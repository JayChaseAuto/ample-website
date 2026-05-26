/* Ample — Homepage — the "Page 1: Homepage" reference with hero + category grid */

const CATEGORY_CARDS = [
  { label: 'Braking',    icon: 'disc-3',                  body: 'Calipers, pads, ABS + wear sensors. Engineered above stock spec.',     defaultImage: 'assets/brake-disc-caliper.jpg' },
  { label: 'Cooling',    icon: 'thermometer-snowflake',   body: 'Radiators, water pumps, oil coolers. Sustained-load thermal.',          defaultImage: '' },
  { label: 'HVAC',       icon: 'wind',                    body: 'Compressors, condensers, heater cores, blowers. Climate kept honest.', defaultImage: '' },
  { label: 'Engine',     icon: 'cog',                     body: 'Tensioners, ignition coils, exhaust, gaskets. OEM+ rebuilt.',           defaultImage: 'assets/engine-parts-banner-raw.png' },
  { label: 'Electrical', icon: 'zap',                     body: 'Starters, alternators, sensors. OEM+ signal fidelity.',                 defaultImage: '' },
  { label: 'Lighting',   icon: 'sun',                     body: 'Headlight assemblies, DRL clusters with verified photometry.',           defaultImage: '' },
  { label: 'Steering',   icon: 'compass',                 body: 'Racks, pumps and geometry components for predictable input.',            defaultImage: '' },
  { label: 'Service',    icon: 'filter',                  body: 'Air, cabin, oil filters and service-grade consumables.',                 defaultImage: 'assets/packaging-brake-pad-box.png' }
];

function HomePage() {
  const { tweaks, setTweak } = useTweakState();
  const headline1 = tweaks.heroHeadline1 || 'Road-ready';
  const headlineAccent = tweaks.heroHeadlineAccent || 'precision.';
  const headline2 = tweaks.heroHeadline2 || 'Engineered beyond stock.';
  const heroImage = tweaks.heroImage || 'assets/brake-disc-caliper.jpg';
  const heroOverlay = tweaks.heroOverlay != null ? tweaks.heroOverlay : 70;
  const showStats = tweaks.showStats !== false;
  const showGold = tweaks.showGoldBanner !== false;
  const gridCols = tweaks.gridCols || 4;

  const heroBgRef = React.useRef(null);
  useParallax(heroBgRef, 0.18);

  const heroDropRef = React.useRef(null);
  useImageDrop(heroDropRef, (path, opts) => {
    setTweak('heroImage', path, opts);
  }, { namePrefix: 'hero' });

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <SiteHeader active="home" />
      <main>
        {/* Hero */}
        <section ref={heroDropRef} className="drop-target" style={{
          position: 'relative', overflow: 'hidden',
          background: '#000', borderBottom: '1px solid var(--border-1)'
        }} data-screen-label="Homepage · Hero">
          <div className="drop-hint">Drop image to set hero background</div>
          <div ref={heroBgRef} style={{
            position: 'absolute', top: '-30%', left: 0, right: 0, bottom: '-30%',
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover', backgroundPosition: 'right center',
            opacity: 0.85
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to right, rgba(0,0,0,0.97) 0%, rgba(0,0,0,${(heroOverlay / 100).toFixed(2)}) 40%, transparent 70%)`
          }} />
          <div style={{ position: 'relative', maxWidth: 1440, margin: '0 auto',
                        padding: 'clamp(56px, 9vw, 90px) clamp(16px, 4vw, 40px) clamp(64px, 10vw, 100px)',
                        minHeight: 'clamp(360px, 60vh, 520px)' }}>
            <Reveal as="h1" style={{
              fontFamily: 'var(--font-product)', fontWeight: 800,
              fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.94,
              textTransform: 'uppercase', letterSpacing: '-0.02em',
              margin: 0, maxWidth: 820
            }}>
              {headline1} <span style={{ color: 'var(--ample-red)' }}>{headlineAccent}</span><br />
              {headline2}
            </Reveal>
            {showStats &&
            <Reveal delay={2} style={{ display: 'flex', gap: 48, marginTop: 72, flexWrap: 'wrap' }}>
                <Stat k={tweaks.stat1Value || '1M+'} v={tweaks.stat1Label || 'Happy customers'} />
                <Stat k={tweaks.stat2Value || '10K+'} v={tweaks.stat2Label || 'SKUs in range'} />
                <Stat k={tweaks.stat3Value || '20+'} v={tweaks.stat3Label || 'Years experience'} />
              </Reveal>
            }
          </div>
        </section>

        {/* Explore categories */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 40px) clamp(48px, 9vw, 80px)' }} data-screen-label="Homepage · Categories">
          <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <Eyebrow color="white">Explore Categories</Eyebrow>
            <a href="#/catalog" style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ample-red)', textDecoration: 'none' }}>Explore our catalog ›</a>
          </Reveal>
          <div style={{ display: 'grid',
                        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 260px), 1fr))`,
                        gap: 16 }}>
            {CATEGORY_CARDS.map((c, idx) => (
              <Reveal key={c.label} delay={idx % 4}>
                <CategoryCard card={c} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Featured products rail */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px) clamp(48px, 9vw, 80px)' }}>
          <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <Eyebrow>Featured · OEM+ Catalog</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 40, textTransform: 'uppercase', margin: '8px 0 0' }}>Built for the drive.</h2>
            </div>
            <a href="#/catalog" style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--ample-red)', textDecoration: 'none' }}>BROWSE ALL ›</a>
          </Reveal>
          {(() => {
            // Featured rail = `tweaks.featuredProducts` (array of slugs).
            // Default ['brake-pads', 'caliper-npc'] because Braking is the
            // anchor category — the two flagship parts lead the homepage.
            // Falls back to the first gridCols products if the array is
            // missing or empty; filters out any slug that doesn't resolve
            // so a typo in source doesn't crash the rail.
            const configured = Array.isArray(tweaks.featuredProducts) && tweaks.featuredProducts.length
              ? tweaks.featuredProducts
              : ['brake-pads', 'caliper-npc'];
            const featured = configured
              .filter((s) => PRODUCTS[s])
              .slice(0, Math.max(1, gridCols));
            return (
              <div style={{ display: 'grid',
                            gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 260px), 1fr))`,
                            gap: 16 }}>
                {featured.map((slug, idx) => (
                  <Reveal key={slug} delay={idx % 4} style={{ display: 'block' }}>
                    <FeaturedCard slug={slug} />
                  </Reveal>
                ))}
              </div>
            );
          })()}
        </section>

        {/* Gold standard banner */}
        {showGold && <Reveal><GoldBanner /></Reveal>}
        <SiteFooter />
      </main>
    </div>);

}

/* Parse stat strings like '1M+', '10K+', '20+', '1.5K' into a numeric
   target. Anything we can't parse stays static — the display falls back to
   the original string. */
function parseStatTarget(s) {
  const m = String(s).match(/^(\d+(?:\.\d+)?)([KMB])?(\+?)\s*$/i);
  if (!m) return null;
  const mul = m[2] ? { K: 1e3, M: 1e6, B: 1e9 }[m[2].toUpperCase()] : 1;
  return { target: parseFloat(m[1]) * mul, plus: m[3] || '' };
}

/* Format a count-up frame as 'NM+', 'NK+', 'N+' — so a 1M+ counter
   sweeps through 999K, 1M and the suffix transitions feel dynamic. */
function formatStat(n, plus) {
  const round = (x) => Math.floor(x);
  if (n >= 1e9) return round(n / 1e9) + 'B' + plus;
  if (n >= 1e6) return round(n / 1e6) + 'M' + plus;
  if (n >= 1e3) return round(n / 1e3) + 'K' + plus;
  return round(n) + plus;
}

function Stat({ k, v }) {
  const parsed = parseStatTarget(k);
  const [display, setDisplay] = React.useState(() => parsed ? '0' + (parsed.plus || '') : k);
  const ref = React.useRef(null);
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    if (!parsed || !ref.current) { setDisplay(k); return; }
    if (startedRef.current) return;
    // IO so the count fires when the hero scrolls into view — covers nav-back
    // from another route, not just the initial mount.
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting || startedRef.current) continue;
        startedRef.current = true;
        const duration = 1600;
        const start = performance.now();
        let raf;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutCubic — fast start, settles into the final value
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(formatStat(eased * parsed.target, parsed.plus));
          if (t < 1) raf = requestAnimationFrame(tick);
          else setDisplay(k); // snap to the exact author-formatted value at end
        };
        raf = requestAnimationFrame(tick);
        io.disconnect();
        return;
      }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [k]);

  return (
    <div ref={ref}>
      <div style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 44, color: 'var(--fg-1)', letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{display}</div>
      <div style={{ fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--fg-3)', marginTop: 10 }}>{v}</div>
    </div>);

}

function FeaturedCard({ slug }) {
  const p = PRODUCTS[slug];
  const { tweaks, setProductTweak, mergeImageBag } = useTweakState();
  const cardImage = (tweaks.catalogCardImages || {})[slug];
  const imageFit = tweaks.cardImageFit || 'contain';
  // Per-product overrides win over the global card defaults. Falls back to
  // 1.0 / 16 if neither is set so existing cards render unchanged.
  const overrides = (tweaks.productOverrides || {})[slug] || {};
  const cardScale = typeof overrides.cardScale === 'number'
    ? overrides.cardScale
    : (typeof tweaks.catalogCardScale === 'number' ? tweaks.catalogCardScale : 1);
  const cardPadding = typeof overrides.cardPadding === 'number'
    ? overrides.cardPadding
    : (typeof tweaks.catalogCardPadding === 'number' ? tweaks.catalogCardPadding : 16);
  const cardPosition = typeof overrides.cardPosition === 'string'
    ? overrides.cardPosition : '50% 50%';

  const dropRef = React.useRef(null);
  useImageDrop(dropRef, (path, opts) => {
    mergeImageBag('catalogCardImages', slug, path, opts);
  }, { namePrefix: `card-${slug}` });

  return (
    <a ref={dropRef} href={`#/product/${slug}`} className="drop-target card-hover" style={{
      textDecoration: 'none', color: 'inherit',
      background: 'var(--ample-coal)', border: '1px solid var(--border-1)', borderRadius: 4,
      overflow: 'hidden', display: 'block',
      position: 'relative'
    }}>
      <div className="drop-hint">Drop image for {p.title} {p.title2 || ''}</div>

      {p.goldStandard &&
      <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 4,
        background: 'var(--ample-gold)', color: '#17110a', fontFamily: 'var(--font-product)', fontSize: 9, fontWeight: 800,
        letterSpacing: '0.16em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 999, pointerEvents: 'none' }}>★ Gold Standard</span>
      }
      <div style={{ position: 'relative', aspectRatio: '4/3', background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #000 75%)', overflow: 'hidden' }}>
        <ProductCardMedia slug={slug} heroAsset={p.heroAsset} fit={imageFit} size={240}
          override={cardImage} scale={cardScale} padding={cardPadding}
          position={cardPosition}
          onPositionChange={window.__ampleEditor
            ? (pos) => setProductTweak(slug, 'cardPosition', pos)
            : undefined} />
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
            Gold Standard SKUs are our lab's answer to recurring OEM failures. Revised geometry, better materials, tighter tolerances. Same fitment. Better outcome.
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

function CategoryCard({ card }) {
  const { tweaks, mergeImageSlot } = useTweakState();
  const ref = React.useRef(null);
  useImageDrop(ref, (path, opts) => {
    mergeImageSlot('categoryImages', card.label, { url: path }, opts);
  }, { namePrefix: `cat-${card.label}` });
  const slot = readImageSlot(tweaks.categoryImages, card.label, card.defaultImage);
  return (
    <a ref={ref} href={`#/catalog/${encodeURIComponent(card.label)}`} className="cat-card drop-target"
       data-ample-slot={`category-banner-${card.label}`}>
      <div className="cat-photo"
           style={slot.url ? {
             backgroundImage: `url(${slot.url})`,
             backgroundSize: slot.fit === 'contain' ? 'contain' : 'cover',
             backgroundPosition: slot.position,
             backgroundRepeat: 'no-repeat',
           } : {}} />
      <div className="cat-shade" />
      <div className="cat-icon-chip">
        <Icon name={card.icon} size={18} />
      </div>
      <div className="cat-meta">
        <div className="cat-label">{card.label}</div>
        <p className="cat-body">{card.body}</p>
        <span className="cat-cta">Learn More ›</span>
      </div>
      <div className="drop-hint">Drop image for {card.label}</div>
    </a>
  );
}

Object.assign(window, { HomePage });