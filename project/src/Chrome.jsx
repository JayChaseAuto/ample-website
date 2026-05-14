/* Ample — Header, Footer, Navigation shared across all pages.
   All layout/breakpoint styling lives in colors_and_type.css under the
   .site-header / .site-nav rules. JSX is just structure + active state. */

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#/' },
  { id: 'catalog', label: 'Catalog', href: '#/catalog' },
  { id: 'gold', label: 'Gold Standard', href: '#/gold' },
  { id: 'story', label: 'Our Story', href: '#/story' },
  { id: 'contact', label: 'Contact Us', href: '#/contact' },
];

function SiteHeader({ active }) {
  const [open, setOpen] = React.useState(false);
  // Close the menu on hash change (link tap) and on Escape.
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('hashchange', close);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('hashchange', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="site-logo" href="#/" aria-label="Ample home">
          <img src="assets/logo-red-transparent.png" alt="ample" />
        </a>
        <button
          type="button"
          className={open ? 'site-burger is-open' : 'site-burger'}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
        <nav id="site-nav" className={open ? 'site-nav is-open' : 'site-nav'}>
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={l.href}
               className={active === l.id ? 'site-nav-link is-active' : 'site-nav-link'}
               aria-current={active === l.id ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-row">
        <div className="site-footer-links">
          <a href="#/" className="site-footer-link">Home</a>
          <a href="#/story" className="site-footer-link">Our Story</a>
          <a href="#/contact" className="site-footer-link">Contact Us</a>
        </div>
        <div className="site-footer-tagline">Global Partnerships</div>
      </div>
      <div className="site-footer-fine">
        Global network of physical partners and service centers.
      </div>
    </footer>
  );
}

Object.assign(window, { SiteHeader, SiteFooter, NAV_LINKS });
