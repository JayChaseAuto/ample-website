/* Ample — Product Detail Page — matches the "Page 3+ Braking/Cooling/..." reference layouts */

function ProductDetailPage({ slug }) {
  const p = PRODUCTS[slug] || PRODUCTS['brake-pads'];
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: 'var(--fg-1)' }}>
      <SiteHeader active="gold" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px' }}>
        {/* Hero section */}
        <section style={{ position: 'relative', padding: '48px 0 40px' }} data-screen-label={`Product · ${p.slug}`}>
          {/* Top row: eyebrow + title + gold medallion */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 40 }}>
            <div style={{ flex: 1 }}>
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
            </div>
            {p.goldStandard && (
              <div style={{ paddingTop: 8 }}>
                <GoldMedallion size={100} />
              </div>
            )}
          </div>

          {/* Hero image with callouts */}
          <div style={{
            position: 'relative', marginTop: 40,
            background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #000 70%)',
            borderRadius: 4, padding: '40px 20px', minHeight: 480,
            overflow: 'visible',
          }}>
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              <ProductHero type={p.heroAsset} size={560} />
            </div>
            {p.callouts.map((c, i) => (
              <Callout key={i} {...c} />
            ))}
          </div>
        </section>

        {/* Feature blocks — 2 or 3 columns */}
        <section style={{ padding: '32px 0 48px', borderTop: '1px solid var(--border-1)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: p.features.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
            gap: 20,
          }}>
            {p.features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </section>

        {/* Specs + Bullets + Purchase area */}
        <section style={{ padding: '32px 0 64px', borderTop: '1px solid var(--border-1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40 }}>
            {/* Left: bullets and description */}
            <div>
              <Eyebrow>Engineering Summary</Eyebrow>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'grid', gap: 12 }}>
                {p.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.55 }}>
                    <span style={{ width: 8, height: 8, background: 'var(--ample-red)', marginTop: 9, flexShrink: 0 }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: spec table */}
            <div style={{ background: 'var(--ample-coal)', border: '1px solid var(--border-1)', padding: 24 }}>
              <Eyebrow>Specifications</Eyebrow>
              <div style={{ marginTop: 14 }}>
                {p.specs.map(([k, v], i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    padding: '12px 0', borderBottom: i < p.specs.length - 1 ? '1px solid var(--border-1)' : 'none',
                    gap: 16,
                  }}>
                    <div style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{k}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-1)', textAlign: 'right' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

function RelatedProducts({ current }) {
  const others = PRODUCT_ORDER.filter(s => s !== current).slice(0, 4);
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
        {others.map(slug => {
          const p = PRODUCTS[slug];
          return (
            <a key={slug} href={`#/product/${slug}`} style={{
              textDecoration: 'none', color: 'inherit',
              background: 'var(--ample-coal)', border: '1px solid var(--border-1)', borderRadius: 4,
              overflow: 'hidden', display: 'block', transition: 'all 120ms var(--ease-sharp)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'var(--ample-red)'; e.currentTarget.style.borderLeftWidth = '2px'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'var(--border-1)'; e.currentTarget.style.borderLeftWidth = '1px'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ aspectRatio: '1/1', background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #000 75%)', padding: 12 }}>
                <ProductHero type={p.heroAsset} size={200} />
              </div>
              <div style={{ padding: '12px 14px 14px', borderTop: '1px solid var(--border-1)' }}>
                <Eyebrow color={p.goldStandard ? 'gold' : 'red'} style={{ fontSize: 10 }}>{p.goldStandard ? 'Gold Standard' : p.category}</Eyebrow>
                <div style={{ fontFamily: 'var(--font-product)', fontWeight: 700, textTransform: 'uppercase', fontSize: 14, marginTop: 6 }}>{p.title} {p.title2}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', marginTop: 4 }}>{p.sku}</div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

Object.assign(window, { ProductDetailPage });
