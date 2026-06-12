// Prerendered SEO stub pages for the ample SPA.
//
// Hash routes (#/product/...) are invisible to search engines — only the
// SPA root gets indexed. This generator emits one REAL html page per
// public product (PRODUCT_ORDER only — hidden products stay unindexed by
// design) plus the four section pages, each with unique metadata, JSON-LD
// and actual content, linking INTO the SPA. No auto-redirect: a redirect
// would make Google collapse indexing back to the SPA root.
//
// Runs as part of scripts/build.mjs (CI). Reads SOURCE files, writes into
// dist/ only.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';
import vm from 'node:vm';
import { SITE_URL, PROD_CSP } from './site.config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export function extractProducts() {
  const code = readFileSync(join(ROOT, 'project', 'src', 'ProductData.jsx'), 'utf8');
  const js = transformSync(code, { loader: 'jsx' }).code; // robust if JSX ever appears
  const sandbox = { window: {} };
  vm.runInNewContext(js, sandbox);
  const { PRODUCTS, PRODUCT_ORDER } = sandbox.window;
  if (!PRODUCTS || !PRODUCT_ORDER) throw new Error('PRODUCTS/PRODUCT_ORDER not found in ProductData.jsx');
  return { PRODUCTS, PRODUCT_ORDER };
}

export function extractTweaks() {
  const html = readFileSync(join(ROOT, 'project', 'index.html'), 'utf8');
  const m = /\/\*EDITMODE-BEGIN\*\/([\s\S]*?)\/\*EDITMODE-END\*\//.exec(html);
  if (!m) throw new Error('EDITMODE markers not found in index.html');
  return JSON.parse(m[1]); // \/ escapes are valid JSON
}

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const truncate = (s, n = 155) => {
  s = String(s ?? '').replace(/\s+/g, ' ').trim();
  return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
};

const STUB_CSS = `
  html,body{margin:0;background:#0B0B0D;color:#fff;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
    line-height:1.6}
  main{max-width:720px;margin:0 auto;padding:32px 20px 64px}
  header,footer{max-width:720px;margin:0 auto;padding:20px}
  header a,footer a{color:#fff;text-decoration:none;font-weight:700;
    font-size:13px;letter-spacing:.12em;text-transform:uppercase}
  footer{border-top:1px solid rgba(255,255,255,.12);display:flex;gap:20px;
    flex-wrap:wrap;font-size:12px}
  footer a{color:rgba(255,255,255,.6);font-weight:600}
  .eyebrow{color:#E92024;font-size:12px;font-weight:700;letter-spacing:.2em;
    text-transform:uppercase;margin:0 0 8px}
  h1{font-size:clamp(30px,6vw,44px);font-weight:800;text-transform:uppercase;
    letter-spacing:-.02em;line-height:1.05;margin:0 0 14px}
  .gold{color:#C9A14E;font-size:13px;font-weight:700;margin:0 0 18px}
  img{width:100%;max-width:640px;height:auto;display:block;border-radius:4px;
    background:#16171a;margin:18px 0}
  ul{padding-left:20px;color:rgba(255,255,255,.78);font-size:15px}
  li{margin:6px 0}
  p{color:rgba(255,255,255,.78);font-size:15px}
  .cta{display:inline-block;background:#E92024;color:#fff;text-decoration:none;
    font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
    padding:14px 28px;border-radius:2px;margin-top:10px}
`;

const page = ({ rel, title, desc, ogType, imgAbs, imgRel, canonical, jsonLd, bodyHtml }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${PROD_CSP}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(title)} — ample.</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<link rel="icon" type="image/png" href="${rel}assets/logo-red-transparent.png">
<meta name="theme-color" content="#0B0B0D">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="ample.">
<meta property="og:title" content="${esc(title)} — ample.">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${imgAbs}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)} — ample.">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${imgAbs}">
${jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
<style>${STUB_CSS}</style>
</head>
<body>
<header><a href="${rel}">ample.</a></header>
<main>
${bodyHtml}
</main>
<footer>
  <a href="${rel}catalog/">Catalog</a>
  <a href="${rel}gold/">Gold Standard</a>
  <a href="${rel}story/">Our Story</a>
  <a href="${rel}contact/">Contact</a>
</footer>
</body>
</html>
`;

const SECTIONS = [
  { dir: 'catalog', hash: '#/catalog', title: 'Parts Catalog',
    desc: 'Browse the full ample catalog of OEM+ automotive parts — braking, cooling, HVAC, engine, electrical, lighting, steering and service components.' },
  { dir: 'gold', hash: '#/gold', title: 'The Gold Standard',
    desc: 'Every Gold Standard batch is dyno-tested to failure before it ships — thermally, mechanically, then in duty cycle. Nothing leaves the lab on a spec sheet alone.' },
  { dir: 'story', hash: '#/story', title: 'Our Story',
    desc: 'Two decades of OEM+ automotive parts. How ample grew from a single workshop into a catalog trusted by professionals.' },
  { dir: 'contact', hash: '#/contact', title: 'Contact Us',
    desc: 'Talk to the ample team — product questions, fitment checks, wholesale and partnership inquiries.' },
];

export function generateStubs(distDir) {
  const { PRODUCTS, PRODUCT_ORDER } = extractProducts();
  const tweaks = extractTweaks();
  const cardImages = tweaks.catalogCardImages || {};
  const urls = [SITE_URL];

  const orgLd = {
    '@context': 'https://schema.org', '@type': 'Organization',
    '@id': `${SITE_URL}#org`, name: 'ample.', url: SITE_URL,
    logo: `${SITE_URL}assets/logo-red-transparent.png`,
  };

  for (const s of SECTIONS) {
    const canonical = `${SITE_URL}${s.dir}/`;
    urls.push(canonical);
    const html = page({
      rel: '../', title: s.title, desc: s.desc, ogType: 'website',
      imgAbs: `${SITE_URL}assets/og-home.jpg`, canonical,
      jsonLd: [orgLd],
      bodyHtml: `
  <p class="eyebrow">ample.</p>
  <h1>${esc(s.title)}</h1>
  <p>${esc(s.desc)}</p>
  <p><a class="cta" href="../${s.hash}">Open ${esc(s.title)} →</a></p>`,
    });
    mkdirSync(join(distDir, s.dir), { recursive: true });
    writeFileSync(join(distDir, s.dir, 'index.html'), html);
  }

  for (const slug of PRODUCT_ORDER) {
    const p = PRODUCTS[slug];
    if (!p) continue;
    const title = `${p.title || slug} ${p.title2 || ''}`.replace(/\.$/, '').trim();
    const desc = truncate(p.intro || (p.bullets || []).slice(0, 2).join(' ') || `${title} — OEM+ ${p.category || 'automotive'} parts by ample.`);
    const imgPath = cardImages[slug] || p.cardImage || 'assets/og-home.jpg';
    const canonical = `${SITE_URL}p/${slug}/`;
    urls.push(canonical);
    const bullets = (p.bullets || []).slice(0, 6);
    const html = page({
      rel: '../../', title, desc, ogType: 'product',
      imgAbs: `${SITE_URL}${imgPath}`, canonical,
      jsonLd: [
        {
          '@context': 'https://schema.org', '@type': 'Product',
          name: title, image: `${SITE_URL}${imgPath}`, description: desc,
          category: p.category || undefined,
          brand: { '@type': 'Brand', name: 'ample.' },
        },
        {
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Catalog', item: `${SITE_URL}catalog/` },
            { '@type': 'ListItem', position: 3, name: title, item: canonical },
          ],
        },
        orgLd,
      ],
      bodyHtml: `
  <p class="eyebrow">${esc(p.eyebrow || p.category || 'Catalog')}</p>
  <h1>${esc(title)}</h1>
  ${p.goldStandard ? '<p class="gold">★ Gold Standard — dyno-tested batch QA</p>' : ''}
  <img src="../../${esc(imgPath)}" alt="${esc(title)}" loading="eager" decoding="async">
  ${p.intro ? `<p>${esc(p.intro)}</p>` : ''}
  ${bullets.length ? `<ul>${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
  <p><a class="cta" href="../../#/product/${encodeURIComponent(slug)}">Open in the interactive catalog →</a></p>`,
    });
    mkdirSync(join(distDir, 'p', slug), { recursive: true });
    writeFileSync(join(distDir, 'p', slug, 'index.html'), html);
  }

  // sitemap + robots (overwrite the bootstrap copies in the artifact)
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`
    + `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    + urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')
    + `\n</urlset>\n`;
  writeFileSync(join(distDir, 'sitemap.xml'), sitemap);

  const robots = `# ample. — all crawlers welcome, including AI search and AI training agents.\n`
    + `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`;
  writeFileSync(join(distDir, 'robots.txt'), robots);

  return { pages: urls.length, products: PRODUCT_ORDER.length };
}
