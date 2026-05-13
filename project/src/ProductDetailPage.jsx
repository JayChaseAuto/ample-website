/* Ample — Product Detail Page — matches the "Page 3+ Braking/Cooling/..." reference layouts */

function ProductDetailPage({ slug }) {
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const overrides = (tweaks.productOverrides || {})[slug] || {};
  // Apply overrides on top of the base product. Empty strings for text fields
  // shouldn't blank out defaults — only apply non-empty values.
  const base = PRODUCTS[slug] || PRODUCTS['brake-pads'];
  const p = { ...base };
  for (const k of ['eyebrow', 'title', 'title2', 'summary', 'heroAsset']) {
    if (overrides[k] != null && overrides[k] !== '') p[k] = overrides[k];
  }
  // heroBgImage is a NEW field — empty string means "no photo".
  p.heroBgImage = overrides.heroBgImage || '';

  const heroDropRef = React.useRef(null);
  useImageDrop(heroDropRef, (path) => {
    window.__ampleSetProductTweak && window.__ampleSetProductTweak(slug, 'heroBgImage', path);
  }, { namePrefix: `product-${slug}-hero` });
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'var(--fg-1)' }}>
      <SiteHeader active="gold" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px' }}>
        {/* Hero section */}
        <section style={{ position: 'relative', padding: '48px 0 40px' }} data-screen-label={`Product · ${p.slug}`}>
          {/* Top row: eyebrow + title + gold medallion */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40 }}>
            <Reveal style={{ flex: 1 }}>
              <Eyebrow>{p.eyebrow}</Eyebrow>
              <h1 style={{
                fontFamily: 'var(--font-product)', fontWeight: 800,
                fontSize: 'clamp(48px, 6vw, 84px)', lineHeight: 0.92,
                textTransform: 'uppercase', letterSpacing: '-0.02em',
                margin: '14px 0 0',
              }}>
                {p.title}<br />{p.title2}
              </h1>
              <p style={{
                color: 'var(--fg-2)', fontSize: 15, maxWidth: 540, lineHeight: 1.6, marginTop: 18,
              }}>
                {p.summary}
              </p>
            </Reveal>
            {p.goldStandard && (
              <Reveal delay={2} style={{ paddingTop: 8 }}>
                <GoldMedallion size={100} />
              </Reveal>
            )}
          </div>

          {/* Hero — drag-drop only. No SVG illustration, no asset fallback.
              Empty state: clean placeholder with prompt. Drop fills the area. */}
          <Reveal delay={2}>
            <div ref={heroDropRef} className="drop-target product-hero">
              <div className="drop-hint">Drop image to set product hero</div>
              {p.heroBgImage ? (
                <div className="product-hero-image"
                     style={{ backgroundImage: `url(${p.heroBgImage})` }} />
              ) : (
                <div className="product-hero-placeholder">
                  <div className="product-hero-placeholder-frame">▢</div>
                  <div className="product-hero-placeholder-text">Drop product photo</div>
                  <div className="product-hero-placeholder-sub">JPG · PNG · WEBP</div>
                </div>
              )}
            </div>
          </Reveal>
        </section>

        {/* Feature blocks — 2 or 3 columns. Skipped for products with no features. */}
        {p.features && p.features.length > 0 && (
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
        )}

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

function RelatedProductCard({ slug, imageFit, override }) {
  const p = PRODUCTS[slug];
  const dropRef = React.useRef(null);
  useImageDrop(dropRef, (path) => {
    window.__ampleSetTweak && window.__ampleSetTweak('catalogCardImages',
      { ...(window.__ampleTweaks?.catalogCardImages || {}), [slug]: path });
  }, { namePrefix: `card-${slug}` });
  return (
    <a ref={dropRef} href={`#/product/${slug}`} className="drop-target" style={{
      textDecoration: 'none', color: 'inherit',
      background: 'var(--ample-coal)', border: '1px solid var(--border-1)', borderRadius: 4,
      overflow: 'hidden', display: 'block', transition: 'all 120ms var(--ease-sharp)',
      cursor: 'pointer', position: 'relative',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ample-red)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--e-2)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-1)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
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
