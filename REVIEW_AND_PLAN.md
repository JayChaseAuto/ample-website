# ample. — Site Review & Tweaks Manager 2.0 Plan
*2026-06-10 · produced from a 5-agent review: consistency audit, editor code review, page code review, UI critique, and Wix/Shopify/Framer/Squarespace editor research. No code has been changed.*

---

## Part 1 — The most important discovery first

**Your live site is not showing most of your images.** Two findings combine into this:

1. **Images live in the editor state, not the product data.** Card images, callout images, and banners exist only in `tweaks.productOverrides` / `catalogCardImages` — i.e. whatever was baked into `TWEAK_DEFAULTS` at your last "Save & lock," plus your browser's localStorage. Anything you edited but didn't Save & lock + push exists only on your machine.
2. **The fallback probe 404-storms.** When no override exists, every card tries `assets/<slug>.png` → 404 → `assets/<slug>.jpg` → 404 → falls back to a generic SVG drawing. Only 1 of 21 products has a convention-named file. On the live catalog that's ~40 wasted requests and visitors seeing placeholder line-art instead of your photos.

**Fix (Phase 0):** bake the real hashed `.webp` images into `ProductData.jsx` as proper defaults (`cardImage`, `calloutImage`, `banners`) and retire the probe. This one change makes live actually match what you see locally — the root of the local-vs-live confusion you've hit repeatedly.

---

## Part 2 — Code review (top findings, ranked)

### Critical / high
| # | Finding | Where |
|---|---|---|
| 1 | **Live-site image fallback storm** (see Part 1) | `ProductHero.jsx:657`, `ProductData.jsx` |
| 2 | **Product data mutated during render** — padding `numberedFeatures` with `while(items.length<4) items.push(...)` pushes empty entries into the *shared* PRODUCTS object | `ProductDetailPage.jsx:398` |
| 3 | **Undo can restore dead images** — an edit made while an upload is in flight snapshots the temporary `blob:` URL; undoing past the swap restores a permanently broken image | `Animations.jsx:373`, `tweaks-panel.jsx:304` |
| 4 | **Banner reorder during upload misroutes the file** — rows are patched by index; reorder/remove mid-upload lands the image on the wrong banner | `index.html` ProductBannerRow |
| 5 | **You can never delete the last banner** — empty list is treated as "use defaults," so base banners resurrect | 3 sites, incl. `ProductDetailPage.jsx:38` |
| 6 | **Editor slider drags re-render the whole site per pointer-move** and serialize all state to localStorage each tick — the lag you feel in the panel | `index.html` App state, `tweaks-panel.jsx:333` |
| 7 | **`?edit=1` works on the LIVE site and persists** — a visitor can be tricked into a tampered view of your site that survives reload (no server write risk — GitHub Pages has no endpoints — but it's a phishing/self-defacement vector + a 404-spamming poll). Gate the editor to localhost | `index.html:87` |
| 8 | **Carousel sub-threshold drag never snaps back** — slide stays visually stuck off-center | `ProductDetailPage.jsx:591` |

### Worth fixing in the same pass
- "Save & lock" can bake a dead `blob:` URL into source if an upload fails mid-save (every visitor then sees a broken image).
- **No "Reset to saved defaults" button anywhere** — stale localStorage shadows published defaults forever (the other half of local-vs-live drift).
- Per-product `cardImageFit` honored on /catalog only — same product renders differently on Home/Related rails.
- Catalog Images tab offers banner editing for products that never render banners (silent no-op trap).
- Contact form: no field labels (accessibility), "Buisness Inquiries" typo, two empty styled divs.
- Carousel layout-shift by design (mounts 16:9 then animates to real ratio) + all banners eager-load.
- Heading semantics: callout/benefit/card titles are styled `<div>`s — page outline collapses.
- Dead code: `callouts:[]`, never-rendered `features`/`bullets` (~120 lines), unused SVG renderer, `catalogCardCols` read-never-used, empty `categoryBlurbs` rendering empty `<p>`s.
- ~1,850-line inline Babel script in `index.html` — should be extracted to `src/` modules (only the EDITMODE block must stay inline).
- The same Scale/Padding/Position control trio is hand-copied in 3 places; hero knobs in 2 — they've already drifted.

---

## Part 3 — Consistency audit (top 10, each with a one-line fix)

1. **GoldBanner doesn't stack on mobile** (`HomePage.jsx:242`) — missing `stack-on-mobile`, fixed `56px 40px` padding → crushed two-column squeeze on every phone. *Add the class + clamp padding.*
2. **Catalog card images aren't clickable** — link wraps only the text band on /catalog, but whole-card elsewhere. *Make the whole card the link (editor drag still works — Home already proves it).*
3. **`.cat-card { border-radius: 4 }` is invalid CSS** (missing `px`) — category cards render square next to rounded product cards. *One character.*
4. **Five different hero-h1 size recipes** across pages (min sizes 34–56px, vw 6–8.5). *One shared `<PageTitle>`: `clamp(40px,7vw,88px)`.*
5. **Section h2s mix fixed-px and clamp()** — some headings never shrink on phones. *One `<SectionTitle>`: `clamp(28px,4.5vw,44px)`.*
6. **FeaturedCard vs CatalogCard are 90% duplicates that drifted** (title 15 vs 16px, different CTA labels/underlines). *Merge into one `<ProductCard>`.*
7. **Five different card-hover behaviors**; cat-card hover shifts content 2px. *One hover grammar token.*
8. **Six CTA-link species** ("View ›", "View Details", "LEARN MORE ›", "BROWSE ALL ›"…). *One `<CTALink>` primitive.*
9. **Spacing wobble** — Gold page misaligns with itself by 4px; product page uses fixed px while every other page clamps. *Adopt the shared clamp scale.*
10. **Token bypass cluster** — `#17110a` hardcoded 6×, medallion re-hardcodes the gold tokens, success-green bypasses `--ok`, three near-identical stage gradients, letter-spacing has 6 values. *Add `--ample-gold-ink`, `--stage-gradient`, two tracking tokens; use them.*

Also: breakpoints standardize on 720px (currently 380/520/720/900 salad); nav links have a transition but no hover rule (dead).

---

## Part 4 — UI improvements (my suggestions, grounded in parts-site UX)

### Highest impact, sitewide
1. **Catalog: sticky category chip row** under the intro — `Braking 5 · Cooling 6 · Engine 4 …` pills linking `#/catalog/<cat>` (route already exists, has no UI). The catalog is ~6,000px tall with zero in-page navigation. **Single highest-value visitor change.**
2. **Product pages convert nothing today.** Add an identity strip + CTA under the h1: mono SKU line (`AMP-BRK-0041 · OEM+ certified · per-batch verified`) and **`Request pricing & fitment`** (red, prefills `#/contact?subject=…`) + ghost `Download spec sheet`. The contact form gains a subject-prefill and an inquiry-type select. For an inquiry-based business, no price is fine — no *path to a price* is not.
3. **Nav bug:** every product page highlights "GOLD STANDARD" in the header (`active="gold"` hardcoded). Derive active state from the hash; add breadcrumbs (`Catalog › Braking › Brake Pads`) — the routes already exist.
4. **Empty-state rule:** anything empty either collapses or shows branded fallback. Today bare products show a 480px black void hero to visitors; blank callout circles "3. 4." render for products with 2 features; empty blurb `<p>`s ship on every catalog section.
5. **Loading:** visitors stare at pure black while ~2MB of Babel compiles 10 JSX files. Quick fix: static logo splash inside `#root` + font preload. Real fix: a one-shot precompile step so live ships plain JS (also removes dev-React + unpkg dependency).
6. **Footer is anemic:** missing Catalog & Gold links (the two commercial pages), no email, no copyright. 3-column layout reusing `NAV_LINKS`.
7. **`document.title` never changes per route** — bookmarks/history all read the same. Set `ample. — Brake Pads` etc.

### Per page (abridged)
- **Home:** hero has no CTA (add Browse catalog + Gold Standard buttons); h1 min 56px is too big on phones (`clamp(38px,9vw,104px)`); stats — swap "1M+ happy customers" for a verifiable spec ("±5 µm machining tolerance"); Wipers category card missing (dead aisle — category exists only in catalog); featured rail is just "first 4 products," should be curated (gold first).
- **Catalog:** lone-category card stretch (Lighting=1 SKU): recommended fix is `auto-fill` with capped tracks `repeat(auto-fill, minmax(260px, 320px))` — uniform card size in every section, lone cards left-aligned under their full-width ruled header (reads intentional, not empty — this is how Dorman does it). Alternative for thin sections: a denser horizontal "spec row" variant.
- **Product:** medallion pushes content 140px down on phones (shrink + absolute-position); `bannerHeight` fixed-px should clamp to `min(value, 56vw)` on phones; related-rail "filler" products contradict the "Related · Braking" label.
- **Gold:** page never links to a single product — add a 4-up gold SKU rail; state an actual warranty term; hero medallion duplicates the homepage one — lead with the dyno video instead.
- **Story:** fix copy casing of entry 1; year labels as mono spec (`2009`, `2011–2019`, `2019–NOW`); add closing CTA (currently dead-ends).
- **Contact:** typo fix; label the fields; emails as `mailto:` links; iOS zoom fix (16px inputs); subject prefill support.

---

## Part 5 — Tweaks Manager 2.0 ("ample Studio")

### Why the current editor fights you
- **Controls live far from the thing.** Editing a product hero means: be on the right route, open the right tab, scroll the right section. Wix/Shopify's #1 pattern is *click the thing itself*.
- **Every image kind has different freedoms.** Hero gets fit+scale+position+overlay; cards get scale/padding/position; categories get fit+position; banners until recently got nothing. Same task, five rulebooks.
- **No media library.** `/assets` is invisible — uploads vanish into a folder you can't browse; reuse means retyping paths; the "photo dropdowns" list 4 hardcoded files.
- **No focal point.** Position pads are panel-side proxies; "scale" sometimes crops weirdly because it's a CSS transform inside `overflow:hidden`.
- **No mobile control.** One crop serves all screen sizes; you can't even see what mobile gets while editing.
- **No state visibility.** Draft (localStorage) vs Saved (index.html) vs Live (GitHub) are invisible — the recurring "this isn't what's live" confusion. And there's no Reset button.

### The new model (patterns adopted from the research)

**1. One unified image slot** *(Shopify focal-point metadata + Wix non-destructive editing)*
Every image on the site — hero, card, callout, banner, category, gold, story, site-bg — becomes the same data shape:
```json
{ "src": "assets/card-brake-pads.webp", "alt": "…",
  "focal": [62, 38], "zoom": 1.0, "fit": "cover",
  "overlay": 35, "mobile": { "focal": [50, 20] } }
```
Rendered by one `<SlotImage>` component (`object-fit` + `object-position` from focal). Non-destructive: the file is never edited; reframing is metadata. Migration v2→v3 converts all existing shapes (the migration infra already exists).

**2. Click-to-edit on canvas** *(Wix/Framer)*
In edit mode, hovering any tweakable element shows an outline + name chip; clicking selects it and the panel re-scopes to *just its* controls. The existing `data-ample-slot` attributes become a slot registry. A "Sections" tree in the panel (Wix Layers) handles hard-to-click things and doubles as the navigator.

**3. Focal point ON the image** *(Squarespace)*
Selected image gets a draggable dot directly on the page — drag to choose what stays visible at any crop. Arrow keys nudge. The panel pad remains as the precision fallback. This replaces "Position" everywhere with one consistent gesture.

**4. Media Library** *(Wix Media Manager)* — the "freedom with pictures" centerpiece
A full-screen modal, one source of truth for `/assets`:
- Browse every asset as thumbnails; search by name; filter by kind (cards / heroes / banners / unused).
- **"Used in" badges** — see exactly which slots reference each image.
- Drag-drop upload zone; auto-rename to the slot convention; client-side resize per use (card 800px / banner 1600px) with a size warning.
- Every image control gains a **"Choose from library"** button next to drop/paste — reuse any image anywhere in two clicks.
- Powered by one new read-only dev-server endpoint (`GET /__editor/assets` returns the file list). Live site unaffected.

**5. Schema-driven controls** *(Shopify settings schema)*
All panel controls generated from one declarative schema (`{type: range|select|color|image|toggle, label, min, max, info}`) by a single renderer. Kills the three hand-copied control blocks, guarantees every image kind gets the *same* controls, and makes adding a knob a one-line change.

**6. Mobile overrides that cascade** *(Wix mobile editor / Framer breakpoints)*
Desktop is the source of truth; switch the existing device toggle to "mobile editing mode" and any change writes to a sparse `mobile:{}` override. Overridden fields show a blue dot with right-click "reset to desktop." Plus per-slot "hide on mobile."

**7. Presets** *(Shopify)*
Named one-click looks per slot type — hero: "Dark cinematic / Clean studio / Full-bleed"; banners: "Compact strip / Showcase / Edge-to-edge" — shown as thumbnails of *your actual image* with the preset applied.

**8. Undo/redo + named snapshots + Reset** *(Wix Site History)*
Keep Ctrl+Z (fixing the blob-poisoning bug), add: "Reset slot to saved," "Reset all to saved," and named snapshots ("before-summer-refresh") stored locally and restorable.

### My own additions (not in Wix/Shopify — specific to your setup)

**A. Publish-state bar.** A persistent strip in the panel: `Draft: 7 changes · Saved: in index.html · Live: 2 commits behind` with buttons **Save & lock** → **(then) push reminder**. Makes the three-layer state (localStorage → file → GitHub) visible at all times. *Directly kills your recurring local-vs-live confusion.*

**B. Image health checker.** A panel tab that scans every slot and reports: broken paths (404s), images referenced but never Saved-&-locked (drift risk), files >500KB, unused assets cluttering `/assets`, missing alt text. One click jumps to the offending slot.

**C. Bulk operations.** "Apply this fit/scale to all catalog cards," "set all banner heights," — the panel's per-product loop already proved you need this.

**D. Slot-aware auto-naming.** Drops are already prefixed (`card-<slug>-…`); extend everywhere so the library stays organized without you thinking about filenames.

**E. Editor gate hardening.** The editor only activates on localhost (fixes the live `?edit=1` vector), and the published page stops shipping editor markup entirely.

### What stays (it's good)
The dev-server save round-trip (atomic EDITMODE swap), drag-drop upload to `/assets`, the undo system's bones, SVG-blocking upload allowlist, the device preview frame, and the overall panel-on-the-right layout.

---

## Part 6 — Build order

| Phase | Scope | Size |
|---|---|---|
| **0 — Stabilize** | The 8 ranked bugs + bake images into ProductData (kills 404 storm + drift root) + contact form labels/typo + nav `active` fix | 1 session |
| **1 — Foundation** | Extract the 1,850-line inline script to `src/editor-*.jsx` modules; unified slot data model + v3 migration; schema-driven control renderer | 1–2 sessions |
| **2 — Media Library** | `GET /__editor/assets` endpoint; library modal (browse/search/used-in/upload); "Choose from library" everywhere | 1 session |
| **3 — On-canvas editing** | Slot registry + selection overlays; click-to-edit contextual panel; focal-point drag on the page; sections tree | 1–2 sessions |
| **4 — Power features** | Mobile override layer + device-toggle integration; presets; publish-state bar; health checker; snapshots/reset | 1–2 sessions |
| **5 — Consistency & UI sweep** | Part 3's top-10 + Part 4's improvements (chips, CTA strip, breadcrumbs, footer, empty states, titles, splash) | 1–2 sessions |
| **6 — Ship-speed (optional)** | Precompile JSX for live (kills Babel-in-browser, dev React, the black flash) | 1 session |

Phases 0 and 5 are independent of the Studio rebuild and can land anytime. 1→2→3→4 are sequential. Everything stays GitHub-Pages compatible (no backend; the library endpoint is local-dev only).

---

## Part 7 — Decisions I need from you

1. **Scope check:** full plan as written, or trim? (e.g., skip presets / mobile overrides for v1)
2. **Start point:** Phase 0 (bug fixes) first, or jump straight to the Studio foundation (Phase 1)? My recommendation: 0 → 1 → 2 → 3 → 4, with 5 interleaved.
3. **Live-site changes implied by Phase 0** (baking images into product data, gating the editor to localhost) ship via the same PR flow as before — OK?
4. **Catalog lone-card fix:** uniform capped tracks (recommended), dense spec-rows for thin categories, or merge thin categories?
5. **Precompile (Phase 6):** worth doing? It changes the deploy slightly (one build step) but is the single biggest live-site speed win.
