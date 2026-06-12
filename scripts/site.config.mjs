// Single source of truth for the site's absolute base URL.
//
// CUSTOM-DOMAIN FLIP: change this line, then update the few hardcoded
// spots in source files (grep for "jaychaseauto.github.io" in project/:
// index.html head metas, robots.txt, 404.html, .well-known/security.txt)
// and set the domain in repo Settings -> Pages. The generated artifact
// (sitemap, robots, prerendered stubs) follows this constant automatically.
export const SITE_URL = 'https://ampleproducts.ca/';

// Production CSP for the deploy artifact. No unsafe-eval (babel-standalone
// is gone after the build) and no unsafe-inline scripts (all inline
// scripts are externalized to files). style unsafe-inline stays: React
// style attributes need it. img unpkg = lucide icons.
export const PROD_CSP =
  "default-src 'self'; " +
  "script-src 'self' https://unpkg.com; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
  "font-src 'self' https://fonts.gstatic.com; " +
  "img-src 'self' data: https://unpkg.com; " +
  "media-src 'self'; " +
  "connect-src 'self' https://ample-contact.ampleproducts.workers.dev; " +
  "frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";
