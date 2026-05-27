/* Ample — Header, Footer, Navigation shared across all pages */

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#/' },
  { id: 'catalog', label: 'Catalog', href: '#/catalog' },
  { id: 'gold', label: 'Gold Standard', href: '#/gold' },
  { id: 'story', label: 'Our Story', href: '#/story' },
  { id: 'contact', label: 'Contact Us', href: '#/contact' },
];

// Mobile-detection hook. CSS @media is the primary mechanism, but we also
// track viewport width in state so the header markup can be PRUNED on
// mobile — not just visually-hidden via transform. This belt-and-braces
// approach prevents any "old nav text peeks through" edge cases when
// stylesheets race scripts or when something accidentally overrides a
// mobile rule. Returns true when viewport ≤ 720px.
function useIsMobileViewport() {
  const get = () => typeof window !== 'undefined' &&
                    window.matchMedia('(max-width: 720px)').matches;
  const [isMobile, setIsMobile] = React.useState(get);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const onChange = (e) => setIsMobile(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    // Catch any change that happened between initial paint and effect mount.
    setIsMobile(mq.matches);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  return isMobile;
}

function SiteHeader({ active }) {
  // Drawer open state for the mobile hamburger. Closed by default so the
  // header renders identically on first paint — clicking the burger flips
  // it open and the .is-open class slides the drawer into view.
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobileViewport();

  // Auto-close the drawer when the route changes (user tapped a link) or
  // when the viewport widens past the mobile breakpoint (rotated to
  // landscape / resized desktop). isMobile flips on resize already, but
  // we also reset open so a later shrink doesn't reveal a stale-open drawer.
  React.useEffect(() => {
    const closeOnNav = () => setOpen(false);
    window.addEventListener('hashchange', closeOnNav);
    return () => window.removeEventListener('hashchange', closeOnNav);
  }, []);
  React.useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  // Dev-time marker so a stale cached build is easy to spot in DevTools.
  // Bump the version string whenever SiteHeader changes shape. Editor-only
  // so production visitors don't see N copies stack up as they navigate
  // (SiteHeader unmounts on every route change).
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.__ampleEditor &&
        typeof console !== 'undefined') {
      console.log('[ample] SiteHeader v3 (logo + hamburger on ≤720px)');
    }
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a href="#/" className="site-logo" aria-label="ample — home">
          <img src="assets/logo-red-transparent.png" alt="ample" />
        </a>
        {/* Render the nav drawer markup only on mobile when it's open, OR
            always on desktop. This prunes the nav links from the DOM on
            mobile-closed so there's nothing for stray CSS overrides to
            accidentally reveal — matches the user's "just logo + 3 dashes"
            request to the letter when the drawer is closed. */}
        {(!isMobile || open) && (
          <nav className={'site-nav' + (open ? ' is-open' : '')}
               id="site-nav"
               aria-label="Primary">
            {NAV_LINKS.map(l => (
              <a key={l.id} href={l.href}
                 className={'site-nav-link' + (active === l.id ? ' is-active' : '')}>
                {l.label}
              </a>
            ))}
          </nav>
        )}
        {/* Hamburger — rendered only on mobile (display:none CSS would
            also hide it on desktop, but JS-gating keeps the DOM clean and
            avoids any focus-order surprises for keyboard users). */}
        {isMobile && (
          <button type="button"
                  className={'site-burger' + (open ? ' is-open' : '')}
                  aria-controls="site-nav"
                  aria-expanded={open}
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  onClick={() => setOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        )}
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
