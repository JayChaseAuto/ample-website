/* Ample — Homepage — the "Page 1: Homepage" reference with hero + category grid */

function HomePage() {
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const headline1 = tweaks.heroHeadline1 || 'Road-ready';
  const headlineAccent = tweaks.heroHeadlineAccent || 'precision.';
  const headline2 = tweaks.heroHeadline2 || 'Engineered beyond stock.';
  const heroImage = (window.__resolveAsset || (x => x))(tweaks.heroImage || 'assets/brake-disc-caliper.jpg');
  const heroOverlay = tweaks.heroOverlay != null ? tweaks.heroOverlay : 70;
  const showStats = tweaks.showStats !== false;
  const showGold = tweaks.showGoldBanner !== false;
  const gridCols = tweaks.gridCols || 4;

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <SiteHeader active="home" />
      <main>
        {/* Hero */}
        <section style={{
          position: 'relative', overflow: 'hidden',
          background: '#000', borderBottom: '1px solid var(--border-1)'
        }} data-screen-label="Homepage · Hero">
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover', backgroundPosition: 'right center',
            opacity: 0.85
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to right, rgba(0,0,0,0.97) 0%, rgba(0,0,0,${(heroOverlay / 100).toFixed(2)}) 40%, transparent 70%)`
          }} />
          <div style={{ position: 'relative', maxWidth: 1440, margin: '0 auto', padding: '90px 40px 100px', minHeight: 520 }}>
            <h1 style={{
              fontFamily: 'var(--font-product)', fontWeight: 800,
              fontSize: 'clamp(56px, 7vw, 104px)', lineHeight: 0.92,
              textTransform: 'uppercase', letterSpacing: '-0.02em',
              margin: 0, maxWidth: 820
            }}>
              {headline1} <span style={{ color: 'var(--ample-red)' }}>{headlineAccent}</span><br />
              {headline2}
            </h1>
            {showStats &&
            <div style={{ display: 'flex', gap: 48, marginTop: 72, flexWrap: 'wrap' }}>
                <Stat k={tweaks.stat1Value || '1M+'} v={tweaks.stat1Label || 'Happy customers'} />
                <Stat k={tweaks.stat2Value || '10K+'} v={tweaks.stat2Label || 'SKUs in range'} />
                <Stat k={tweaks.stat3Value || '20+'} v={tweaks.stat3Label || 'Years experience'} />
              </div>
            }
          </div>
        </section>

        {/* Explore categories */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '60px 40px 80px' }} data-screen-label="Homepage · Categories">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <Eyebrow color="white">Explore Categories</Eyebrow>
            <a href="#/catalog" style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ample-red)', textDecoration: 'none' }}>Explore our catalog ›</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: 16 }}>
            {[
            { label: 'Braking', icon: 'disc-3', body: 'Calipers, pads, ABS + wear sensors — engineered above stock spec.' },
            { label: 'Cooling', icon: 'thermometer-snowflake', body: 'Radiators, water pumps, oil coolers — sustained-load thermal.' },
            { label: 'HVAC', icon: 'wind', body: 'Compressors, condensers, heater cores, blowers — climate kept honest.' },
            { label: 'Engine', icon: 'cog', body: 'Tensioners, ignition coils, exhaust, gaskets — OEM+ rebuilt.' },
            { label: 'Electrical', icon: 'zap', body: 'Starters, alternators, sensors — OEM+ signal fidelity.' },
            { label: 'Lighting', icon: 'sun', body: 'Headlight assemblies, DRL clusters with verified photometry.' },
            { label: 'Steering', icon: 'compass', body: 'Racks, pumps and geometry components for predictable input.' },
            { label: 'Service', icon: 'filter', body: 'Air, cabin, oil filters and service-grade consumables.' }].
            map((c) =>
            <div key={c.label} style={{
              background: 'var(--ample-coal)', border: '1px solid var(--border-1)',
              padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 14,
              borderRadius: 4
            }}>
                <div style={{
                width: 52, height: 52, border: '1px solid var(--border-2)', borderRadius: 999,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
              }}>
                  <Icon name={c.icon} size={22} />
                </div>
                <div style={{ fontFamily: 'var(--font-product)', fontWeight: 800, textTransform: 'uppercase', fontSize: 22, letterSpacing: '0.02em' }}>{c.label}</div>
                <p style={{ color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.5, margin: 0, flex: 1 }}>{c.body}</p>
                <Button variant="secondary" size="sm" href="#/catalog" style={{ alignSelf: 'flex-start' }}>Learn More</Button>
              </div>
            )}
          </div>
        </section>

        {/* Featured products rail */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <Eyebrow>Featured · OEM+ Catalog</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 40, textTransform: 'uppercase', margin: '8px 0 0' }}>Built for the drive.</h2>
            </div>
            <a href="#/catalog" style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ample-red)', textDecoration: 'none' }}>BROWSE ALL ›</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gap: 16 }}>
            {PRODUCT_ORDER.slice(0, gridCols).map((slug) => <FeaturedCard key={slug} slug={slug} />)}
          </div>
        </section>

        {/* Gold standard banner */}
        {showGold && <GoldBanner />}
        <SiteFooter />
      </main>
    </div>);

}

function Stat({ k, v }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 44, color: 'var(--fg-1)', letterSpacing: '-0.02em', lineHeight: 1 }}>{k}</div>
      <div style={{ fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-3)', marginTop: 10 }}>{v}</div>
    </div>);

}

function FeaturedCard({ slug }) {
  const p = PRODUCTS[slug];
  return (
    <a href={`#/product/${slug}`} style={{
      textDecoration: 'none', color: 'inherit',
      background: 'var(--ample-coal)', border: '1px solid var(--border-1)', borderRadius: 4,
      overflow: 'hidden', display: 'block', transition: 'all 120ms var(--ease-sharp)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)';e.currentTarget.style.boxShadow = 'var(--e-2)';}}
    onMouseLeave={(e) => {e.currentTarget.style.transform = 'none';e.currentTarget.style.boxShadow = 'none';}}>
      
      {p.goldStandard &&
      <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 2,
        background: 'var(--ample-gold)', color: '#17110a', fontFamily: 'var(--font-product)', fontSize: 9, fontWeight: 800,
        letterSpacing: '0.16em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 999 }}>★ Gold Standard</span>
      }
      <div style={{ aspectRatio: '4/3', background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #000 75%)', padding: 16 }}>
        <ProductHero type={p.heroAsset} size={240} />
      </div>
      <div style={{ padding: '14px 16px 16px', borderTop: '1px solid var(--border-1)' }}>
        <Eyebrow color={p.goldStandard ? 'gold' : 'red'} style={{ fontSize: 10 }}>{p.category}</Eyebrow>
        <div style={{ fontFamily: 'var(--font-product)', fontWeight: 700, textTransform: 'uppercase', fontSize: 15, marginTop: 6 }}>{p.title} {p.title2}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', marginTop: 12 }}>
          <div style={{ fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ample-red)' }}>View ›</div>
        </div>
      </div>
    </a>);

}

function GoldBanner() {
  return (
    <section style={{ position: 'relative', background: '#000', borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)' }}>
      <Stripes color="gold" height={6} />
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <Eyebrow color="gold">The Gold Standard Program</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 48, textTransform: 'uppercase', margin: '10px 0 14px', lineHeight: 1 }}>
            When <span style={{ color: 'var(--ample-gold)' }}>OEM isn't enough,</span><br />we engineer the fix.
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, maxWidth: 520, lineHeight: 1.6 }}>
            Gold Standard SKUs are our lab's answer to recurring OEM failures — revised geometry, better materials, tighter tolerances. Same fitment. Better outcome.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="gold" href="#/gold">Browse Gold Standard</Button>
            <Button variant="ghost" href="#/gold">How we pick them ›</Button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoldMedallion size={220} />
        </div>
      </div>
      <Stripes color="gold" height={6} />
    </section>);

}

Object.assign(window, { HomePage });