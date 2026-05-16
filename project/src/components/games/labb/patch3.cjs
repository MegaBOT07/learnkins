const fs = require('fs');

const labPath = 'virtual-lab/src/lab.js';
let content = fs.readFileSync(labPath, 'utf8');

const physAdd = ",\\n    {id:'p4',title:'Electric Circuits',topic:'Electricity',grade:6,diff:'Medium',dur:'30 min',\\n     apparatus:[{ic:'🔋',nm:'Battery'},{ic:'💡',nm:'LED Bulb'},{ic:'🔌',nm:'Wires'},{ic:'🔘',nm:'Switch'}],\\n     steps:['Place the battery on the board.','Connect a wire from the positive terminal to the switch.','Connect a wire from the switch to the LED bulb.','Connect the LED bulb back to the negative terminal.','Close the switch to complete the circuit.','The LED lights up!','Open the switch to break the circuit.'],\\n     outcome:'A closed path allows electric current to flow, lighting the bulb.',anim:'circuit'},\\n    {id:'p5',title:'Convex Lenses',topic:'Light',grade:8,diff:'Medium',dur:'25 min',\\n     apparatus:[{ic:'🔍',nm:'Convex Lens'},{ic:'🔦',nm:'Light Source'},{ic:'📏',nm:'Optical Bench'},{ic:'📃',nm:'Screen'}],\\n     steps:['Mount the convex lens on the optical bench.','Place the light source (candle/laser) on one side.','Turn on the light source.','Move the screen on the other side until a sharp image forms.','Observe the light rays converging to a focal point.','Measure the focal length of the lens.'],\\n     outcome:'Convex lenses converge parallel light rays to a focal point.',anim:'lens'}";

content = content.replace(
  "outcome:'Magnetic field lines run from North to South pole outside the magnet.',anim:'magnet'},",
  "outcome:'Magnetic field lines run from North to South pole outside the magnet.',anim:'magnet'}," + physAdd
);

const bioAdd = ",\\n    {id:'b4',title:'Stomata Observation',topic:'Getting to Know Plants',grade:6,diff:'Medium',dur:'35 min',\\n     apparatus:[{ic:'🍃',nm:'Leaf'},{ic:'🥄',nm:'Forceps'},{ic:'🟦',nm:'Glass Slide'},{ic:'⬜',nm:'Coverslip'},{ic:'🔬',nm:'Microscope'}],\\n     steps:['Tear the leaf to peel off a thin layer from the lower epidermis.','Place the peel on a glass slide.','Add a drop of water and a coverslip.','Place the slide on the microscope.','Observe under low power and high power.','Identify the bean-shaped guard cells and the stomatal pore.'],\\n     outcome:'Stomata are tiny pores guarded by guard cells, allowing gas exchange.',anim:'microscope'},\\n    {id:'b5',title:'Testing Food (Starch & Protein)',topic:'Components of Food',grade:6,diff:'Medium',dur:'40 min',\\n     apparatus:[{ic:'🥔',nm:'Potato'},{ic:'🥛',nm:'Milk'},{ic:'🧪',nm:'Test Tubes'},{ic:'🟤',nm:'Iodine'},{ic:'💧',nm:'Biuret Reagent'}],\\n     steps:['Add potato extract to Test Tube 1.','Add milk to Test Tube 2.','Add drops of iodine to Tube 1.','Observe Tube 1 turn blue-black indicating starch.','Add Biuret reagent to Tube 2.','Observe Tube 2 turn purple indicating protein.'],\\n     outcome:'Iodine tests for starch (blue-black). Biuret tests for protein (purple).',anim:'litmus'}";

content = content.replace(
  "outcome:'Only chlorophyll-containing (green) areas perform photosynthesis and produce starch.',anim:'leaf'},",
  "outcome:'Only chlorophyll-containing (green) areas perform photosynthesis and produce starch.',anim:'leaf'}," + bioAdd
);

content = content.replace(
  "leaf:['idle','hold','dip','stir','hold','dip','examine','write'],",
  "leaf:['idle','hold','dip','stir','hold','dip','examine','write'],\\n  circuit:['idle','push','push','push','push','examine','examine','write'],\\n  lens:['idle','hold','push','push','examine','write','write'],\\n  foodtest:['idle','pourL','pourL','dip','dip','dip','examine','write'],"
);

const screenDemosAdd = "\\n  p4:{\\n    title:'Electric Circuits', zone:'physics', color:'#facc15',\\n    steps:[\\n      {label:'Setup Components', desc:'Place battery, switch, and LED bulb on the board.', draw:'cir_setup'},\\n      {label:'Wire 1', desc:'Connect wire from battery positive to the switch.', draw:'cir_wire1'},\\n      {label:'Wire 2', desc:'Connect wire from switch to the LED bulb.', draw:'cir_wire2'},\\n      {label:'Wire 3', desc:'Connect LED back to battery negative to complete the loop.', draw:'cir_wire3'},\\n      {label:'Close Switch', desc:'Close the switch! Electrons can now flow through the connected wires.', draw:'cir_close'},\\n      {label:'LED Lights Up', desc:'Current flows! Electric energy converts to light energy.', draw:'cir_lit'},\\n      {label:'Open Switch', desc:'Open the switch to break the path. The circuit is incomplete, LED turns off.', draw:'cir_open'}\\n    ]\\n  },\\n  p5:{\\n    title:'Convex Lenses', zone:'physics', color:'#60a5fa',\\n    steps:[\\n      {label:'Setup', desc:'Mount a convex lens in the middle. Place a laser or light source on the left.', draw:'lens_setup'},\\n      {label:'Parallel Rays', desc:'Laser shines parallel rays of light towards the convex lens.', draw:'lens_rays'},\\n      {label:'Refraction', desc:'Light enters the thicker glass and bends (refracts).', draw:'lens_refract'},\\n      {label:'Convergence', desc:'A convex lens is thicker in the middle, causing rays to converge.', draw:'lens_converge'},\\n      {label:'Focal Point', desc:'All parallel rays meet at exactly one spot: the FOCAL POINT.', draw:'lens_focus'},\\n      {label:'Focal Length', desc:'The distance from the lens to the focal point is the FOCAL LENGTH.', draw:'lens_length'}\\n    ]\\n  },\\n  b4:{\\n    title:'Stomata Observation', zone:'biology', color:'#4ade80',\\n    steps:[\\n      {label:'Epidermis Peel', desc:'Tear a leaf and peel the thin, transparent lower epidermis.', draw:'stom_peel'},\\n      {label:'Slide Prep', desc:'Place peel on slide, add water drop, and put coverslip.', draw:'stom_slide'},\\n      {label:'Microscope', desc:'Place slide on the microscope stage.', draw:'stom_scope'},\\n      {label:'Low Power', desc:'Observe under low power. See tightly packed epidermal cells with pores.', draw:'stom_low'},\\n      {label:'High Power', desc:'Observe a single pore (stoma) under high magnification.', draw:'stom_high'},\\n      {label:'Guard Cells', desc:'Identify two bean-shaped guard cells controlling the stomatal pore opening.', draw:'stom_guard'}\\n    ]\\n  },\\n  b5:{\\n    title:'Food Testing', zone:'biology', color:'#f472b6',\\n    steps:[\\n      {label:'Samples', desc:'Tube 1: Potato extract. Tube 2: Milk sample.', draw:'ft_setup'},\\n      {label:'Milk Prep', desc:'Milk is ready for protein testing.', draw:'ft_milk'},\\n      {label:'Add Iodine', desc:'Add a few drops of Iodine solution to the potato extract.', draw:'ft_iodine'},\\n      {label:'Starch Confirmed', desc:'Tube 1 turns BLUE-BLACK! Iodine confirms the presence of STARCH.', draw:'ft_starch'},\\n      {label:'Add Biuret', desc:'Add Biuret reagent (Copper Sulphate + Caustic Soda) to the milk.', draw:'ft_biuret'},\\n      {label:'Protein Confirmed', desc:'Tube 2 turns PURPLE! Biuret test confirms the presence of PROTEIN.', draw:'ft_protein'}\\n    ]\\n  },";

content = content.replace(
  "}\\n};\\n\\n// ─────────────────────────────────────────────",
  screenDemosAdd + "\\n};\\n\\n// ─────────────────────────────────────────────"
);

const drawFnsAddText = fs.readFileSync('draw_fns.txt', 'utf8');

content = content.replace(
  '// ── helpers ──',
  drawFnsAddText + '\\n\\n// ── helpers ──'
);

fs.writeFileSync(labPath, content);
console.log('Patch3 complete!');
