/* Ample — shared primitives (Icon, Button, Badge, Eyebrow, Stripes, etc.) */

function Icon({ name, size = 20, color, style, ...rest }) {
  const src = `https://unpkg.com/lucide-static@latest/icons/${name}.svg`;
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: color === 'red' ? 'brightness(0) saturate(100%) invert(26%) sepia(89%) saturate(3523%) hue-rotate(347deg) brightness(98%) contrast(94%)'
              : color === 'gold' ? 'brightness(0) saturate(100%) invert(72%) sepia(20%) saturate(652%) hue-rotate(5deg) brightness(92%) contrast(86%)'
              : color === 'muted' ? 'brightness(0) invert(0.55)'
              : 'brightness(0) invert(1)',
        ...style,
      }}
      {...rest}
    />
  );
}

function Button({ variant = 'primary', size = 'md', icon, iconEnd, children, onClick, disabled, href, style, ...rest }) {
  const base = {
    fontFamily: 'var(--font-product)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    border: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: 4,
    transition: 'all 120ms var(--ease-sharp)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    textDecoration: 'none',
  };
  const sizeMap = {
    sm: { padding: '8px 14px', fontSize: 11 },
    md: { padding: '12px 20px', fontSize: 13 },
    lg: { padding: '16px 28px', fontSize: 14 },
  };
  const variants = {
    primary: { background: 'var(--ample-red)', color: '#fff', boxShadow: 'var(--e-1)' },
    secondary: { background: 'transparent', color: 'var(--fg-1)', border: '1px solid var(--border-2)' },
    gold: { background: 'var(--ample-gold)', color: '#17110a' },
    ghost: { background: 'transparent', color: 'var(--fg-2)' },
    dark: { background: 'var(--ample-coal)', color: 'var(--fg-1)', border: '1px solid var(--border-1)' },
    light: { background: '#fff', color: '#0B0B0D' },
  };
  const disStyle = disabled ? { background: 'var(--ample-graphite)', color: 'var(--fg-4)', boxShadow: 'none', border: '1px solid var(--border-1)' } : {};
  const [hover, setHover] = React.useState(false);
  const hoverStyle = hover && !disabled ? ({
    primary: { background: 'var(--ample-red-hot)', boxShadow: 'var(--glow-red)' },
    secondary: { borderColor: 'var(--ample-red)', color: 'var(--ample-red)' },
    gold: { background: 'var(--ample-gold-hot)', boxShadow: 'var(--glow-gold)' },
    ghost: { color: 'var(--fg-1)', background: 'var(--ample-coal)' },
    dark: { borderColor: 'var(--border-2)' },
    light: { background: '#f0f0f0' },
  })[variant] : {};
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      href={href}
      style={{ ...base, ...sizeMap[size], ...variants[variant], ...disStyle, ...hoverStyle, ...style }}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === 'sm' ? 14 : 16} />}
    </Tag>
  );
}

function Badge({ variant = 'default', children, dot }) {
  const base = {
    fontFamily: 'var(--font-product)',
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    fontSize: 10,
    fontWeight: 700,
    padding: '5px 10px',
    borderRadius: 999,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    whiteSpace: 'nowrap',
  };
  const variants = {
    default: { background: 'transparent', border: '1px solid var(--border-2)', color: 'var(--fg-2)' },
    gold: { background: 'var(--ample-gold)', color: '#17110a' },
    goldOutline: { background: 'transparent', border: '1px solid var(--ample-gold)', color: 'var(--ample-gold)' },
    red: { background: 'transparent', border: '1px solid var(--ample-red)', color: 'var(--ample-red)' },
    redSolid: { background: 'var(--ample-red)', color: '#fff' },
    ok: { background: 'transparent', border: '1px solid var(--ok)', color: 'var(--ok)' },
    warn: { background: 'transparent', border: '1px solid var(--warn)', color: 'var(--warn)' },
    out: { background: 'transparent', border: '1px solid var(--fg-4)', color: 'var(--fg-3)' },
    solid: { background: '#fff', color: '#000' },
  };
  return <span style={{ ...base, ...variants[variant] }}>{dot && <span style={{ width: 6, height: 6, borderRadius: 3, background: 'currentColor' }} />}{children}</span>;
}

function Eyebrow({ children, color = 'red', style }) {
  const colors = { red: 'var(--ample-red)', gold: 'var(--ample-gold)', muted: 'var(--fg-3)', white: 'var(--fg-1)' };
  return (
    <div style={{
      fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.18em', color: colors[color], ...style
    }}>{children}</div>
  );
}

function Stripes({ color = 'gold', height = 8, style }) {
  return <div style={{ height, background: color === 'gold' ? 'var(--stripes-gold)' : 'var(--stripes-red)', ...style }} />;
}

/* Gold Standard medallion — used on product hero corners */
function GoldMedallion({ size = 88 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #E0C27E 0%, #CCAE69 45%, #9E8547 100%)',
      border: '1px solid #8A7335',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 0 3px rgba(204,174,105,0.15), 0 8px 24px rgba(0,0,0,0.6)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 4, borderRadius: '50%',
        border: '1px dashed rgba(23,17,10,0.4)',
      }} />
      <div style={{
        fontFamily: 'var(--font-product)', fontWeight: 800,
        fontSize: size * 0.095, letterSpacing: '0.14em',
        color: '#17110a', textTransform: 'uppercase', lineHeight: 1,
      }}>Gold</div>
      <div style={{
        fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 800,
        fontSize: size * 0.19, letterSpacing: '-0.01em',
        color: '#17110a', textTransform: 'uppercase', lineHeight: 1, marginTop: 2,
      }}>Standard</div>
    </div>
  );
}

/* Red spec dot — used in callouts */
function SpecDot() {
  return (
    <span style={{
      display: 'inline-block', width: 10, height: 10, borderRadius: 5,
      background: 'var(--ample-red)',
      boxShadow: '0 0 0 3px rgba(233,32,36,0.2)',
    }} />
  );
}

/* Callout — used on product hero with a leader line + label */
function Callout({ label, side = 'left', x, y }) {
  const isRight = side === 'right';
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      display: 'flex', alignItems: 'center', gap: 10,
      flexDirection: isRight ? 'row-reverse' : 'row',
      fontFamily: 'var(--font-product)', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-1)',
      pointerEvents: 'none',
    }}>
      <SpecDot />
      <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.4)' }} />
      <div style={{ whiteSpace: 'nowrap' }}>{label}</div>
    </div>
  );
}

Object.assign(window, { Icon, Button, Badge, Eyebrow, Stripes, GoldMedallion, SpecDot, Callout });
