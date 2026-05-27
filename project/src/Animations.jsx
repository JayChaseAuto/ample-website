/* Ample — Scroll Animations
   - Lenis: smooth-scroll inertia (loaded via CDN at window.Lenis)
   - <Reveal>: IntersectionObserver fade/slide-in for sections
   - useParallax: translate an element on scroll for hero-style parallax
   Respects prefers-reduced-motion. */

const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lenis bootstrap (singleton) ---------- */
let lenisInstance = null;
function getLenis() {
  if (lenisInstance) return lenisInstance;
  if (typeof window === 'undefined' || !window.Lenis) return null;
  lenisInstance = new window.Lenis({
    // Inertia tuning. Lower lerp = snappier, higher = floatier.
    lerp: PREFERS_REDUCED_MOTION ? 1 : 0.1,
    smoothWheel: !PREFERS_REDUCED_MOTION,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    // Don't smooth touch — feels wrong on mobile.
    smoothTouch: false,
  });
  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Hash routing override: when location hash changes, scroll to top instantly.
  // The existing useHashRoute calls window.scrollTo(0, 0) but Lenis intercepts
  // that. Listen for hashchange and tell Lenis to jump.
  window.addEventListener('hashchange', () => {
    lenisInstance.scrollTo(0, { immediate: true });
  });

  return lenisInstance;
}

/* ---------- <Reveal> ---------- */
/* Fade + slide up on scroll into view. One-shot.
   Props:
     - delay (number, optional): 0|1|2|3 → 0/80/160/240ms stagger
     - as (string, optional): wrapper element tag (default 'div')
     - threshold (number, optional): IO threshold (default 0.15)
     - children, style, ...rest passed through */
function Reveal({ children, delay = 0, as = 'div', threshold = 0.15, style, className, ...rest }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(PREFERS_REDUCED_MOTION);

  React.useEffect(() => {
    if (PREFERS_REDUCED_MOTION) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: '0px 0px -80px 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  const cls = ['reveal', visible ? 'is-visible' : '', className].filter(Boolean).join(' ');
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={cls}
      data-delay={delay || undefined}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- useParallax ---------- */
/* Translate a ref element on scroll for a parallax/depth effect.
   Speed convention: 0 < speed < 1 makes the element drift behind the
   foreground (classic background parallax). Speed > 1 makes it lead the
   scroll. Typical hero values: 0.15–0.3.
   Math: visible_movement = scrollY * (speed - 1), so speed=0.2 means the
   element moves at 80% scroll speed. */
function useParallax(ref, speed = 0.2) {
  React.useEffect(() => {
    if (PREFERS_REDUCED_MOTION) return;
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    let pending = false;
    node.style.willChange = 'transform';

    const apply = () => {
      pending = false;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // Skip when element is far outside viewport.
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      const y = window.scrollY * speed;
      node.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      node.style.willChange = '';
    };
  }, [ref, speed]);
}

/* ---------- Boot Lenis on first import ---------- */
/* Defer to next frame so React UMD has finished mounting and Lenis CDN script
   has run. If Lenis isn't loaded for some reason we silently no-op. */
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(getLenis, 0);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(getLenis, 0));
  }
}

/* ---------- Dev server bridge — uploads + save ---------- */
/* All editor disk writes go through the local dev server (dev-server.py).
   PUT /assets/<safe-name> writes images; POST /__editor/save_index rewrites
   the EDITMODE block in index.html. Loopback-bound, allowlist-validated.
   No File System Access API, no picker, no IndexedDB handle dance —
   the drop event just becomes a fetch. */
const __AMPLE_DEV_PING = '/__editor/ping';
const __AMPLE_DEV_ASSETS = '/assets/';
const __AMPLE_DEV_SAVE = '/__editor/save_index';

/* One-shot probe so the UI can show "dev server connected" vs "offline".
   Memoised — every component that asks gets the same in-flight promise. */
let __ampleDevPromise = null;
function detectDevServer() {
  if (__ampleDevPromise) return __ampleDevPromise;
  __ampleDevPromise = (async () => {
    try {
      const r = await fetch(__AMPLE_DEV_PING, { cache: 'no-store' });
      if (!r.ok) return { ok: false, reason: `ping HTTP ${r.status}` };
      const body = await r.json();
      if (body && body.server === 'ample-dev') {
        return { ok: true, root: body.root, assets: body.assets };
      }
      return { ok: false, reason: 'unexpected ping payload' };
    } catch (e) {
      return { ok: false, reason: (e && e.message) || String(e) };
    }
  })();
  return __ampleDevPromise;
}
// Re-probe on demand (e.g. after the user starts the server without
// reloading). Used by the Tweaks panel's "Recheck" button.
function resetDevServerProbe() { __ampleDevPromise = null; }

/* Resolve a drag's payload to a media Blob. Accepts:
   - OS file drags (dataTransfer.files)
   - In-page asset drags exposing text/uri-list, text/plain, or text/html
   The `accept` param is a list of MIME prefixes (default ['image']);
   pass ['image','video'] for media drop targets that take either.
   Returns { blob, suggestedName } or { url } if a URL was found but couldn't
   be fetched (CORS, redirect). Null when nothing usable was offered. */
async function resolveDraggedToBlob(dt, accept) {
  if (!dt) return null;
  const prefixes = accept && accept.length ? accept : ['image'];
  const matches = (mime) => !!mime && prefixes.some((p) => mime.startsWith(p + '/'));
  const file = dt.files && dt.files[0];
  if (file && matches(file.type)) {
    return { blob: file, suggestedName: file.name || '' };
  }
  const fetchAsMedia = async (url) => {
    const r = await fetch(url, { credentials: 'omit' });
    if (!r.ok) throw new Error('fetch ' + r.status);
    const b = await r.blob();
    if (!matches(b.type)) throw new Error('rejected mime: ' + b.type);
    return b;
  };
  const tryUrls = [];
  const uriList = dt.getData('text/uri-list');
  if (uriList) {
    for (const line of uriList.split(/\r?\n/)) {
      const u = line.trim();
      if (u && !u.startsWith('#')) tryUrls.push(u);
    }
  }
  const plain = dt.getData('text/plain');
  if (plain && /^(data:|https?:|\/|assets\/)/.test(plain.trim())) tryUrls.push(plain.trim());
  const html = dt.getData('text/html');
  if (html) {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m) tryUrls.push(m[1]);
  }
  for (const u of tryUrls) {
    try {
      const b = await fetchAsMedia(u);
      const last = u.split('/').pop().split('?')[0] || '';
      return { blob: b, suggestedName: last };
    } catch {}
  }
  // If we couldn't fetch any of the URLs (CORS, network, wrong MIME) we
  // intentionally do NOT persist the raw URL. The previous behaviour
  // stored a verbatim third-party URL into the tweak state, which Save &
  // lock then baked into source — every published-site visitor would pull
  // assets from a domain we don't control. Hard failure here is safer.
  return null;
}

/* Write a Blob into project/assets/ via the local dev server and return the
   "assets/<filename>" path. Images get a canvas re-encode (WebP, capped at
   MAX_DIM) so we don't ship 10MB originals; video and SVG keep their bytes.
   Filename is "<prefix>-<sha256-short>.<ext>" so different bytes never
   collide on the same slot. Throws with a readable message when the dev
   server isn't reachable — the caller decides how to surface that. */
async function writeImageToAssets(blob, namePrefix) {
  const MAX_DIM = 1600;
  const mime = blob.type || '';
  // SVGs can carry inline <script>. Even if the host page only uses the
  // file as <img>/url() (script-inert there), the asset itself lives at
  // an HTTP path on the deployed site — direct navigation executes the
  // script in our origin. Reject before the upload to match the server's
  // SAFE_NAME_RE allowlist.
  if (mime === 'image/svg+xml') {
    throw new Error('SVG uploads are disabled — drop a raster image (PNG, JPG, WebP, AVIF) instead.');
  }
  const extFromMime = (m) => ((m.split('/')[1] || 'bin').toLowerCase()
    .replace('jpeg', 'jpg')
    .replace('quicktime', 'mov')
    .replace('x-matroska', 'mkv'));
  let outBlob = blob;
  let outExt = extFromMime(mime) || 'bin';
  // SVG bytes can carry script, so skip the canvas pass and ship the
  // original. Same for non-image MIME types (videos).
  if (mime.startsWith('image/') && mime !== 'image/svg+xml') {
    try {
      const bitmap = await createImageBitmap(blob);
      try {
        const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
        const w = Math.max(1, Math.round(bitmap.width * scale));
        const h = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
        const encoded = await new Promise((res) => canvas.toBlob(res, 'image/webp', 0.9));
        if (encoded) { outBlob = encoded; outExt = 'webp'; }
      } finally {
        bitmap.close && bitmap.close();
      }
    } catch {
      // decode failure: keep original bytes.
    }
  }
  const buf = await outBlob.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buf);
  const hex = Array.from(new Uint8Array(hash)).slice(0, 4)
    .map((b) => b.toString(16).padStart(2, '0')).join('');
  const safe = String(namePrefix || 'img').toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'img';
  const filename = `${safe}-${hex}.${outExt}`;

  const resp = await fetch(__AMPLE_DEV_ASSETS + filename, {
    method: 'PUT',
    headers: { 'Content-Type': outBlob.type || 'application/octet-stream' },
    body: outBlob,
  });
  if (!resp.ok) {
    let detail = '';
    try { const j = await resp.json(); if (j && j.error) detail = ` — ${j.error}`; } catch {}
    if (resp.status === 0 || resp.status >= 500) {
      throw new Error(`Dev server not reachable (HTTP ${resp.status})${detail}. Run \`py dev-server.py\` from the repo root.`);
    }
    throw new Error(`Upload rejected (HTTP ${resp.status})${detail}`);
  }
  return `assets/${filename}`;
}

/* ---------- useImageDrop ---------- */
/* Wire a ref to accept dragged images. Supports both OS file drops AND
   in-page asset drags (asset library panels, other tabs, links).

   Flow:
     1. The instant the drop resolves to a blob, we hand onDrop a
        blob: URL so the image appears immediately — no waiting for the
        upload round-trip.
     2. The blob is PUT to the dev server (writeImageToAssets) in the
        background. On success, onDrop is called again with the canonical
        "assets/<name>.webp" path and the blob: URL is revoked.
     3. On upload failure the blob: URL is kept (image still visible) and
        an `ample-upload-error` window event is dispatched so the panel
        can show a persistent banner with the actual reason.

   Pass { namePrefix } so the saved filename is descriptive
   (e.g. 'card-brake-pads'). Without it the file lands as 'img-<hash>.webp'. */
function useImageDrop(ref, onDrop, opts) {
  const onDropRef = React.useRef(onDrop);
  onDropRef.current = onDrop;
  const prefixRef = React.useRef(opts && opts.namePrefix);
  prefixRef.current = opts && opts.namePrefix;
  const acceptRef = React.useRef((opts && opts.accept) || ['image']);
  acceptRef.current = (opts && opts.accept) || ['image'];

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // Editor-only feature. Visitors don't get drag-drop on any device;
    // the dashed ring stays hidden via CSS (`.drop-target` styles gated on
    // `html[data-editor="1"]`).
    if (typeof window !== 'undefined' && !window.__ampleEditor) return;
    const hasMedia = (dt) => {
      if (!dt) return false;
      const types = Array.from(dt.types || []);
      return types.includes('Files') ||
             types.includes('text/uri-list') ||
             types.includes('text/html') ||
             types.includes('text/plain');
    };
    const onEnter = (e) => {
      if (!hasMedia(e.dataTransfer)) return;
      e.preventDefault();
      node.classList.add('is-dragover');
    };
    const onOver = (e) => {
      if (!hasMedia(e.dataTransfer)) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };
    const onLeave = (e) => {
      if (!node.contains(e.relatedTarget)) node.classList.remove('is-dragover');
    };
    const onDropEvent = async (e) => {
      if (!hasMedia(e.dataTransfer)) return;
      e.preventDefault();
      e.stopPropagation();
      node.classList.remove('is-dragover');
      const resolved = await resolveDraggedToBlob(e.dataTransfer, acceptRef.current);
      if (!resolved || !resolved.blob) return;

      // Optimistic preview: render right now from the in-memory blob.
      // We pass the same prefix back via dispatch so the panel toast can
      // name the slot (e.g. "Uploading card-tensioner…").
      const previewUrl = URL.createObjectURL(resolved.blob);
      onDropRef.current(previewUrl);
      try {
        window.dispatchEvent(new CustomEvent('ample-upload-start', {
          detail: { namePrefix: prefixRef.current || null },
        }));
      } catch {}

      try {
        const path = await writeImageToAssets(resolved.blob, prefixRef.current);
        // Swap blob: URL → canonical assets/ path. The optimistic preview
        // already pushed a history entry; this follow-up MUST NOT push
        // another one (skipHistory: true), otherwise pressing Ctrl+Z lands
        // on the now-revoked blob: URL state and shows a broken image.
        onDropRef.current(path, { skipHistory: true });
        URL.revokeObjectURL(previewUrl);
        try {
          window.dispatchEvent(new CustomEvent('ample-upload-success', {
            detail: { namePrefix: prefixRef.current || null, path },
          }));
        } catch {}
      } catch (err) {
        const reason = (err && err.message) || String(err);
        console.warn('writeImageToAssets failed:', reason);
        // Leave the blob: URL in place so the image stays visible for
        // this session — but make it loud that it's not on disk.
        try {
          window.dispatchEvent(new CustomEvent('ample-upload-error', {
            detail: { namePrefix: prefixRef.current || null, reason },
          }));
        } catch {}
      }
    };
    node.addEventListener('dragenter', onEnter);
    node.addEventListener('dragover', onOver);
    node.addEventListener('dragleave', onLeave);
    node.addEventListener('drop', onDropEvent);
    return () => {
      node.removeEventListener('dragenter', onEnter);
      node.removeEventListener('dragover', onOver);
      node.removeEventListener('dragleave', onLeave);
      node.removeEventListener('drop', onDropEvent);
    };
  }, [ref]);
}

/* ---------- AtmosphereCanvas ---------- */
/* Fixed-position canvas behind the page. Pre-renders a faint grid + (desktop
   only) a few drifting "circuit trace" lines to an offscreen buffer ONCE,
   then blits + draws an amber sweep beam over it on each frame.

   Mobile concessions:
     - DPR capped to 1 (smaller backing buffer, less GPU work)
     - Sweep beam skipped — only the static grid blit each frame
     - Circuit traces omitted from the offscreen pre-render
   Performance guards (desktop + mobile):
     - 24fps cap via frame-skip counter
     - Boots inside requestIdleCallback so React paints first
     - Pauses on document.visibilitychange (tab hidden) and on resize
     - prefers-reduced-motion -> render one static frame and stop */
function AtmosphereCanvas() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    const dpr = Math.min(isMobile ? 1 : 2, window.devicePixelRatio || 1);

    let w = 0, h = 0;
    let raf = 0;
    let frame = 0;
    let prerendered = null;
    let resizeTimer = 0;

    const buildPrerendered = () => {
      const off = document.createElement('canvas');
      off.width = w * dpr;
      off.height = h * dpr;
      const octx = off.getContext('2d');
      if (!octx) return null;
      octx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Faint grid
      octx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      octx.lineWidth = 1;
      const step = 32;
      for (let x = step; x < w; x += step) {
        octx.beginPath();
        octx.moveTo(x + 0.5, 0);
        octx.lineTo(x + 0.5, h);
        octx.stroke();
      }
      for (let y = step; y < h; y += step) {
        octx.beginPath();
        octx.moveTo(0, y + 0.5);
        octx.lineTo(w, y + 0.5);
        octx.stroke();
      }

      // Circuit traces — desktop only. Deterministic step pattern so we
      // don't burn entropy on Math.random per resize.
      if (!isMobile) {
        octx.strokeStyle = 'rgba(233, 32, 36, 0.05)';
        octx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          let x = 0;
          let y = (i + 0.5) * h / 4;
          octx.beginPath();
          octx.moveTo(x, y);
          while (x < w) {
            const seg = 40 + ((i * 53 + Math.floor(x / 7)) % 80);
            x += seg;
            octx.lineTo(x, y);
            if (x < w && (Math.floor(x / 31) + i) % 3 === 0) {
              const dy = (Math.floor(x / 41) + i) % 2 === 0 ? -18 : 18;
              octx.lineTo(x, y + dy);
              y += dy;
              x += 10;
              octx.lineTo(x, y);
            }
          }
          octx.stroke();
        }
      }

      return off;
    };

    const setup = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      prerendered = buildPrerendered();
    };

    const drawSweep = (t) => {
      if (isMobile) return;
      const period = 30000;
      const p = (t % period) / period;
      const x = p * (w + 600) - 300;
      const grad = ctx.createLinearGradient(x - 200, 0, x + 200, 0);
      grad.addColorStop(0, 'rgba(255, 168, 50, 0)');
      grad.addColorStop(0.5, 'rgba(255, 168, 50, 0.05)');
      grad.addColorStop(1, 'rgba(255, 168, 50, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - 200, 0, 400, h);
    };

    const tick = (t) => {
      frame++;
      if (frame % 2 !== 0) { raf = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, w, h);
      if (prerendered) ctx.drawImage(prerendered, 0, 0, w, h);
      drawSweep(t);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      setup();
      if (PREFERS_REDUCED_MOTION) {
        ctx.clearRect(0, 0, w, h);
        if (prerendered) ctx.drawImage(prerendered, 0, 0, w, h);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else if (!raf && !PREFERS_REDUCED_MOTION) raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { stop(); start(); }, 200);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('resize', onResize, { passive: true });

    if (window.requestIdleCallback) {
      window.requestIdleCallback(start, { timeout: 800 });
    } else {
      setTimeout(start, 200);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
      clearTimeout(resizeTimer);
      stop();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        // z-index: 1 so this paints with the other atmosphere layers
        // (.atm-grid, .atm-noise, .atm-glow) — ABOVE the .atm-bg site
        // background but BELOW page content (z-index: 2). Previously
        // z-index: 0 collided with .atm-bg and won the DOM-order tiebreak,
        // overlaying the user-set background with a 65% animated grid.
        pointerEvents: 'none', zIndex: 1,
        opacity: 0.65,
      }}
    />
  );
}

Object.assign(window, {
  Reveal, useParallax, useImageDrop, getLenis, AtmosphereCanvas,
  writeImageToAssets, resolveDraggedToBlob,
  detectDevServer, resetDevServerProbe,
});
