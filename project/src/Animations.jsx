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

/* ---------- File System Access — project dir + assets/ writes ---------- */
/* Single directory handle for the whole project. Used by image drops AND by
   the "Save & lock to source" flow in index.html. Cached in IndexedDB so a
   second session doesn't re-prompt for the picker. */
const __AMPLE_HANDLE_DB = 'ample-fs';
const __AMPLE_HANDLE_STORE = 'handles';
const __AMPLE_HANDLE_KEY = 'projectDir';

function __ampleOpenHandleDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no indexedDB'));
    const req = indexedDB.open(__AMPLE_HANDLE_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(__AMPLE_HANDLE_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function __ampleReadStoredHandle() {
  try {
    const db = await __ampleOpenHandleDB();
    return await new Promise((res, rej) => {
      const tx = db.transaction(__AMPLE_HANDLE_STORE, 'readonly');
      const r = tx.objectStore(__AMPLE_HANDLE_STORE).get(__AMPLE_HANDLE_KEY);
      r.onsuccess = () => res(r.result || null);
      r.onerror = () => rej(r.error);
    });
  } catch { return null; }
}

async function __ampleWriteStoredHandle(handle) {
  try {
    const db = await __ampleOpenHandleDB();
    await new Promise((res, rej) => {
      const tx = db.transaction(__AMPLE_HANDLE_STORE, 'readwrite');
      tx.objectStore(__AMPLE_HANDLE_STORE).put(handle, __AMPLE_HANDLE_KEY);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  } catch {}
}

let __ampleDirHandle = null;

/* Resolve the project root directory handle, prompting the user only when
   we don't already have a granted handle. Throws if the browser lacks the
   API, the user cancels, or the picked folder isn't the ample project. */
async function ensureProjectDirHandle({ prompt = true } = {}) {
  const tryPermission = async (h) => {
    if (!h) return null;
    const cur = await h.queryPermission({ mode: 'readwrite' });
    if (cur === 'granted') return h;
    if (cur === 'prompt' && prompt) {
      const next = await h.requestPermission({ mode: 'readwrite' });
      if (next === 'granted') return h;
    }
    return null;
  };

  const fromMemory = await tryPermission(__ampleDirHandle);
  if (fromMemory) return fromMemory;
  __ampleDirHandle = null;

  const stored = await __ampleReadStoredHandle();
  const fromDisk = await tryPermission(stored);
  if (fromDisk) { __ampleDirHandle = fromDisk; return fromDisk; }

  if (!prompt) return null;
  if (typeof window.showDirectoryPicker !== 'function') {
    throw new Error('Direct file writes need Chrome, Edge, or Opera. Drops will fall back to in-memory.');
  }
  const picked = await window.showDirectoryPicker({ mode: 'readwrite', id: 'ample-project' });
  try { await picked.getFileHandle('index.html'); }
  catch { throw new Error('Pick the folder that contains index.html (e.g. ample-website/project).'); }
  __ampleDirHandle = picked;
  await __ampleWriteStoredHandle(picked);
  return picked;
}

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
  // Last-ditch: a same-origin URL we couldn't fetch — caller can still store it.
  if (tryUrls.length) return { url: tryUrls[0] };
  return null;
}

/* Write a Blob into project/assets/ and return the "assets/<filename>" path.
   Images go through a canvas re-encode (WebP, capped at MAX_DIM) so the
   sidecar bytes stay reasonable. Videos and unrecognized formats are written
   as-is with an extension derived from the MIME type. */
async function writeImageToAssets(blob, namePrefix) {
  const dir = await ensureProjectDirHandle();
  const assets = await dir.getDirectoryHandle('assets', { create: true });
  const MAX_DIM = 1600;
  const mime = blob.type || '';
  const extFromMime = (m) => ((m.split('/')[1] || 'bin').toLowerCase()
    .replace('jpeg', 'jpg')
    .replace('quicktime', 'mov')
    .replace('x-matroska', 'mkv'));
  let outBlob = blob;
  let outExt = extFromMime(mime) || 'bin';
  if (mime.startsWith('image/')) {
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
      // SVG / decode failure: keep original bytes.
    }
  }
  const buf = await outBlob.arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', buf);
  const hex = Array.from(new Uint8Array(hash)).slice(0, 4)
    .map((b) => b.toString(16).padStart(2, '0')).join('');
  const safe = String(namePrefix || 'img').toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'img';
  const filename = `${safe}-${hex}.${outExt}`;
  const fh = await assets.getFileHandle(filename, { create: true });
  const writable = await fh.createWritable();
  await writable.write(outBlob);
  await writable.close();
  return `assets/${filename}`;
}

/* ---------- useImageDrop ---------- */
/* Wire a ref to accept dragged images. Supports both OS file drops AND
   in-page asset drags (asset library panels, other tabs, links). The
   resolved image is written into project/assets/ via the File System
   Access API and the on-disk path is passed to onDrop(path).

   If the FS write fails (no API support, picker cancelled, permission
   denied) the drop silently falls back to a base64 data URL — same
   behaviour as the old hook, so visuals don't break. The fallback URL
   gets converted into a real assets/ path the next time the user clicks
   "Save & lock to source" (exportTweaksState handles data URLs).

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
    // Editor-only feature. Visitors don't get drag-drop on any device
    // (including the touch fallback path), and the dashed ring stays hidden
    // via CSS (the .drop-target class is gated on data-editor on <html>).
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
      if (!resolved) return;
      // No blob (CORS, redirect): store the URL verbatim — same-origin
      // ones still resolve as <img src>.
      if (!resolved.blob && resolved.url) { onDropRef.current(resolved.url); return; }
      try {
        const path = await writeImageToAssets(resolved.blob, prefixRef.current);
        onDropRef.current(path);
      } catch (err) {
        console.warn('writeImageToAssets failed; staging as data URL:', err && err.message);
        const reader = new FileReader();
        reader.onload = () => onDropRef.current(String(reader.result));
        reader.readAsDataURL(resolved.blob);
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

Object.assign(window, {
  Reveal, useParallax, useImageDrop, getLenis,
  ensureProjectDirHandle, writeImageToAssets, resolveDraggedToBlob,
});
