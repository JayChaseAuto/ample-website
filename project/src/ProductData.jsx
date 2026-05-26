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
    /* Rich callout layout (same shape as caliper-npc). Numbered features
       and benefits are the user-facing "why" panel; intro/closing/outro
       wrap the centered product shot with paragraph context. */
    intro: 'Premium ceramic brake pads built with Dupont components and produced on automatic hot-press lines. They meet or exceed OE friction specs and ship installation-ready with hardware in the box. Multi-layer nitrile rubber shims and edge chamfering keep noise and vibration off the pedal.',
    numberedFeatures: [
      { title: 'OE Fit & Quality', body: 'Meets or exceeds OE specs. Hardware in the box, install-ready out of the carton.' },
      { title: 'Chamfered',        body: 'Edge-chamfered for less noise and even pad wear from the first stop.' },
      { title: 'Slotted',          body: '100% slotted compound for NVH control. Quiet at the curb, predictable in the corner.' },
      { title: 'Ceramic Formula',  body: 'Ceramic friction layer for extended pad life and low brake dust.' },
    ],
    closing: 'From the morning commute to the canyon road, the bite stays linear and the pedal stays consistent. Drop-in fitment with shim, chamfer and bedding done at the factory means the install takes minutes, not an afternoon.',
    benefitsTitle: 'Engineered Above Stock',
    benefits: [
      { icon: 'activity',         body: 'Linear bite from the first millimeter of pedal travel.' },
      { icon: 'sparkles',         body: 'Low-dust compound. Wheels stay clean between washes.' },
      { icon: 'thermometer-sun',  body: 'Holds shape past 800 °C. No fade, no glaze, no surprises.' },
      { icon: 'shield',           body: 'ABE + ECE R90 certified. Inspection and insurance friendly.' },
    ],
    outro: 'Verified through repeated bedding cycles against OE friction curves, then salt-spray and cyclic corrosion tested batch by batch — the same QC program that backs every Gold Standard SKU in the range.',
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
    intro: 'Our core radiator holds more coolant than stock, sheds heat faster under sustained load, and uses bar-and-plate construction that survives the heat cycles that crack plastic-tank designs. TIG-welded aluminium end tanks, dual-pass core, drop-in to the original mounts.',
    numberedFeatures: [
      { title: 'Larger Core Volume', body: '32% more coolant capacity than the stock unit. Slower to heat, faster to recover after sustained load.' },
      { title: 'Bar-and-Plate Core', body: 'Dual-pass bar-and-plate construction. More surface area, lower flow restriction across the rpm range.' },
      { title: 'TIG-Welded Tanks',   body: 'Aluminium end tanks, TIG-welded throughout. No plastic to fatigue, no crimp seal to leak after heat cycles.' },
      { title: 'Drop-In Fitment',    body: 'OEM mount points and hose nipples. Silicone hoses in the box. No bracketry changes, no core-support cuts.' },
    ],
    closing: 'Plastic-tank radiators fail the same way every summer. The crimp at the tank opens up, coolant drips down the front of the engine, and the temp gauge climbs in traffic. This one is built so the crimp is not there to fail.',
    benefitsTitle: 'Built for the Long Climb',
    benefits: [
      { icon: 'thermometer-sun', body: 'Sustained delta-T under track load. No heat-soak fade.' },
      { icon: 'shield',          body: 'All-aluminium construction. No plastic tank to crack.' },
      { icon: 'activity',        body: 'Lower restriction. Pump flows easier, idle temps drop.' },
      { icon: 'sparkles',        body: 'Silicone hoses included. One box, full system, one weekend.' },
    ],
    outro: 'Each radiator is pressure-tested at 2 bar and dye-checked at every weld before shipping. Built on the line that supplies our OE cooling program, the same QC standard that backs every Gold Standard SKU in the range.',
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
    intro: 'Our high-output alternator delivers full charge at idle, holds rated voltage across the rpm band, and shrugs off the thermal cycles that ruin cheaper rebuilds. Hardened slip rings, sealed bearings, copper-rich windings, all built to a tighter spec than the rebuild it replaces.',
    numberedFeatures: [
      { title: 'High Idle Output',    body: 'Full rated current at 800 rpm. Heated seats, defroster, fans, audio all on, battery still gains.' },
      { title: 'Internal Regulator',  body: 'Tight voltage envelope across temperature and rpm. No overcharge, no field flutter on long highway pulls.' },
      { title: 'Hardened Slip Rings', body: 'Forged slip rings on the rotor. Brush wear pattern stays even, service interval extends well past stock.' },
      { title: 'OEM Interface',       body: 'Same bracket, same connector, same belt path. No harness mods, no pulley swap, no reflash.' },
    ],
    closing: 'Cheap rebuilds fail in two ways. Both end with a no-start morning and a tow. The bearing dies around the first major service and the brushes go flat not long after. This one is built so that morning does not happen.',
    benefitsTitle: 'Built for Long Hauls',
    benefits: [
      { icon: 'zap',             body: 'Full charge at idle. Battery gains in traffic, not just on the highway.' },
      { icon: 'thermometer-sun', body: 'Tolerates heat soak under the hood without voltage drift.' },
      { icon: 'shield',          body: 'Sealed bearings, lifetime-rated. No grease point, no service interval.' },
      { icon: 'activity',        body: 'Clean voltage curve. No flicker at the lights, no whine in the radio.' },
    ],
    outro: 'Each alternator is dyno-tested for output across the rpm range and thermal-shock validated batch by batch. Built on the line that supplies our OE contracts, the same QC program that backs every Gold Standard SKU in the range.',
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
    /* Wiper-linkage stays simple — not in PRODUCT_ORDER, no rich layout needed. */
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
    intro: 'Our wiper motor sweeps both arms in step, parks them at the correct position every time, and stays quiet against the bottom of the stroke. Two-speed drive, sealed against the spray it lives under, OEM bracket and connector.',
    numberedFeatures: [
      { title: 'Two-Speed Drive',   body: 'Reliable low and high speed selection with a defined park position. No missing speeds, no failure to park.' },
      { title: 'Sealed Housing',    body: 'Sealed against the water that pools in the cowl. Lifetime-rated against the spray it lives under.' },
      { title: 'OEM Mount',         body: 'Same bracket bolts, same linkage pickup, same harness. No bracket modifications, no linkage refit.' },
      { title: 'Quiet at Park',     body: 'Engineered for low-noise park engagement. No groan at the bottom of the stroke, no thump into the cowl.' },
    ],
    closing: 'When the wiper motor fails, it fails at the worst possible moment. A heavy rain, a stop in traffic, blades freeze mid-sweep with the windshield half cleared. This one is built so that moment does not arrive.',
    benefitsTitle: 'Built for the Downpour',
    benefits: [
      { icon: 'wind',     body: 'Two-speed sweep with reliable park position.' },
      { icon: 'shield',   body: 'Sealed against water and freeze cycles.' },
      { icon: 'activity', body: 'Quiet at park. No groan into the cowl.' },
      { icon: 'sparkles', body: 'OE bracket, connector and mount.' },
    ],
    outro: 'Each motor is bench-tested for park reliability and current draw across the temperature range. Built on the line that supplies our OE wiper program, the same QC standard that backs every wiper SKU in the ample range.',
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
    intro: 'Our stacked-plate oil cooler keeps engine oil out of the temperature range where it stops being lubricant and starts being solvent. Thermostatic bypass holds full flow until oil is up to temperature, then opens to dump heat. No restriction at warmup, full cooling under load.',
    numberedFeatures: [
      { title: 'Stacked-Plate Core',   body: 'High surface area, low pressure drop. More cooling capacity per cubic inch than a tube-and-fin design.' },
      { title: 'Thermostatic Bypass',  body: 'Full flow bypass until oil hits operating temperature. Zero drag at warmup, full cooling once the thermostat opens.' },
      { title: 'All Aluminium',        body: 'No plastic bypass valve to crack, no rubber to fail under heat. Aluminium plate stack throughout.' },
      { title: 'Standard Fittings',    body: 'Standard −10 AN inlet and outlet. Mounting hardware and adapter to OE filter sandwich plate included.' },
    ],
    closing: 'Oil hotter than 130 °C breaks down faster than the service interval can keep up with. Bearings wear, varnish builds, the next teardown costs a short block. This cooler keeps oil below the threshold where any of that starts.',
    benefitsTitle: 'Built for the Heat',
    benefits: [
      { icon: 'thermometer-sun', body: 'Sustained oil-temp control under track load.' },
      { icon: 'shield',          body: 'No plastic, no rubber. All-aluminium plate stack.' },
      { icon: 'activity',        body: 'Thermostatic bypass. No drag at warmup.' },
      { icon: 'sparkles',        body: 'AN fittings and adapter plate in the box.' },
    ],
    outro: 'Each cooler is pressure-tested at 8 bar before shipping, well above any operating pressure it will ever see. Built on the line that supplies our OE program, the same QC standard that backs every Gold Standard SKU in the range.',
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
    intro: 'Our gear-reduction starter motor pulls 2.4 kW at peak crank, fires on the first turn in subzero conditions, and survives the heat-shielded environment near modern headers. Hardened pinion, sealed solenoid, OEM bracket and electrical interface.',
    numberedFeatures: [
      { title: 'Gear-Reduction Drive',   body: 'Compact gear-reduction architecture with 2.4 kW peak output. Cranks faster than a direct-drive at the same battery state.' },
      { title: 'Heat-Shielded Solenoid', body: 'Sealed solenoid with a thermal jacket. Survives installs near catalysts and short headers without contact drift.' },
      { title: 'Hardened Pinion',        body: 'Forged Bendix pinion with hardened teeth. No premature wear against the ring gear after thousands of start cycles.' },
      { title: 'OEM Interface',          body: 'Same bolt pattern, same connector, same engagement geometry. No engine mount changes, no harness modification.' },
    ],
    closing: 'Cheap starters fail two ways. Both end with a click and no crank. The solenoid contacts pit after 50,000 cycles, or the pinion teeth wear into the flywheel. This one is built so neither happens.',
    benefitsTitle: 'Built to Crank',
    benefits: [
      { icon: 'zap',             body: 'Cranks fast in subzero conditions.' },
      { icon: 'thermometer-sun', body: 'Heat-shielded solenoid. Survives header-close installs.' },
      { icon: 'shield',          body: 'Hardened pinion. No flywheel wear.' },
      { icon: 'activity',        body: 'Two-year replacement warranty.' },
    ],
    outro: 'Each starter is bench-tested at temperature for engagement reliability and held-current draw. Built on the line that supplies our OE replacement program, the same QC standard that backs every electrical SKU in the ample range.',
  }),
  makeProduct({
    slug: 'water-pump-awn',
    category: 'Cooling', eyebrow: 'Cooling · Replacement',
    title: 'Water', title2: 'Pump.',
    heroAsset: 'water-pump',
    summary: 'OEM housing, forged impeller, factory-spec output. The straightforward replacement when the original goes plastic.',
    bullets: [
      'Forged steel impeller. Survives high rpm without cavitation.',
      'OEM housing footprint. No hose changes.',
      'Carbon-faced mechanical seal on a ceramic mating face.',
      'Double-row sealed bearing, lifetime-rated.',
      'Gasket and bolts included.',
      'Pressure-tested for leak-down before shipping.',
    ],
    /* Rich callout layout. Common OE water-pump emphasis: steel-vs-plastic
       impeller failure mode, carbon mechanical seal, sealed-for-life
       bearing, cavitation resistance at high rpm. Same template shape as
       compressor, caliper-npc, brake-pads. No em dashes anywhere. */
    intro: 'Our OEM-spec water pump pairs a forged steel impeller with a sealed bearing and a carbon-faced mechanical seal. Pulls the same coolant volume the original did, takes the same belt path, fits the same gasket footprint. Pressure-tested at the line before it leaves the box.',
    numberedFeatures: [
      { title: 'Forged Steel Impeller', body: 'Steel impeller, not plastic. Holds shape under sustained high-rpm flow without cavitating or shedding vanes into the loop.' },
      { title: 'Carbon-Faced Seal',     body: 'Carbon mechanical seal running on a ceramic mating face. Holds pressure across heat cycles, no weep at the weep hole.' },
      { title: 'Sealed Bearing',        body: 'Double-row sealed bearing, no grease point, no service interval. Quiet at every rpm, dry at the shaft.' },
      { title: 'OEM Footprint',         body: 'Same housing, same gasket, same bolt pattern, same pulley alignment. No bracket mods, no hose mods.' },
    ],
    closing: 'Plastic impellers crack at the hub when the engine cycles hot to cold. The signature failure is a slow temp rise that nobody notices until the gauge hits red and the gasket lets go. Steel impeller, steel hub, steel shaft. The signature failure does not happen here.',
    benefitsTitle: 'Built to Outlast the Loop',
    benefits: [
      { icon: 'thermometer-sun', body: 'Sustained flow at temperature. No cavitation, no airlock, no surprise overheat in traffic.' },
      { icon: 'shield',          body: 'Sealed bearing, lifetime-rated. No grease point, no service interval, no shaft play.' },
      { icon: 'activity',        body: 'Quiet at every rpm. No bearing whine, no shaft chatter into the cabin.' },
      { icon: 'sparkles',        body: 'Gasket and bolts in the box. Drop in, fill, bleed, drive.' },
    ],
    outro: 'Each pump is dry-spun for balance and pressure-tested for leak-down at the seal and the housing before it leaves the line. Cast and machined to OE drawings, sampled batch by batch, the same QC program that backs every Gold Standard SKU in the range.',
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
      'PAG oil dosed to OE spec at fill.',
      'ISO/TS-certified manufacturing line.',
    ],
    /* Rich callout layout (same shape as caliper-npc and brake-pads).
       Copy cadence borrowed from Denso OE compressor literature: PAG
       precharge, magnetic clutch durability, OE-equivalent fitment.
       No em dashes anywhere in this block. */
    intro: 'Our six-cylinder swash-plate compressor delivers OEM-equivalent cooling under sustained heat-soak loads. Each unit ships pre-charged with the correct PAG oil viscosity, paired with a sealed magnetic clutch and validated through full-cycle bench testing. Drops into the bracket the original used, takes the same electrical connector, runs on the same refrigerant.',
    numberedFeatures: [
      { title: 'Six-Cylinder Swash-Plate', body: 'Rotary swash-plate design with six pistons. Smooth engagement at every cycle, no clutch shock to the accessory drive.' },
      { title: 'Pre-Charged PAG Oil',      body: 'Correct viscosity oil dosed to OE spec at the factory. Vacuum the system, charge it, drive away.' },
      { title: 'Sealed Magnetic Clutch',   body: 'Double-row bearing, sealed for life. Quiet at idle, no rattle on heat soak, no metal in the lines.' },
      { title: 'OEM Fitment',              body: 'Same bracket, same connector, same belt path, same refrigerant. No harness, hose or mount modifications.' },
    ],
    closing: 'Compressors fail the same way every summer. The bearing screams, the clutch slips, the lines fill with metal and the cabin runs warm. This one is built so that does not happen. Each unit is bench-tested at temperature and pressure before it leaves the line.',
    benefitsTitle: 'Engineered for the Heat',
    benefits: [
      { icon: 'thermometer-snowflake', body: 'Sustained cooling under heat soak. No pull-down loss in traffic, no warm air at idle.' },
      { icon: 'activity',              body: 'Smooth engagement at every cycle. No clutch shock, no surge into the belt.' },
      { icon: 'shield',                body: 'Sealed bearing and clutch. Quiet at every rpm, dry at every gasket.' },
      { icon: 'sparkles',              body: 'Pre-charged with the correct PAG oil. Drop in, vacuum, charge, done.' },
    ],
    outro: 'Magnetic clutch torque-tested through 200 engagement cycles. Refrigerant ports pressure-tested for leak-down at 25 bar before shipping. Built on an ISO/TS-certified manufacturing line and sampled batch by batch, the same QC program that backs every Gold Standard SKU in the range.',
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
    summary: "ABS that flickers on a wet morning is ABS you cannot trust on a wet afternoon. Active Hall-effect element on a sealed IC, square-wave output, OE connector, drop-in fit.",
    bullets: [
      'Active Hall-effect sensor. Element, amplifier and signal conditioning on a single hermetically-sealed IC.',
      'Square-wave digital output. Module reads the same edge from 0.1 km/h to top speed.',
      'Compatible with both multipole magnetic and steel-ring (variable-reluctance) encoders.',
      'IP6K9K-rated overmolded housing. Survives steam-clean, salt spray and brake dust.',
      'OEM connector and mounting boss. No harness changes, no scan-tool reset.',
      'Pre-calibrated to OE air-gap tolerance. Fit it and the ABS light clears on the first drive cycle.',
    ],
    intro: "Our wheel-speed sensor replaces the passive variable-reluctance coil that wears out in the original with an active Hall-effect element sealed inside an overmolded IC head. The integrated circuit packages the Hall element, signal amplifier and conditioning logic onto a single chip — so the output stays a clean square wave from crawl-speed all the way to top speed, instead of the analog sinusoid the OE part puts out (which gets noisier as the reluctor ring wears). OEM electrical connector, OEM mounting geometry, sealed against the salt and grit that kill the one you are replacing.",
    numberedFeatures: [
      { title: 'Hall-Effect IC',         body: 'Hall-sensing element, signal amplifier and conditioning logic combined on one hermetically-sealed silicon chip. Output is digital from the first wheel revolution — no analog-to-digital conversion losses at the module.' },
      { title: 'Universal Encoder',      body: 'Reads both multipole magnetic encoder rings and traditional steel toothed-wheel reluctors. One sensor covers both wheel-bearing generations across the application range.' },
      { title: 'Sealed Housing',         body: 'Overmolded plastic body rated IP6K9K — fully sealed against pressure-wash water, road salt, brake dust and grit. The OE failure mode (corrosion creeping in at the connector seam) is engineered out.' },
      { title: 'OEM Drop-In Fit',        body: 'Same mounting boss, same connector pinout, same harness clip routing. Pre-calibrated to OE air-gap tolerance, so no scan-tool calibration is needed after install.' },
    ],
    closing: "ABS sensors fail one of two ways: the connector corrodes and the signal cuts in and out, or the reluctor coil ages and the sinusoidal output gets noisy enough that the module gives up and lights the dash. An IP6K9K-sealed Hall-effect IC with a square-wave output closes off both failure modes at the source.",
    benefitsTitle: 'Reads Clean. Every Condition.',
    benefits: [
      { icon: 'activity',  body: 'Clean digital square wave from first wheel revolution to top speed. No false triggers in the wet.' },
      { icon: 'shield',    body: 'IP6K9K overmolded housing. Salt, dust and steam-clean cannot reach the element or the connector.' },
      { icon: 'sparkles',  body: 'OEM connector and mount. Fit it, clear the code, drive away — no scan-tool calibration.' },
      { icon: 'zap',       body: 'Hall-effect IC. No signal fade as the reluctor ring wears, no drift with temperature.' },
    ],
    outro: 'Each sensor is bench-tested across the full speed range for signal linearity and edge-jitter, then pull-tested at the connector seal before it ships. Built on the line that supplies our OE brake program, the same QC standard that backs every Braking SKU in the ample range.',
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
    summary: "CAB-brazed aluminium core, double-folded fins, reinforced plastic tanks. Every unit 100% leak-tested before the box is sealed. The day the original lets go, this is what goes back in.",
    bullets: [
      'Controlled Atmosphere Brazing (CAB) aluminium core. The same joining process used by Behr, Nissens and other OE suppliers.',
      'Double-folded fin geometry. Reinforces the fin stack and increases total heat-exchange surface area.',
      'OE-dimension reinforced plastic end tanks. Built against the crimp-seam failure that drips on every aging factory radiator.',
      'ISO/TS 16949 manufacturing. Same quality system that backs the OE supply chain.',
      '100% leak-tested at 2 bar. Validated through thermal cycling, vibration and salt-spray.',
      'Hose adapters, O-rings and mounting hardware in the box.',
    ],
    intro: "Our OEM-replacement radiator drops into the bracket the original used, takes the same hose paths and holds the coolant volume the engine was tuned for. Brazed aluminium core joined in a controlled-atmosphere brazing furnace, double-folded fins for additional heat-exchange surface, ribbed plastic end tanks built against the OE seam-failure mode. Engineered to ISO/TS 16949 — the automotive quality standard used by Behr, Mahle, Nissens and the rest of the OE supply chain. Every unit ships pressure-tested at 2 bar.",
    numberedFeatures: [
      { title: 'CAB-Brazed Aluminium Core',  body: 'Tubes and fins joined in a controlled-atmosphere brazing furnace — the same process used by OE suppliers. Strong, leak-tight joints that hold under thermal cycling without the flux residue that promotes corrosion.' },
      { title: 'Double-Folded Fin Stack',    body: 'Fins folded twice into the air path. Reinforces the stack against vibration damage and increases the total heat-exchange surface area in the same frontal footprint.' },
      { title: 'Reinforced Tank Seam',       body: 'Plastic end tanks with a ribbed reinforcement at the aluminium-to-plastic crimp — built against the exact seam that opens up on the OE radiator after a few summers of expansion cycles.' },
      { title: '100% Leak-Tested',           body: 'Every unit pressure-tested at 2 bar and dye-checked at every weld before it ships. Validated through corrosion, vibration, pressure-impulse and thermal-expansion testing.' },
    ],
    closing: "Stock radiators fail one way. The crimp where the aluminium core meets the plastic tank opens up, coolant drips down the front of the engine, and the temp gauge climbs in traffic. A CAB-brazed core with a reinforced tank seam closes off both halves of the failure mode at the source.",
    benefitsTitle: 'Built for the Replacement Day',
    benefits: [
      { icon: 'thermometer-sun', body: 'CAB-brazed aluminium. Faster heat shed and lighter than copper-brass at the same surface area.' },
      { icon: 'shield',          body: 'Reinforced tank seams. Engineered against the exact OE failure mode.' },
      { icon: 'activity',        body: 'OE drop-in fit. Same mounts, same hose nipples, same fan-shroud clearance.' },
      { icon: 'sparkles',        body: 'Hose adapters, O-rings and clips in the box. Open it, drop it in, fill, bleed, drive.' },
    ],
    outro: 'Built on an ISO/TS 16949 manufacturing line and validated through thermal cycling, vibration, pressure-impulse and salt-spray corrosion testing. Every unit is pressure-tested at 2 bar, dye-checked at every weld and serial-stamped before it leaves the line — the same QC program that backs every cooling SKU in the ample range.',
  }),
  makeProduct({
    slug: 'condenser',
    category: 'HVAC', eyebrow: 'HVAC · Heat Out',
    title: 'A/C', title2: 'Condenser.',
    heroAsset: 'radiator',
    summary: "Parallel-flow aluminium. Refrigerant runs through dozens of pin-bore tubes instead of one serpentine loop — about a third more heat out per pass than the OE design.",
    bullets: [
      'True parallel-flow core. Dozens of pin-bore micro-channel tubes maximise refrigerant-to-fin contact.',
      '~33% more heat rejection per pass than the OE serpentine tube-and-fin layout.',
      'Compatible with R134a and R1234yf refrigerants out of the same SKU.',
      'Integrated receiver-dryer. One less bracket to source, one less seam to leak.',
      'OEM-spec mounting points, refrigerant fittings and fan-shroud clearance.',
      'Pressure-tested for leak-down before shipping. Cap-sealed to keep moisture out in transit.',
    ],
    intro: "Our parallel-flow aluminium condenser replaces the serpentine-core unit the car left the factory with, trading it for the design that has powered every new OE A/C system since the early 2000s. Instead of one long refrigerant loop, the refrigerant splits across dozens of pin-bore micro-channel tubes — roughly a third more heat-exchange surface per pass than the original. Integrated receiver-dryer and desiccant bag, OEM mounting tabs and fitting locations, drops in with no bracket fabrication.",
    numberedFeatures: [
      { title: 'Parallel Micro-Channel',  body: 'Refrigerant splits across dozens of pin-bore aluminium tubes running in parallel — the same architecture every new OE condenser has used since the early 2000s. Higher refrigerant-to-fin contact, lower pressure drop, shorter compressor duty cycles.' },
      { title: 'Dual Refrigerant',        body: 'Engineered to spec for both R134a and R1234yf. One part number covers retrofits and model-year variants across the application range without guessing which refrigerant your VIN was built for.' },
      { title: 'Integrated Desiccant',    body: 'Receiver-dryer cartridge integrated into the condenser body, with a sealed desiccant bag inside. Removes one separately-mounted part and eliminates the bracket-and-line seam that corrodes loose on the OE setup.' },
      { title: 'OEM Bracket & Fittings',  body: 'Mounting tabs, fan-shroud clearance and refrigerant fitting positions match OE. Fit it, evacuate the system, charge it, drive — no custom brackets, no adapter fittings.' },
    ],
    closing: "Parallel-flow condensers cannot be flushed clean once they have debris in them — the micro-channels trap it forever. So when the OE one fails, the right answer is replacement, not service. This one is built to drop in once and stay there for the life of the next compressor.",
    benefitsTitle: 'Engineered to Keep It Cold',
    benefits: [
      { icon: 'thermometer-snowflake', body: 'Micro-channel parallel flow. ~33% more heat out per pass than the OE serpentine layout.' },
      { icon: 'sparkles',              body: 'Integrated receiver-dryer. One fewer part to source, one fewer bracket to corrode.' },
      { icon: 'activity',              body: 'Dual-refrigerant compatible. R134a and R1234yf out of the same SKU.' },
      { icon: 'shield',                body: 'OEM mounting and fittings. Bolt in, evacuate, charge, done — no fabrication.' },
    ],
    outro: 'Each condenser is pressure-tested for leak-down at the fittings and seams, then cap-sealed to keep moisture and contamination out during transit. Built on the line that supplies our OE HVAC program and validated through thermal cycling and vibration — the same QC standard that backs every ample HVAC SKU.',
  }),
  makeProduct({
    slug: 'heater-core',
    category: 'HVAC', eyebrow: 'HVAC · Cabin Heat',
    title: 'Heater', title2: 'Core.',
    heroAsset: 'radiator',
    summary: "Brass-tube, copper-finned heater core. The dashboard-removal part you replace ONCE — not in 50,000 km, not again in 70,000 km. Pressure-tested at every joint.",
    bullets: [
      'Brass-tube core with copper fins. The traditional pairing that outlasts aluminium under heat cycling and electrolysis.',
      'Soldered tube-to-header joints, not crimped. Reseals on its own under thermal expansion.',
      'OEM external dimensions and tab geometry. Drops into the heater box without trimming or bracket changes.',
      'Hose nipples sized for OEM clamps — standard hose, no adapters, no improvised fittings.',
      '100% pressure-tested at every joint before shipping.',
      'Salt-spray and electrolysis tested. Validated against the OE failure modes (pinhole corrosion + stress fracture).',
    ],
    intro: "Our heater core pairs brass tubes with copper fins — the traditional pairing that aluminium cores in late-model cars were supposed to replace but routinely outlast. Aluminium heater cores look good on a spec sheet (better raw thermal conductivity) but they fail two ways the brass-copper combination resists: electrolysis corrodes the tubes into pinholes within a few seasons, and stress fractures open at the tube-to-header joints under repeat heat cycling. OEM external dimensions, hose nipples sized for the original clamps, drops into the heater box on the original tabs.",
    numberedFeatures: [
      { title: 'Brass-Tube Core',        body: 'Brass tubes resist the electrolysis corrosion that eats aluminium cores from the inside. Engineered for the typical 5-to-7-year replacement cycle to become the LAST replacement cycle — not a stop on the way to the next one.' },
      { title: 'Soldered Header Joints', body: 'Tube-to-header connections soldered, not crimped. The soldered joints reseal themselves under thermal expansion, where the OE crimps open up as a stress fracture and start weeping into the evaporator box.' },
      { title: 'Copper Fin Matrix',      body: 'Copper fins bonded to the tube bundle. High surface area transfers heat efficiently into the blower-fan airflow, defrosts the windshield faster on a cold morning, and resists corrosion in the salt-laden cabin condensate.' },
      { title: 'OEM Footprint',          body: 'External dimensions, mounting tabs, hose-nipple positions and hose-nipple sizes match OE. Sits in the heater box on the original locating ribs, takes the original hose clamps without adapters.' },
    ],
    closing: "Heater cores fail slowly and expensively. A pinhole opens, coolant weeps into the evaporator box, and by the time the windshield fogs from inside the carpet is already soaked. Brass tubes, copper fins and soldered joints close off the electrolysis-and-stress-fracture failure path at the source — so the next dashboard-out service interval gets pushed past the rest of the car.",
    benefitsTitle: 'Built to Hold. Every Season.',
    benefits: [
      { icon: 'thermometer-sun', body: 'Brass tubes + copper fins. Resists electrolysis corrosion that eats aluminium cores in 5-7 years.' },
      { icon: 'shield',          body: 'Soldered header joints. Reseal under thermal expansion where OE crimps open as stress fractures.' },
      { icon: 'activity',        body: 'OEM footprint. Drop into the heater box on the original tabs with no trimming.' },
      { icon: 'sparkles',        body: 'Hose nipples sized for OE clamps. Standard hose, no adapters, no improvised fittings.' },
    ],
    outro: 'Each core is pressure-cycled across the operating temperature range, electrolysis-tested for tube-wall corrosion resistance, and leak-tested at every joint before it ships. Built on the line that supplies our OE cabin-heat program — the same QC standard that backs every ample HVAC SKU in the range.',
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
  // 'calipers', 'wiper-linkage', 'exhaust', 'radiators', 'oil-cooler',
  // 'blower-motor' intentionally omitted — kept in PRODUCTS so a direct URL
  // (#/product/<slug>) still renders, but hidden from catalog + featured
  // listings.
  'brake-pads', 'caliper-npc', 'abs-sensor', 'pad-sensor',
  'radiator-urk', 'water-pump-awn',
  'compressor', 'condenser', 'heater-core',
  'alternator', 'starter', 'ignition-coil', 'lighting',
  'wiper-motor',
  'tensioner', 'gasket',
  'power-steering-pump', 'rack-pinion',
  'air-filter', 'cabin-filter',
];

Object.assign(window, { PRODUCTS, PRODUCT_ORDER });
