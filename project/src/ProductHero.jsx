/* Ample — Stylized SVG product illustrations for hero shots.
   These mimic high-contrast, cool-neutral, single-source lit product photography. */

function ProductHero({ type, size = 520 }) {
  // Real photography override for products that have photo assets
  const PHOTOS = {
    'brake-pads': 'assets/brake-pad-hero.png',
  };
  if (PHOTOS[type]) {
    return (
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '1/1', maxWidth: size,
        margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        filter: 'drop-shadow(0 40px 40px rgba(0,0,0,0.6))',
      }}>
        <img src={PHOTOS[type]} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    );
  }
  const Renderer = HERO_RENDERERS[type] || HERO_RENDERERS['brake-pads'];
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '1/1', maxWidth: size,
      margin: '0 auto',
      filter: 'drop-shadow(0 40px 40px rgba(0,0,0,0.6))',
    }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="rim" cx="30%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)"/>
            <stop offset="50%" stopColor="rgba(255,255,255,0.04)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <radialGradient id="shadow" cx="50%" cy="90%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.8)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8eaed"/>
            <stop offset="40%" stopColor="#8a8f96"/>
            <stop offset="70%" stopColor="#3a3d44"/>
            <stop offset="100%" stopColor="#1a1b1e"/>
          </linearGradient>
          <linearGradient id="metalDark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6a6d74"/>
            <stop offset="50%" stopColor="#2a2d33"/>
            <stop offset="100%" stopColor="#0a0b0d"/>
          </linearGradient>
          <linearGradient id="metalRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff4a4e"/>
            <stop offset="50%" stopColor="#B3181C"/>
            <stop offset="100%" stopColor="#5a0e10"/>
          </linearGradient>
          <radialGradient id="hotspot" cx="35%" cy="30%" r="25%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
        {/* Ground shadow */}
        <ellipse cx="200" cy="360" rx="150" ry="16" fill="url(#shadow)" />
        <Renderer />
        {/* Rim light overlay */}
        <rect x="0" y="0" width="400" height="400" fill="url(#rim)" style={{ pointerEvents: 'none' }} />
      </svg>
    </div>
  );
}

const HERO_RENDERERS = {
  'brake-pads': () => (
    <g>
      {[{x:100,y:180},{x:230,y:150},{x:90,y:260},{x:220,y:230}].map((p,i)=>(
        <g key={i}>
          <rect x={p.x} y={p.y} width="90" height="60" rx="3" fill="url(#metalDark)" stroke="#0a0b0d"/>
          <rect x={p.x+4} y={p.y+4} width="82" height="40" rx="2" fill="#1a1b1e"/>
          <rect x={p.x+4} y={p.y+4} width="82" height="40" rx="2" fill="url(#hotspot)"/>
          <rect x={p.x} y={p.y+48} width="90" height="12" fill="url(#metal)"/>
          {[...Array(6)].map((_,j)=>(
            <circle key={j} cx={p.x+10+j*14} cy={p.y+24} r="1.5" fill="#444" />
          ))}
        </g>
      ))}
    </g>
  ),
  'caliper': () => (
    <g>
      {/* Rotor disc */}
      <circle cx="200" cy="210" r="150" fill="url(#metal)" />
      <circle cx="200" cy="210" r="150" fill="url(#hotspot)" />
      <circle cx="200" cy="210" r="60" fill="#0a0b0d" />
      <circle cx="200" cy="210" r="58" fill="none" stroke="#3a3d44" strokeWidth="1"/>
      {/* Drilled holes */}
      {[...Array(24)].map((_,i)=>{
        const a = i*(360/24) * Math.PI/180;
        return <circle key={i} cx={200+Math.cos(a)*105} cy={210+Math.sin(a)*105} r="4" fill="#0a0b0d"/>;
      })}
      {/* Slots */}
      {[...Array(8)].map((_,i)=>{
        const a = i*(360/8) * Math.PI/180;
        return <line key={i} x1={200+Math.cos(a)*78} y1={210+Math.sin(a)*78} x2={200+Math.cos(a)*140} y2={210+Math.sin(a)*140} stroke="#0a0b0d" strokeWidth="3"/>;
      })}
      {/* Red caliper */}
      <path d="M 130 140 L 150 120 L 270 120 L 290 140 L 290 200 L 270 220 L 150 220 L 130 200 Z" fill="url(#metalRed)" stroke="#5a0e10" strokeWidth="1.5"/>
      <path d="M 130 140 L 150 120 L 270 120 L 290 140 L 290 200 L 270 220 L 150 220 L 130 200 Z" fill="url(#hotspot)" opacity="0.5"/>
      <rect x="155" y="130" width="110" height="10" fill="#7a0d10" rx="2"/>
      <text x="210" y="176" fontFamily="Barlow, sans-serif" fontSize="14" fontWeight="800" fill="#fff" textAnchor="middle" letterSpacing="2">ample</text>
      {/* Pistons */}
      {[165,200,235].map(x=>(
        <circle key={x} cx={x} cy="200" r="7" fill="#3a3d44" stroke="#0a0b0d"/>
      ))}
    </g>
  ),
  'radiator': () => (
    <g>
      {/* Frame */}
      <rect x="50" y="120" width="300" height="160" fill="url(#metal)" stroke="#1a1b1e" rx="4"/>
      <rect x="50" y="120" width="300" height="160" fill="url(#hotspot)" rx="4" opacity="0.6"/>
      {/* Fins */}
      <rect x="60" y="130" width="280" height="140" fill="#0a0b0d" rx="2"/>
      {[...Array(40)].map((_,i)=>(
        <line key={i} x1={60+i*7} y1="130" x2={60+i*7} y2="270" stroke="#4a4d54" strokeWidth="0.5"/>
      ))}
      {[...Array(18)].map((_,i)=>(
        <line key={`h${i}`} x1="60" y1={130+i*8} x2="340" y2={130+i*8} stroke="#2a2d33" strokeWidth="0.5"/>
      ))}
      {/* Tanks */}
      <rect x="46" y="116" width="14" height="168" fill="url(#metalDark)" rx="2"/>
      <rect x="340" y="116" width="14" height="168" fill="url(#metalDark)" rx="2"/>
      {/* Hose fittings */}
      <rect x="30" y="140" width="20" height="18" fill="url(#metal)" rx="2"/>
      <rect x="350" y="240" width="20" height="18" fill="url(#metal)" rx="2"/>
    </g>
  ),
  'water-pump': () => (
    <g>
      {/* Body */}
      <circle cx="200" cy="210" r="110" fill="url(#metal)" />
      <circle cx="200" cy="210" r="110" fill="url(#hotspot)" />
      <circle cx="200" cy="210" r="85" fill="#0a0b0d" stroke="#3a3d44"/>
      {/* Impeller blades */}
      {[...Array(6)].map((_,i)=>{
        const a = i*60;
        return (
          <path key={i} transform={`rotate(${a} 200 210)`} d="M 200 140 Q 215 175 205 210 L 195 210 Q 185 175 200 140 Z" fill="url(#metalDark)" stroke="#1a1b1e"/>
        );
      })}
      <circle cx="200" cy="210" r="18" fill="url(#metal)" stroke="#1a1b1e"/>
      <circle cx="200" cy="210" r="5" fill="#0a0b0d"/>
      {/* Mounting bolts */}
      {[0,90,180,270].map(a=>{
        const r = 100, rad = a*Math.PI/180;
        return <circle key={a} cx={200+Math.cos(rad)*r} cy={210+Math.sin(rad)*r} r="6" fill="#3a3d44" stroke="#0a0b0d"/>;
      })}
      {/* Inlet pipe */}
      <rect x="80" y="200" width="35" height="20" fill="url(#metal)" rx="2"/>
    </g>
  ),
  'sensor': () => (
    <g>
      {/* Cable */}
      <path d="M 80 110 Q 140 140 170 180 Q 195 210 200 250" fill="none" stroke="#1a1b1e" strokeWidth="8" strokeLinecap="round"/>
      <path d="M 80 110 Q 140 140 170 180 Q 195 210 200 250" fill="none" stroke="#3a3d44" strokeWidth="4" strokeLinecap="round"/>
      {/* Connector */}
      <rect x="60" y="95" width="40" height="30" fill="url(#metalDark)" stroke="#0a0b0d" rx="2"/>
      <rect x="66" y="101" width="28" height="18" fill="#0a0b0d" rx="1"/>
      {/* Sensor body */}
      <rect x="180" y="240" width="50" height="90" fill="url(#metal)" stroke="#1a1b1e" rx="2"/>
      <rect x="180" y="240" width="50" height="90" fill="url(#hotspot)" rx="2" opacity="0.7"/>
      {/* Hex nut */}
      <polygon points="175,250 205,235 235,250 235,275 205,290 175,275" fill="url(#metalDark)" stroke="#0a0b0d"/>
      {/* Thread */}
      <rect x="190" y="310" width="30" height="40" fill="url(#metalDark)" stroke="#0a0b0d"/>
      {[...Array(8)].map((_,i)=>(
        <line key={i} x1="190" y1={312+i*5} x2="220" y2={315+i*5} stroke="#0a0b0d" strokeWidth="0.5"/>
      ))}
      {/* Tip */}
      <circle cx="205" cy="355" r="6" fill="#B3181C"/>
    </g>
  ),
  'power-steering': () => (
    <g>
      {/* Rack bar */}
      <rect x="40" y="200" width="320" height="20" fill="url(#metal)" stroke="#1a1b1e" rx="2"/>
      <rect x="40" y="200" width="320" height="20" fill="url(#hotspot)" opacity="0.5"/>
      {/* Teeth */}
      {[...Array(40)].map((_,i)=>(
        <line key={i} x1={50+i*8} y1="200" x2={50+i*8} y2="195" stroke="#0a0b0d" strokeWidth="1"/>
      ))}
      {/* Motor body */}
      <rect x="130" y="140" width="140" height="70" fill="url(#metalDark)" stroke="#0a0b0d" rx="6"/>
      <rect x="130" y="140" width="140" height="70" fill="url(#hotspot)" rx="6" opacity="0.6"/>
      {[...Array(6)].map((_,i)=>(
        <line key={i} x1={140+i*20} y1="150" x2={140+i*20} y2="200" stroke="#0a0b0d" strokeWidth="1" opacity="0.6"/>
      ))}
      {/* Connector */}
      <rect x="270" y="155" width="28" height="40" fill="#0a0b0d" stroke="#3a3d44" rx="2"/>
      <rect x="274" y="160" width="20" height="10" fill="#3a3d44"/>
      <rect x="274" y="175" width="20" height="14" fill="#3a3d44"/>
      {/* Tie-rod ends */}
      <circle cx="40" cy="210" r="18" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="40" cy="210" r="6" fill="#0a0b0d"/>
      <circle cx="360" cy="210" r="18" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="360" cy="210" r="6" fill="#0a0b0d"/>
      <text x="200" y="182" fontFamily="Barlow, sans-serif" fontSize="12" fontWeight="800" fill="#E92024" textAnchor="middle" letterSpacing="2">ample EPS</text>
    </g>
  ),
  'starter': () => (
    <g>
      {/* Main body cylinder */}
      <ellipse cx="200" cy="180" rx="55" ry="20" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <rect x="145" y="180" width="110" height="120" fill="url(#metal)" stroke="#1a1b1e"/>
      <rect x="145" y="180" width="110" height="120" fill="url(#hotspot)" opacity="0.6"/>
      <ellipse cx="200" cy="300" rx="55" ry="18" fill="url(#metalDark)" stroke="#0a0b0d"/>
      {/* Ribs */}
      {[...Array(8)].map((_,i)=>(
        <line key={i} x1="145" y1={185+i*14} x2="255" y2={185+i*14} stroke="#1a1b1e" strokeWidth="1"/>
      ))}
      {/* Bendix nose */}
      <rect x="180" y="130" width="40" height="50" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="200" cy="130" r="18" fill="url(#metal)" stroke="#1a1b1e"/>
      {/* Pinion gear */}
      <g transform="translate(200 110)">
        {[...Array(12)].map((_,i)=>{
          const a = i*30, rad = a*Math.PI/180;
          return <rect key={i} x="-3" y="-18" width="6" height="8" fill="url(#metal)" transform={`rotate(${a})`}/>;
        })}
        <circle r="12" fill="url(#metalDark)"/>
        <circle r="3" fill="#0a0b0d"/>
      </g>
      {/* Solenoid cylinder on top */}
      <rect x="255" y="150" width="60" height="40" fill="url(#metalDark)" stroke="#0a0b0d" rx="4"/>
      <circle cx="320" cy="170" r="8" fill="#B3181C"/>
      <circle cx="320" cy="170" r="3" fill="#ff4a4e"/>
    </g>
  ),
  'filter': () => (
    <g>
      {/* Top cap */}
      <ellipse cx="200" cy="120" rx="80" ry="18" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <rect x="120" y="120" width="160" height="20" fill="url(#metalDark)"/>
      {/* Main body */}
      <rect x="130" y="135" width="140" height="160" fill="url(#metal)" stroke="#1a1b1e"/>
      <rect x="130" y="135" width="140" height="160" fill="url(#hotspot)" opacity="0.5"/>
      {/* Pleats */}
      {[...Array(14)].map((_,i)=>(
        <rect key={i} x={132+i*10} y="140" width="5" height="150" fill="#0a0b0d" opacity="0.4"/>
      ))}
      {[...Array(14)].map((_,i)=>(
        <rect key={`l${i}`} x={137+i*10} y="140" width="1" height="150" fill="#fff" opacity="0.15"/>
      ))}
      {/* Red brand band */}
      <rect x="130" y="195" width="140" height="28" fill="url(#metalRed)"/>
      <rect x="130" y="195" width="140" height="28" fill="url(#hotspot)" opacity="0.3"/>
      <text x="200" y="214" fontFamily="Barlow, sans-serif" fontSize="14" fontWeight="800" fill="#fff" textAnchor="middle" letterSpacing="4">ample</text>
      {/* Bottom cap */}
      <rect x="120" y="290" width="160" height="18" fill="url(#metalDark)"/>
      <ellipse cx="200" cy="308" rx="80" ry="16" fill="url(#metalDark)" stroke="#0a0b0d"/>
      {/* Thread */}
      <circle cx="200" cy="120" r="20" fill="#0a0b0d"/>
      <circle cx="200" cy="120" r="18" fill="none" stroke="#3a3d44" strokeWidth="0.5"/>
    </g>
  ),
  /* ---------- New product types ---------- */
  'oil-cooler': () => (
    <g>
      {/* Stacked plate cooler — rectangular block with horizontal channels */}
      <rect x="80" y="130" width="240" height="160" fill="url(#metal)" stroke="#1a1b1e" rx="3"/>
      <rect x="80" y="130" width="240" height="160" fill="url(#hotspot)" opacity="0.5" rx="3"/>
      {[...Array(14)].map((_,i)=>(
        <rect key={i} x="92" y={138+i*11} width="216" height="6" fill="#0a0b0d" opacity="0.85"/>
      ))}
      {[...Array(14)].map((_,i)=>(
        <line key={`g${i}`} x1="92" y1={144+i*11} x2="308" y2={144+i*11} stroke="#3a3d44" strokeWidth="0.5"/>
      ))}
      {/* End plates */}
      <rect x="80" y="125" width="240" height="14" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <rect x="80" y="282" width="240" height="14" fill="url(#metalDark)" stroke="#0a0b0d"/>
      {/* Inlet/outlet ports */}
      <circle cx="110" cy="115" r="14" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="110" cy="115" r="6" fill="#0a0b0d"/>
      <circle cx="290" cy="115" r="14" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="290" cy="115" r="6" fill="#0a0b0d"/>
    </g>
  ),
  'tensioner': () => (
    <g>
      {/* Tensioner pulley + arm */}
      <path d="M 100 280 L 100 200 Q 100 170 130 170 L 200 170" fill="none" stroke="url(#metalDark)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 100 280 L 100 200 Q 100 170 130 170 L 200 170" fill="none" stroke="url(#metal)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Mount base */}
      <rect x="78" y="270" width="44" height="40" fill="url(#metalDark)" stroke="#0a0b0d" rx="3"/>
      <circle cx="100" cy="290" r="8" fill="#0a0b0d"/>
      {/* Pulley */}
      <circle cx="240" cy="170" r="62" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="240" cy="170" r="62" fill="url(#hotspot)" opacity="0.5"/>
      <circle cx="240" cy="170" r="48" fill="#0a0b0d"/>
      <circle cx="240" cy="170" r="44" fill="none" stroke="#2a2d33" strokeWidth="1"/>
      {/* Belt grooves */}
      {[40, 36, 32, 28].map((r,i)=>(
        <circle key={i} cx="240" cy="170" r={r} fill="none" stroke="#3a3d44" strokeWidth="0.6"/>
      ))}
      <circle cx="240" cy="170" r="14" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="240" cy="170" r="5" fill="#0a0b0d"/>
      {/* Spring detail on arm pivot */}
      <circle cx="100" cy="200" r="14" fill="url(#metal)" stroke="#0a0b0d"/>
      <circle cx="100" cy="200" r="4" fill="#0a0b0d"/>
    </g>
  ),
  'blower-motor': () => (
    <g>
      {/* Squirrel-cage fan */}
      <circle cx="170" cy="210" r="92" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="170" cy="210" r="92" fill="url(#hotspot)" opacity="0.5"/>
      <circle cx="170" cy="210" r="78" fill="#0a0b0d"/>
      {[...Array(28)].map((_,i)=>{
        const a = i*(360/28) * Math.PI/180;
        return <line key={i} x1={170+Math.cos(a)*45} y1={210+Math.sin(a)*45} x2={170+Math.cos(a)*76} y2={210+Math.sin(a)*76} stroke="#5a5d64" strokeWidth="2"/>;
      })}
      <circle cx="170" cy="210" r="20" fill="url(#metal)" stroke="#0a0b0d"/>
      <circle cx="170" cy="210" r="6" fill="#0a0b0d"/>
      {/* Motor housing on the side */}
      <rect x="262" y="180" width="80" height="60" fill="url(#metalDark)" stroke="#0a0b0d" rx="4"/>
      <rect x="262" y="180" width="80" height="60" fill="url(#hotspot)" opacity="0.5" rx="4"/>
      {[...Array(5)].map((_,i)=>(
        <line key={i} x1={270+i*16} y1="186" x2={270+i*16} y2="234" stroke="#0a0b0d" strokeWidth="1"/>
      ))}
      {/* Connector pigtail */}
      <rect x="332" y="200" width="30" height="20" fill="#0a0b0d" stroke="#3a3d44" rx="2"/>
    </g>
  ),
  'lighting': () => (
    <g>
      {/* Headlight assembly — projector style */}
      <rect x="60" y="140" width="280" height="140" fill="url(#metalDark)" stroke="#0a0b0d" rx="14"/>
      <rect x="68" y="148" width="264" height="124" fill="#0a0b0d" rx="10"/>
      {/* Inner reflector */}
      <ellipse cx="160" cy="210" rx="62" ry="58" fill="url(#metal)" />
      <ellipse cx="160" cy="210" rx="62" ry="58" fill="url(#hotspot)" opacity="0.7"/>
      <circle cx="160" cy="210" r="34" fill="#1a1b1e"/>
      <circle cx="160" cy="210" r="22" fill="url(#hotspot)"/>
      {/* LED strip eyebrow */}
      <rect x="80" y="160" width="240" height="10" fill="#0a0b0d" rx="2"/>
      {[...Array(28)].map((_,i)=>(
        <circle key={i} cx={88+i*8.4} cy="165" r="2.6" fill="#cfeaff" opacity="0.95"/>
      ))}
      {/* Right cluster — DRL ring */}
      <circle cx="270" cy="210" r="46" fill="none" stroke="#cfeaff" strokeWidth="3"/>
      <circle cx="270" cy="210" r="46" fill="none" stroke="rgba(180,220,255,0.4)" strokeWidth="9"/>
      <circle cx="270" cy="210" r="22" fill="url(#metalDark)"/>
      {/* Indicator amber bar */}
      <rect x="80" y="252" width="240" height="14" fill="#3a2a10" rx="2"/>
      <rect x="84" y="255" width="232" height="8" fill="#ffb24a" opacity="0.7" rx="1"/>
    </g>
  ),
  'ignition-coil': () => (
    <g>
      {/* Pencil-style coil-on-plug */}
      <rect x="170" y="100" width="60" height="50" fill="url(#metalDark)" stroke="#0a0b0d" rx="6"/>
      <rect x="170" y="100" width="60" height="50" fill="url(#hotspot)" opacity="0.5" rx="6"/>
      {/* Connector pins */}
      <rect x="184" y="92" width="32" height="14" fill="#0a0b0d" rx="2"/>
      {[0,1,2].map(i=> <rect key={i} x={188+i*10} y="84" width="4" height="10" fill="#3a3d44"/>)}
      {/* Body shaft */}
      <rect x="180" y="148" width="40" height="160" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <rect x="180" y="148" width="40" height="160" fill="url(#hotspot)" opacity="0.4"/>
      {/* Mounting bracket */}
      <path d="M 220 170 L 270 170 L 282 184 L 270 198 L 220 198 Z" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="270" cy="184" r="5" fill="#0a0b0d"/>
      {/* Boot — rubber */}
      <path d="M 178 308 Q 178 322 200 322 Q 222 322 222 308 Z" fill="#0a0b0d"/>
      <rect x="190" y="320" width="20" height="34" fill="url(#metalDark)" stroke="#0a0b0d"/>
      {/* Spark tip */}
      <rect x="194" y="354" width="12" height="8" fill="url(#metal)"/>
      <circle cx="200" cy="370" r="3" fill="#ffb24a"/>
    </g>
  ),
  'compressor': () => (
    <g>
      {/* AC compressor — clutch pulley + cylindrical body */}
      <circle cx="160" cy="210" r="92" fill="url(#metal)" stroke="#1a1b1e"/>
      <circle cx="160" cy="210" r="92" fill="url(#hotspot)" opacity="0.5"/>
      <circle cx="160" cy="210" r="74" fill="#0a0b0d"/>
      {/* Belt grooves */}
      {[68, 62, 56, 50].map((r,i)=>(
        <circle key={i} cx="160" cy="210" r={r} fill="none" stroke="#2a2d33" strokeWidth="1.2"/>
      ))}
      <circle cx="160" cy="210" r="42" fill="url(#metalDark)" stroke="#0a0b0d"/>
      {/* Clutch hub */}
      <circle cx="160" cy="210" r="22" fill="url(#metalRed)" stroke="#5a0e10"/>
      <circle cx="160" cy="210" r="6" fill="#0a0b0d"/>
      {/* Body cylinder behind */}
      <rect x="244" y="160" width="100" height="100" fill="url(#metalDark)" stroke="#0a0b0d" rx="6"/>
      <rect x="244" y="160" width="100" height="100" fill="url(#hotspot)" opacity="0.5" rx="6"/>
      {/* Service ports */}
      <rect x="252" y="146" width="22" height="20" fill="url(#metalDark)" stroke="#0a0b0d" rx="2"/>
      <rect x="290" y="146" width="22" height="20" fill="url(#metalDark)" stroke="#0a0b0d" rx="2"/>
      <text x="294" y="216" fontFamily="Barlow, sans-serif" fontSize="11" fontWeight="800" fill="#E92024" textAnchor="middle" letterSpacing="2">ample</text>
    </g>
  ),
  'exhaust': () => (
    <g>
      {/* Cat-back exhaust with muffler + tip */}
      {/* Front pipe */}
      <rect x="40" y="200" width="120" height="22" fill="url(#metalDark)" stroke="#0a0b0d" rx="11"/>
      <rect x="40" y="200" width="120" height="22" fill="url(#hotspot)" opacity="0.5" rx="11"/>
      {/* Muffler body */}
      <rect x="155" y="170" width="160" height="80" fill="url(#metal)" stroke="#1a1b1e" rx="14"/>
      <rect x="155" y="170" width="160" height="80" fill="url(#hotspot)" opacity="0.5" rx="14"/>
      {/* Banding */}
      <line x1="200" y1="170" x2="200" y2="250" stroke="#0a0b0d" strokeWidth="1"/>
      <line x1="270" y1="170" x2="270" y2="250" stroke="#0a0b0d" strokeWidth="1"/>
      {/* Tail pipe */}
      <rect x="312" y="200" width="30" height="22" fill="url(#metalDark)" stroke="#0a0b0d"/>
      {/* Tip */}
      <ellipse cx="354" cy="211" rx="14" ry="14" fill="url(#metal)" stroke="#0a0b0d"/>
      <ellipse cx="354" cy="211" rx="9" ry="9" fill="#0a0b0d"/>
      {/* Hangers */}
      <circle cx="100" cy="190" r="6" fill="#3a3d44"/>
      <circle cx="240" cy="160" r="6" fill="#3a3d44"/>
    </g>
  ),
  'gasket': () => (
    <g>
      {/* Multi-layer steel head gasket — flat shape with cylinder bores + bolt holes */}
      <rect x="60" y="160" width="280" height="120" fill="url(#metalDark)" stroke="#0a0b0d" rx="8"/>
      <rect x="60" y="160" width="280" height="120" fill="url(#hotspot)" opacity="0.5" rx="8"/>
      {/* Cylinder bores */}
      {[120, 180, 240, 300].map((cx,i)=>(
        <g key={i}>
          <circle cx={cx} cy="220" r="26" fill="#0a0b0d"/>
          <circle cx={cx} cy="220" r="26" fill="none" stroke="url(#metalRed)" strokeWidth="2.2"/>
          <circle cx={cx} cy="220" r="22" fill="none" stroke="#3a3d44" strokeWidth="0.6"/>
        </g>
      ))}
      {/* Bolt holes */}
      {[[80,178],[80,262],[340,178],[340,262],[150,178],[150,262],[210,178],[210,262],[270,178],[270,262]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="6" fill="#0a0b0d" stroke="#3a3d44"/>
      ))}
      {/* Coolant passages */}
      <rect x="80" y="200" width="20" height="8" fill="#0a0b0d" rx="2"/>
      <rect x="80" y="232" width="20" height="8" fill="#0a0b0d" rx="2"/>
      <rect x="320" y="200" width="20" height="8" fill="#0a0b0d" rx="2"/>
      <rect x="320" y="232" width="20" height="8" fill="#0a0b0d" rx="2"/>
    </g>
  ),
  'rack-pinion': () => (
    <g>
      {/* Pinion gear at top, rack bar across */}
      <rect x="40" y="230" width="320" height="22" fill="url(#metal)" stroke="#1a1b1e" rx="2"/>
      <rect x="40" y="230" width="320" height="22" fill="url(#hotspot)" opacity="0.5"/>
      {/* Rack teeth */}
      {[...Array(34)].map((_,i)=>(
        <rect key={i} x={50+i*9} y="222" width="5" height="9" fill="url(#metalDark)" stroke="#0a0b0d" strokeWidth="0.4"/>
      ))}
      {/* Pinion gear */}
      <g transform="translate(200 200)">
        {[...Array(14)].map((_,i)=>{
          const a = i*(360/14);
          return <rect key={i} x="-3" y="-32" width="6" height="10" fill="url(#metalDark)" stroke="#0a0b0d" strokeWidth="0.4" transform={`rotate(${a})`}/>;
        })}
        <circle r="22" fill="url(#metal)" stroke="#0a0b0d"/>
        <circle r="6" fill="#0a0b0d"/>
      </g>
      {/* Tie-rod ends */}
      <circle cx="40" cy="241" r="20" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="40" cy="241" r="6" fill="#0a0b0d"/>
      <circle cx="360" cy="241" r="20" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="360" cy="241" r="6" fill="#0a0b0d"/>
      {/* Bellows boots */}
      {[80, 320].map((x,i)=>(
        <g key={i}>
          {[...Array(5)].map((_,j)=>(
            <ellipse key={j} cx={x+ (i===0?j*8:-j*8)} cy="241" rx="6" ry="14" fill="#0a0b0d" stroke="#3a3d44" strokeWidth="0.5"/>
          ))}
        </g>
      ))}
    </g>
  ),
  'wiper-motor': () => (
    <g>
      {/* Wiper linkage with motor on one side */}
      {/* Motor housing */}
      <ellipse cx="110" cy="200" rx="60" ry="52" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <ellipse cx="110" cy="200" rx="60" ry="52" fill="url(#hotspot)" opacity="0.5"/>
      <circle cx="110" cy="200" r="22" fill="url(#metal)" stroke="#0a0b0d"/>
      <circle cx="110" cy="200" r="6" fill="#0a0b0d"/>
      {/* Connector */}
      <rect x="60" y="190" width="22" height="20" fill="#0a0b0d" stroke="#3a3d44" rx="2"/>
      {/* Crank arm + linkage rod */}
      <line x1="110" y1="200" x2="170" y2="170" stroke="url(#metalDark)" strokeWidth="10" strokeLinecap="round"/>
      <line x1="170" y1="170" x2="320" y2="180" stroke="url(#metal)" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="170" cy="170" r="7" fill="#0a0b0d"/>
      {/* Pivot pucks */}
      <circle cx="320" cy="180" r="22" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="320" cy="180" r="8" fill="#0a0b0d"/>
      {/* Second arm + pivot */}
      <line x1="320" y1="180" x2="240" y2="280" stroke="url(#metalDark)" strokeWidth="8" strokeLinecap="round"/>
      <circle cx="240" cy="280" r="22" fill="url(#metalDark)" stroke="#0a0b0d"/>
      <circle cx="240" cy="280" r="8" fill="#0a0b0d"/>
      {/* Mount tabs */}
      <rect x="100" y="148" width="22" height="14" fill="url(#metalDark)" stroke="#0a0b0d" rx="2"/>
    </g>
  ),
};

/* ProductCardMedia
   ─────────────────
   Renders a product card's image area with this priority:
     1. `override` — explicit path set via the Tweaks panel (catalogCardImages).
     2. Convention — `assets/<slug>.png`, then `assets/<slug>.jpg`.
     3. Fallback — stylized ProductHero illustration.

   `fit` controls object-fit (contain = whole image visible, cover = fills card).
*/
function ProductCardMedia({ slug, heroAsset, fit = 'contain', size = 240, override, padding = 16, scale = 1 }) {
  const conventionalExts = ['png', 'jpg'];
  const [extIdx, setExtIdx] = React.useState(0);
  const [conventionFailed, setConventionFailed] = React.useState(false);

  // Reset the probe whenever the slug or override changes.
  const probeKey = slug + '|' + (override || '');
  React.useEffect(() => {
    setExtIdx(0);
    setConventionFailed(false);
  }, [probeKey]);

  // `scale` zooms the visible image inside the card frame without changing
  // the frame size. Useful for tightening up product shots that ship with
  // a lot of transparent margin baked in. Clamped to a safe range so a
  // misconfigured tweak can't blow the image past the card chrome.
  const safeScale = Math.max(0.5, Math.min(2, Number(scale) || 1));
  const imgStyle = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: fit, objectPosition: 'center', zIndex: 1, display: 'block',
    transform: safeScale !== 1 ? `scale(${safeScale})` : undefined,
    transformOrigin: 'center',
  };
  const overlay = fit === 'cover' && (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to bottom, transparent 60%, rgba(11,11,13,0.5) 100%)',
      zIndex: 2, pointerEvents: 'none',
    }} />
  );

  if (override) {
    return (<><img src={override} alt="" loading="lazy" decoding="async" style={imgStyle} />{overlay}</>);
  }

  if (conventionFailed) {
    return (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1,
        transform: safeScale !== 1 ? `scale(${safeScale})` : undefined,
        transformOrigin: 'center',
      }}>
        <ProductHero type={heroAsset} size={size} />
      </div>);
  }

  return (<>
    <img
      key={extIdx}
      src={`assets/${slug}.${conventionalExts[extIdx]}`}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => {
        if (extIdx + 1 >= conventionalExts.length) setConventionFailed(true);
        else setExtIdx(extIdx + 1);
      }}
      style={imgStyle}
    />
    {overlay}
  </>);
}

Object.assign(window, { ProductHero, ProductCardMedia });
