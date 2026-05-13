/* Ample — Catalog, Gold Standard, Story/Contact pages */

function CatalogPage() {
  const tweaks = typeof window !== 'undefined' && window.__ampleTweaks || {};
  const eyebrow = tweaks.catalogEyebrow || 'Our Inventory';
  const title = tweaks.catalogTitle || 'Our Catalog.';
  const intro = tweaks.catalogIntro || "A curated selection of our precision components, organized by system. For fitment, pricing, or availability on any part, get in touch.";
  const cardCols = tweaks.catalogCardCols || 3;
  const showBlurbs = tweaks.catalogShowBlurbs !== false;
  const showCardFit = tweaks.catalogShowCardFit !== false;
  const cardImgRatio = tweaks.catalogCardRatio || '4/3';
  const headerSize = tweaks.catalogHeaderSize || 84;
  const filter = tweaks.catalogFilter || 'all';
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
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px 80px' }} data-screen-label="Catalog">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: headerSize, textTransform: 'uppercase', margin: '10px 0 0', letterSpacing: '-0.02em', lineHeight: 0.95 }}>{title}</h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6, marginTop: 18, maxWidth: 640 }}>
          {intro}
        </p>

        {layout === 'flat' ?
        <div style={{ marginTop: 56 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--border-1)', paddingBottom: 14 }}>
              <div>
                <Eyebrow color="red">{flatSlugs.length} {flatSlugs.length === 1 ? 'product' : 'products'}</Eyebrow>
                <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 44, textTransform: 'uppercase', margin: '8px 0 0', letterSpacing: '-0.01em' }}>{filter === 'all' ? 'All Products.' : filter + '.'}</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cardCols}, 1fr)`, gap: 16 }}>
              {flatSlugs.map((slug) => <CatalogCard key={slug} slug={slug} showFit={showCardFit} ratio={cardImgRatio} />)}
            </div>
          </div> :

        <div style={{ marginTop: 56, display: 'grid', gap: 64 }}>
            {categories.map((cat) =>
          <section key={cat}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid var(--border-1)', paddingBottom: 14 }}>
                  <div>
                    <Eyebrow color="red">{grouped[cat].length} {grouped[cat].length === 1 ? 'product' : 'products'}</Eyebrow>
                    <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 44, textTransform: 'uppercase', margin: '8px 0 0', letterSpacing: '-0.01em' }}>{{ Braking: 'Ample Brakes', Cooling: 'Ample Cooling', HVAC: 'Ample AC', Engine: 'Ample Engine', Electrical: 'Ample Electrical', Lighting: 'Ample Lighting', Steering: 'Ample Steering Parts', Wipers: 'Ample Wipers', Service: 'Ample Filters' }[cat] || cat}</h2>
                  </div>
                  {showBlurbs &&
              <p style={{ color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.6, margin: 0, maxWidth: 420, textAlign: 'right' }}>{categoryBlurbs[cat]}</p>
              }
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cardCols}, 1fr)`, gap: 16 }}>
                  {grouped[cat].map((slug) => <CatalogCard key={slug} slug={slug} showFit={showCardFit} ratio={cardImgRatio} />)}
                </div>
              </section>
          )}
          </div>
        }
      </main>
      <SiteFooter />
    </div>);

}

function CatalogCard({ slug, showFit = true, ratio = '4/3' }) {
  const p = PRODUCTS[slug];
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--ample-coal)',
        border: '1px solid var(--border-1)',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 120ms var(--ease-sharp)'
      }}
      onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)';e.currentTarget.style.boxShadow = 'var(--e-2)';e.currentTarget.style.borderColor = 'var(--border-2)';}}
      onMouseLeave={(e) => {e.currentTarget.style.transform = 'none';e.currentTarget.style.boxShadow = 'none';e.currentTarget.style.borderColor = 'var(--border-1)';}}
      onDragEnter={(e) => {if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) {e.preventDefault();e.currentTarget.setAttribute('data-card-over', '');}}}
      onDragOver={(e) => {if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) {e.preventDefault();e.dataTransfer.dropEffect = 'copy';}}}
      onDragLeave={(e) => {if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.removeAttribute('data-card-over');}}
      onDrop={(e) => {
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (!f) return;
        e.preventDefault();
        e.currentTarget.removeAttribute('data-card-over');
        const slot = e.currentTarget.querySelector('image-slot');
        if (slot && typeof slot._ingest === 'function') slot._ingest(f);
      }}>
      {p.goldStandard &&
      <span style={{ position: 'absolute', top: 10, right: 10, zIndex: 3, background: 'var(--ample-gold)', color: '#17110a', fontFamily: 'var(--font-product)', fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 999, pointerEvents: 'none' }}>★ Gold</span>
      }
      <div style={{ position: 'relative', aspectRatio: ratio, background: 'radial-gradient(ellipse at center, #1a1b1e 0%, #000 75%)', padding: 16 }}>
        <div style={{ position: 'absolute', inset: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ProductHero type={p.heroAsset} size={240} />
        </div>
        <image-slot
          id={`catalog-${slug}`}
          shape="rect"
          fit="cover"
          placeholder="Drop image"
          style={{ position: 'absolute', inset: 16, background: 'transparent', zIndex: 2 }}
          ref={(el) => {
            if (!el) return;
            const apply = () => {el.style.background = el.hasAttribute('data-filled') ? '#000' : 'transparent';};
            apply();
            new MutationObserver(apply).observe(el, { attributes: true, attributeFilter: ['data-filled'] });
          }} />
      </div>
      <a href={`#/product/${slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', padding: '14px 18px 18px', borderTop: '1px solid var(--border-1)' }}>
        <Eyebrow color={p.goldStandard ? 'gold' : 'red'} style={{ fontSize: 10 }}>{p.category}</Eyebrow>
        <div style={{ fontFamily: 'var(--font-product)', fontWeight: 700, textTransform: 'uppercase', fontSize: 16, marginTop: 6 }}>{p.title} {p.title2}</div>
        {showFit && <p style={{ color: 'var(--fg-3)', fontSize: 12, lineHeight: 1.5, margin: '6px 0 12px' }}>{p.fit}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: showFit ? 0 : 12 }}>
          <div style={{ fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ample-red)', borderBottom: '1px solid var(--ample-red)' }}>View Details</div>
        </div>
      </a>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 4, outline: '2px dashed var(--ample-red)', outlineOffset: -6, opacity: 0, transition: 'opacity 120ms var(--ease-sharp)' }} className="cc-drop-ring" />
      <style>{`[data-card-over] .cc-drop-ring { opacity: 1 !important; }`}</style>
    </div>);

}

/* ---------- Gold Standard page ---------- */
function GoldStandardPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <SiteHeader active="gold" />
      <main data-screen-label="Gold Standard">
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <Eyebrow color="gold">The Standard</Eyebrow>
              <h1 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 88, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: '12px 0 0' }}>
                <span style={{ color: 'var(--ample-gold)' }}>The Gold Standard.</span><br />
                Uncompromising<br />quality assurance.
              </h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
              <GoldMedallion size={200} />
            </div>
          </div>
        </section>

        {/* Rigorous testing block */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 40px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: 'var(--ample-coal)', border: '1px solid var(--border-1)', aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 30%, #2a2d33 0%, #0a0b0d 80%)' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.1em' }}>LAB-01 · FRICTION DYNO</div>
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <ProductHero type="caliper" size={260} />
              </div>
            </div>
            <div style={{ padding: '32px 8px' }}>
              <Eyebrow>Rigorous Testing</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 36, textTransform: 'uppercase', margin: '10px 0 14px' }}>Every SKU gets the dyno.</h2>
              <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6, maxWidth: 520 }}>
                Our high-inertia friction dyno runs each Gold Standard batch to failure — thermally, mechanically, then in duty cycle. Nothing leaves the lab on a spec sheet alone.
              </p>
              <div style={{ background: 'var(--ample-coal)', border: '1px solid var(--ample-gold)', padding: 20, marginTop: 22, display: 'inline-block', boxShadow: 'var(--glow-gold)' }}>
                <div style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 40, color: 'var(--ample-gold)', lineHeight: 1 }}>800 °C</div>
                <div style={{ fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-3)', marginTop: 8 }}>Brake fade ceiling · verified</div>
              </div>
            </div>
          </div>
        </section>

        {/* Precision + Material row */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '20px 40px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
            { t: 'Precision Engineering', b: 'Our machining partners hold ±5 µm tolerances across the whole catalog, verified per-batch on a CMM.', bg: 'linear-gradient(135deg, #2a2d33 0%, #0a0b0d 100%)' },
            { t: 'Material Sourcing', b: 'Metallurgy-traceable billet stock. Every critical part ships with a material certificate on request.', bg: 'linear-gradient(135deg, #1a1b1e 0%, #000 100%)' }].
            map((c) =>
            <div key={c.t} style={{ background: 'var(--ample-coal)', border: '1px solid var(--border-1)', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '16/9', background: c.bg, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 60%)' }} />
                </div>
                <div style={{ padding: 24, borderTop: '1px solid var(--border-1)' }}>
                  <Eyebrow color="gold">{c.t}</Eyebrow>
                  <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>{c.b}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Warranty band */}
        <section style={{ borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)', background: '#000' }}>
          <Stripes color="gold" height={6} />
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px', textAlign: 'center' }}>
            <Eyebrow color="gold">Service Promise</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 56, textTransform: 'uppercase', margin: '14px 0 0', lineHeight: 0.95 }}>
              We stand behind every part.<br /><span style={{ color: 'var(--ample-gold)' }}>Trusted by professionals.</span>
            </h2>
          </div>
          <Stripes color="gold" height={6} />
        </section>
      </main>
      <SiteFooter />
    </div>);

}

/* ---------- Our Story page ---------- */
function StoryPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <SiteHeader active="story" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px 64px' }} data-screen-label="Our Story">
        <Eyebrow>History · Timeline</Eyebrow>
        <h1 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 84, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.95, margin: '10px 0 48px' }}>
          Our Story.
        </h1>

        <div style={{ position: 'relative', maxWidth: 920 }}>
          <div style={{ position: 'absolute', left: 200, top: 24, bottom: 24, width: 1, background: 'var(--border-2)' }} />
          {[
          { year: '1995', t: 'Founding Principles', b: 'Born in the empty floor above an even wider, wreckers headline dismissed, quiet garage in Stuttgart.', bg: '#3a3d44' },
          { year: '2005', t: 'The OEM+ Philosophy', b: "Each quality post construct to over-take derivation by case the 1990's philosophy.", bg: '#1e3a5a' },
          { year: '2020', t: 'Expanding Our Reach', b: "A continental group's name transit manufacturing and generations, systems outsourced and indexes.", bg: '#3a3025' }].
          map((e, i) =>
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '170px 60px 1fr', gap: 0, marginBottom: 32, alignItems: 'start' }}>
              <div style={{ background: e.bg, aspectRatio: '4/3', borderRadius: 2, border: '1px solid var(--border-1)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 8, left: 10, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>ARCHIVE · {e.year}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: 'var(--ample-red)', border: '3px solid #000', boxShadow: '0 0 0 1px var(--ample-red)' }} />
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 22, textTransform: 'uppercase' }}>{e.t} <span style={{ color: 'var(--fg-3)', fontWeight: 500 }}>({e.year})</span></div>
                <p style={{ color: 'var(--fg-2)', fontSize: 13, lineHeight: 1.6, marginTop: 8, maxWidth: 380 }}>{e.b}</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom big slogan */}
        <div style={{ marginTop: 80, borderTop: '1px solid var(--border-1)', paddingTop: 40 }}>
          <Eyebrow>Features · Now Driving</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 64, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.95, margin: '10px 0 0' }}>
            Built for the road, <br /><span style={{ color: 'var(--ample-red)' }}>not the shelf.</span>
          </h2>
        </div>
      </main>
      <SiteFooter />
    </div>);

}

/* ---------- Contact Us page ---------- */
function ContactPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <SiteHeader active="contact" />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '56px 40px 64px' }} data-screen-label="Contact Us">
        <Eyebrow>Get In Touch</Eyebrow>
        <h1 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 84, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 0.95, margin: '10px 0 48px' }}>
          Contact Us.
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
          {/* Contact details */}
          <div>
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
          </div>

          {/* Contact form */}
          <div id="contact" style={{ background: 'var(--ample-coal)', border: '1px solid var(--border-1)', padding: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-product)', fontWeight: 800, fontSize: 40, textTransform: 'uppercase', margin: 0 }}>Send a message</h2>
            <div style={{ fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginTop: 4 }}></div>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, marginTop: 16, lineHeight: 1.6 }}>We'll respond within two business days</p>
            <form onSubmit={(e) => {e.preventDefault();alert('Submitted — our team will be in touch.');}} style={{ display: 'grid', gap: 12, marginTop: 20 }}>
              <input placeholder="Name" style={inputStyle} />
              <input placeholder="Email" type="email" style={inputStyle} />
              <input placeholder="Subject" style={inputStyle} />
              <textarea placeholder="Message" rows={5} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
              <Button variant="primary">Submit</Button>
            </form>
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-1)', fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>

            </div>
          </div>
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