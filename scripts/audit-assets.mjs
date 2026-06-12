// Asset orphan audit for ample-website.
//
// Scans every code/style/markup file under project/ for "assets/<name>"
// string references, then lists files in project/assets/ that nothing
// references. Because TWEAK_DEFAULTS, AVAILABLE_PHOTOS, categoryImages,
// productOverrides and ProductData card images are all string literals in
// the scanned files, the reference scan inherently whitelists them.
//
//   node scripts/audit-assets.mjs                          # dry run (prints report)
//   node scripts/audit-assets.mjs --apply                  # git mv orphans -> assets-archive/
//   node scripts/audit-assets.mjs --apply --before=YYYY-MM-DD
//       only archive orphans whose last commit predates the cutoff —
//       protects the current editing wave (an unsaved editor draft may
//       reference recently-dropped variants that look orphaned here)
//
// Safety model:
//  - PRECONDITION: press "Save & lock" in the Tweaks editor first, so any
//    draft image references are materialized into TWEAK_DEFAULTS. Files
//    referenced only by an unsaved localStorage draft look orphaned.
//  - Dry run first, review the list (last-commit dates included).
//  - --apply MOVES files into assets-archive/ (committed to git) — nothing
//    is deleted; recovery is `git mv assets-archive/<f> project/assets/<f>`.
import { readFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'project', 'assets');
const ARCHIVE = join(ROOT, 'assets-archive');
const APPLY = process.argv.includes('--apply');

// Files referenced from places the scan can't see (head metas resolve
// relative URLs, future build scripts, etc.). Belt and braces.
const EXTRA_WHITELIST = new Set([
  'logo-red-transparent.png',
  'og-home.jpg',
  'gold-dyno-094485be.mp4',
  'hero-d3c3d9c4.webp',
]);

const scanFiles = [];
const walk = (dir, exts) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p, exts); continue; }
    if (exts.some((e) => name.toLowerCase().endsWith(e))) scanFiles.push(p);
  }
};
walk(join(ROOT, 'project', 'src'), ['.jsx', '.js']);
walk(join(ROOT, 'project', 'styles'), ['.css']);
scanFiles.push(join(ROOT, 'project', 'index.html'));
scanFiles.push(join(ROOT, 'project', '404.html'));

const referenced = new Set(EXTRA_WHITELIST);
const REF_RE = /assets\/([A-Za-z0-9 ._()%\-]+\.[a-z0-9]{2,5})/gi;
for (const f of scanFiles) {
  // \/ from the JSON tweaks block, %20 from URL-encoded paths
  const text = readFileSync(f, 'utf8').replace(/\\\//g, '/').replace(/%20/g, ' ');
  for (const m of text.matchAll(REF_RE)) referenced.add(m[1]);
}

const all = readdirSync(ASSETS).filter((n) => statSync(join(ASSETS, n)).isFile());
const orphans = all.filter((n) => !referenced.has(n));
const kept = all.length - orphans.length;

const lastCommit = (rel) => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', rel], { cwd: ROOT }).toString().trim() || 'uncommitted';
  } catch { return '?'; }
};

let orphanBytes = 0;
console.log(`Scanned ${scanFiles.length} files; ${referenced.size} referenced names; ${all.length} assets on disk.\n`);
console.log(`ORPHANS (${orphans.length}):`);
for (const n of orphans.sort()) {
  const size = statSync(join(ASSETS, n)).size;
  orphanBytes += size;
  console.log(`  ${(size / 1024 / 1024).toFixed(2).padStart(8)} MB  ${lastCommit('project/assets/' + n).padEnd(12)} ${n}`);
}
console.log(`\nKept: ${kept} files. Orphaned: ${orphans.length} files, ${(orphanBytes / 1024 / 1024).toFixed(1)} MB.`);

if (!APPLY) {
  console.log('\nDry run — nothing moved. Re-run with --apply to archive.');
  process.exit(0);
}

const beforeArg = process.argv.find((a) => a.startsWith('--before='));
const cutoff = beforeArg ? beforeArg.slice('--before='.length) : null;

mkdirSync(ARCHIVE, { recursive: true });
let moved = 0, skipped = 0;
for (const n of orphans) {
  const date = lastCommit('project/assets/' + n);
  // string compare works for YYYY-MM-DD; uncommitted/unknown files are
  // always skipped under a cutoff (they're the riskiest kind)
  if (cutoff && !(date < cutoff)) { skipped++; continue; }
  execFileSync('git', ['mv', join('project', 'assets', n), join('assets-archive', n)], { cwd: ROOT });
  moved++;
}
console.log(`\nMoved ${moved} files to assets-archive/ (git mv — recoverable).`
  + (cutoff ? ` Skipped ${skipped} newer than ${cutoff}.` : ''));
