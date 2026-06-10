/* Ample — Product Detail Page — matches the "Page 3+ Braking/Cooling/..." reference layouts */

function ProductDetailPage({ slug }) {
  const { tweaks, setProductTweak } = useTweakState();
  const overrides = (tweaks.productOverrides || {})[slug] || {};
  // Apply overrides on top of the base product. Empty strings for text fields
  // shouldn't blank out defaults — only apply non-empty values.
  const base = PRODUCTS[slug] || PRODUCTS['brake-pads'];
  const p = { ...base };
  for (const k of ['eyebrow', 'title', 'title2', 'heroAsset', 'description',
                   'intro', 'closing', 'benefitsTitle', 'outro',
                   'heroImageFit', 'heroImagePosition', 'calloutImageFit', 'bannerFit']) {
    if (overrides[k] != null && overrides[k] !== '') p[k] = overrides[k];
  }
  // Numeric hero knobs — 0 is a valid value (no overlay) so gate on type,
  // not truthiness.
  if (typeof overrides.heroOverlay === 'number') p.heroOverlay = overrides.heroOverlay;
  if (typeof overrides.heroHeight === 'number') p.heroHeight = overrides.heroHeight;
  // Banner display: fixed pixel height (0/unset = auto-size to each image's
  // natural ratio). Drives BannerCarousel; pairs with bannerFit.
  if (typeof overrides.bannerHeight === 'number') p.bannerHeight = overrides.bannerHeight;
  // Arrays: replace whole-list when an override exists; falsy/empty means
  // "use base". The tweaks panel always sends a 4-item array.
  if (Array.isArray(overrides.numberedFeatures) && overrides.numberedFeatures.length) {
    p.numberedFeatures = overrides.numberedFeatures;
  }
  if (Array.isArray(overrides.benefits) && overrides.benefits.length) {
    p.benefits = overrides.benefits;
  }
  // Engineering-summary bullets — editable per-product via the Tweaks
  // textarea (one bullet per line). Empty array means "use base bullets".
  if (Array.isArray(overrides.bullets) && overrides.bullets.length) {
    p.bullets = overrides.bullets;
  }
  // Banner gallery — ordered list of full-width marketing graphics shown
  // below the callouts. Each entry is { url, alt }. ANY array override is
  // authoritative — including [] — so the editor can remove every banner on
  // a product that ships base banners (e.g. lighting) without them
  // resurrecting. Only undefined/null falls back to the base set.
  if (Array.isArray(overrides.banners)) {
    p.banners = overrides.banners.filter((b) => b && b.url);
  }
  // Centered callout image transform scale. 1.0 = exactly fits the box.
  // Note: >1 will visually CROP since the parent has overflow:hidden — if
  // an asset looks small it's because the PNG has transparent margin baked
  // in; the proper fix is to crop the source. Clamping here to a safe range
  // so an over-eager Tweaks slider can't blow the image past the panel.
  {
    const raw = (typeof overrides.calloutImageScale === 'number')
      ? overrides.calloutImageScale : 1.0;
    // Range must match the slider's min/max in index.html — otherwise the
    // panel displays a value the runtime silently rounds down on first edit.
    p.calloutImageScale = Math.max(0.5, Math.min(2.5, raw));
  }
  // Position the callout image inside its frame ("X% Y%"). Drives
  // object-position on the <img> inside ProductCardMedia. Default = center.
  p.calloutImagePosition = typeof overrides.calloutImagePosition === 'string'
    ? overrides.calloutImagePosition : '50% 50%';
  // heroBgImage is a NEW field — empty string means "no photo".
  p.heroBgImage = overrides.heroBgImage || '';
  // Hero background scale. Default 1, clamp to a sane range so an over-
  // eager slider can't blow the image past the page chrome.
  {
    const raw = (typeof overrides.heroBgImageScale === 'number')
      ? overrides.heroBgImageScale : 1.0;
    p.heroBgImageScale = Math.max(0.5, Math.min(2.0, raw));
  }
  // calloutImage: the big center photo on the rich callout layout. Has its
  // own slot so the catalog thumbnail and the detail-page hero photo can be
  // different. Falls back to the catalog card image when no callout-
  // specific override is set, so existing products that only have a card
  // image keep rendering it in the callout slot.
  p.calloutImage = overrides.calloutImage || (tweaks.catalogCardImages || {})[slug] || base.cardImage || '';
  const usesRichLayout = !!(p.numberedFeatures && p.numberedFeatures.length);

  const heroDropRef = React.useRef(null);
  useImageDrop(heroDropRef, (path, opts) => {
    setProductTweak(slug, 'heroBgImage', path, opts);
  }, { namePrefix: `product-${slug}-hero` });

  // Unknown slug → a small not-found page instead of silently rendering
  // brake-pads with the wrong product's overrides. Placed AFTER all hooks
  // so the hook order stays stable across slug changes.
  if (!PRODUCTS[slug]) {
    return (
      <div style={{ background: 'transparent', minHeight: '100vh', color: 'var(--fg-1)' }}>
        <SiteHeader active="catalog" />
        <main style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(40px, 7vw, 56px) clamp(16px, 4vw, 40px) clamp(56px, 9vw, 80px)' }}>
          <Eyebrow>Not Found</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: '14px 0 0' }}>
            That part isn't<br />in the catalog.
          </h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6, marginTop: 18 }}>
            <a href="#/catalog" style={{ color: 'var(--ample-red)' }}>Browse the full catalog ›</a>
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', color: 'var(--fg-1)' }}>
      <SiteHeader active="catalog" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>
        {/* Hero section. Left-aligned eyebrow + title on the left, optional
            gold medallion on the right. Wraps on narrow screens so the
            medallion drops below the text instead of squishing. */}
        <section style={{ position: 'relative', padding: 'clamp(32px, 6vw, 48px) 0 clamp(28px, 5vw, 40px)' }} data-screen-label={`Product · ${p.slug}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
            <Reveal style={{ flex: '1 1 320px', minWidth: 0 }}>
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <h1 className="product-hero-title" style={{
                fontFamily: 'var(--font-product)', fontWeight: 800,
                fontSize: 'clamp(40px, 6vw, 84px)', lineHeight: 0.92,
                textTransform: 'uppercase', letterSpacing: '-0.02em',
                margin: '14px 0 0',
              }}>
                {p.title}{p.title2 ? <><br />{p.title2}</> : null}
              </h1>
            </Reveal>
            {p.goldStandard && (
              <Reveal delay={2} style={{ paddingTop: 8 }}>
                <GoldMedallion size={100} />
              </Reveal>
            )}
          </div>

          {/* Drop hero — only for bare products with NO rich callout layout
              AND no description showcase. Rich-layout products show a centered
              product shot inside the callouts; description-layout products
              (e.g. the brake-pad wear sensor) show one in DescriptionLayout.
              For both, this big hero banner would just be a redundant empty
              box, so skip it and keep the title + the product itself.
              Visitors additionally never see the no-photo state: without an
              image this is a giant empty gradient box (the drop placeholder
              is editor-only CSS), so it renders for editors only until a
              photo is set. Height clamps on phones so a fixed desktop px
              value can't fill the whole viewport. */}
          {!usesRichLayout && !p.description &&
           (p.heroBgImage || (typeof window !== 'undefined' && window.__ampleEditor)) && (
            <Reveal delay={2}>
              <div ref={heroDropRef} className="drop-target product-hero"
                   data-ample-slot="product-hero"
                   style={p.heroHeight ? { minHeight: `min(${p.heroHeight}px, 70vw)` } : undefined}>
                <div className="drop-hint">Drop image to set product hero</div>
                {p.heroBgImage ? (
                  <>
                    {/* Blurred backdrop — fills the dead space when the
                        hero image is fit:contain, so the frame visually
                        wraps the photo (premium-auto pattern). Skip when
                        fit:cover since the image already fills. */}
                    {(p.heroImageFit || 'cover') === 'contain' && (
                      <div aria-hidden="true" style={{
                        position: 'absolute', inset: 0, zIndex: 0,
                        backgroundImage: `url(${p.heroBgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(36px) saturate(1.2) brightness(0.5)',
                        transform: 'scale(1.15)',
                        pointerEvents: 'none',
                      }} />
                    )}
                    <div className="product-hero-image"
                         style={{
                           backgroundImage: `url(${p.heroBgImage})`,
                           backgroundSize: p.heroImageFit || 'cover',
                           backgroundPosition: p.heroImagePosition || 'center',
                           // Scale composes with background-position by
                           // anchoring the scale origin to the same point —
                           // pan and zoom feel coherent instead of fighting.
                           transform: p.heroBgImageScale !== 1
                             ? `scale(${p.heroBgImageScale})` : undefined,
                           transformOrigin: p.heroImagePosition || 'center',
                         }} />
                    {p.heroOverlay > 0 && (
                      <div aria-hidden="true" style={{
                        position: 'absolute', inset: 0,
                        background: `rgba(0,0,0,${(p.heroOverlay / 100).toFixed(2)})`,
                        pointerEvents: 'none',
                      }} />
                    )}
                  </>
                ) : (
                  <div className="product-hero-placeholder">
                    <div className="product-hero-placeholder-frame">▢</div>
                    <div className="product-hero-placeholder-text">Drop product photo</div>
                    <div className="product-hero-placeholder-sub">JPG · PNG · WEBP</div>
                  </div>
                )}
              </div>
            </Reveal>
          )}
        </section>

        {/* Body layout. Rich (numbered callouts + benefits) when the product
            defines numberedFeatures; otherwise a description showcase that
            keeps the same centered product-image format as the rich layout
            but drops the 1·2·3·4 callouts and shows just the description
            (e.g. the brake-pad wear sensor). Legacy FeatureCard grid is the
            final fallback for un-upgraded SKUs. */}
        {usesRichLayout ? (
          <CalloutLayout slug={slug} p={p} calloutImage={p.calloutImage} />
        ) : p.description ? (
          <DescriptionLayout slug={slug} p={p} calloutImage={p.calloutImage} />
        ) : p.features && p.features.length > 0 ? (
          <section style={{ padding: '32px 0 48px', borderTop: '1px solid var(--border-1)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: p.features.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
              gap: 20,
            }}>
              {p.features.map((f, i) => (
                <Reveal key={i} delay={i % 4}>
                  <FeatureCard {...f} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {/* Engineering Summary section removed — the bullet list was cluttering
            the page now that every rich-layout product has intro + 4 numbered
            callouts + benefits panel that already cover the same ground.
            p.bullets is still loaded as a tweak field (Tweaks panel exposes it
            in case future templates want to surface it again), it just no
            longer renders on the detail page. */}

        {/* Banner gallery now renders inside the callout center stage as a
            swipeable carousel (see CalloutLayout / BannerCarousel), so there
            is no separate stacked section here. */}

        {/* Related products rail */}
        <RelatedProducts current={slug} />
      </main>
      <SiteFooter />
    </div>
  );
}

function FeatureCard({ icon, title, body }) {
  return (
    <div style={{
      background: 'var(--ample-coal)', border: '1px solid var(--border-1)',
      padding: '22px 22px 20px', borderRadius: 4,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name={icon} size={18} color="red" />
        <div style={{ fontFamily: 'var(--font-product)', fontWeight: 700, textTransform: 'uppercase', fontSize: 14, letterSpacing: '0.04em' }}>{title}</div>
      </div>
      <p style={{ color: 'var(--fg-2)', fontSize: 13, lineHeight: 1.55, margin: 0 }}>{body}</p>
    </div>
  );
}

/* ---------- Description layout (showcase + description, no callouts) ----------
   Same visual format as the rich callout layout — a centered product showcase
   image (drop-to-set, or a banner carousel when the product has banners) — but
   WITHOUT the 1·2·3·4 numbered callouts. The body is just the product's
   `description`. Optional intro/closing/benefits/outro still render if present,
   so it degrades gracefully; the wear sensor uses only the description. */
function DescriptionLayout({ slug, p, calloutImage }) {
  const { setProductTweak } = useTweakState();
  const banners = p.banners || [];
  const hasBanners = banners.length > 0;
  const calloutDropRef = React.useRef(null);
  useImageDrop(calloutDropRef, (path, opts) => {
    setProductTweak(slug, 'calloutImage', path, opts);
  }, { namePrefix: `callout-${slug}` });
  return (
    <>
      <section style={{ padding: '40px 0 24px', borderTop: '1px solid var(--border-1)' }}>
        {p.intro && (
          <Reveal>
            <p style={{ color: 'var(--fg-3)', fontSize: 14, lineHeight: 1.7,
                        maxWidth: 920, margin: '0 auto 36px', textAlign: 'center' }}>{p.intro}</p>
          </Reveal>
        )}
        <Reveal>
          {hasBanners ? (
            <div className="callout-showcase">
              <div className="callout-stage" style={{
                position: 'relative',
                background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #050608 80%)',
                overflow: 'hidden', borderRadius: 6, border: '1px solid var(--border-1)',
              }}>
                <div className="callout-stage-reflection" aria-hidden="true" />
                <BannerCarousel banners={banners} p={p} />
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 380, margin: '0 auto' }}>
              <div ref={calloutDropRef} className="callout-stage drop-target"
                   data-ample-slot="product-callout" style={{
                position: 'relative', aspectRatio: '1/1',
                background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #050608 80%)',
                overflow: 'hidden', borderRadius: 4, border: '1px solid var(--border-1)',
              }}>
                <div className="callout-stage-reflection" aria-hidden="true" />
                <div className="drop-hint">Drop image to set product photo</div>
                <div style={{ position: 'absolute', inset: 0,
                              transform: `scale(${p.calloutImageScale || 1})`,
                              transformOrigin: 'center' }}>
                  <ProductCardMedia slug={slug} heroAsset={p.heroAsset}
                    fit={p.calloutImageFit || 'contain'}
                    size={280} override={calloutImage}
                    padding={(p.calloutImageFit || 'contain') === 'cover' ? 0 : 24}
                    position={p.calloutImagePosition || '50% 50%'}
                    onPositionChange={window.__ampleEditor
                      ? (pos) => setProductTweak(slug, 'calloutImagePosition', pos)
                      : undefined} />
                </div>
              </div>
            </div>
          )}
        </Reveal>
        {p.description && (
          <Reveal delay={1}>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.75,
                        maxWidth: 760, margin: '28px auto 0', textAlign: 'center' }}>
              {p.description}
            </p>
          </Reveal>
        )}
      </section>
      {p.closing && (
        <section style={{ padding: '8px 0 24px' }}>
          <Reveal>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.7,
                        maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>{p.closing}</p>
          </Reveal>
        </section>
      )}
      {p.benefits && p.benefits.length > 0 && (
        <BenefitsBlock title={p.benefitsTitle} items={p.benefits} />
      )}
      {p.outro && (
        <section style={{ padding: '0 0 32px' }}>
          <Reveal>
            <p style={{ color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.7,
                        maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>{p.outro}</p>
          </Reveal>
        </section>
      )}
    </>
  );
}

/* ---------- Callout/Benefits layout (bremsenbrakes-style) ----------
   Renders when a product defines `numberedFeatures`. Layout: a four-corner
   numbered callout grid wrapped around a centered product shot, then a
   2×2 benefits panel, with optional intro/closing/outro paragraphs.
   The center shot pulls from `productOverrides[slug].calloutImage` first,
   falling back to `catalogCardImages[slug]` so older products without a
   dedicated callout image still render. Distinct from the moody hero
   background up top — typically a clean technical photo. */
function CalloutItem({ num, title, body, align = 'left' }) {
  const isRight = align === 'right';
  const isTop = align === 'top'; // number stacked on top — used in the row
                                 // beneath the focal carousel.
  return (
    <div className="callout-card" style={{
      display: 'flex',
      flexDirection: isTop ? 'column' : (isRight ? 'row-reverse' : 'row'),
      alignItems: 'center',
      gap: isTop ? 12 : 18,
      textAlign: 'center',
    }}>
      <div className="callout-num" style={{
        width: 40, height: 40, borderRadius: 999,
        background: 'var(--ample-coal)', border: '1px solid var(--border-1)',
        color: 'var(--fg-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 14,
        flexShrink: 0,
      }}>{num}.</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-product)', fontWeight: 800,
          fontSize: isTop ? 17 : 22, textTransform: 'uppercase',
          letterSpacing: '-0.01em', lineHeight: 1.15,
        }}>{title}</div>
        <p style={{ color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.55, margin: '8px auto 0', maxWidth: 280 }}>{body}</p>
      </div>
    </div>
  );
}

function BenefitsBlock({ title, items }) {
  if (!items || !items.length) return null;
  return (
    <section style={{ padding: '8px 0 48px' }}>
      <Reveal>
        {title && (
          <div style={{
            fontFamily: 'var(--font-product)', fontWeight: 800,
            fontSize: 18, marginBottom: 16, color: 'var(--fg-1)',
            textTransform: 'uppercase', letterSpacing: '0.02em',
            textAlign: 'center',
          }}>{title}</div>
        )}
        <div className="benefits-2x2" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          border: '1px solid var(--border-1)', maxWidth: 1100,
          margin: '0 auto',
        }}>
          {items.map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '18px 22px',
              borderRight: i % 2 === 0 ? '1px solid var(--border-1)' : 'none',
              borderTop: i >= 2 ? '1px solid var(--border-1)' : 'none',
              fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.5,
            }}>
              <Icon name={b.icon} size={26} color="gold" />
              <span>{b.body}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function CalloutLayout({ slug, p, calloutImage }) {
  const { setProductTweak } = useTweakState();
  // COPY before padding — p.numberedFeatures is the same array reference as
  // PRODUCTS[slug].numberedFeatures (or the override array inside tweak
  // state); pushing into it directly would permanently corrupt shared data
  // for any product shipping fewer than 4 features.
  const items = [...(p.numberedFeatures || [])];
  // Pad to 4 so layout placement is stable even if a product ships fewer.
  while (items.length < 4) items.push({ title: '', body: '' });
  // When the product has banners, the center stage becomes a swipeable
  // carousel of them (auto-resizing to each banner). Otherwise it keeps the
  // single drop-to-set product photo.
  const banners = p.banners || [];
  const hasBanners = banners.length > 0;

  // Drag-drop on the center callout image. Writes to its OWN per-product
  // field (productOverrides[slug].calloutImage) so it's independent from
  // the catalog card thumbnail. Render-time fallback in ProductDetailPage
  // still uses catalogCardImages[slug] when no callout override is set, so
  // products with only a card image keep showing it in the callout slot.
  const calloutDropRef = React.useRef(null);
  useImageDrop(calloutDropRef, (path, opts) => {
    setProductTweak(slug, 'calloutImage', path, opts);
  }, { namePrefix: `callout-${slug}` });

  return (
    <>
      <section style={{ padding: '40px 0 24px', borderTop: '1px solid var(--border-1)' }}>
        {p.intro && (
          <Reveal>
            <p style={{
              color: 'var(--fg-3)', fontSize: 14, lineHeight: 1.7,
              maxWidth: 920, margin: '0 auto 36px', textAlign: 'center',
            }}>{p.intro}</p>
          </Reveal>
        )}
        {hasBanners ? (
          /* Image-focus layout: a large centered carousel as the hero of the
             section, with the four numbered callouts as a supporting row
             beneath it. The banner is the clear focal point on desktop and
             mobile, larger than the surrounding copy. */
          <>
            <Reveal>
              <div className="callout-showcase">
                <div className="callout-stage" style={{
                  position: 'relative',
                  background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #050608 80%)',
                  overflow: 'hidden', borderRadius: 6,
                  border: '1px solid var(--border-1)',
                }}>
                  <div className="callout-stage-reflection" aria-hidden="true" />
                  <BannerCarousel banners={banners} p={p} />
                </div>
              </div>
            </Reveal>
            <div className="callout-row">
              {items.map((it, i) => (
                <Reveal key={`co-${i}`} delay={i % 4}>
                  <CalloutItem num={`${i + 1}`} align="top" title={it.title} body={it.body} />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <div className="callout-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr minmax(260px, 380px) 1fr',
            rowGap: 48, columnGap: 32,
            alignItems: 'center',
          }}>
            <Reveal style={{ gridColumn: 1, gridRow: 1 }}>
              <CalloutItem num="1" align="right" title={items[0].title} body={items[0].body} />
            </Reveal>
            <Reveal style={{ gridColumn: 3, gridRow: 1 }} delay={1}>
              <CalloutItem num="2" align="left" title={items[1].title} body={items[1].body} />
            </Reveal>
            <div ref={calloutDropRef} className="callout-stage drop-target"
                 data-ample-slot="product-callout" style={{
              gridColumn: 2, gridRow: '1 / span 2',
              position: 'relative', aspectRatio: '1/1',
              background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #050608 80%)',
              overflow: 'hidden', borderRadius: 4,
              border: '1px solid var(--border-1)',
            }}>
              <div className="callout-stage-reflection" aria-hidden="true" />
              <div className="drop-hint">Drop image to set product photo</div>
              {/* Wrapper applies the callout image scale — wraps the absolute
                  <img> ProductCardMedia renders so the transform applies. */}
              <div style={{
                position: 'absolute', inset: 0,
                transform: `scale(${p.calloutImageScale || 1})`,
                transformOrigin: 'center',
              }}>
                <ProductCardMedia slug={slug} heroAsset={p.heroAsset}
                  fit={p.calloutImageFit || 'contain'}
                  size={280} override={calloutImage} padding={28}
                  position={p.calloutImagePosition || '50% 50%'}
                  onPositionChange={window.__ampleEditor
                    ? (pos) => setProductTweak(slug, 'calloutImagePosition', pos)
                    : undefined} />
              </div>
            </div>
            <Reveal style={{ gridColumn: 1, gridRow: 2 }} delay={2}>
              <CalloutItem num="3" align="right" title={items[2].title} body={items[2].body} />
            </Reveal>
            <Reveal style={{ gridColumn: 3, gridRow: 2 }} delay={3}>
              <CalloutItem num="4" align="left" title={items[3].title} body={items[3].body} />
            </Reveal>
          </div>
        )}
      </section>
      {p.closing && (
        <section style={{ padding: '8px 0 24px' }}>
          <Reveal>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.7,
                        maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>{p.closing}</p>
          </Reveal>
        </section>
      )}
      <BenefitsBlock title={p.benefitsTitle} items={p.benefits} />
      {p.outro && (
        <section style={{ padding: '0 0 32px' }}>
          <Reveal>
            <p style={{ color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.7,
                        maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>{p.outro}</p>
          </Reveal>
        </section>
      )}
    </>
  );
}

/* ---------- BannerCarousel ----------
   Swipeable gallery of a product's uploaded marketing graphics
   (productOverrides[slug].banners / base p.banners, each { url, alt }). Lives
   inside the center .callout-stage. Per the confirmed UX direction it is one
   swipeable box (touch + mouse drag), with prev/next arrows, dot indicators and
   keyboard arrows. No autoplay (auto-rotation hurts accessibility + engagement).
   The container auto-resizes its aspect ratio to the ACTIVE banner's natural
   ratio so each graphic shows full, uncropped, regardless of its dimensions. */
function BannerCarousel({ banners, p }) {
  const n = banners.length;
  // Optional manual sizing from the Tweaks panel: a fixed pixel height
  // (0/unset = auto-resize to each image's natural ratio) and an object-fit
  // mode. Lets the editor lock banner height + choose Fill/Fit.
  const fixedH = (typeof p.bannerHeight === 'number' && p.bannerHeight > 0) ? p.bannerHeight : 0;
  const fit = p.bannerFit || 'contain';
  const [idx, setIdx] = React.useState(0);
  const [ratio, setRatio] = React.useState(16 / 9);
  const [dragging, setDragging] = React.useState(false);
  // Keyed by URL, not index — reordering banners in the editor keeps the
  // same length and active idx, so an index-keyed cache would serve a stale
  // ratio for the slide that moved into this position.
  const ratios = React.useRef({});       // url -> naturalW/naturalH
  const drag = React.useRef({ x: 0, dx: 0 });
  const trackRef = React.useRef(null);
  const reduce = typeof window !== 'undefined' && window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const altFor = (b, i) =>
    (b.alt && b.alt.trim()) || `${p.title} ${p.title2 || ''}`.trim() + ` detail ${i + 1}`;
  const go = (i) => setIdx((n + (i % n)) % n);

  // Measure each slide's natural ratio, then snap the box to the active one.
  // Reading naturalWidth directly covers images that were already complete
  // (served from cache) before React could fire onLoad — the common case on
  // revisit, where relying on the load event alone leaves the ratio unset.
  React.useEffect(() => {
    // If the banner list shrank (e.g. removed in the editor) and the active
    // index is now out of range, clamp it instead of showing a blank slide.
    if (idx > n - 1) { setIdx(Math.max(0, n - 1)); return; }
    const node = trackRef.current;
    if (node) {
      node.querySelectorAll('img').forEach((im) => {
        if (im.complete && im.naturalWidth) {
          ratios.current[im.getAttribute('src')] = im.naturalWidth / im.naturalHeight;
        }
      });
    }
    const key = banners[idx] && banners[idx].url;
    if (key && ratios.current[key]) setRatio(ratios.current[key]);
  }, [idx, n, banners]);

  const onLoad = (url) => (e) => {
    const im = e.currentTarget;
    if (im.naturalWidth && im.naturalHeight) {
      ratios.current[url] = im.naturalWidth / im.naturalHeight;
      if (banners[idx] && banners[idx].url === url) setRatio(ratios.current[url]);
    }
  };

  // Pointer-based swipe/drag — one code path for touch and mouse.
  const onPointerDown = (e) => {
    if (n < 2) return;
    setDragging(true);
    drag.current = { x: e.clientX, dx: 0 };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    drag.current.dx = e.clientX - drag.current.x;
    const w = trackRef.current ? trackRef.current.offsetWidth : 1;
    const pct = -idx * (100 / n) + (drag.current.dx / w) * 100;
    if (trackRef.current) trackRef.current.style.transform = `translateX(${pct}%)`;
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    // Explicitly restore the index-based transform. A sub-threshold drag
    // otherwise sticks at the drag offset: React's style diffing skips the
    // transform because the VDOM string never changed, so the imperative
    // mid-drag write survives the re-render.
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${idx * (100 / n)}%)`;
    }
    const T = 40; // px threshold to advance
    if (drag.current.dx <= -T) go(idx + 1);
    else if (drag.current.dx >= T) go(idx - 1);
  };

  const transBase = reduce ? 'none' : '360ms cubic-bezier(0.22, 1, 0.36, 1)';
  return (
    <div className="banner-carousel" role="group" aria-roledescription="carousel"
         aria-label={`${p.title} ${p.title2 || ''} gallery`.trim()}
         tabIndex={0}
         onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(idx - 1); else if (e.key === 'ArrowRight') go(idx + 1); }}
         style={{
           position: 'relative', width: '100%',
           aspectRatio: fixedH ? undefined : String(ratio),
           // Fixed heights are tuned on desktop — clamp on phones so a
           // 420px-locked banner can't letterbox most of a 360px screen.
           height: fixedH ? `min(${fixedH}px, 56vw)` : undefined,
           transition: reduce ? 'none' : `aspect-ratio 320ms cubic-bezier(0.22, 1, 0.36, 1)`,
           overflow: 'hidden', touchAction: 'pan-y',
         }}>
      <div ref={trackRef}
           onPointerDown={onPointerDown} onPointerMove={onPointerMove}
           onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
           style={{
             // Always render the index-based transform. During a drag,
             // onPointerMove overrides it imperatively (no re-render fires),
             // and the next re-render restores it — so a press that doesn't
             // move never jumps to slide 0 (which `undefined` here caused).
             display: 'flex', height: '100%', width: `${n * 100}%`,
             transform: `translateX(-${idx * (100 / n)}%)`,
             transition: dragging ? 'none' : `transform ${transBase}`,
             cursor: n > 1 ? 'grab' : 'default',
           }}>
        {banners.map((b, i) => (
          <div key={`${b.url}-${i}`} style={{
            width: `${100 / n}%`, height: '100%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Eager load: only a handful of small WebP, and lazy-loading
                transform-shifted carousel slides leaves them blank on first
                swipe and never measures their ratio for the auto-resize. */}
            <img src={b.url} alt={altFor(b, i)} draggable={false} onLoad={onLoad(b.url)}
                 loading="eager" decoding="async"
                 style={{ width: '100%', height: '100%', objectFit: fit,
                          display: 'block', userSelect: 'none', pointerEvents: 'none' }} />
          </div>
        ))}
      </div>
      {n > 1 && (
        <>
          <button type="button" className="banner-arrow prev" aria-label="Previous banner"
                  onClick={() => go(idx - 1)}>‹</button>
          <button type="button" className="banner-arrow next" aria-label="Next banner"
                  onClick={() => go(idx + 1)}>›</button>
          <div className="banner-dots" role="tablist" aria-label="Select banner">
            {banners.map((_, i) => (
              <button key={i} type="button"
                      className={'banner-dot' + (i === idx ? ' is-active' : '')}
                      aria-label={`Banner ${i + 1} of ${n}`} aria-current={i === idx}
                      onClick={() => setIdx(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RelatedProductCard({ slug, imageFit, override, scale, padding, position }) {
  const p = PRODUCTS[slug];
  const { mergeImageBag } = useTweakState();
  const dropRef = React.useRef(null);
  useImageDrop(dropRef, (path, opts) => {
    mergeImageBag('catalogCardImages', slug, path, opts);
  }, { namePrefix: `card-${slug}` });
  return (
    <a ref={dropRef} href={`#/product/${slug}`} className="drop-target card-hover card-hover-red" style={{
      textDecoration: 'none', color: 'inherit',
      background: 'var(--ample-coal)', border: '1px solid var(--border-1)', borderRadius: 4,
      overflow: 'hidden', display: 'block',
      position: 'relative',
    }}>
      <div className="drop-hint">Drop image for {p.title} {p.title2 || ''}</div>
      {/* No padding here — ProductCardMedia owns the image inset via its
          padding prop. Wrapper padding stacked on top would double-shrink
          the photo, which is exactly what RelatedProducts used to do. */}
      <div style={{ aspectRatio: '1/1', position: 'relative', overflow: 'hidden',
                    background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #050608 80%)' }}>
        <ProductCardMedia slug={slug} heroAsset={p.heroAsset} fit={imageFit} size={180}
          override={override} scale={scale} padding={padding} position={position} />
      </div>
      {/* Meta band matches the homepage category cards (.cat-meta / .cat-label):
          small category eyebrow over a large 800-weight uppercase product name. */}
      <div style={{ padding: '18px 18px 20px', borderTop: '1px solid var(--border-1)',
                    display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Eyebrow color={p.goldStandard ? 'gold' : 'red'} style={{ fontSize: 10.5 }}>{p.goldStandard ? 'Gold Standard' : p.category}</Eyebrow>
        <div style={{ fontFamily: 'var(--font-product)', fontWeight: 800, textTransform: 'uppercase', fontSize: 20, lineHeight: 1.12, letterSpacing: '0.02em' }}>{p.title} {p.title2}</div>
      </div>
    </a>
  );
}

function RelatedProducts({ current }) {
  const { tweaks } = useTweakState();
  // Pick siblings in the SAME category first. Top up with any other product
  // only if the category has fewer than 4 — keeps the grid full without
  // ever showing wholly unrelated products at the top.
  const curCat = PRODUCTS[current] && PRODUCTS[current].category;
  const sameCat = PRODUCT_ORDER.filter(
    (s) => s !== current && PRODUCTS[s] && PRODUCTS[s].category === curCat
  );
  const filler = PRODUCT_ORDER.filter(
    (s) => s !== current && !sameCat.includes(s)
  );
  const others = [...sameCat, ...filler].slice(0, 4);

  const cardImages = tweaks.catalogCardImages || {};
  const imageFit = tweaks.cardImageFit || 'contain';
  const globalScale = typeof tweaks.catalogCardScale === 'number' ? tweaks.catalogCardScale : 1;
  const globalPadding = typeof tweaks.catalogCardPadding === 'number' ? tweaks.catalogCardPadding : 16;

  return (
    <section style={{ padding: '16px 0 64px', borderTop: '1px solid var(--border-1)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 28, marginBottom: 20 }}>
        <div>
          <Eyebrow>Related · {curCat || 'Full System'}</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 32, textTransform: 'uppercase', margin: '8px 0 0' }}>Keep the circuit complete.</h2>
        </div>
        <a href={curCat ? `#/catalog/${encodeURIComponent(curCat)}` : '#/catalog'}
           style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ample-red)', textDecoration: 'none' }}>
          Browse {curCat ? curCat.toLowerCase() : 'all'} ›
        </a>
      </div>
      <div style={{ display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                    gap: 16 }}>
        {others.map((slug, idx) => {
          // Per-product overrides win over global defaults — same precedence
          // as FeaturedCard (HomePage) and CatalogCard so a product looks
          // identical wherever it shows up.
          const ov = (tweaks.productOverrides || {})[slug] || {};
          const scale = typeof ov.cardScale === 'number' ? ov.cardScale : globalScale;
          const padding = typeof ov.cardPadding === 'number' ? ov.cardPadding : globalPadding;
          const position = typeof ov.cardPosition === 'string' ? ov.cardPosition : '50% 50%';
          // Per-product fit override — same precedence the catalog grid uses,
          // so a product's framing is identical on every surface.
          const fit = ov.cardImageFit || imageFit;
          return (
            <Reveal key={slug} delay={idx % 4}>
              <RelatedProductCard slug={slug} imageFit={fit}
                override={cardImages[slug] || (PRODUCTS[slug] && PRODUCTS[slug].cardImage)}
                scale={scale} padding={padding} position={position} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

Object.assign(window, { ProductDetailPage });
