/* Ample — Product Detail Page — matches the "Page 3+ Braking/Cooling/..." reference layouts */

function ProductDetailPage({ slug }) {
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
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
    p.calloutImageScale = Math.max(0.5, Math.min(1.6, raw));
  }
  // heroBgImage is a NEW field — empty string means "no photo".
  p.heroBgImage = overrides.heroBgImage || '';
  const usesRichLayout = !!(p.numberedFeatures && p.numberedFeatures.length);

  const heroDropRef = React.useRef(null);
  useImageDrop(heroDropRef, (path) => {
    window.__ampleSetProductTweak && window.__ampleSetProductTweak(slug, 'heroBgImage', path);
  }, { namePrefix: `product-${slug}-hero` });
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'var(--fg-1)' }}>
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
                   style={p.heroHeight ? { minHeight: p.heroHeight } : undefined}>
                <div className="drop-hint">Drop image to set product hero</div>
                {p.heroBgImage ? (
                  <>
                    <div className="product-hero-image"
                         style={{
                           backgroundImage: `url(${p.heroBgImage})`,
                           backgroundSize: p.heroImageFit || 'cover',
                           backgroundPosition: p.heroImagePosition || 'center',
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
            been upgraded yet. */}
        {p.numberedFeatures && p.numberedFeatures.length > 0 ? (
          <CalloutLayout slug={slug} p={p}
            calloutImage={(tweaks.catalogCardImages || {})[slug]} />
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

        {/* Engineering summary — full width, no specs sheet beside it. */}
        <section style={{ padding: '32px 0 64px', borderTop: '1px solid var(--border-1)' }}>
          <Reveal>
            <Eyebrow>Engineering Summary</Eyebrow>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'grid', gap: 14, maxWidth: 820 }}>
              {p.bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 16, color: 'var(--fg-1)', lineHeight: 1.6 }}>
                  <span style={{ width: 8, height: 8, background: 'var(--ample-red)', marginTop: 10, flexShrink: 0 }} />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* Related products rail */}
        <RelatedProducts current={slug} />
      </main>
      <SiteFooter />
    </div>
  );
}

function FeatureCard({ icon, title, body, image }) {
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
   The center shot pulls from `catalogCardImages[slug]` (clean technical
   photo) so it stays distinct from the moody hero background up top. */
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
  const items = p.numberedFeatures || [];
  // Pad to 4 so layout placement is stable even if a product ships fewer.
  while (items.length < 4) items.push({ title: '', body: '' });

  // Drag-drop on the center callout image. Writes to catalogCardImages[slug]
  // — the same field the catalog/featured cards read — so a drop here
  // also updates the homepage rail and catalog grid.
  const calloutDropRef = React.useRef(null);
  useImageDrop(calloutDropRef, (path) => {
    window.__ampleSetTweak && window.__ampleSetTweak('catalogCardImages',
      { ...(window.__ampleTweaks?.catalogCardImages || {}), [slug]: path });
  }, { namePrefix: `card-${slug}` });

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
          <div ref={calloutDropRef} className="drop-target callout-stage" style={{
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
                size={280} override={calloutImage} padding={28} />
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

function RelatedProductCard({ slug, imageFit, override }) {
  const p = PRODUCTS[slug];
  const dropRef = React.useRef(null);
  useImageDrop(dropRef, (path) => {
    window.__ampleSetTweak && window.__ampleSetTweak('catalogCardImages',
      { ...(window.__ampleTweaks?.catalogCardImages || {}), [slug]: path });
  }, { namePrefix: `card-${slug}` });
  return (
    <a ref={dropRef} href={`#/product/${slug}`} className="drop-target card-hover card-hover-red" style={{
      textDecoration: 'none', color: 'inherit',
      background: 'var(--ample-coal)', border: '1px solid var(--border-1)', borderRadius: 4,
      overflow: 'hidden', display: 'block',
      position: 'relative',
    }}>
      <div className="drop-hint">Drop image for {p.title} {p.title2 || ''}</div>
      <div style={{ aspectRatio: '1/1', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #050608 80%)', padding: 12 }}>
        <ProductCardMedia slug={slug} heroAsset={p.heroAsset} fit={imageFit} size={180} override={override} padding={12} />
      </div>
      <div style={{ padding: '12px 14px 14px', borderTop: '1px solid var(--border-1)' }}>
        <Eyebrow color={p.goldStandard ? 'gold' : 'red'} style={{ fontSize: 10 }}>{p.goldStandard ? 'Gold Standard' : p.category}</Eyebrow>
        <div style={{ fontFamily: 'var(--font-product)', fontWeight: 700, textTransform: 'uppercase', fontSize: 14, marginTop: 6 }}>{p.title} {p.title2}</div>
      </div>
    </a>
  );
}

function RelatedProducts({ current }) {
  const others = PRODUCT_ORDER.filter(s => s !== current).slice(0, 4);
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const cardImages = tweaks.catalogCardImages || {};
  const imageFit = tweaks.cardImageFit || 'contain';
  return (
    <section style={{ padding: '16px 0 64px', borderTop: '1px solid var(--border-1)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 28, marginBottom: 20 }}>
        <div>
          <Eyebrow>Related · Full System</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 32, textTransform: 'uppercase', margin: '8px 0 0' }}>Keep the circuit complete.</h2>
        </div>
        <a href="#/catalog" style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ample-red)', textDecoration: 'none' }}>Browse all ›</a>
      </div>
      <div style={{ display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                    gap: 16 }}>
        {others.map((slug, idx) => (
          <Reveal key={slug} delay={idx % 4}>
            <RelatedProductCard slug={slug} imageFit={imageFit} override={cardImages[slug]} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { ProductDetailPage });
