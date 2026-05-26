/* Ample — Header, Footer, Navigation shared across all pages */

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#/' },
  { id: 'catalog', label: 'Catalog', href: '#/catalog' },
  { id: 'gold', label: 'Gold Standard', href: '#/gold' },
  { id: 'story', label: 'Our Story', href: '#/story' },
  { id: 'contact', label: 'Contact Us', href: '#/contact' },
];

function SiteHeader({ active }) {
  // Drop-to-replace logo. Editors can drag a logo file onto the header
  // anchor — dev server stores it under assets/, tweak state remembers it.
  // Falls back to the original committed PNG when no override is set so
  // visitors and fresh clones render correctly.
  const { tweaks, setTweak } = useTweakState();
  const logoSrc = tweaks.siteLogo || 'assets/logo-red-transparent.png';
  const logoHeight = typeof tweaks.siteLogoHeight === 'number' ? tweaks.siteLogoHeight : 22;
  const logoRef = React.useRef(null);
  useImageDrop(logoRef, (path, opts) => {
    setTweak('siteLogo', path, opts);
  }, { namePrefix: 'site-logo' });

  // Mobile hamburger state. Desktop renders the same nav inline; CSS
  // (@media max-width: 720px) hides the nav off-screen until .is-open
  // and reveals the burger button. Close on Escape and on route-link
  // click so the sheet doesn't linger after navigation.
  const [navOpen, setNavOpen] = React.useState(false);
  React.useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(11,11,13,0.82)',
      backdropFilter: 'blur(12px) saturate(140%)',
      WebkitBackdropFilter: 'blur(12px) saturate(140%)',
      borderBottom: '1px solid var(--border-1)',
    }}>
      <div style={{
        height: 64, display: 'flex', alignItems: 'center',
        padding: '0 clamp(16px, 4vw, 40px)',
        gap: 'clamp(12px, 3vw, 40px)',
        maxWidth: 1440, margin: '0 auto',
      }}>
        <a ref={logoRef} href="#/" className="drop-target"
           data-ample-slot="site-logo"
           style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none',
                    flexShrink: 0, position: 'relative', padding: 4, margin: -4 }}>
          <div className="drop-hint">Drop logo image</div>
          <img src={logoSrc} alt="ample" style={{ height: logoHeight, display: 'block' }} />
        </a>
        {/* Nav. Desktop: inline flex strip via inline styles + .nav-scroll.
            Mobile (≤720px): @media block in CSS fixes-position it under
            the header bar, transforms off-screen until .is-open, and
            restyles links as full-width tap targets via .site-nav-link. */}
        <nav className={'site-nav nav-scroll' + (navOpen ? ' is-open' : '')} style={{
          display: 'flex',
          gap: 'clamp(14px, 3vw, 28px)',
          flex: 1, minWidth: 0,
          overflowX: 'auto', overflowY: 'hidden',
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.id} href={l.href}
               className={'site-nav-link' + (active === l.id ? ' is-active' : '')}
               onClick={() => setNavOpen(false)}
               style={{
                 fontFamily: 'var(--font-product)',
                 fontWeight: 700,
                 textTransform: 'uppercase', letterSpacing: '0.16em',
                 color: active === l.id ? 'var(--ample-red)' : 'var(--fg-1)',
                 textDecoration: 'none',
                 borderBottom: active === l.id ? '2px solid var(--ample-red)' : '2px solid transparent',
                 paddingBottom: 4,
                 transition: 'color 120ms',
                 textAlign: 'left',
                 whiteSpace: 'nowrap',
                 flexShrink: 0,
               }}>{l.label}</a>
          ))}
        </nav>
        {/* Hamburger — display:none on desktop, inline-flex on mobile via
            CSS. Three spans morph into an X when .is-open via the
            existing .site-burger keyframes. */}
        <button type="button"
                className={'site-burger' + (navOpen ? ' is-open' : '')}
                aria-label={navOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={navOpen}
                onClick={() => setNavOpen((v) => !v)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

function SiteFooter({ variant = 'dark' }) {
  return (
    <footer style={{ background: '#000', borderTop: '1px solid var(--border-1)' }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '28px clamp(16px, 4vw, 40px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 'clamp(14px, 3vw, 28px)', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#/" style={footerLinkStyle}>Home</a>
          <a href="#/story" style={footerLinkStyle}>Our Story</a>
          <a href="#/contact" style={footerLinkStyle}>Contact Us</a>
        </div>
        <div style={{ fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-1)' }}>
          Global Partnerships
        </div>
      </div>
      <div style={{
        borderTop: '1px solid var(--border-1)',
        padding: '14px clamp(16px, 4vw, 40px)',
        maxWidth: 1440, margin: '0 auto',
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)',
        letterSpacing: '0.06em', textAlign: 'right',
      }}>
        Global network of physical partners and service centers.
      </div>
    </footer>
  );
}

const footerLinkStyle = {
  fontFamily: 'var(--font-product)', fontSize: 10, fontWeight: 700,
  letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'var(--fg-1)', textDecoration: 'none',
};

Object.assign(window, { SiteHeader, SiteFooter, NAV_LINKS });
