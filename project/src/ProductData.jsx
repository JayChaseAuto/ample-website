/* Ample — Product data.
   Voice: driver-focused. Lead with the experience (the pedal feel, the
   first crank, the cabin temperature in traffic), then back it with what
   the part does. No spec sheets — those live on the product card on
   request. Engineering summary stays as a short bullet list.

   Fields per product:
     slug, category, eyebrow, title, title2
     goldStandard       (badge in catalog + detail page)
     summary            (1-2 sentence pitch, driver tone)
     heroAsset          (legacy enum — still used by tweak select option)
     callouts           (deprecated, kept as [] for compatibility)
     features           (optional — feature cards under hero)
     bullets            (engineering summary, full-width list)
*/

const PRODUCTS = {
  'brake-pads': {
    slug: 'brake-pads',
    category: 'Braking',
    title: 'Ceramic Composite',
    title2: 'Brake Pads.',
    eyebrow: 'Braking · Confidence',
    goldStandard: true,
    summary: 'Brake pads that bite the same way every time. Cold morning commute, third lap of a canyon road, traffic on the way home. The pedal feels the same.',
    heroAsset: 'brake-pads',
    callouts: [],
    features: [
      { icon: 'activity', title: 'Linear bite', body: 'Even pressure from the first millimeter of pedal travel. No soft entry, no late grab.' },
      { icon: 'wind', title: 'Wheels stay clean', body: 'Low-dust ceramic compound. The car looks the same after a week as it does after a wash.' },
      { icon: 'thermometer-sun', title: 'Heat doesn’t change it', body: 'The pedal feels the same on lap one and lap eight. No fade, no glaze.' },
    ],
    bullets: [
      'Linear bite from the first millimeter of pedal travel.',
      'Low-dust ceramic compound. Wheels stay clean between washes.',
      'Quiet at the curb. No squeal at low speed, no chatter on cold mornings.',
      'Holds shape past 800 °C. Track day or stop-and-go, the pedal feels the same.',
      'Drop-in fitment. Shim, chamfer, and bedding done at the factory.',
      'ABE + ECE R90 certified. Inspection and insurance happy.',
    ],
  },

  'calipers': {
    slug: 'calipers',
    category: 'Braking',
    title: 'Performance Caliper',
    title2: '& Rotor.',
    eyebrow: 'Braking · The Bite',
    goldStandard: true,
    summary: 'The first inch of pedal travel decides the corner. Six pistons, a forged monobloc body, and a floating rotor that holds shape lap after lap. The pedal feels the same on lap one and lap eight.',
    heroAsset: 'caliper',
    callouts: [],
    features: [
      { icon: 'disc-3', title: 'The first bite', body: 'Even pressure across all six pistons. The pedal answers before the wheel does.' },
      { icon: 'thermometer-sun', title: 'Heat that stays put', body: 'Floating rotor, cross-drilled vents. The third lap feels like the first.' },
      { icon: 'shield', title: 'Drop-in confidence', body: 'Stainless braided lines included. Bracket list covers most chassis. No hose mods.' },
    ],
    bullets: [
      'Even bite across all six pistons. No soft entry, no surprise mid-corner.',
      'Forged 7075-T6 monobloc body. 40% stiffer than stock under load.',
      'Floating 330 × 30 mm rotor. Survives heat cycling without warping.',
      'Stainless braided lines included. Pedal feel that doesn’t swell when it’s hot.',
      'Drop-in fitment with the bracket list. No hose mods, no bracket mods.',
      'Ceramic pad compound bedded at the factory. Ready out of the box.',
    ],
    intro: 'Our six-piston performance caliper is built for the corner you have not taken yet. Forged 7075-T6 monobloc body, floating 330 × 30 mm rotor, stainless braided lines. Bedded ceramic pads in the box and a bracket list that covers most chassis. Engineered above stock spec and verified on the dyno before it ships.',
    numberedFeatures: [
      { title: 'Six Pistons',     body: 'Even pressure across all six pistons. The pedal answers before the wheel does.' },
      { title: 'Forged Monobloc', body: 'Forged 7075-T6 body. 40% stiffer than stock under load.' },
      { title: 'Floating Rotor',  body: '330 × 30 mm floating rotor. Survives heat cycling without warping.' },
      { title: 'Braided Lines',   body: 'Stainless braided lines included. Pedal feel that does not swell when it is hot.' },
    ],
    closing: 'Bedded ceramic pad compound in the box. Bracket list covers most chassis. Drop-in fitment with no hose mods and no bracket mods, so the third lap feels like the first.',
    benefitsTitle: 'Engineered Above Stock',
    benefits: [
      { icon: 'activity',         body: 'Linear bite from the first millimeter of pedal travel.' },
      { icon: 'thermometer-sun',  body: 'Third lap feels like the first. No fade, no glaze.' },
      { icon: 'shield',           body: 'Drop-in fitment with the bracket list, no hose mods.' },
      { icon: 'sparkles',         body: 'Low-dust ceramic compound. Wheels stay clean between washes.' },
    ],
    outro: 'ABE + ECE R90 certified. Inspection and insurance friendly. Verified on our high-inertia friction dyno before it ships, the same QC program that backs every Gold Standard SKU.',
  },

  'radiators': {
    slug: 'radiators',
    category: 'Cooling',
    title: 'Core Radiator',
    title2: 'Assembly.',
    eyebrow: 'Cooling · Headroom',
    goldStandard: true,
    summary: 'The radiator never gets the credit. Until the day it earns it. Sit in 90 °F traffic with a track day in the calendar, and you’ll know exactly which one’s in the bay.',
    heroAsset: 'radiator',
    callouts: [],
    features: [
      { icon: 'layout-grid', title: 'More headroom', body: 'Holds 32% more coolant than stock. Slower to heat, faster to recover.' },
      { icon: 'anchor', title: 'Drop-in', body: 'No bracketry, no core-support cuts. Silicone hoses come in the box.' },
    ],
    bullets: [
      'Holds 32% more coolant than stock. Slower to heat, faster to recover.',
      'Bar-and-plate dual-pass core. TIG-welded end tanks, no plastic to crack.',
      '−18 °C sustained delta under track load.',
      'Drop-in fitment. No bracketry, no core-support cuts.',
      'Silicone hoses included. One box, one weekend, full system.',
    ],
  },

  'alternator': {
    slug: 'alternator',
    category: 'Electrical',
    title: 'High-Output',
    title2: 'Alternator.',
    eyebrow: 'Electrical · Charge',
    goldStandard: false,
    summary: 'Headlights that don’t dim at idle. Heated seats, defroster, fan, sound system. All on at the same time, and the battery still gains. Built to keep up with a fully-loaded car.',
    heroAsset: 'starter',
    callouts: [],
    features: [
      { icon: 'zap', title: 'Output at idle', body: 'Full charge at 800 rpm. The battery gains in traffic, not just on the highway.' },
      { icon: 'shield', title: 'Brushes that last', body: 'Hardened slip rings and brushes. Twice the service interval of the part it replaces.' },
    ],
    bullets: [
      'High output at idle. Battery still gains with every accessory on.',
      'Internal regulator. Clean voltage curve, no over-charge under heavy load.',
      'Hardened slip rings and brushes. 200,000 km service interval.',
      'Sealed bearings. Quiet at any rpm, no whine into the cabin.',
      'OEM bracket and connector. Drop-in for the part it replaces.',
    ],
  },
};

/* ----------------------------------------------------------------------------
   Bulk catalog additions.
   Each entry passes its own summary + bullets so the copy stays driver-first
   instead of falling back to the generic boilerplate.
---------------------------------------------------------------------------- */

function makeProduct({ slug, category, eyebrow, title, title2, summary, heroAsset, bullets, features, ...rest }) {
  return {
    slug, category, eyebrow: eyebrow || category,
    title, title2: title2 || '',
    goldStandard: false,
    summary: summary || `${title} ${title2 || ''}. Reach out for fitment, batch availability and pricing.`.trim(),
    heroAsset,
    callouts: [],
    features: features || [],
    bullets: bullets || [
      'Drop-in fitment. No mods, no re-flash, no fuss.',
      'OEM+ tolerance. Built to outlast the part it replaces.',
      'Catalogued under our quality program. Full traceability.',
      'Engineered, sourced and verified by the ample team.',
    ],
    // Optional richer-layout fields (intro, numberedFeatures, closing,
    // benefitsTitle, benefits, outro) are passed through verbatim so a
    // product detail page can opt into the callout/benefits redesign.
    ...rest,
  };
}

const NEW_PRODUCTS = [
  makeProduct({
    slug: 'wiper-linkage',
    category: 'Wipers', eyebrow: 'Wipers · The Sync',
    title: 'Wiper Linkage', title2: 'Assembly.',
    heroAsset: 'wiper-motor',
    summary: 'Sloppy wipers waste a downpour. The linkage keeps both arms moving in step. When it dies, the passenger side drags or stops mid-stroke. This one drops in.',
    bullets: [
      'Restored sync. Both arms hit the same point at the same time.',
      'OEM bracket compatible. No drilling, no body work.',
      'New bushings and bearings. Eliminates the rattle at speed.',
      'Quiet at the bottom of the stroke. No groan into the cabin.',
    ],
  }),
  makeProduct({
    slug: 'wiper-motor',
    category: 'Wipers', eyebrow: 'Wipers · Park & Forget',
    title: 'Wiper', title2: 'Motor.',
    heroAsset: 'wiper-motor',
    summary: 'Wipers should sweep, park, and shut up. Two speeds, dependable park position, OEM mount. The kind of part you forget about, which is the point.',
    bullets: [
      'Two-speed motor with reliable park position.',
      '12 V drop-in. Same connector, same mount, same harness.',
      'Sealed against the spray it lives under.',
      'Quiet at low speed. No motor whine through the firewall.',
    ],
  }),
  makeProduct({
    slug: 'oil-cooler',
    category: 'Cooling', eyebrow: 'Cooling · Hot Oil',
    title: 'Oil', title2: 'Cooler.',
    heroAsset: 'oil-cooler',
    summary: 'Oil that’s hotter than it should be is oil that’s already breaking down. Stacked-plate, thermostatic. Sips heat off the oil only when it has to.',
    bullets: [
      'Stacked-plate design. High surface area, low pressure drop.',
      'Thermostatic bypass. Full flow until oil is hot, no drag at warmup.',
      'Aluminium throughout. No plastic, no rubber bypass to fail.',
      'Standard −10 AN connections, mounting hardware in the box.',
    ],
  }),
  makeProduct({
    slug: 'tensioner',
    category: 'Engine', eyebrow: 'Engine · No Squeal',
    title: 'Belt', title2: 'Tensioner.',
    heroAsset: 'tensioner',
    summary: 'Every belt squeal you’ve ever heard came from a tensioner that gave up. This one keeps the belt where the belt should be. Quietly, for the next 100,000 km.',
    bullets: [
      'Spring-loaded with internal damper. No chatter, no stretch.',
      'OEM-spec mounting bolts and pulleys.',
      'Sealed bearing. No service interval, no grease points.',
      'Auxiliary belt pulley included.',
    ],
  }),
  makeProduct({
    slug: 'starter',
    category: 'Electrical', eyebrow: 'Electrical · Cranks',
    title: 'Starter', title2: 'Motor.',
    heroAsset: 'starter',
    summary: 'The straightforward version. Same gear-reduction architecture, OEM-spec mount, 2.4 kW peak. For cars that don’t need rare-earth-and-titanium and just need to start tomorrow.',
    bullets: [
      'Gear-reduction starter, 1.8 to 2.4 kW peak.',
      'OEM-spec mounting and electrical interface.',
      'Heat-shielded solenoid. Survives headers-close installs.',
      'Two-year replacement warranty.',
    ],
  }),
  makeProduct({
    slug: 'water-pump-awn',
    category: 'Cooling', eyebrow: 'Cooling · Replacement',
    title: 'Water', title2: 'Pump.',
    heroAsset: 'water-pump',
    summary: 'OEM housing, forged impeller, factory-spec output. The straightforward replacement when the original goes plastic.',
    bullets: [
      'Forged impeller. Survives high rpm without cavitation.',
      'OEM housing footprint. No hose changes.',
      'Mechanical seal, lifetime-rated.',
      'Gasket and bolts included.',
    ],
  }),
  makeProduct({
    slug: 'blower-motor',
    category: 'HVAC', eyebrow: 'HVAC · Cabin Air',
    title: 'Blower', title2: 'Motor.',
    heroAsset: 'blower-motor',
    summary: 'A cabin fan that doesn’t surrender at speed three. Multi-speed, OEM mount, sealed bearing. The part you don’t think about until it stops, and then you can’t think about anything else.',
    bullets: [
      'Multi-speed cabin blower. Full range without intermittent drop-out.',
      'Sealed bearings. Quiet at every speed.',
      'OEM cage and mount. Drop-in fitment.',
      '12 V universal connector.',
    ],
  }),
  makeProduct({
    slug: 'lighting',
    category: 'Lighting', eyebrow: 'Lighting · Cleaner Beam',
    title: 'LED', title2: 'Lighting.',
    heroAsset: 'lighting',
    summary: 'Wider beam, sharper cutoff, less glare for the car coming the other way. The road looks the way the engineers meant it to look.',
    bullets: [
      'Wider beam pattern, sharper cutoff. Better light, fewer flashes.',
      'DRL + indicator built in. One housing, full function.',
      'Dust- and water-sealed. Lasts the life of the car.',
      'Plug-and-play harness. No CAN-bus error codes, no resistor packs.',
    ],
  }),
  makeProduct({
    slug: 'ignition-coil',
    category: 'Engine', eyebrow: 'Engine · Hotter Spark',
    title: 'Ignition', title2: 'Coil.',
    heroAsset: 'ignition-coil',
    summary: 'Misfires hide for thousands of kilometres. Until they don’t. Coil-on-plug spark, hotter and more consistent than the part you’re replacing.',
    bullets: [
      'Hotter spark across the rev range. Cleaner idle, fewer misfires.',
      'Coil-on-plug pencil style. Direct mount on the plug.',
      'Sealed against heat and moisture.',
      'OEM electrical interface. No harness mods.',
    ],
  }),
  makeProduct({
    slug: 'caliper-npc',
    category: 'Braking', eyebrow: 'Braking · OE Spec',
    title: 'Brake', title2: 'Caliper.',
    heroAsset: 'caliper',
    summary: 'Brand-new single-piston caliper with fresh seals, new boot, new pins, and a corrosion-resistant finish. Drop-in fit for the part it replaces, no bracket mods.',
    bullets: [
      'Brand-new OEM-spec caliper. Single-piston floating design.',
      'New seals, new boot, slide pins greased.',
      'Cadmium-plated finish. Won’t rust through.',
      'OEM bracket compatible. No bracket mods.',
    ],
    intro: 'Our brand-new brake calipers offer a very high degree of corrosion resistance, verified through salt-spray and cyclic corrosion testing. New pistons, fresh slide pins, new seals and a pre-fitted bleeder mean an easier, quicker, safer install and no core return. Built to match OE standards and subject to rigorous QC testing for the life of the vehicle.',
    numberedFeatures: [
      { title: 'Bleeder Valve',    body: 'Pre-fitted bleeder valve ensures proper hydraulic pressure and clean flushing during service.' },
      { title: 'Premium Grease',   body: 'High quality grease on the slider pins prevents premature jams and binding.' },
      { title: 'Double Ribbed',    body: 'Double-ribbed seal carrier on the slider bushings for longer service life.' },
      { title: 'Hardware Included',body: 'Banjo bolts, copper washers, slide pins and boots in the box where applicable.' },
    ],
    closing: 'Designed with high-quality materials and treated with a water-based protective coating to prevent rust and corrosion. Developed in response to stricter environmental standards, this coating is used worldwide on over 40 million brake components every year.',
    benefitsTitle: 'The Benefits of Our Coating',
    benefits: [
      { icon: 'car',             body: 'Prevents rust, ultimately making your vehicle look better' },
      { icon: 'activity',        body: 'Unaltered braking performance equal to or better than the original' },
      { icon: 'thermometer-sun', body: 'High-temperature resistance through repeated heat cycles' },
      { icon: 'leaf',            body: 'Environmentally conscious, water-based, no chromium' },
    ],
    outro: 'It is not greasy, forms a very thin layer, and does not compromise braking performance. The coating withstands temperatures up to 400 °C (750 °F), maintaining its protective qualities through heat cycling without crystallization or organic resin buildup. Applied in a closed system that recycles leftover liquids, making it a sustainable choice for high-performance brake calipers.',
  }),
  makeProduct({
    slug: 'compressor',
    category: 'HVAC', eyebrow: 'HVAC · Cabin Cool',
    title: 'A/C', title2: 'Compressor.',
    heroAsset: 'compressor',
    summary: 'Cabin cool depends on a compressor that doesn’t bite into the engine when it kicks in. Six-cylinder swash-plate, low cycling, no surge.',
    bullets: [
      '6-cylinder swash-plate. Smooth engagement, no clutch shock.',
      'R134a refrigerant compatible.',
      'Sealed magnetic clutch. Quiet at idle.',
      'OEM bracket and connector.',
    ],
  }),
  makeProduct({
    slug: 'exhaust',
    category: 'Engine', eyebrow: 'Engine · The Sound',
    title: 'Exhaust', title2: 'System.',
    heroAsset: 'exhaust',
    summary: 'Cat-back stainless. Better breathing, fewer drone notes, no rattles. The kind of upgrade you hear when you accelerate, not when you idle in your driveway.',
    bullets: [
      'Stainless 304 throughout. Won’t rust through Northern winters.',
      'Mandrel-bent. No flow restriction at the bends.',
      'Resonator tuned to kill cabin drone in the 1,800 to 2,400 rpm band.',
      'OEM hangers and flanges. Bolts up to stock mounting points.',
    ],
  }),
  makeProduct({
    slug: 'gasket',
    category: 'Engine', eyebrow: 'Engine · The Seal',
    title: 'Gaskets', title2: '',
    heroAsset: 'gasket',
    summary: 'The gasket is the one part you don’t get to inspect after install. Multi-layer steel with embossed sealing beads. Same seal at lap one and 100,000 km later.',
    bullets: [
      'Multi-layer steel construction. Embossed beads at every seal point.',
      'OEM bore and bolt pattern.',
      'Pre-coated for one-shot install.',
      'Survives heat cycling without backing off.',
    ],
  }),
  makeProduct({
    slug: 'abs-sensor',
    category: 'Braking', eyebrow: 'Braking · ABS',
    title: 'ABS', title2: 'Sensor.',
    heroAsset: 'sensor',
    summary: 'ABS that flickers on a wet morning is ABS you can’t trust on a wet afternoon. Hall-effect, OE connector, calibrated to read clean across the speed range.',
    bullets: [
      'Hall-effect. No resistive drift over time.',
      'OEM electrical interface. No harness mods.',
      'Sealed against road salt and brake dust.',
      'Two-year replacement warranty.',
    ],
  }),
  makeProduct({
    slug: 'pad-sensor',
    category: 'Braking', eyebrow: 'Braking · Wear',
    title: 'Brake Pad', title2: 'Wear Sensor.',
    heroAsset: 'sensor',
    summary: 'The dashboard light that says you’re at 2 mm. Loop-break circuit. No false alarms, no missed warnings.',
    bullets: [
      'Loop-break circuit. Fails open, lights the dash.',
      'Front-axle universal.',
      'OEM connector. No harness mods.',
      'Two per pack for typical fitments.',
    ],
  }),
  makeProduct({
    slug: 'power-steering-pump',
    category: 'Steering', eyebrow: 'Steering · Hydraulic',
    title: 'Power Steering', title2: 'Pump.',
    heroAsset: 'water-pump',
    summary: 'A hydraulic power-steering pump that doesn’t whine in a parking lot. Vane-type, sealed bearing, OEM-pressure spec.',
    bullets: [
      'Vane pump. Quiet at low rpm, full pressure at idle.',
      'OEM-pressure spec. No over-assist, no over-feel.',
      'Sealed bearing. No fluid leak, no service interval.',
      'Pulley pre-fitted; bracket included.',
    ],
  }),
  makeProduct({
    slug: 'radiator-urk',
    category: 'Cooling', eyebrow: 'Cooling · Replacement',
    title: 'Cooling', title2: 'Radiator.',
    heroAsset: 'radiator',
    summary: 'OEM-replacement aluminium core. Plastic tanks, factory-pressure tested, drop-in fitment for the day the original lets go.',
    bullets: [
      'Aluminium core. Better heat transfer than copper-brass.',
      'Plastic tank to OEM dimensions. No bracket changes.',
      'Pressure tested at 2 bar before shipping.',
      'Hose adapters included.',
    ],
  }),
  makeProduct({
    slug: 'condenser',
    category: 'HVAC', eyebrow: 'HVAC · Heat Out',
    title: 'A/C', title2: 'Condenser.',
    heroAsset: 'radiator',
    summary: 'Cabin cool depends on the condenser dumping heat to the road. Parallel-flow, dual-refrigerant compatible, drop-in fitment.',
    bullets: [
      'Parallel-flow design. 30% better heat rejection than serpentine.',
      'Compatible with both R134a and R1234yf.',
      'OEM mounting brackets included.',
      'Pre-charged with desiccant.',
    ],
  }),
  makeProduct({
    slug: 'heater-core',
    category: 'HVAC', eyebrow: 'HVAC · Cabin Heat',
    title: 'Heater', title2: 'Core.',
    heroAsset: 'radiator',
    summary: 'Brass-tube heater core. The boring part that decides whether you scrape ice off the inside or the outside of the windshield.',
    bullets: [
      'Brass-tube core. Won’t crack like aluminium under heat cycling.',
      'OEM dimensions. Drop-in fitment.',
      'Pressure-tested for leaks before shipping.',
      'Hose nipples sized for OEM clamps.',
    ],
  }),
  makeProduct({
    slug: 'rack-pinion',
    category: 'Steering', eyebrow: 'Steering · OE Spec',
    title: 'Rack', title2: '& Pinion.',
    heroAsset: 'rack-pinion',
    summary: 'Brand-new rack with fresh bushings and seals. OEM geometry. The steering feel you remember from when the car was new.',
    bullets: [
      'Brand-new OEM-spec unit. OE-geometry preserved.',
      'New bushings and seals throughout.',
      'Bench-tested before shipping.',
      'OEM mounting points and tie-rod fitment.',
    ],
  }),
  makeProduct({
    slug: 'air-filter',
    category: 'Service', eyebrow: 'Service · Air',
    title: 'Air', title2: 'Filter.',
    heroAsset: 'filter',
    summary: 'Drop-in pleated synthetic. Lower pressure drop than paper, longer service interval. The simple side of the filter catalog.',
    bullets: [
      'Pleated synthetic media. Lower pressure drop than paper.',
      'OEM housing fitment. No airbox mods.',
      'Service interval doubled vs. paper.',
      '98% capture at 10 micron.',
    ],
  }),
  makeProduct({
    slug: 'cabin-filter',
    category: 'Service', eyebrow: 'Service · Cabin Air',
    title: 'Cabin', title2: 'Filter.',
    heroAsset: 'filter',
    summary: 'Activated carbon + HEPA-grade media. Pollen, diesel particulate, smoke. The air in your cabin shouldn’t be the air outside.',
    bullets: [
      'Activated carbon layer. Pulls volatile compounds and odor.',
      'HEPA-grade pleat. Captures pollen and diesel particulate.',
      'OEM housing fit.',
      'Service interval: 15,000 km.',
    ],
  }),
];

NEW_PRODUCTS.forEach(p => { PRODUCTS[p.slug] = p; });

const PRODUCT_ORDER = [
  // 'calipers' intentionally omitted — kept in PRODUCTS so a direct URL
  // (#/product/calipers) still renders, but hidden from catalog + featured.
  'brake-pads', 'caliper-npc', 'abs-sensor', 'pad-sensor',
  'radiators', 'radiator-urk', 'water-pump-awn', 'oil-cooler',
  'compressor', 'condenser', 'heater-core', 'blower-motor',
  'alternator', 'starter', 'ignition-coil', 'lighting',
  'wiper-motor', 'wiper-linkage',
  'tensioner', 'exhaust', 'gasket',
  'power-steering-pump', 'rack-pinion',
  'air-filter', 'cabin-filter',
];

Object.assign(window, { PRODUCTS, PRODUCT_ORDER });
