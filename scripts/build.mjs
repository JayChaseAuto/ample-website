// Deploy-artifact build for ample-website.
//
// The SOURCE tree (project/) stays zero-build — babel-standalone + React
// dev builds, served as-is by dev-server.py for the localhost editor.
// This script produces dist/ for GitHub Pages:
//
//   1. copy project/ -> dist/
//   2. esbuild-compile the 9 src/*.jsx -> minified dist/js/*.js
//   3. externalize the inline scripts (CSP drops 'unsafe-inline'):
//        - error overlay            -> js/boot-overlay.js
//        - build tag + editor gate
//          + image protection       -> js/boot-flags.js  (order preserved)
//        - the big text/babel app   -> js/app.js         (compiled+minified)
//   4. rewrite script tags: React dev -> production.min (pinned SRI),
//      DELETE babel-standalone, ?v=<git-sha> cache busting
//   5. swap the dev CSP meta for the tightened production policy
//   6. re-derive the hero <link rel=preload> from TWEAK_DEFAULTS.heroImage
//   7. run the stub generator (prerendered product/section pages,
//      sitemap.xml, robots.txt)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';
import { PROD_CSP } from './site.config.mjs';
import { generateStubs } from './generate-stubs.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'project');
const DIST = join(ROOT, 'dist');

// Production React 18.3.1 UMD builds — hashes computed from unpkg bytes.
// If React is ever bumped, recompute with:
//   node -e "fetch(URL).then(r=>r.arrayBuffer()).then(b=>console.log('sha384-'+require('crypto').createHash('sha384').update(Buffer.from(b)).digest('base64')))"
const REACT_PROD = {
  url: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  sri: 'sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z',
};
const REACT_DOM_PROD = {
  url: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
  sri: 'sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1',
};

let sha = 'dev';
try { sha = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch {}

const compile = (code, label) => {
  try {
    return transformSync(code, { loader: 'jsx', jsx: 'transform', minify: true, target: 'es2020' }).code;
  } catch (e) {
    throw new Error(`esbuild failed on ${label}: ${e.message}`);
  }
};
const minifyJs = (code, label) => {
  try {
    return transformSync(code, { loader: 'js', minify: true, target: 'es2020' }).code;
  } catch (e) {
    throw new Error(`esbuild failed on ${label}: ${e.message}`);
  }
};

// 1. fresh dist
rmSync(DIST, { recursive: true, force: true });
cpSync(SRC, DIST, { recursive: true });
mkdirSync(join(DIST, 'js'), { recursive: true });

// 2. compile the component files
const srcFiles = readdirSync(join(SRC, 'src')).filter((n) => n.endsWith('.jsx'));
for (const name of srcFiles) {
  const out = compile(readFileSync(join(SRC, 'src', name), 'utf8'), name);
  writeFileSync(join(DIST, 'js', basename(name, '.jsx') + '.js'), out);
}
rmSync(join(DIST, 'src'), { recursive: true, force: true });

// 3-6. transform index.html
let html = readFileSync(join(DIST, 'index.html'), 'utf8');

// 3a. the big inline text/babel app block -> js/app.js
const appMatch = /<script type="text\/babel">([\s\S]*?)<\/script>/.exec(html);
if (!appMatch) throw new Error('inline text/babel app block not found');
writeFileSync(join(DIST, 'js', 'app.js'), compile(appMatch[1], 'inline app'));
html = html.replace(appMatch[0], `<script defer src="js/app.js?v=${sha}"></script>`);

// 3b. plain inline <script> blocks (overlay, build tag, gate, protection).
// First one (error overlay) gets its own file so it loads before anything
// else can throw; the rest merge in order into boot-flags.js.
const inlineBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (inlineBlocks.length < 2) throw new Error(`expected >=2 plain inline scripts, found ${inlineBlocks.length}`);
writeFileSync(join(DIST, 'js', 'boot-overlay.js'), minifyJs(inlineBlocks[0][1], 'boot-overlay'));
html = html.replace(inlineBlocks[0][0], `<script src="js/boot-overlay.js?v=${sha}"></script>`);
const flags = inlineBlocks.slice(1).map((m) => m[1]).join('\n;\n');
writeFileSync(join(DIST, 'js', 'boot-flags.js'), minifyJs(flags, 'boot-flags'));
html = html.replace(inlineBlocks[1][0], `<script src="js/boot-flags.js?v=${sha}"></script>`);
for (const m of inlineBlocks.slice(2)) html = html.replace(m[0], '');

// 3c. the 9 external text/babel component tags -> compiled js (defer keeps
// document order and stops them blocking parse)
html = html.replace(
  /<script type="text\/babel" src="src\/([\w.-]+)\.jsx\?v=\d+"><\/script>/g,
  (_, name) => `<script defer src="js/${name}.js?v=${sha}"></script>`
);

// 4. React production swap + babel removal
html = html.replace(
  /<script src="https:\/\/unpkg\.com\/react@[\d.]+\/umd\/react\.development\.js"[^>]*><\/script>/,
  `<script src="${REACT_PROD.url}" integrity="${REACT_PROD.sri}" crossorigin="anonymous"></script>`
);
html = html.replace(
  /<script src="https:\/\/unpkg\.com\/react-dom@[\d.]+\/umd\/react-dom\.development\.js"[^>]*><\/script>/,
  `<script src="${REACT_DOM_PROD.url}" integrity="${REACT_DOM_PROD.sri}" crossorigin="anonymous"></script>`
);
html = html.replace(/<script src="https:\/\/unpkg\.com\/@babel\/standalone[^>]*><\/script>\r?\n?/, '');

// 4b. cache-bust the stylesheet — GH Pages caches ~10min per file with no
// coordination, so a fresh HTML + stale CSS mix can ship layout bugs.
html = html.replace(
  /<link rel="stylesheet" href="styles\/colors_and_type\.css">/,
  `<link rel="stylesheet" href="styles/colors_and_type.css?v=${sha}">`
);

// 5. CSP swap (the source tag is kept single-line for exactly this match).
// The explanatory dev comment goes too — it mentions 'unsafe-eval' and
// would trip the sanity gate below.
const cspBefore = html;
html = html.replace(/<!-- CSP:[\s\S]*?-->/, '<!-- CSP: production policy, tightened at build time -->');
html = html.replace(
  /<meta http-equiv="Content-Security-Policy" content="[^"]*">/,
  `<meta http-equiv="Content-Security-Policy" content="${PROD_CSP}">`
);
if (html === cspBefore) throw new Error('CSP meta tag not found/replaced');

// 6. hero preload follows TWEAK_DEFAULTS.heroImage so an owner hero swap
// can't strand a stale preload in the artifact
const tweaksMatch = /\/\*EDITMODE-BEGIN\*\/([\s\S]*?)\/\*EDITMODE-END\*\//.exec(readFileSync(join(SRC, 'index.html'), 'utf8'));
const heroImage = JSON.parse(tweaksMatch[1]).heroImage;
if (heroImage) {
  html = html.replace(
    /<link rel="preload" as="image" href="[^"]*" fetchpriority="high">/,
    `<link rel="preload" as="image" href="${heroImage}" fetchpriority="high">`
  );
}

writeFileSync(join(DIST, 'index.html'), html);

// sanity gates — fail the deploy rather than ship a half-transformed page
const out = readFileSync(join(DIST, 'index.html'), 'utf8');
for (const bad of ['text/babel', 'babel.min.js', 'react.development', 'react-dom.development', "'unsafe-eval'"]) {
  if (out.includes(bad)) throw new Error(`artifact still contains "${bad}"`);
}

// 7. prerendered stubs + sitemap + robots
const { pages, products } = generateStubs(DIST);

console.log(`build ok: ${srcFiles.length} components + app compiled, sha=${sha}, `
  + `${pages} sitemap URLs (${products} products).`);
