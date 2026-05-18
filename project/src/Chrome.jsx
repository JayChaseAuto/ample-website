/* Ample — Header, Footer, Navigation shared across all pages */

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#/' },
  { id: 'catalog', label: 'Catalog', href: '#/catalog' },
  { id: 'gold', label: 'Gold Standard', href: '#/gold' },
  { id: 'story', label: 'Our Story', href: '#/story' },
  { id: 'contact', label: 'Contact Us', href: '#/contact' },
];

function SiteHeader({ active }) {
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
        <a href="#/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <img src="assets/logo-red-transparent.png" alt="ample" style={{ height: 22, display: 'block' }} />
        </a>
        {/* Nav scrolls horizontally on narrow screens; .nav-scroll hides the
            scrollbar so the row looks clean. Items keep whiteSpace: nowrap
            so they don't wrap mid-label ("Gold / Standard"). */}
        <nav className="nav-scroll" style={{
          display: 'flex',
          gap: 'clamp(14px, 3vw, 28px)',
          flex: 1, minWidth: 0,
          overflowX: 'auto', overflowY: 'hidden',
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.id} href={l.href} style={{
              fontFamily: 'var(--font-product)',
              fontSize: 'clamp(10px, 2.4vw, 11px)',
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
