/* Ample — Product Detail Page — matches the "Page 3+ Braking/Cooling/..." reference layouts */

function ProductDetailPage({ slug }) {
  const { tweaks, setProductTweak } = useTweakState();
  const overrides = (tweaks.productOverrides || {})[slug] || {};
  // Apply overrides on top of the base product. Empty strings for text fields
  // shouldn't blank out defaults — only apply non-empty values.
  const base = PRODUCTS[slug] || PRODUCTS['brake-pads'];
  const p = { ...base };
  for (const k of ['eyebrow', 'title', 'title2', 'summary', 'heroAsset',
                   'intro', 'closing', 'benefitsTitle', 'outro',
                   'heroImageFit', 'heroImagePosition', 'calloutImageFit']) {
    if (overrides[k] != null && overrides[k] !== '') p[k] = overrides[k];
  }
  // Numeric hero knobs — 0 is a valid value (no overlay) so gate on type,
  // not truthiness.
  if (typeof overrides.heroOverlay === 'number') p.heroOverlay = overrides.heroOverlay;
  if (typeof overrides.heroHeight === 'number') p.heroHeight = overrides.heroHeight;
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
  p.calloutImage = overrides.calloutImage || (tweaks.catalogCardImages || {})[slug] || '';
  const usesRichLayout = !!(p.numberedFeatures && p.numberedFeatures.length);

  const heroDropRef = React.useRef(null);
  useImageDrop(heroDropRef, (path, opts) => {
    setProductTweak(slug, 'heroBgImage', path, opts);
  }, { namePrefix: `product-${slug}-hero` });
  return (
    <div style={{ background: 'transparent', minHeight: '100vh', color: 'var(--fg-1)' }}>
      <SiteHeader active="gold" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)' }}>
        {/* Hero section. Left-aligned eyebrow + title + summary on the
            left, optional gold medallion on the right. Wraps on narrow
            screens so the medallion drops below the text instead of
            squishing. */}
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
              {p.summary && (
                <p style={{
                  color: 'var(--fg-2)', fontSize: 15, maxWidth: 540, lineHeight: 1.6, marginTop: 18,
                }}>{p.summary}</p>
              )}
            </Reveal>
            {p.goldStandard && (
              <Reveal delay={2} style={{ paddingTop: 8 }}>
                <GoldMedallion size={100} />
              </Reveal>
            )}
          </div>

          {/* Drop hero — only for products WITHOUT the rich callout layout.
              Rich-layout products skip the big dropped image since the
              callouts already show a centered product shot. */}
          {!usesRichLayout && (
            <Reveal delay={2}>
              <div ref={heroDropRef} className="drop-target product-hero"
                   data-ample-slot="product-hero"
                   style={p.heroHeight ? { minHeight: p.heroHeight } : undefined}>
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

        {/* Rich layout (callouts + benefits) — opt-in via product.numberedFeatures.
            Falls back to the legacy FeatureCard grid for products that haven't
            been upgraded yet. Simple-layout products keep just the hero
            banner above — no extra center/showcase image. */}
        {p.numberedFeatures && p.numberedFeatures.length > 0 ? (
          <CalloutLayout slug={slug} p={p} calloutImage={p.calloutImage} />
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
  return (
    <div className="callout-card" style={{
      display: 'flex',
      flexDirection: isRight ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 18,
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
          fontSize: 22, textTransform: 'uppercase',
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
  const items = p.numberedFeatures || [];
  // Pad to 4 so layout placement is stable even if a product ships fewer.
  while (items.length < 4) items.push({ title: '', body: '' });

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
          <div ref={calloutDropRef} className="drop-target callout-stage"
               data-ample-slot="product-callout" style={{
            gridColumn: 2, gridRow: '1 / span 2',
            position: 'relative',
            aspectRatio: '1/1',
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
      <div style={{ padding: '12px 14px 14px', borderTop: '1px solid var(--border-1)' }}>
        <Eyebrow color={p.goldStandard ? 'gold' : 'red'} style={{ fontSize: 10 }}>{p.goldStandard ? 'Gold Standard' : p.category}</Eyebrow>
        <div style={{ fontFamily: 'var(--font-product)', fontWeight: 700, textTransform: 'uppercase', fontSize: 14, marginTop: 6 }}>{p.title} {p.title2}</div>
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
          return (
            <Reveal key={slug} delay={idx % 4}>
              <RelatedProductCard slug={slug} imageFit={imageFit} override={cardImages[slug]}
                scale={scale} padding={padding} position={position} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

Object.assign(window, { ProductDetailPage });
