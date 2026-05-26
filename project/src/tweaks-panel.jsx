
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:300px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-resize{position:absolute;left:0;top:0;bottom:0;width:8px;cursor:ew-resize;
    background:transparent;transition:background .15s;touch-action:none;z-index:3}
  .twk-resize:hover,.twk-resize:active{background:rgba(0,0,0,.06)}
  .twk-resize::before{content:"";position:absolute;left:3px;top:50%;
    transform:translateY(-50%);width:2px;height:24px;border-radius:2px;
    background:rgba(0,0,0,.18);opacity:0;transition:opacity .15s}
  .twk-resize:hover::before{opacity:1}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    flex:1 1 auto;overflow-y:auto;overflow-x:hidden;min-height:0;
    overscroll-behavior:contain;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}
  .twk-sect-sub{font-weight:400;font-size:10px;letter-spacing:.01em;
    text-transform:none;color:rgba(41,38,27,.62);margin-top:3px;line-height:1.35}
  .twk-sect-jump{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.45);
    font:inherit;font-size:12px;line-height:1;padding:2px 4px;border-radius:4px;
    cursor:pointer;flex-shrink:0;text-transform:none;letter-spacing:0}
  .twk-sect-jump:hover{color:var(--ample-red,#c96442);background:rgba(0,0,0,.05)}

  /* Global slot-focus pulse — applied to any [data-ample-slot] element
     when its panel section's ↗ button is clicked. Lives in the global
     style scope because target elements are anywhere in the page tree,
     not inside the panel. */
  .ample-slot-focus{outline:2px solid #c96442 !important;outline-offset:4px;
    animation:ample-slot-flash 1.5s ease-out;border-radius:inherit}
  @keyframes ample-slot-flash{
    0%{box-shadow:0 0 0 0 rgba(201,100,66,.7)}
    25%{box-shadow:0 0 0 14px rgba(201,100,66,.18)}
    100%{box-shadow:0 0 0 26px rgba(201,100,66,0)}
  }

  .twk-field{appearance:none;width:100%;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  textarea.twk-field.twk-textarea{height:auto;min-height:48px;padding:6px 8px;
    line-height:1.4;resize:vertical;font-family:inherit}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-launcher{position:fixed;right:16px;bottom:16px;z-index:2147483646;
    appearance:none;display:inline-flex;align-items:center;gap:8px;
    padding:8px 12px 8px 10px;border:.5px solid rgba(255,255,255,.18);border-radius:999px;
    background:rgba(11,11,13,.78);color:rgba(255,255,255,.95);
    -webkit-backdrop-filter:blur(14px) saturate(160%);backdrop-filter:blur(14px) saturate(160%);
    box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 8px 28px rgba(0,0,0,.45);
    font:11px/1 ui-sans-serif,system-ui,-apple-system,sans-serif;font-weight:600;
    letter-spacing:.06em;text-transform:uppercase;cursor:pointer;
    transition:transform .15s,background .15s,border-color .15s}
  .twk-launcher:hover{background:rgba(11,11,13,.92);border-color:rgba(255,255,255,.32);
    transform:translateY(-1px)}
  .twk-launcher>span:first-child{font-size:14px;line-height:1}
  .twk-launcher-kbd{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
    font-size:9.5px;padding:2px 5px;border-radius:4px;
    background:rgba(255,255,255,.08);border:.5px solid rgba(255,255,255,.16);
    color:rgba(255,255,255,.7);letter-spacing:0}

  /* Tabs — sticky header strip inside the panel body. Matches the segmented
     control idiom (twk-seg) so the panel feels consistent. */
  .twk-tabs{display:flex;gap:2px;padding:2px;background:rgba(0,0,0,.06);
    border-radius:8px;margin:0 0 10px;outline:none;position:sticky;
    top:0;z-index:2;backdrop-filter:blur(8px)}
  .twk-tab{appearance:none;flex:1;min-width:0;border:0;background:transparent;
    color:rgba(41,38,27,.55);font:inherit;font-weight:600;font-size:10.5px;
    letter-spacing:.04em;text-transform:uppercase;padding:6px 4px;
    border-radius:6px;cursor:default;
    transition:background .15s,color .15s,box-shadow .15s;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .twk-tab:hover{color:rgba(41,38,27,.85)}
  .twk-tab.active{background:rgba(255,255,255,.92);color:#29261b;
    box-shadow:0 1px 2px rgba(0,0,0,.12)}
  .twk-tab:focus-visible{outline:2px solid var(--ample-red,#c96442);outline-offset:1px}
  .twk-tabs:focus-visible{outline:2px solid var(--ample-red,#c96442);outline-offset:2px}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).

// Recursively drop string values that won't survive a page reload:
//   - data:image/* and data:video/* URLs: bloat localStorage past 5MB
//   - blob:* URLs: revoked when the page unloads, so they're dead the
//     next time the page hydrates. If a useImageDrop upload failed
//     mid-way, the blob: URL would otherwise persist and render as a
//     broken image (visible as a black/empty box) after refresh.
// Per-session state lives in React; cross-session state lives in source
// via Save & lock.
function __stripDataUrls(v) {
  if (typeof v === 'string') {
    if (/^data:(image|video)\//i.test(v)) return undefined;
    if (/^blob:/i.test(v)) return undefined;
    return v;
  }
  if (Array.isArray(v)) {
    return v.map(__stripDataUrls).filter((x) => x !== undefined);
  }
  if (v && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v)) {
      const cleaned = __stripDataUrls(v[k]);
      if (cleaned !== undefined) out[k] = cleaned;
    }
    return out;
  }
  return v;
}

// localStorage schema version. Bump when stored shape changes in a way
// that older readers can't tolerate. Hydration walks back through prior
// versions, applies migrations, then writes the result under the current
// key — old keys are cleaned up. Lets us evolve the schema without
// stranding users on stale state.
const STORAGE_KEY_PREFIX = '__ampleTweaks_v';
const STORAGE_VERSION = 2;
const STORAGE_KEY = STORAGE_KEY_PREFIX + STORAGE_VERSION;

// Per-version migration functions. Key = the version we're migrating INTO.
// Each takes the parsed object from the previous version and returns the
// shape this version expects. Identity for now — bump and add transforms
// when the bag schema actually changes.
const __TWEAKS_MIGRATIONS = {
  2: (prev) => prev, // v1 → v2: bag entries can be strings OR objects; readers handle both, no rewrite needed
};

function __hydrateTweaks() {
  if (typeof localStorage === 'undefined') return null;
  try {
    // Current-version hit
    const cur = localStorage.getItem(STORAGE_KEY);
    if (cur) return __stripDataUrls(JSON.parse(cur)) || {};
    // Walk back through old versions, apply forward migrations, persist
    // result under the current key and clean up the old one.
    for (let v = STORAGE_VERSION - 1; v >= 0; v--) {
      const oldKey = STORAGE_KEY_PREFIX + v;
      const raw = localStorage.getItem(oldKey);
      if (raw == null) continue;
      let parsed = JSON.parse(raw);
      for (let step = v + 1; step <= STORAGE_VERSION; step++) {
        const fn = __TWEAKS_MIGRATIONS[step];
        if (fn) parsed = fn(parsed);
      }
      const cleaned = __stripDataUrls(parsed) || {};
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned)); } catch {}
      try { localStorage.removeItem(oldKey); } catch {}
      return cleaned;
    }
  } catch {}
  return null;
}

// Undo/redo history settings. Cap keeps memory in check; debounce coalesces
// slider drags into one history entry instead of one per pointermove.
const __TWEAKS_HISTORY_MAX = 30;
const __TWEAKS_DEBOUNCE_MS = 350;

function useTweaks(defaults) {
  const [values, setValues] = React.useState(() => {
    const hydrated = __hydrateTweaks();
    return hydrated ? { ...defaults, ...hydrated } : defaults;
  });

  // History stacks live in refs because they're not part of the rendered
  // output — bumping them shouldn't trigger a re-render. The bump counter
  // IS state, so canUndo/canRedo recompute when the user undoes/redoes.
  const pastRef = React.useRef([]);
  const futureRef = React.useRef([]);
  const lastPushAtRef = React.useRef(0);
  const [historyTick, setHistoryTick] = React.useState(0);

  // Three call shapes:
  //   setTweak('key', value)                  → edits = { key: value }
  //   setTweak({ key1: v1, key2: v2 })        → edits = that object
  //   setTweak((prev) => ({ key: derived }))  → edits = fn(prev), evaluated
  //                                             inside the setState callback so
  //                                             the derived edits always see
  //                                             the latest state (no stale
  //                                             closures from drop handlers).
  // Optional third arg: { skipHistory: true } — skips the undo push. Use
  // for invisible follow-ups like the drop handler swapping a blob: URL
  // for its canonical assets/ path AFTER an upload settles. Without this,
  // undo restores the (now-revoked) blob: URL and the image breaks.
  const setTweak = React.useCallback((keyOrEditsOrFn, val, opts) => {
    const skipHistory = !!(opts && opts.skipHistory);
    setValues((prev) => {
      let edits;
      if (typeof keyOrEditsOrFn === 'function') {
        edits = keyOrEditsOrFn(prev) || {};
      } else if (typeof keyOrEditsOrFn === 'object' && keyOrEditsOrFn !== null) {
        edits = keyOrEditsOrFn;
      } else {
        edits = { [keyOrEditsOrFn]: val };
      }
      const next = { ...prev, ...edits };

      // Push prev onto history, debounced. A burst of edits (slider drag)
      // collapses into a single undo step at the burst boundary.
      if (!skipHistory) {
        const now = Date.now();
        if (now - lastPushAtRef.current > __TWEAKS_DEBOUNCE_MS) {
          pastRef.current.push(prev);
          if (pastRef.current.length > __TWEAKS_HISTORY_MAX) pastRef.current.shift();
          futureRef.current = []; // any new edit clears the redo stack
          // Trigger re-render of canUndo/canRedo consumers without spamming
          setHistoryTick((n) => n + 1);
        }
        lastPushAtRef.current = now;
      }

      // React state keeps the data URL so the image renders this session;
      // localStorage only ever sees the stripped version.
      try {
        const persistable = __stripDataUrls(next) || {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
      } catch {}
      // Host protocol — fire inside the reducer so functional updaters'
      // computed edits get reported correctly. Non-StrictMode app, so
      // double-fire under reducer re-run isn't an issue.
      try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch {}
      return next;
    });
  }, []);

  const undo = React.useCallback(() => {
    setValues((prev) => {
      if (pastRef.current.length === 0) return prev;
      const restored = pastRef.current.pop();
      futureRef.current.push(prev);
      if (futureRef.current.length > __TWEAKS_HISTORY_MAX) futureRef.current.shift();
      try {
        const persistable = __stripDataUrls(restored) || {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
      } catch {}
      lastPushAtRef.current = 0; // next setTweak treats this as a fresh burst
      setHistoryTick((n) => n + 1);
      return restored;
    });
  }, []);

  const redo = React.useCallback(() => {
    setValues((prev) => {
      if (futureRef.current.length === 0) return prev;
      const restored = futureRef.current.pop();
      pastRef.current.push(prev);
      if (pastRef.current.length > __TWEAKS_HISTORY_MAX) pastRef.current.shift();
      try {
        const persistable = __stripDataUrls(restored) || {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
      } catch {}
      lastPushAtRef.current = 0;
      setHistoryTick((n) => n + 1);
      return restored;
    });
  }, []);

  // Recomputed only when history changes (historyTick) — cheap.
  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;
  // Reference historyTick so React tracks the dep (lint-friendly).
  void historyTick;

  // Memoize the history object so its identity is stable across renders
  // when nothing actually changed. Without this, every App render produced
  // a fresh history reference, which invalidated the TweaksContext useMemo,
  // re-fired the keydown listener effect, and re-mirrored window globals
  // — a quiet but real perf tax.
  const history = React.useMemo(
    () => ({ undo, redo, canUndo, canRedo }),
    [undo, redo, canUndo, canRedo]
  );
  return [values, setTweak, history];
}

// ── Image-slot helpers ─────────────────────────────────────────────────────
// Image bags split into two storage shapes by design — NOT inconsistency:
//
//   • categoryImages / storyImages / goldFeatureImages →
//     entries are { url, position, scale, fit } objects (or legacy bare
//     strings, normalized by readImageSlot). The knobs live INSIDE the
//     entry because each banner / story year / feature card is its own
//     standalone slot with no parallel per-slug state to attach them to.
//
//   • catalogCardImages →
//     entries stay as bare strings. The accompanying knobs (cardScale,
//     cardPadding, cardPosition) live in productOverrides[slug] because
//     they're properties of the PRODUCT, not the image-instance. A drop
//     replaces just the URL; the product's visual treatment persists
//     across image swaps. Migrating these into the bag would require
//     duplicating the same per-product values across every product surface
//     (catalog grid, featured rail, related grid) instead of one source.
//
// readImageSlot normalizes both shapes into the same { url, position,
// scale, fit } object so renderers don't have to branch. mergeImageSlot
// patches an object in place; mergeImageBag still exists for the
// string-only bag (catalogCardImages).
function readImageSlot(bag, key, fallbackUrl) {
  const v = (bag || {})[key];
  if (typeof v === 'string') {
    return { url: v, position: '50% 50%', scale: 1, fit: 'cover' };
  }
  if (v && typeof v === 'object') {
    return {
      url: typeof v.url === 'string' ? v.url : '',
      position: typeof v.position === 'string' ? v.position : '50% 50%',
      scale: typeof v.scale === 'number' ? v.scale : 1,
      fit: typeof v.fit === 'string' ? v.fit : 'cover',
    };
  }
  return { url: fallbackUrl || '', position: '50% 50%', scale: 1, fit: 'cover' };
}

// ── TweaksContext ───────────────────────────────────────────────────────────
// React Context that the panel and all readers consume. Replaces the legacy
// window.__ampleTweaks / window.__ampleSetTweak globals — components now
// subscribe properly and re-render on state changes instead of relying on a
// manual dispatch event. The provider also re-exposes the setters on window
// as compatibility shims for code paths (or third-party embeds) that still
// reach for the globals.
const TweaksContext = React.createContext(null);

function useTweakState() {
  const ctx = React.useContext(TweaksContext);
  if (!ctx) {
    // Render-time without a provider is almost certainly a bug — fail loud
    // with usable defaults rather than crashing the page with a TypeError.
    if (typeof console !== 'undefined') {
      console.warn('useTweakState() called outside <TweaksProvider> — returning no-op stubs.');
    }
    return {
      tweaks: {},
      setTweak: () => {},
      setProductTweak: () => {},
      mergeImageBag: () => {},
      mergeImageSlot: () => {},
      history: { undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
    };
  }
  return ctx;
}

function TweaksProvider({ value, children }) {
  // Pre-mount CSS init in index.html reads window.__ampleTweaks directly,
  // so keep the value mirror. The setter shims (__ampleSetTweak,
  // __ampleSetProductTweak, __ampleSetCategoryImage) were removed — a
  // repo-wide grep found zero readers. Internal callers all use
  // useTweakState(); legacy embeds can either upgrade or read tweaks
  // directly from this window value.
  React.useEffect(() => {
    window.__ampleTweaks = value.tweaks;
  }, [value.tweaks]);
  return React.createElement(TweaksContext.Provider, { value }, children);
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  // Editor-only — visitors never see the launcher or the panel. Bail before
  // any state/effects so we don't run drag listeners, message bus, etc.
  if (typeof window !== 'undefined' && !window.__ampleEditor) return null;
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;
  // Panel width — drag the left edge to expand. Persisted across reloads.
  const WIDTH_KEY = '__ampleTweaksWidth';
  const WIDTH_MIN = 260, WIDTH_MAX = 640, WIDTH_DEFAULT = 300;
  const [width, setWidth] = React.useState(() => {
    try {
      const v = parseInt(localStorage.getItem(WIDTH_KEY) || '', 10);
      if (Number.isFinite(v)) return Math.max(WIDTH_MIN, Math.min(WIDTH_MAX, v));
    } catch {}
    return WIDTH_DEFAULT;
  });
  const widthRef = React.useRef(width);
  widthRef.current = width;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');

    // Auto-open when running standalone (not embedded in Claude Design).
    // Also wire up `T` key as a toggle shortcut.
    const isStandalone = window.parent === window;
    if (isStandalone) setOpen(true);
    const onKey = (e) => {
      if (e.key !== 't' && e.key !== 'T') return;
      // Don't steal the keystroke when user is typing in a form field.
      // e.target may not be an Element (e.g. window/document) — guard before
      // calling closest() so the handler never throws and gets silenced.
      const tgt = e.target;
      const inField = tgt && typeof tgt.closest === 'function' &&
                      tgt.closest('input, textarea, select, [contenteditable]');
      if (inField) return;
      setOpen((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('message', onMsg);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // Left-edge resize. Panel is anchored bottom-right; dragging the left
  // edge LEFT widens it, dragging RIGHT narrows it. Width persisted to
  // localStorage so it survives reloads.
  const onResizeDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = widthRef.current;
    const move = (ev) => {
      const next = Math.max(WIDTH_MIN, Math.min(WIDTH_MAX, startW + (startX - ev.clientX)));
      setWidth(next);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      try { localStorage.setItem(WIDTH_KEY, String(widthRef.current)); } catch {}
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  if (!open) {
    // Closed: show a small floating launcher button so the panel is always
    // discoverable. T also toggles, but a visible button is easier to find.
    return (
      <>
        <style>{__TWEAKS_STYLE}</style>
        <button type="button" className="twk-launcher" data-noncommentable=""
                onClick={() => setOpen(true)}
                aria-label="Open Tweaks (T)">
          <span aria-hidden="true">⚙</span>
          <span className="twk-launcher-label">Tweaks</span>
          <span className="twk-launcher-kbd" aria-hidden="true">T</span>
        </button>
      </>
    );
  }
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-noncommentable=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y, width: width + 'px' }}>
        <div className="twk-resize" onPointerDown={onResizeDown}
             title="Drag to resize" aria-label="Resize panel" />
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">{children}</div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

// Section header. Optional:
//   subtitle — short plain-English description rendered under the label.
//   slot     — data-ample-slot value of the page element this section
//              controls. Renders a "↗" button that scrolls the element
//              into view and pulses an outline so you can find it.
function TweakSection({ label, subtitle, slot, children }) {
  const focus = React.useCallback(() => {
    if (!slot) return;
    const el = document.querySelector(`[data-ample-slot="${slot}"]`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ample-slot-focus');
    setTimeout(() => el.classList.remove('ample-slot-focus'), 1600);
  }, [slot]);
  return (
    <>
      <div className="twk-sect">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ flex: 1, minWidth: 0 }}>{label}</span>
          {slot && (
            <button type="button" className="twk-sect-jump"
                    onClick={focus} title="Jump to this on the page"
                    aria-label="Jump to this element">↗</button>
          )}
        </div>
        {subtitle && <div className="twk-sect-sub">{subtitle}</div>}
      </div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

function TweakColor({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <input type="color" className="twk-swatch" value={value}
             onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

// ── TweakImageMeta ──────────────────────────────────────────────────────────
// Fit (Fill / Fit) + Position pad pair. The two knobs that always travel
// together for background-image slots (category banners, story timeline,
// gold standard features). Use after reading the slot with readImageSlot;
// onPatch receives a partial like { fit: 'cover' } or { position: '50% 30%' }
// that can be handed straight to mergeImageSlot.
function TweakImageMeta({ slot, label, onPatch }) {
  const labelFor = (k) => label ? `${label} · ${k}` : (k.charAt(0).toUpperCase() + k.slice(1));
  return (
    <>
      <TweakRadio label={labelFor('fit')}
                  value={slot.fit}
                  options={[
                    { value: 'cover', label: 'Fill' },
                    { value: 'contain', label: 'Fit' },
                  ]}
                  onChange={(v) => onPatch({ fit: v })} />
      <TweakPositionPad label={labelFor('position')}
                        value={slot.position}
                        onChange={(v) => onPatch({ position: v })} />
    </>
  );
}

// ── TweakTabs / TweakTab ────────────────────────────────────────────────────
// Sticky horizontal tab strip inside the panel body. Children must be
// <TweakTab id="..."> wrappers — only the active tab's children mount, so
// non-visible tab trees don't keep stale effects running.
//
// Persists the active tab to localStorage keyed by `id`, and survives a
// route change that removes the active tab (falls back to the first tab).
// Keyboard: ← / → on the strip cycles tabs.
function TweakTabs({ id, tabs, children, sticky = false }) {
  const STORAGE_KEY = `__ampleTab_${id || 'default'}`;
  const validIds = tabs.map((t) => t.id);
  const firstId = validIds[0];
  const [active, setActive] = React.useState(() => {
    try {
      const stored = typeof localStorage !== 'undefined'
        ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored && validIds.includes(stored)) return stored;
    } catch {}
    return firstId;
  });
  // If the tab list changes and the active one is gone (route change), fall
  // back to the first tab. Without this you'd see an empty panel body.
  React.useEffect(() => {
    if (!validIds.includes(active)) setActive(firstId);
    // intentional: only react to the tab id set
  }, [validIds.join('|')]);
  const persist = (next) => {
    setActive(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  };
  const onKey = (e) => {
    const i = validIds.indexOf(active);
    if (i < 0) return;
    if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault(); persist(validIds[i - 1]);
    }
    if (e.key === 'ArrowRight' && i < validIds.length - 1) {
      e.preventDefault(); persist(validIds[i + 1]);
    }
  };
  return (
    <>
      <div className="twk-tabs" role="tablist" tabIndex={0} onKeyDown={onKey}
           style={sticky ? undefined : { position: 'static' }}>
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab"
                  aria-selected={t.id === active}
                  className={'twk-tab' + (t.id === active ? ' active' : '')}
                  onClick={() => persist(t.id)}
                  title={t.title || t.label}>{t.label}</button>
        ))}
      </div>
      {React.Children.toArray(children).filter(
        (c) => c && c.props && c.props.id === active
      )}
    </>
  );
}

function TweakTab({ id, children }) {
  // Pure wrapper — TweakTabs decides whether to render based on `id`.
  // The component just passes its children through.
  return React.createElement(React.Fragment, null, children);
}

// ── TweakPositionPad ────────────────────────────────────────────────────────
// 2D position pad: drag (or click) the dot inside the square to set an
// object-position-style "X% Y%" value. Companion control for the in-place
// drag-to-pan on the cards themselves — useful for fine adjustments and for
// resetting via a single click.
function TweakPositionPad({ label, value, onChange }) {
  const trackRef = React.useRef(null);
  const parsePos = (s) => {
    const m = String(s || '50% 50%').match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
    return m ? [parseFloat(m[1]), parseFloat(m[2])] : [50, 50];
  };
  const [x, y] = parsePos(value);

  const update = (clientX, clientY) => {
    const r = trackRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    const ny = Math.max(0, Math.min(100, ((clientY - r.top) / r.height) * 100));
    onChange(`${nx.toFixed(1)}% ${ny.toFixed(1)}%`);
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    update(e.clientX, e.clientY);
    const move = (ev) => update(ev.clientX, ev.clientY);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label} value={`${Math.round(x)}% ${Math.round(y)}%`}>
      <div ref={trackRef} onPointerDown={onPointerDown}
           style={{
             position: 'relative', width: '100%', height: 64,
             background: 'rgba(0,0,0,.06)', borderRadius: 6,
             border: '.5px solid rgba(0,0,0,.1)',
             cursor: 'crosshair', userSelect: 'none', touchAction: 'none',
             overflow: 'hidden',
           }}>
        {/* crosshair guides at 50/50 to anchor "center" visually */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '.5px dashed rgba(0,0,0,.18)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '.5px dashed rgba(0,0,0,.18)' }} />
        <div aria-hidden="true" style={{
          position: 'absolute', left: `${x}%`, top: `${y}%`,
          width: 12, height: 12, borderRadius: '50%',
          background: '#fff', border: '1.5px solid rgba(0,0,0,.7)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 1px 3px rgba(0,0,0,.3)',
          pointerEvents: 'none',
        }} />
      </div>
    </TweakRow>
  );
}

function TweakTextarea({ label, value, placeholder, rows = 3, onChange }) {
  return (
    <TweakRow label={label}>
      <textarea className="twk-field twk-textarea" value={value || ''}
                placeholder={placeholder} rows={rows}
                onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakTextarea, TweakNumber, TweakColor, TweakButton,
  TweakPositionPad, TweakImageMeta,
  TweakTabs, TweakTab,
  TweaksContext, TweaksProvider, useTweakState,
  readImageSlot,
});
