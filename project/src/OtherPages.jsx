/* Ample — Catalog, Gold Standard, Story/Contact pages */

function CatalogPage({ filter: filterProp } = {}) {
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const eyebrow = tweaks.catalogEyebrow || 'Our Inventory';
  const title = tweaks.catalogTitle || 'Our Catalog.';
  const intro = tweaks.catalogIntro || "A curated selection of our precision components, organized by system. For fitment, pricing, or availability on any part, get in touch.";
  const cardCols = tweaks.catalogCardCols || 3;
  const showBlurbs = tweaks.catalogShowBlurbs !== false;
  const cardImgRatio = tweaks.catalogCardRatio || '4/3';
  const headerSize = tweaks.catalogHeaderSize || 84;
  const filter = filterProp || tweaks.catalogFilter || 'all';
  const layout = tweaks.catalogLayout || 'grouped'; // grouped | flat
  const sortMode = tweaks.catalogSort || 'category';

  // Group products by broad category
  const grouped = PRODUCT_ORDER.reduce((acc, slug) => {
    const p = PRODUCTS[slug];
    (acc[p.category] = acc[p.category] || []).push(slug);
    return acc;
  }, {});
  const categoryOrder = ['Braking', 'Cooling', 'HVAC', 'Engine', 'Electrical', 'Lighting', 'Steering', 'Wipers', 'Service'];
  let categories = categoryOrder.filter((c) => grouped[c]);
  if (filter !== 'all') categories = categories.filter((c) => c === filter);

  const categoryBlurbs = {
    'Braking': '',
    'Cooling': '',
    'HVAC': '',
    'Engine': '',
    'Electrical': '',
    'Lighting': '',
    'Steering': '',
    'Wipers': '',
    'Service': ''
  };

  // Flat list (sorted) when layout = flat
  let flatSlugs = [];
  if (layout === 'flat') {
    flatSlugs = PRODUCT_ORDER.filter((s) => filter === 'all' || PRODUCTS[s].category === filter);
    if (sortMode === 'name') flatSlugs.sort((a, b) => (PRODUCTS[a].title + PRODUCTS[a].title2).localeCompare(PRODUCTS[b].title + PRODUCTS[b].title2));else
    if (sortMode === 'gold') flatSlugs.sort((a, b) => (PRODUCTS[b].goldStandard ? 1 : 0) - (PRODUCTS[a].goldStandard ? 1 : 0));
  }

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <SiteHeader active="catalog" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(40px, 7vw, 56px) clamp(16px, 4vw, 40px) clamp(56px, 9vw, 80px)' }} data-screen-label="Catalog">
        <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
        <Reveal as="h1" delay={1} style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: `clamp(40px, 8vw, ${headerSize}px)`, textTransform: 'uppercase', margin: '10px 0 0', letterSpacing: '-0.02em', lineHeight: 0.95 }}>{title}</Reveal>
        <Reveal as="p" delay={2} style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6, marginTop: 18, maxWidth: 640 }}>
          {intro}
        </Reveal>

        {layout === 'flat' ?
        <div style={{ marginTop: 56 }}>
            <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--border-1)', paddingBottom: 14 }}>
              <div>
                <Eyebrow color="red">{flatSlugs.length} {flatSlugs.length === 1 ? 'product' : 'products'}</Eyebrow>
                <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 'clamp(28px, 5.5vw, 44px)', textTransform: 'uppercase', margin: '8px 0 0', letterSpacing: '-0.01em' }}>{filter === 'all' ? 'All Products.' : filter + '.'}</h2>
              </div>
            </Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 260px), 1fr))`, gap: 16 }}>
              {flatSlugs.map((slug, idx) => (
                <Reveal key={slug} delay={idx % 4}>
                  <CatalogCard slug={slug} ratio={cardImgRatio} />
                </Reveal>
              ))}
            </div>
          </div> :

        <div style={{ marginTop: 56, display: 'grid', gap: 64 }}>
            {categories.map((cat) =>
          <section key={cat}>
                <Reveal style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--border-1)', paddingBottom: 14 }}>
                  <div>
                    <Eyebrow color="red">{grouped[cat].length} {grouped[cat].length === 1 ? 'product' : 'products'}</Eyebrow>
                    <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 'clamp(28px, 5.5vw, 44px)', textTransform: 'uppercase', margin: '8px 0 0', letterSpacing: '-0.01em' }}>{{ Braking: 'Ample Brakes', Cooling: 'Ample Cooling', HVAC: 'Ample AC', Engine: 'Ample Engine', Electrical: 'Ample Electrical', Lighting: 'Ample Lighting', Steering: 'Ample Steering Parts', Wipers: 'Ample Wipers', Service: 'Ample Filters' }[cat] || cat}</h2>
                  </div>
                  {showBlurbs &&
              <p style={{ color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.6, margin: 0, maxWidth: 420, textAlign: 'right' }}>{categoryBlurbs[cat]}</p>
              }
                </Reveal>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 260px), 1fr))`, gap: 16 }}>
                  {grouped[cat].map((slug, idx) => (
                    <Reveal key={slug} delay={idx % 4}>
                      <CatalogCard slug={slug} ratio={cardImgRatio} />
                    </Reveal>
                  ))}
                </div>
              </section>
          )}
          </div>
        }
      </main>
      <SiteFooter />
    </div>);

}

function CatalogCard({ slug, ratio = '4/3' }) {
  const p = PRODUCTS[slug];
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const cardImage = (tweaks.catalogCardImages || {})[slug];
  const imageFit = tweaks.cardImageFit || 'contain';

  const dropRef = React.useRef(null);
  useImageDrop(dropRef, (path) => {
    window.__ampleSetTweak && window.__ampleSetTweak('catalogCardImages',
      { ...(window.__ampleTweaks?.catalogCardImages || {}), [slug]: path });
  }, { namePrefix: `card-${slug}` });

  return (
    <div
      ref={dropRef}
      className="catalog-card drop-target card-hover"
      style={{
        position: 'relative',
        background: 'var(--ample-coal)',
        border: '1px solid var(--border-1)',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
      <div className="drop-hint">Drop image for {p.title} {p.title2 || ''}</div>
      {p.goldStandard &&
      <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 4, background: 'var(--ample-gold)', color: '#17110a', fontFamily: 'var(--font-product)', fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 999, pointerEvents: 'none' }}>★ Gold</span>
      }
      <div style={{ position: 'relative', aspectRatio: ratio, background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #000 75%)', padding: 16, overflow: 'hidden' }}>
        <ProductCardMedia slug={slug} heroAsset={p.heroAsset} fit={imageFit} size={240} override={cardImage} />
      </div>
      <a href={`#/product/${slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '14px 18px 18px', borderTop: '1px solid var(--border-1)' }}>
        <Eyebrow color={p.goldStandard ? 'gold' : 'red'} style={{ fontSize: 10 }}>{p.category}</Eyebrow>
        <div style={{ fontFamily: 'var(--font-product)', fontWeight: 700, textTransform: 'uppercase', fontSize: 16, marginTop: 6 }}>{p.title} {p.title2}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12 }}>
          <div style={{ fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ample-red)', borderBottom: '1px solid var(--ample-red)' }}>View Details</div>
        </div>
      </a>
    </div>);

}

/* ---------- Gold Standard · Lab media box ---------- */
/* Lab-01 dyno panel — droppable image OR video. Defaults to the
   caliper SVG. If the stored path ends in a recognised video
   extension we render an autoplay/loop/muted <video> sized to the
   box; otherwise we treat it as an image background. */
const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v|ogg|ogv|mkv)(\?|$)/i;

function LabMediaBox() {
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const media = tweaks.goldStandardMedia || '';
  const isVideo = VIDEO_EXT_RE.test(media);
  const isImage = !!media && !isVideo;

  const dropRef = React.useRef(null);
  useImageDrop(dropRef, (path) => {
    window.__ampleSetTweak && window.__ampleSetTweak('goldStandardMedia', path);
  }, { namePrefix: 'gold-dyno', accept: ['image', 'video'] });

  return (
    <div
      ref={dropRef}
      className="drop-target"
      style={{ background: 'var(--ample-coal)', border: '1px solid var(--border-1)', aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: isImage
        ? `url(${media}) center / cover no-repeat`
        : 'radial-gradient(ellipse at 30% 30%, #2a2d33 0%, #0a0b0d 80%)' }} />
      {isVideo && (
        <video
          src={media}
          autoPlay loop muted playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#000' }}
        />
      )}
      {!media && (
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
          <ProductHero type="caliper" size={260} />
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 65%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 20, left: 20, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.1em', zIndex: 2 }}>LAB-01 · FRICTION DYNO</div>
      <div className="drop-hint">Drop image or video</div>
    </div>
  );
}

/* ---------- Gold Standard · Precision + Material feature cards ---------- */
const GOLD_FEATURES = [
  { key: 'precision', t: 'Precision Engineering', b: 'Our machining partners hold ±5 µm tolerances across the whole catalog, verified per-batch on a CMM.', bg: 'linear-gradient(135deg, #2a2d33 0%, #0a0b0d 100%)' },
  { key: 'material',  t: 'Team of Professionals', b: 'Our dedicated experts enforce rigorous quality assurance protocols at every stage of the supply chain, ensuring excellence from sourcing to final delivery.', bg: 'linear-gradient(135deg, #1a1b1e 0%, #000 100%)' },
];

function GoldFeatureCard({ feature, delay }) {
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const img = (tweaks.goldFeatureImages || {})[feature.key] || '';
  const dropRef = React.useRef(null);
  useImageDrop(dropRef, (path) => {
    window.__ampleSetTweak && window.__ampleSetTweak('goldFeatureImages',
      { ...(window.__ampleTweaks?.goldFeatureImages || {}), [feature.key]: path });
  }, { namePrefix: `gold-${feature.key}` });
  return (
    <Reveal delay={delay} style={{ background: 'var(--ample-coal)', border: '1px solid var(--border-1)', overflow: 'hidden' }}>
      <div
        ref={dropRef}
        className="drop-target"
        style={{ aspectRatio: '16/9', position: 'relative', background: img
          ? `url(${img}) center / cover no-repeat`
          : feature.bg }}>
        {!img && (
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 60%)' }} />
        )}
        <div className="drop-hint">Drop image for {feature.t}</div>
      </div>
      <div style={{ padding: 24, borderTop: '1px solid var(--border-1)' }}>
        <Eyebrow color="gold">{feature.t}</Eyebrow>
        <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>{feature.b}</p>
      </div>
    </Reveal>
  );
}

/* ---------- Gold Standard page ---------- */
function GoldStandardPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <SiteHeader active="gold" />
      <main data-screen-label="Gold Standard">
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(40px, 7vw, 56px) clamp(16px, 4vw, 40px) clamp(24px, 5vw, 32px)' }}>
          <div className="stack-on-mobile" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'clamp(24px, 5vw, 48px)', alignItems: 'start' }}>
            <Reveal>
              <Eyebrow color="gold">The Standard</Eyebrow>
              <h1 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 'clamp(48px, 9vw, 88px)', lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: '12px 0 0' }}>
                <span style={{ color: 'var(--ample-gold)' }}>The Gold Standard.</span><br />
                Uncompromising<br />quality assurance.
              </h1>
            </Reveal>
            <Reveal delay={2} style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
              <GoldMedallion size={200} />
            </Reveal>
          </div>
        </section>

        {/* Rigorous testing block */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(20px, 4vw, 24px) clamp(16px, 4vw, 40px) clamp(28px, 6vw, 40px)' }}>
          <Reveal className="stack-on-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <LabMediaBox />
            <div style={{ padding: '32px 8px' }}>
              <Eyebrow>Rigorous Testing</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 36, textTransform: 'uppercase', margin: '10px 0 14px' }}>Every SKU gets the dyno.</h2>
              <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6, maxWidth: 520 }}>
                Our high-inertia friction dyno runs each Gold Standard batch to failure. Thermally, mechanically, then in duty cycle. Nothing leaves the lab on a spec sheet alone.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Precision + Material row */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(16px, 4vw, 20px) clamp(16px, 4vw, 40px) clamp(28px, 6vw, 40px)' }}>
          <div className="stack-on-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {GOLD_FEATURES.map((c, i) => (
              <GoldFeatureCard key={c.key} feature={c} delay={i % 4} />
            ))}
          </div>
        </section>

        {/* Warranty band */}
        <section style={{ borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)', background: '#000' }}>
          <Stripes color="gold" height={6} />
          <Reveal style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(40px, 7vw, 56px) clamp(16px, 4vw, 40px)', textAlign: 'center' }}>
            <Eyebrow color="gold">Service Promise</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 'clamp(32px, 6vw, 56px)', textTransform: 'uppercase', margin: '14px 0 0', lineHeight: 0.95 }}>
              We stand behind every part.<br /><span style={{ color: 'var(--ample-gold)' }}>Trusted by professionals.</span>
            </h2>
          </Reveal>
          <Stripes color="gold" height={6} />
        </section>
      </main>
      <SiteFooter />
    </div>);

}

/* ---------- Our Story page ---------- */
const STORY_ENTRIES = [
  { key: '2009', year: '2009',       t: 'Entered the auto parts industry', b: 'and provided consistent service towards shops and suppliers', img: 'assets/history_2009_1778520721447.png' },
  { key: '2011', year: '2011 to 2019', t: 'THE QUALITY MISSION', b: "Over a decade of experience revealed a critical gap: the market was flooded with failing supply chains and inconsistent parts. We spent these years improving supplier relationships and maintaining quality", img: 'assets/history_2011_1778520777617.png' },
  { key: '2019', year: '2019 to present', t: 'THE AMPLE STANDARD', b: "Ample was born to bridge that gap. Today, we manage over 10,000 SKUs all strictly certified to OEM or OEM+ specifications ensuring that \"aftermarket\" never means a compromise in performance.", img: 'assets/history_2024_1778520797001.png' },
];

/* StoryTimeline — horizontal 3-column layout on desktop, vertical on mobile.
   Single IntersectionObserver toggles an `.is-visible` class on the wrapper
   which then drives three coordinated CSS animations:
     1. The connecting rail draws (scaleX on desktop, scaleY on mobile).
     2. Dots light from cool grey to ample-red at staggered delays.
     3. Each card fades up with a 150ms stagger between cards.
   prefers-reduced-motion bails to the final state on mount. */
function StoryCard({ entry, idx }) {
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const override = (tweaks.storyImages || {})[entry.key];
  const img = override || entry.img;
  const dropRef = React.useRef(null);
  useImageDrop(dropRef, (path) => {
    window.__ampleSetTweak && window.__ampleSetTweak('storyImages',
      { ...(window.__ampleTweaks?.storyImages || {}), [entry.key]: path });
  }, { namePrefix: `history-${entry.key}` });
  return (
    <div className="story-card" data-idx={idx}>
      <div className="story-card-inner">
        <span className="story-dot" aria-hidden="true" />
        <div className="story-year">{entry.year}</div>
        <div ref={dropRef} className="story-img drop-target"
             style={{ backgroundImage: `url(${img})` }}>
          <div className="story-img-shade" aria-hidden="true" />
          <div className="story-img-tag">ARCHIVE · {entry.key}</div>
          <div className="drop-hint">Drop image for {entry.year}</div>
        </div>
        <h3 className="story-title">{entry.t}</h3>
        <p className="story-body">{entry.b}</p>
      </div>
    </div>
  );
}

function StoryTimeline() {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setVisible(true); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { setVisible(true); io.disconnect(); break; }
      }
    }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={'story-grid' + (visible ? ' is-visible' : '')}>
      <div className="story-rail" aria-hidden="true" />
      {STORY_ENTRIES.map((e, i) => (
        <StoryCard key={e.key} entry={e} idx={i} />
      ))}
    </div>
  );
}

function StoryPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <SiteHeader active="story" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(40px, 7vw, 56px) clamp(16px, 4vw, 40px) clamp(48px, 8vw, 64px)' }} data-screen-label="Our Story">
        <Reveal><Eyebrow>History · Timeline</Eyebrow></Reveal>
        <Reveal as="h1" delay={1} style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 'clamp(44px, 8.5vw, 84px)', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.95, margin: '10px 0 48px' }}>
          Our Story.
        </Reveal>

        <StoryTimeline />

        {/* Bottom big slogan */}
        <Reveal style={{ marginTop: 80, borderTop: '1px solid var(--border-1)', paddingTop: 40 }}>
          <Eyebrow>Features · Now Driving</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 'clamp(36px, 6.5vw, 64px)', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.95, margin: '10px 0 0' }}>
            Built for the road, <br /><span style={{ color: 'var(--ample-red)' }}>not the shelf.</span>
          </h2>
        </Reveal>
      </main>
      <SiteFooter />
    </div>);

}

/* ---------- Contact Us page ---------- */
function ContactPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <SiteHeader active="contact" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: 'clamp(40px, 7vw, 56px) clamp(16px, 4vw, 40px) clamp(48px, 8vw, 64px)' }} data-screen-label="Contact Us">
        <Reveal><Eyebrow>Get In Touch</Eyebrow></Reveal>
        <Reveal as="h1" delay={1} style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 'clamp(44px, 8.5vw, 84px)', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.95, margin: '10px 0 48px' }}>
          Contact Us.
        </Reveal>

        <div className="stack-on-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px, 6vw, 64px)', alignItems: 'start' }}>
          {/* Contact details */}
          <Reveal delay={1}>
            <Eyebrow>Reach The Team</Eyebrow>
            <p style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1.6, marginTop: 14, maxWidth: 480 }}>This site showcases our product line it is not a storefront. For pricing, technical specifications, or to learn more about a component, get in touch with our team directly.

            </p>

            <div style={{ marginTop: 36, display: 'grid', gap: 24 }}>
              {[
              { label: 'General Inquiries', v: 'support@ampleproducts.ca' },
              { label: 'Technical Support', v: 'support@ampleproducts.ca' },
              { label: 'Buisness Inquiries', v: 'partners@ampleproducts.ca' },
              { label: 'Headquarters', v: 'Toronto, Canada' }].
              map((r) =>
              <div key={r.label} style={{ borderTop: '1px solid var(--border-1)', paddingTop: 16 }}>
                  <div style={{ fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{r.label}</div>
                  <div style={{ fontFamily: 'var(--font-product)', fontSize: 22, fontWeight: 700, color: 'var(--fg-1)', marginTop: 6 }}>{r.v}</div>
                </div>
              )}
            </div>
          </Reveal>

          {/* Contact form */}
          <Reveal as="div" delay={2} id="contact" style={{ background: 'var(--ample-coal)', border: '1px solid var(--border-1)', padding: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 40, textTransform: 'uppercase', margin: 0 }}>Send a message</h2>
            <div style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginTop: 4 }}></div>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>We'll respond within two business days</p>
            <form onSubmit={(e) => {e.preventDefault();alert('Submitted. Our team will be in touch.');}} style={{ display: 'grid', gap: 12, marginTop: 20 }}>
              <input placeholder="Name" style={inputStyle} />
              <input placeholder="Email" type="email" style={inputStyle} />
              <input placeholder="Subject" style={inputStyle} />
              <textarea placeholder="Message" rows={5} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
              <Button variant="primary">Submit</Button>
            </form>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-1)', fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>

            </div>
          </Reveal>
        </div>
      </main>
      <SiteFooter />
    </div>);

}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--ample-graphite)', border: '1px solid var(--border-1)',
  color: 'var(--fg-1)', borderRadius: 4, padding: '12px 14px',
  fontFamily: 'var(--font-sans)', fontSize: 14, outline: 'none'
};

Object.assign(window, { CatalogPage, GoldStandardPage, StoryPage, ContactPage });