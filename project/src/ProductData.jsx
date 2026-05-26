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
    summary: "ABS that flickers on a wet morning is ABS you can't trust on a wet afternoon. Hall-effect, OE connector, calibrated to read clean across the speed range.",
    bullets: [
      'Hall-effect element. Active digital output, no resistive drift over time.',
      'OEM electrical interface. Drops into the harness the original used.',
      'IP67-sealed housing. Survives salt spray, brake dust and pressure wash.',
      'Clean signal from 1 km/h to top speed — no false triggers, no flicker.',
      'Direct replacement. No scan-tool calibration after install.',
      'Two-year replacement warranty.',
    ],
    intro: "Our ABS wheel-speed sensor uses a Hall-effect element in place of the passive variable-reluctance coil that wears in the original. Hall-effect output is active and digital — the signal doesn't drift with temperature, doesn't fade as the reluctor ring wears, and reads cleanly from the first wheel revolution. OEM connector and mounting geometry, sealed against the salt and grit that kill the one you are replacing.",
    numberedFeatures: [
      { title: 'Hall-Effect Element',   body: 'Active digital output. No resistance ladder to corrode, no signal fade as the reluctor ring surface wears down over time.' },
      { title: 'Clean Signal Range',    body: 'Calibrated to read from crawl speed to highway. The ABS module sees a clean square wave at every speed — no false triggers in the wet, no flicker at low creep.' },
      { title: 'Sealed Housing',        body: 'IP67-rated seal. Survives pressure washing, salt spray and brake dust. The failure mode of the OE sensor — corrosion at the connector — is closed off.' },
      { title: 'OEM Drop-In Fit',       body: 'Same mounting boss, same connector, same harness routing. No scan-tool calibration needed after install. Fit it and the ABS light goes out on the first test drive.' },
    ],
    closing: "ABS sensors fail one way: the signal degrades until the module cannot trust it and the ABS warning light stays on. A Hall-effect element with a sealed IP67 housing closes off the two failure modes — corrosion at the connector and signal fade at the element — so the light stays off and the system does its job.",
    benefitsTitle: 'Reads Clean. Every Condition.',
    benefits: [
      { icon: 'activity',  body: 'Clean digital output from first wheel revolution to top speed. No false ABS triggers in wet conditions.' },
      { icon: 'shield',    body: 'IP67 sealed. Salt, dust and pressure wash cannot reach the element or the connector.' },
      { icon: 'sparkles',  body: 'OEM connector and mount. Fit it, clear the code, drive away.' },
      { icon: 'zap',       body: 'Hall-effect. No resistive drift, no signal fade as the reluctor ring wears.' },
    ],
    outro: 'Each sensor is bench-tested for signal linearity across the speed range and pull-tested at the connector seal before it ships. Built on the line that supplies our OE brake program, the same QC standard that backs every Braking SKU in the ample range.',
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
    summary: 'Aluminium core, reinforced plastic tanks, OEM fit. Pressure-tested at 2 bar before the box is sealed. The day the original lets go, this is what goes back in.',
    bullets: [
      'Brazed aluminium tube-and-fin core. Sheds heat faster than copper-brass.',
      'Ribbed plastic end tanks built against the seam that fails on the OE part.',
      'Same mounts, same hose nipples, same fan shroud holes. No modifications.',
      'Pressure-tested at 2 bar and dye-checked at every weld before shipping.',
      'Hose adapters in the box.',
    ],
    intro: 'Our OEM-replacement radiator drops into the bracket the original used, takes the same hose paths and holds the coolant volume the engine was tuned for. Brazed aluminium tube-and-fin core, ribbed plastic end tanks built against the seam that fails on the OE part, pressure-tested at 2 bar at the line. Meets or exceeds OE specification across the application range, with no drilling, no trimming and no bracket changes at install.',
    numberedFeatures: [
      { title: 'Aluminium Core',       body: 'Brazed aluminium tube-and-fin. Sheds heat faster than copper-brass at the same surface area, lighter at the front of the car.' },
      { title: 'Ribbed Plastic Tanks', body: 'OE-dimension end tanks, reinforced at the crimp. Built against the seam failure that opens up on stock radiators after a few summers.' },
      { title: 'OE Drop-In Fit',       body: 'Same mounts, same hose nipple positions, same fan shroud holes. No drilling, no cutting, no bracket swaps.' },
      { title: '2-Bar Pressure Test',  body: 'Every unit pressure-tested at 2 bar and dye-checked at the seams before it ships. Leak-free before the box is sealed.' },
    ],
    closing: 'Stock radiators fail one way. The crimp at the tank-to-core seam opens up, coolant drips down the front of the engine and the temp gauge climbs in traffic. This one is built so that morning arrives much later, not much sooner.',
    benefitsTitle: 'Built for the Replacement Day',
    benefits: [
      { icon: 'thermometer-sun', body: 'Aluminium core. Faster heat shed, lower weight than copper-brass.' },
      { icon: 'shield',          body: 'Ribbed tank seams. Built against the OE failure mode.' },
      { icon: 'activity',        body: 'OE drop-in fit. Same mounts, same hoses, no modifications.' },
      { icon: 'sparkles',        body: 'Hose adapters in the box. Open it, drop it in, fill, drive.' },
    ],
    outro: 'Built on an ISO 9001 manufacturing line and validated through thermal cycling, vibration and salt-spray corrosion testing. Each unit is pressure-tested at 2 bar, dye-checked at every weld and serial-stamped before it leaves the line — the same QC program that backs every cooling SKU in the ample range.',
  }),
  makeProduct({
    slug: 'condenser',
    category: 'HVAC', eyebrow: 'HVAC · Heat Out',
    title: 'A/C', title2: 'Condenser.',
    heroAsset: 'radiator',
    summary: 'The cabin stays cool only as long as the condenser keeps dumping heat to the road. Parallel-flow aluminium, dual-refrigerant compatible, drop-in fit.',
    bullets: [
      'Parallel-flow core. Up to 30% better heat rejection than serpentine design.',
      'Compatible with R134a and R1234yf refrigerants.',
      'Integrated desiccant receiver-dryer — no separate part to source.',
      'OEM-spec mounting brackets and fittings. No modifications.',
      'Pressure-tested before shipping.',
    ],
    intro: 'Our parallel-flow aluminium condenser replaces the serpentine-core unit the car left the factory with, trading it for a design that rejects more heat in the same frontal area. Multi-pass parallel flow means the refrigerant drops temperature faster, the compressor runs shorter cycles, and the cabin pulls down quicker under heat soak. Integrated desiccant receiver-dryer, OEM-spec brackets, drops into the original mount with no modifications.',
    numberedFeatures: [
      { title: 'Parallel-Flow Core',      body: 'Multi-pass parallel-flow design rejects heat more efficiently than the OE serpentine layout. Shorter compressor cycles, faster cabin pull-down under heat soak.' },
      { title: 'Dual Refrigerant',        body: 'Compatible with R134a and R1234yf. One part covers the application across model years without fitment guesswork.' },
      { title: 'Integrated Desiccant',    body: 'Receiver-dryer built into the condenser body. Removes one extra part to source and eliminates the bracket that corrodes and works loose on the OE unit.' },
      { title: 'OEM Bracket & Fittings',  body: 'Same mounting points, same refrigerant line fittings, same fan shroud clearance. Fit it, evacuate, recharge, done — no custom fabrication.' },
    ],
    closing: 'A clogged or kinked condenser can't dump enough heat for the compressor to deliver cold air — the system runs continuously, the compressor wears faster, and the cabin stays warm. This condenser is built to spec so the rest of the HVAC loop can do its job.',
    benefitsTitle: 'Engineered to Keep It Cold',
    benefits: [
      { icon: 'thermometer-snowflake', body: 'Parallel-flow core. More heat out of the refrigerant per pass, faster cabin pull-down.' },
      { icon: 'sparkles',              body: 'Integrated receiver-dryer. One less part to source, one less bracket to corrode.' },
      { icon: 'activity',              body: 'R134a and R1234yf compatible. Fits across model-year variants without fitment guessing.' },
      { icon: 'shield',                body: 'OEM mounting and fittings. Bolt in, evacuate, recharge — no modifications.' },
    ],
    outro: 'Each condenser is pressure-tested for leak-down at the fittings and seams before it ships. Built on the manufacturing line that supplies our OE HVAC program, validated through thermal cycling and vibration testing — the same QC standard that backs every ample HVAC SKU.',
  }),
  makeProduct({
    slug: 'heater-core',
    category: 'HVAC', eyebrow: 'HVAC · Cabin Heat',
    title: 'Heater', title2: 'Core.',
    heroAsset: 'radiator',
    summary: "Brass-tube heater core. The part nobody thinks about until there is a sweet smell in the cabin, fog on the inside of the glass, and coolant on the passenger carpet.",
    bullets: [
      'Brass-tube, aluminium-fin construction. Survives heat-cycling that cracks OE cores.',
      'OEM dimensions. Drop-in fitment — no trimming, no bracket changes.',
      'All connections pressure-tested before shipping.',
      'Hose nipples sized for OEM clamps — standard hose, no adapters.',
      'Interior-safe construction. No plastic neck to crack on re-install.',
    ],
    intro: 'Our heater core pairs brass tubes with aluminium fins — the tube material that handles repeated heat cycling without the micro-cracking that opens pinhole leaks in OE aluminium cores. OEM external dimensions, hose nipples sized for the original clamps, same footprint on the heater box tabs. Pull the dash, swap the core, button it back up. No sweet smell. No fogged glass. No coolant in the carpet.',
    numberedFeatures: [
      { title: 'Brass-Tube Core',        body: 'Brass tubes handle the thermal expansion of repeated heat cycling without the micro-cracking that opens pinhole leaks in OE aluminium cores after a few seasons.' },
      { title: 'Aluminium Fin Matrix',   body: 'Aluminium fins bonded to the brass tube bundle. High surface area transfers heat efficiently into the cabin airflow without adding bulk to the heater box.' },
      { title: 'OEM Footprint',          body: 'Same external dimensions as the original. Sits in the heater box tabs without modification, lines up with the same hose routing, clears the same evaporator stack.' },
      { title: 'Pressure-Tested Seals',  body: 'All joints and hose nipples pressure-tested before shipping. The failure mode of a leaking heater core — sweet smell, fogged glass, wet carpet — is confirmed closed before the box is sealed.' },
    ],
    closing: 'Heater cores fail slowly: a pinhole opens, coolant weeps into the evaporator box, and by the time there is fog on the inside of the windshield the carpet is already wet. Brass tubes and pressure-tested joints close off the failure mode at the source.',
    benefitsTitle: 'Built to Hold. Every Season.',
    benefits: [
      { icon: 'thermometer-sun', body: 'Brass tubes. Handles heat cycling without the micro-cracking that opens leaks in OE cores.' },
      { icon: 'shield',          body: 'All joints pressure-tested before shipping. No sweet smell, no fog, no wet carpet.' },
      { icon: 'activity',        body: 'OEM footprint. Drop into the heater box with no trimming and no bracket changes.' },
      { icon: 'sparkles',        body: 'Hose nipples sized for OE clamps. Standard hose, no adapters, no improvised fittings.' },
    ],
    outro: 'Each core is pressure-cycled across the operating temperature range and leak-tested at every joint before it ships. Built on the line that supplies our OE cabin-heat program, the same QC standard that backs every ample HVAC SKU in the range.',
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
