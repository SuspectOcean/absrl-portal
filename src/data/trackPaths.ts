// Accurate SVG track layout paths — shared across all pages
// ViewBox: 0 0 200 150 for all tracks

export const trackSvgPaths: Record<string, string> = {
  // Trial Mountain Circuit — Clockwise, mountain circuit with tunnels and elevation
  // Long uphill back straight on left, mountain hairpin at top, descending technical section on right
  'trial-mountain': [
    'M 35,130',   // Start/Finish
    'L 30,120',   // Into T1
    'L 25,105',   // Uphill
    'L 22,85',    // Through tunnel 1
    'L 20,65',    // Continuing uphill
    'L 22,48',    // Approaching mountain section
    'L 28,35',    // Climbing
    'L 38,25',    // Near summit
    'L 52,20',    // Mountain hairpin entry
    'L 62,22',    // Hairpin apex (T7)
    'L 68,30',    // Hairpin exit
    'L 75,42',    // Descent begins
    'L 82,50',    // Through tunnel 2
    'L 92,55',    // Ridge section
    'L 105,52',   // Ridge chicane (T10-11)
    'L 115,56',   // After chicane
    'L 128,62',   // Continuing descent
    'L 140,70',   // Through tunnel 3
    'L 150,80',   // Approaching valley
    'L 158,92',   // Valley sweep entry
    'L 160,105',  // Valley sweep apex (T14)
    'L 155,118',  // Exit sweep
    'L 142,128',  // Onto main straight
    'L 120,132',  // Main straight
    'L 95,133',   // Continuing straight
    'L 65,132',   // Approaching start
    'L 35,130',   // Back to S/F
  ].join(' '),

  // Laguna Seca — Counter-clockwise, famous for the Corkscrew
  // Compact circuit with big elevation, Andretti Hairpin, Corkscrew descent
  'laguna-seca': [
    'M 70,125',    // Start/Finish
    'L 95,122',    // Approaching T1
    'L 115,115',   // T1 entry
    'L 130,105',   // T1 (right-hander)
    'L 128,90',    // T2 Andretti Hairpin entry
    'L 118,82',    // Andretti apex
    'L 108,80',    // Andretti exit
    'L 95,78',     // Uphill to T3
    'L 82,72',     // T3-T4
    'L 72,62',     // Climbing
    'L 65,50',     // T5-T6
    'L 60,38',     // Approaching Corkscrew
    'L 62,28',     // Corkscrew entry (T8)
    'L 70,22',     // Corkscrew apex — blind drop
    'L 80,25',     // Corkscrew exit (T8A)
    'L 88,35',     // Steep descent
    'L 92,48',     // Rainey Curve entry (T9)
    'L 88,60',     // Rainey apex
    'L 78,68',     // T10
    'L 65,78',     // T11 exit
    'L 55,92',     // Downhill
    'L 48,108',    // Approaching final turn
    'L 50,120',    // Final turn
    'L 58,126',    // Onto pit straight
    'L 70,125',    // Back to S/F
  ].join(' '),

  // Spa-Francorchamps — Clockwise, 7km legend through Belgian Ardennes
  // La Source hairpin at top-left, Eau Rouge drops southeast, Kemmel straight,
  // Les Combes, drops through forest, Pouhon, Stavelot, Blanchimont, Bus Stop
  'spa-francorchamps': [
    'M 30,20',     // Start/Finish (La Source area)
    'L 22,25',     // La Source hairpin entry
    'L 18,30',     // La Source apex
    'L 22,36',     // La Source exit
    'L 30,42',     // Down to Eau Rouge
    'L 35,52',     // Eau Rouge compression
    'L 40,48',     // Raidillon — up and right
    'L 48,42',     // Top of Raidillon
    'L 62,38',     // Kemmel Straight
    'L 80,35',     // Kemmel Straight cont.
    'L 95,34',     // Les Combes entry
    'L 105,38',    // Les Combes chicane
    'L 110,44',    // Malmedy
    'L 115,52',    // Rivage hairpin
    'L 112,60',    // Rivage exit
    'L 105,68',    // Descending
    'L 100,78',    // Into Pouhon
    'L 105,88',    // Pouhon double-left apex
    'L 115,95',    // Pouhon exit
    'L 128,100',   // Fagnes chicane
    'L 140,105',   // Campus
    'L 150,112',   // Stavelot entry
    'L 155,120',   // Stavelot apex
    'L 150,128',   // Stavelot exit
    'L 135,132',   // Curve Paul Frère
    'L 115,130',   // Blanchimont entry
    'L 95,122',    // Blanchimont — flat out left
    'L 78,112',    // Blanchimont exit
    'L 62,100',    // Approaching Bus Stop
    'L 50,88',     // Bus Stop entry
    'L 45,80',     // Bus Stop chicane
    'L 42,72',     // Bus Stop exit
    'L 38,58',     // Pit straight begins
    'L 35,42',     // Climbing back
    'L 32,30',     // Back uphill
    'L 30,20',     // Back to S/F
  ].join(' '),

  // Red Bull Ring — Clockwise, short explosive track in Styrian Alps
  // Only 10 turns, long straight, steep uphill right-handers
  'red-bull-ring': [
    'M 40,120',    // Start/Finish
    'L 65,118',    // Pit straight
    'L 90,115',    // Approaching T1
    'L 108,108',   // T1 Niki Lauda Kurve entry
    'L 118,95',    // T1 apex (heavy braking right)
    'L 120,82',    // T1 exit, climbing
    'L 125,68',    // T2 uphill right
    'L 132,55',    // T3 Remus (sweeping right, uphill)
    'L 138,42',    // Still climbing
    'L 142,32',    // T4 Rauch — blind crest right
    'L 140,24',    // Over the crest
    'L 132,20',    // Descending
    'L 120,22',    // Short straight
    'L 108,28',    // T5-T6
    'L 95,35',     // Approaching T7
    'L 82,32',     // T7 Rindt Kurve entry
    'L 72,38',     // Rindt apex (fast right)
    'L 65,48',     // Rindt exit
    'L 58,62',     // Descending
    'L 52,78',     // T8-T9
    'L 45,95',     // T10 final turn
    'L 40,108',    // Onto main straight
    'L 40,120',    // Back to S/F
  ].join(' '),

  // Interlagos (Autódromo José Carlos Pace) — Counter-clockwise
  // Uphill S/F straight on the west, Senna S drops southeast, infield winds around,
  // Junção leads onto long uphill main straight
  'interlagos': [
    'M 35,35',     // Start/Finish (top of hill)
    'L 50,32',     // Approaching Senna S
    'L 65,28',     // Senna S entry (T1)
    'L 78,32',     // Senna S middle
    'L 88,38',     // Senna S exit (T2)
    'L 95,48',     // Descending
    'L 100,58',    // Reta Oposta (back straight)
    'L 105,68',    // Descida do Lago entry (T4)
    'L 108,80',    // Descida do Lago — left descending
    'L 112,92',    // Ferradura entry
    'L 118,102',   // Ferradura
    'L 122,112',   // Approaching Bico de Pato
    'L 118,122',   // Bico de Pato (T8) sharp left
    'L 108,128',   // After Bico de Pato
    'L 95,130',    // Mergulho
    'L 80,128',    // S do Senna (infield S)
    'L 68,122',    // Continuing
    'L 58,115',    // Approaching Junção
    'L 48,108',    // Junção entry (T12)
    'L 42,98',     // Junção apex — critical exit
    'L 38,85',     // Onto uphill straight
    'L 36,70',     // Climbing main straight
    'L 35,55',     // Continuing uphill
    'L 35,35',     // Back to S/F
  ].join(' '),

  // Deep Forest Raceway — Clockwise, fictional Swiss forest circuit
  // 18 corners, tunnels, lakeside sweep, tight technical sections
  'deep-forest-raceway': [
    'M 55,130',    // Start/Finish
    'L 75,128',    // Main straight
    'L 95,125',    // Approaching T1
    'L 110,118',   // T1-T2 entry
    'L 122,108',   // Forest chicane entry (T3)
    'L 128,98',    // Forest chicane apex
    'L 130,88',    // Chicane exit (T4)
    'L 135,75',    // Into forest
    'L 138,62',    // Approaching tunnels
    'L 135,48',    // Tunnel entry (T8)
    'L 128,38',    // Inside tunnel — kink
    'L 118,32',    // Tunnel exit (T9)
    'L 105,28',    // Open section
    'L 90,25',     // Fast section
    'L 75,22',     // Approaching lakeside
    'L 60,25',     // Lakeside entry
    'L 48,32',     // Lakeside sweep (T13) — long fast right
    'L 38,42',     // Lakeside apex
    'L 32,55',     // Lakeside exit
    'L 28,70',     // Continuing
    'L 25,85',     // T15-T16
    'L 28,100',    // Approaching final section
    'L 35,112',    // Final hairpin entry (T17)
    'L 42,120',    // Final hairpin apex
    'L 48,126',    // Hairpin exit — onto pit straight
    'L 55,130',    // Back to S/F
  ].join(' '),
};

// Real GT7 track map images from GT Engine
export const trackMapImages: Record<string, string> = {
  'trial-mountain': 'https://gt-engine.com/gt7/tracks/images/md/trial-mountain.png',
  'laguna-seca': 'https://gt-engine.com/gt7/tracks/images/md/laguna-seca.png',
  'spa-francorchamps': 'https://gt-engine.com/gt7/tracks/images/md/spa-francorchamps.png',
  'red-bull-ring': 'https://gt-engine.com/gt7/tracks/images/md/red-bull-ring.png',
  'interlagos': 'https://gt-engine.com/gt7/tracks/images/md/interlagos.png',
  'deep-forest-raceway': 'https://gt-engine.com/gt7/tracks/images/md/deep-forest.png',
};

// Start/Finish line coordinates for each track (for the red dot marker)
export const trackStartCoords: Record<string, { x: number; y: number }> = {
  'trial-mountain': { x: 35, y: 130 },
  'laguna-seca': { x: 70, y: 125 },
  'spa-francorchamps': { x: 30, y: 20 },
  'red-bull-ring': { x: 40, y: 120 },
  'interlagos': { x: 35, y: 35 },
  'deep-forest-raceway': { x: 55, y: 130 },
};
