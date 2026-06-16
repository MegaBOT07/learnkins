export function initLab() {

'use strict';

// ════════════════════════════════════════════
// DATA
// ════════════════════════════════════════════
const EXPS = {
  chemistry:[
    {id:'c1',title:'Acid-Base Indicators',topic:'Acids, Bases & Salts',grade:7,diff:'Easy',dur:'20 min',
     apparatus:[{ic:'🧪',nm:'Test Tube'},{ic:'💧',nm:'Dropper'},{ic:'📄',nm:'Litmus Paper'},{ic:'🫙',nm:'Beaker'},{ic:'🧤',nm:'Gloves'}],
     steps:['Put on safety gloves before starting.','Pour 5 mL of lemon juice into the test tube.','Dip red litmus paper into the lemon juice.','Red litmus stays red - acid confirmed!','Dip blue litmus paper into lemon juice.','Blue litmus turns red - acidic nature confirmed.','Repeat with baking soda and record observations.'],
     outcome:'Acids turn blue litmus red. Bases turn red litmus blue. pH<7 is acidic, pH>7 is basic.',anim:'litmus'},
    {id:'c2',title:'Rusting of Iron',topic:'Metals and Non-metals',grade:8,diff:'Medium',dur:'3 days',
     apparatus:[{ic:'📌',nm:'Iron Nail'},{ic:'🧪',nm:'Test Tube'},{ic:'💦',nm:'Water'},{ic:'🫙',nm:'Oil'},{ic:'🧂',nm:'CaCl2'}],
     steps:['Label three test tubes A, B, and C.','Tube A: iron nail with water exposed to air.','Tube B: iron nail in boiled water sealed with oil.','Tube C: iron nail with calcium chloride only.','Leave all three tubes for 3 days.','Observe: only Tube A shows rust.','Conclusion: both water AND oxygen cause rusting.'],
     outcome:'Rusting requires both water and oxygen simultaneously at the metal surface.',anim:'rust'},
    {id:'c3',title:'Separating Mixtures',topic:'Separation of Substances',grade:6,diff:'Easy',dur:'15 min',
     apparatus:[{ic:'📐',nm:'Funnel'},{ic:'📋',nm:'Filter Paper'},{ic:'🫙',nm:'Beaker'},{ic:'🥢',nm:'Stirring Rod'},{ic:'🧲',nm:'Magnet'}],
     steps:['Prepare a mixture of sand and water in beaker.','Fold filter paper into a cone and place in funnel.','Place funnel over an empty clean beaker.','Slowly pour the mixture through the funnel.','Clear water (filtrate) collects below.','Sand stays on filter paper as residue.','Record filtrate vs residue observations.'],
     outcome:'Filtration separates insoluble solids from liquids using a porous filter medium.',anim:'filter'},
    {id:'c4',title:'Chemical vs Physical',topic:'Physical & Chemical Changes',grade:7,diff:'Easy',dur:'25 min',
     apparatus:[{ic:'🧊',nm:'Ice Cube'},{ic:'🔥',nm:'Burner'},{ic:'🧪',nm:'Vinegar'},{ic:'🧂',nm:'Baking Soda'},{ic:'🎈',nm:'Balloon'}],
     steps:['Melt an ice cube over the burner.','Ice turns to water. This is a PHYSICAL change (reversible).','Add baking soda to a flask.','Pour in vinegar and quickly attach the balloon.','Reaction releases Carbon Dioxide gas, inflating balloon.','This is a CHEMICAL change (new substance formed, irreversible).','Compare the two types of changes.'],
     outcome:'Physical changes are usually reversible. Chemical changes form new substances and are irreversible.',anim:'c4'},
    {id:'c5',title:'Crystallization',topic:'Physical & Chemical Changes',grade:7,diff:'Hard',dur:'2 days',
     apparatus:[{ic:'💧',nm:'Water'},{ic:'🥣',nm:'Copper Sulphate'},{ic:'🔥',nm:'Burner'},{ic:'🫙',nm:'Beaker'},{ic:'🥢',nm:'Stirring Rod'}],
     steps:['Boil a beaker of water over the burner.','Add Copper Sulphate powder while stirring.','Keep adding until no more powder can dissolve (saturated).','Filter the hot solution into a clean beaker.','Allow the solution to cool completely undisturbed.','Leave for 1-2 days.','Observe large, pure blue crystals forming!'],
     outcome:'Crystallization is a physical change used to obtain large pure crystals of a substance.',anim:'c5'},
  ],
  physics:[
    {id:'p1',title:'Light Reflection',topic:'Light',grade:7,diff:'Easy',dur:'25 min',
     apparatus:[{ic:'🪞',nm:'Plane Mirror'},{ic:'🔦',nm:'Torch'},{ic:'📐',nm:'Protractor'},{ic:'📃',nm:'White Paper'},{ic:'📏',nm:'Ruler'}],
     steps:['Place plane mirror vertically on white paper.','Draw a normal (perpendicular) line to mirror surface.','Shine torch at 30 degrees to the normal.','Mark where the reflected ray falls on paper.','Measure the angle of reflection.','Repeat for 45 and 60 degree angles.','Record: angle of incidence equals angle of reflection.'],
     outcome:'Law of Reflection: the angle of incidence always equals the angle of reflection.',anim:'reflect'},
    {id:'p2',title:'Friction on Surfaces',topic:'Friction',grade:8,diff:'Medium',dur:'30 min',
     apparatus:[{ic:'🟫',nm:'Wooden Block'},{ic:'⚖️',nm:'Spring Balance'},{ic:'🟧',nm:'Sandpaper'},{ic:'🟨',nm:'Smooth Board'},{ic:'🏋️',nm:'Weights'}],
     steps:['Attach wooden block to spring balance.','Place block on the smooth wooden board.','Pull gently until block just starts moving.','Record the force - static friction on smooth surface.','Place sandpaper under the block and repeat.','Compare: sandpaper requires more force.','Rougher surfaces produce greater friction.'],
     outcome:'Friction force depends on surface roughness and the normal force (weight) applied.',anim:'friction'},
    {id:'p3',title:'Magnets & Field Lines',topic:'Magnetism',grade:6,diff:'Easy',dur:'20 min',
     apparatus:[{ic:'🧲',nm:'Bar Magnet'},{ic:'✨',nm:'Iron Filings'},{ic:'🧭',nm:'Compass'},{ic:'📃',nm:'White Paper'},{ic:'📏',nm:'Ruler'}],
     steps:['Place the bar magnet flat on white paper.','Sprinkle iron filings gently around the magnet.','Tap paper lightly to help filings align.','Observe the magnetic field line pattern.','Use compass to determine field direction.','Field lines emerge from N and enter S pole.','Sketch the complete magnetic field pattern.'],
     outcome:'Magnetic field lines run from North to South pole outside the magnet.',anim:'magnet'},
    {id:'p4',title:'Electric Circuits',topic:'Electricity',grade:6,diff:'Medium',dur:'30 min',
     apparatus:[{ic:'🔋',nm:'Battery'},{ic:'💡',nm:'LED Bulb'},{ic:'🔌',nm:'Wires'},{ic:'🔘',nm:'Switch'}],
     steps:['Place the battery on the board.','Connect a wire from the positive terminal to the switch.','Connect a wire from the switch to the LED bulb.','Connect the LED bulb back to the negative terminal.','Close the switch to complete the circuit.','The LED lights up!','Open the switch to break the circuit.'],
     outcome:'A closed path allows electric current to flow, lighting the bulb.',anim:'p4'},
    {id:'p5',title:'Convex Lenses',topic:'Light',grade:8,diff:'Medium',dur:'25 min',
     apparatus:[{ic:'🔍',nm:'Convex Lens'},{ic:'🔦',nm:'Light Source'},{ic:'📏',nm:'Optical Bench'},{ic:'📃',nm:'Screen'}],
     steps:['Mount the convex lens on the optical bench.','Place the light source (candle/laser) on one side.','Turn on the light source.','Move the screen on the other side until a sharp image forms.','Observe the light rays converging to a focal point.','Measure the focal length of the lens.'],
     outcome:'Convex lenses converge parallel light rays to a focal point.',anim:'p5'}
  ],
  biology:[
    {id:'b1',title:'Parts of a Flower',topic:'Getting to Know Plants',grade:6,diff:'Easy',dur:'30 min',
     apparatus:[{ic:'🌺',nm:'Hibiscus'},{ic:'🥄',nm:'Forceps'},{ic:'🔍',nm:'Hand Lens'},{ic:'🟦',nm:'Glass Slide'},{ic:'🪡',nm:'Needle'}],
     steps:['Take a fresh hibiscus flower specimen.','Remove the green sepals (calyx) carefully.','Peel off the colourful petals (corolla).','Identify stamens - the male reproductive parts.','Locate the pistil (carpel) at the centre.','Use hand lens to examine pollen on stamens.','Draw and label all four floral whorls.'],
     outcome:'Flowers have four main parts: sepals, petals, stamens (male) and pistil (female).',anim:'flower'},
    {id:'b2',title:'Onion Cell Observation',topic:'Cell Structure',grade:7,diff:'Medium',dur:'35 min',
     apparatus:[{ic:'🧅',nm:'Onion'},{ic:'🟦',nm:'Glass Slide'},{ic:'⬜',nm:'Coverslip'},{ic:'🟤',nm:'Iodine'},{ic:'🔬',nm:'Microscope'}],
     steps:['Peel a thin transparent layer from onion.','Place the peel flat on a clean glass slide.','Add one drop of iodine solution to stain cells.','Lower coverslip at an angle to avoid bubbles.','Place slide on the microscope stage.','Focus with low-power objective lens first.','Switch to high power - observe cell wall and nucleus.'],
     outcome:'Plant cells have a distinct cell wall and nucleus clearly visible when stained with iodine.',anim:'microscope'},
    {id:'b3',title:'Photosynthesis Test',topic:'Nutrition in Plants',grade:8,diff:'Medium',dur:'40 min',
     apparatus:[{ic:'🍃',nm:'Leaf'},{ic:'🫙',nm:'Beaker'},{ic:'🧴',nm:'Ethanol'},{ic:'🟤',nm:'Iodine'},{ic:'🫧',nm:'Water Bath'}],
     steps:['Take a variegated leaf with green and white patches.','Boil the leaf in water for 5 minutes.','Transfer to beaker with alcohol in a water bath.','Heat until leaf is decolourised completely.','Wash the decolourised leaf with water.','Add iodine solution drops over the entire leaf.','Green areas turn blue-black; white areas stay brown.'],
     outcome:'Only chlorophyll-containing (green) areas perform photosynthesis and produce starch.',anim:'leaf'},
    {id:'b4',title:'Stomata Observation',topic:'Getting to Know Plants',grade:6,diff:'Hard',dur:'35 min',
     apparatus:[{ic:'🌱',nm:'Fresh Leaf'},{ic:'🥄',nm:'Forceps'},{ic:'🟦',nm:'Glass Slide'},{ic:'🔴',nm:'Safranin Stain'},{ic:'🔬',nm:'Microscope'}],
     steps:['Tear a fresh leaf to peel off a thin transparent layer from the lower surface.','Place the peel in water on a glass slide.','Add a drop of Safranin stain.','Gently cover with a coverslip, avoiding air bubbles.','Observe under the microscope at low power.','Switch to high power.','Notice kidney-shaped guard cells surrounding tiny pores (stomata).'],
     outcome:'Leaves have tiny pores called stomata on their lower surface used for gas exchange and transpiration.',anim:'b4'},
    {id:'b5',title:'Food Adulteration',topic:'Components of Food',grade:6,diff:'Easy',dur:'20 min',
     apparatus:[{ic:'🥛',nm:'Milk Sample'},{ic:'🟤',nm:'Iodine'},{ic:'🧪',nm:'Test Tube'},{ic:'💧',nm:'Dropper'},{ic:'🥣',nm:'Turmeric'}],
     steps:['Take a sample of milk in a test tube.','Add a few drops of Iodine solution.','Observe the colour change.','If it turns blue-black, starch (adulterant) is present!','Now take turmeric powder in another tube.','Add water and a few drops of concentrated acid.','If it turns magenta/red, it is adulterated with metanil yellow dye.'],
     outcome:'Simple chemical tests can identify harmful adulterants mixed into common foods for profit.',anim:'b5'},
  ]
};

const ZONE_CFG = {
  chemistry:{label:'Chemistry Lab',col:0xff6600,hex:'#ff6600',hi:0xff9944,tx:-8.5,tz:-1,cx:-12.5,cz:-6},
  physics:  {label:'Physics Lab',  col:0x3344cc,hex:'#5566ff',hi:0x6677ff,tx:0,   tz:-1,cx:-0.5, cz:-6},
  biology:  {label:'Biology Lab',  col:0x226633,hex:'#44aa55',hi:0x55cc66,tx:8.5,  tz:-1,cx:11.5, cz:-6},
};

// ════════════════════════════════════════════
// RENDERER + SCENE
// ════════════════════════════════════════════
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2ede4);
scene.fog = new THREE.FogExp2(0xf2ede4, 0.028);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth/window.innerHeight, 0.05, 60);
camera.position.set(0,3,8);

const clock = new THREE.Clock();

// ════════════════════════════════════════════
// LIGHTING
// ════════════════════════════════════════════
scene.add(new THREE.AmbientLight(0xfff5e8, 0.65));
const sun = new THREE.DirectionalLight(0xfff8f0, 0.45);
sun.position.set(5,10,3); sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024); scene.add(sun);

const ceilLights = [];
[[-7,4.85,0],[-7,4.85,-8],[0,4.85,0],[0,4.85,-8],[7,4.85,0],[7,4.85,-8]].forEach(([x,y,z])=>{
  const pl = new THREE.PointLight(0xfff5e0, 0.7, 16);
  pl.position.set(x,y,z); pl.castShadow=true; pl.shadow.mapSize.set(256,256); scene.add(pl); ceilLights.push(pl);
  const fix = new THREE.Mesh(new THREE.BoxGeometry(0.7,0.06,0.7),new THREE.MeshStandardMaterial({color:0xffffdd,emissive:0xffffbb,emissiveIntensity:0.55}));
  fix.position.set(x,4.9,z); scene.add(fix);
});

// ════════════════════════════════════════════
// MATERIALS (shared)
// ════════════════════════════════════════════
const M = {
  wall:   new THREE.MeshStandardMaterial({color:0xf6f2ec,roughness:0.95}),
  floor:  new THREE.MeshStandardMaterial({color:0xe0d8c8,roughness:0.85}),
  ceil:   new THREE.MeshStandardMaterial({color:0xfafaf8,roughness:1.0}),
  wood:   new THREE.MeshStandardMaterial({color:0x9a6840,roughness:0.65}),
  metal:  new THREE.MeshStandardMaterial({color:0x888899,roughness:0.35,metalness:0.65}),
  glass:  new THREE.MeshStandardMaterial({color:0x99ccff,transparent:true,opacity:0.22,roughness:0.04,metalness:0.15}),
  black:  new THREE.MeshStandardMaterial({color:0x1a361a,roughness:0.92}),
  skin:   new THREE.MeshStandardMaterial({color:0xf2b88a,roughness:0.75}),
  coat:   new THREE.MeshStandardMaterial({color:0xeeeee8,roughness:0.82}),
  shirt:  new THREE.MeshStandardMaterial({color:0x3366ee,roughness:0.8}),
  pants:  new THREE.MeshStandardMaterial({color:0x223355,roughness:0.85}),
  shoe:   new THREE.MeshStandardMaterial({color:0x111122,roughness:0.92}),
  hair:   new THREE.MeshStandardMaterial({color:0x2a1200,roughness:0.95}),
  board:  new THREE.MeshStandardMaterial({color:0x1a381a,roughness:0.9}),
};

// ════════════════════════════════════════════
// ROOM
// ════════════════════════════════════════════
// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(34,28), M.floor);
floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);
const grid = new THREE.GridHelper(34,34,0xbbaaa0,0xbbaaa0);
grid.material.opacity=0.12; grid.material.transparent=true; grid.position.y=0.001; scene.add(grid);

// Ceiling
const ceil = new THREE.Mesh(new THREE.PlaneGeometry(34,28), M.ceil);
ceil.rotation.x=Math.PI/2; ceil.position.y=5; scene.add(ceil);

// Walls
[{s:[34,5],p:[0,2.5,-14],ry:0},{s:[34,5],p:[0,2.5,14],ry:Math.PI},
 {s:[28,5],p:[-17,2.5,0],ry:Math.PI/2},{s:[28,5],p:[17,2.5,0],ry:-Math.PI/2}
].forEach(w=>{
  const m=new THREE.Mesh(new THREE.PlaneGeometry(...w.s),M.wall.clone());
  m.position.set(...w.p); m.rotation.y=w.ry; m.receiveShadow=true; scene.add(m);
});

// Zone dividers on floor
[-5.5,5.5].forEach(x=>{
  const d=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.012,28),new THREE.MeshStandardMaterial({color:0xc0b090}));
  d.position.set(x,0.006,0); scene.add(d);
});

// Blackboard
(()=>{
  const frm=new THREE.Mesh(new THREE.BoxGeometry(11,3.2,0.14),M.wood);
  frm.position.set(0,3.1,-13.85); scene.add(frm);
  const brd=new THREE.Mesh(new THREE.BoxGeometry(10.6,2.85,0.06),M.board);
  brd.position.set(0,3.1,-13.78); scene.add(brd);
  // Chalk tray
  const tray=new THREE.Mesh(new THREE.BoxGeometry(10.6,0.1,0.22),M.wood);
  tray.position.set(0,1.67,-13.8); scene.add(tray);
  // Zone labels as colored bars
  [{x:-8.5,c:0xff6600},{x:0,c:0x4455dd},{x:8.5,c:0x44aa55}].forEach(b=>{
    const bar=new THREE.Mesh(new THREE.BoxGeometry(4.5,0.08,0.04),new THREE.MeshStandardMaterial({color:b.c,emissive:b.c,emissiveIntensity:0.3}));
    bar.position.set(b.x,2.1,-13.74); scene.add(bar);
  });
})();

// Windows
[-6,0,6].forEach(z=>{
  const frm=new THREE.Mesh(new THREE.BoxGeometry(0.12,2.4,3.2),new THREE.MeshStandardMaterial({color:0xddd0b8}));
  frm.position.set(16.94,3,z); scene.add(frm);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(2.9,2.1),M.glass);
  g.rotation.y=-Math.PI/2; g.position.set(16.92,3,z); scene.add(g);
  const sky=new THREE.PointLight(0xc8e0ff,0.3,9);
  sky.position.set(15,3,z); scene.add(sky);
});

// ════════════════════════════════════════════
// LAB ZONE BUILDER (tables + cabinets)
// ════════════════════════════════════════════
const interactables = [];
// For each zone: map of 3D objects on table that animate
const tableObjects = {}; // zone -> {objects by name}
const cabinetObjects = {};

function buildZone(zk){
  const c = ZONE_CFG[zk];
  const tmat = new THREE.MeshStandardMaterial({color:c.col,roughness:0.45,metalness:0.06});

  // TABLE
  const tabletop = new THREE.Mesh(new THREE.BoxGeometry(5.5,0.11,3.2),tmat);
  tabletop.position.set(c.tx,1.02,c.tz); tabletop.castShadow=true; tabletop.receiveShadow=true; scene.add(tabletop);
  // Apron
  const apronF = new THREE.Mesh(new THREE.BoxGeometry(5.3,0.14,0.06),new THREE.MeshStandardMaterial({color:c.col,roughness:0.5}));
  apronF.position.set(c.tx,0.95,c.tz+1.6); scene.add(apronF);
  // Legs
  [2.1,-2.1].forEach(dx=>[1.3,-1.3].forEach(dz=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.02,0.1),M.wood);
    leg.position.set(c.tx+dx,0.51,c.tz+dz); leg.castShadow=true; scene.add(leg);
  }));
  // Under shelf
  const shelf=new THREE.Mesh(new THREE.BoxGeometry(5.1,0.05,2.8),M.wood);
  shelf.position.set(c.tx,0.32,c.tz); scene.add(shelf);
  // Label plate
  const lmat=new THREE.MeshStandardMaterial({color:c.col,emissive:c.col,emissiveIntensity:0.18,roughness:0.6});
  const lp=new THREE.Mesh(new THREE.BoxGeometry(2,0.04,0.55),lmat);
  lp.position.set(c.tx,1.08,c.tz-1.28); scene.add(lp);
  // Stool
  const stoolT=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.055,18),new THREE.MeshStandardMaterial({color:0x7a5230,roughness:0.7}));
  stoolT.position.set(c.tx,0.65,c.tz+2.4); scene.add(stoolT);
  const stoolL=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.6,8),M.metal);
  stoolL.position.set(c.tx,0.32,c.tz+2.4); scene.add(stoolL);

  // Build decorative items + animated preview objects
  tableObjects[zk] = buildTableItems(zk, c.tx, c.tz);

  // Invisible hit box for table
  const thit=new THREE.Mesh(new THREE.BoxGeometry(5.6,2.5,4),new THREE.MeshBasicMaterial({visible:false}));
  thit.position.set(c.tx,1,c.tz+0.5); thit.userData={type:'table',zone:zk}; scene.add(thit); interactables.push(thit);

  // CABINET
  buildCabinet(zk, c.cx, c.cz, c.col, c.hi);
}

function buildTableItems(zk, tx, tz){
  const objs = {};
  if(zk==='chemistry'){
    // Test tube rack - solid wood
    const rack=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.09,0.2),M.wood);
    rack.position.set(tx-1.4,1.075,tz-0.5); scene.add(rack);
    const tubes=[];
    // Rack posts
    [0,0.24,0.48].forEach(dx=>{
      const post=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.22,8),M.wood);
      post.position.set(tx-1.55+dx,1.19,tz-0.5); scene.add(post);
    });
    // Solid opaque test tubes (no transparency - fixes invisibility)
    [0,0.24,0.48].forEach((dx,i)=>{
      // Outer tube body - solid coloured glass look
      const tubeMat=new THREE.MeshStandardMaterial({color:[0xee2222,0xddcc00,0x22cc88][i],roughness:0.2,metalness:0.1,depthWrite:true});
      const tubeBody=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.036,0.26,12),tubeMat);
      tubeBody.position.set(tx-1.55+dx,1.22,tz-0.5); scene.add(tubeBody); tubes.push(tubeBody);
      // Liquid fill inside (solid, smaller)
      const liqFillMat=new THREE.MeshStandardMaterial({color:[0xff5555,0xffee33,0x44ffaa][i],roughness:0.15,metalness:0.0,depthWrite:true});
      const liqFill=new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.025,0.1,10),liqFillMat);
      liqFill.position.set(tx-1.55+dx,1.14,tz-0.5); scene.add(liqFill);
    });
    objs.tubes=tubes;

    // Beaker - use a solid ring + base instead of transparent cylinder
    // Beaker base
    const bkBase=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.16,0.04,18),new THREE.MeshStandardMaterial({color:0x88bbdd,roughness:0.1,metalness:0.25,depthWrite:true}));
    bkBase.position.set(tx+0.6,1.065,tz); scene.add(bkBase);
    // Beaker wall (open top cylinder - solid)
    const bkWallMat=new THREE.MeshStandardMaterial({color:0x99ccee,roughness:0.1,metalness:0.2,side:THREE.DoubleSide,depthWrite:true});
    const bkWall=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.16,0.28,18,1,true),bkWallMat);
    bkWall.position.set(tx+0.6,1.19,tz); scene.add(bkWall);
    const beaker=bkWall; // ref for animations
    // Liquid inside beaker - solid yellow
    const liqM=new THREE.MeshStandardMaterial({color:0xeedd77,roughness:0.3,depthWrite:true});
    const liq=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.13,0.1,16),liqM);
    liq.position.set(tx+0.6,1.1,tz); scene.add(liq);
    objs.beaker=beaker; objs.liquid=liq; objs.liqMat=liqM;

    // Litmus strip - solid blue strip, visible as prop
    const litM=new THREE.MeshStandardMaterial({color:0x3355ee,roughness:0.8,depthWrite:true});
    const litmus=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.24,0.012),litM);
    litmus.position.set(tx-1.55,1.22,tz-0.5); litmus.visible=false; scene.add(litmus);
    objs.litmus=litmus; objs.litmusMat=litM;

    // Bunsen burner - solid metal
    const bb=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.14,0.24,12),M.metal);
    bb.position.set(tx+1.5,1.13,tz-0.4); scene.add(bb);
    const bbpipe=new THREE.Mesh(new THREE.CylinderGeometry(0.032,0.032,0.34,8),M.metal);
    bbpipe.position.set(tx+1.5,1.35,tz-0.4); scene.add(bbpipe);
    // Collar ring
    const bbring=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.014,8,14),new THREE.MeshStandardMaterial({color:0x555566,roughness:0.4,metalness:0.7}));
    bbring.position.set(tx+1.5,1.26,tz-0.4); bbring.rotation.x=Math.PI/2; scene.add(bbring);
    // Flame - solid emissive cone (hidden until active)
    const flameMat=new THREE.MeshStandardMaterial({color:0xff7700,emissive:0xff5500,emissiveIntensity:1.2,roughness:0.8,depthWrite:true});
    const flame=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.2,10),flameMat);
    flame.position.set(tx+1.5,1.58,tz-0.4); flame.visible=false; scene.add(flame);
    objs.flame=flame;

    // Dropper bottle
    const bottleMat=new THREE.MeshStandardMaterial({color:0x884400,roughness:0.4,depthWrite:true});
    const bottle=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,0.22,10),bottleMat);
    bottle.position.set(tx+1.2,1.14,tz+0.5); scene.add(bottle);
    const bottleTop=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.04,0.1,8),bottleMat);
    bottleTop.position.set(tx+1.2,1.3,tz+0.5); scene.add(bottleTop);
  }

  if(zk==='physics'){
    // Mirror stand - solid metal post
    const mstand=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.55,0.1),M.metal);
    mstand.position.set(tx-1.2,1.34,tz); scene.add(mstand);
    // Mirror face - solid reflective silver (no transparency)
    const mfaceMat=new THREE.MeshStandardMaterial({color:0xddeeff,roughness:0.02,metalness:0.95,depthWrite:true});
    const mface=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.48,0.3),mfaceMat);
    mface.position.set(tx-1.16,1.34,tz); scene.add(mface);
    // Mirror backing (dark)
    const mback=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.5,0.32),new THREE.MeshStandardMaterial({color:0x222233,roughness:0.8,depthWrite:true}));
    mback.position.set(tx-1.2,1.34,tz); scene.add(mback);
    // Mirror base foot
    const mfoot=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.04,0.28),M.metal);
    mfoot.position.set(tx-1.18,1.065,tz); scene.add(mfoot);

    // Prism - solid tinted (no transparency)
    const prismMat=new THREE.MeshStandardMaterial({color:0x55aacc,roughness:0.05,metalness:0.3,depthWrite:true});
    const prism=new THREE.Mesh(new THREE.CylinderGeometry(0,0.2,0.44,3),prismMat);
    prism.position.set(tx+0.7,1.29,tz); scene.add(prism);
    objs.prism=prism;

    // Light ray beams - solid emissive boxes (hidden, revealed by FX)
    const rayMat=new THREE.MeshStandardMaterial({color:0xffee00,emissive:0xffdd00,emissiveIntensity:2.0,roughness:0.0,depthWrite:true});
    const rayG=new THREE.BoxGeometry(0.018,0.018,1.4);
    const ray=new THREE.Mesh(rayG,rayMat);
    ray.position.set(tx-0.5,1.3,tz); ray.visible=false; scene.add(ray);
    objs.ray=ray; objs.rayMat=rayMat;
    const ray2Mat=new THREE.MeshStandardMaterial({color:0xffbb00,emissive:0xff9900,emissiveIntensity:2.0,roughness:0.0,depthWrite:true});
    const ray2=new THREE.Mesh(rayG.clone(),ray2Mat);
    ray2.position.set(tx-0.5,1.3,tz); ray2.visible=false; scene.add(ray2);
    objs.ray2=ray2; objs.ray2Mat=ray2Mat;

    // Wooden block for friction
    const block=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.14,0.2),M.wood);
    block.position.set(tx+0.5,1.09,tz+0.5); scene.add(block);
    objs.block=block;

    // Spring balance - solid
    const sb=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.38,0.09),M.metal);
    sb.position.set(tx+1.6,1.27,tz-0.4); scene.add(sb);
    const sbDial=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.02,12),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.9,depthWrite:true}));
    sbDial.position.set(tx+1.6,1.35,tz-0.36); sbDial.rotation.x=Math.PI/2; scene.add(sbDial);
    const sbhook=new THREE.Mesh(new THREE.TorusGeometry(0.055,0.012,8,12,Math.PI),M.metal);
    sbhook.position.set(tx+1.6,1.47,tz-0.4); sbhook.rotation.z=Math.PI; scene.add(sbhook);

    // Horseshoe magnet - solid red+grey
    const magRedMat=new THREE.MeshStandardMaterial({color:0xcc2222,roughness:0.4,metalness:0.25,depthWrite:true});
    const magGreyMat=new THREE.MeshStandardMaterial({color:0x888899,roughness:0.4,metalness:0.3,depthWrite:true});
    const mag=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.052,8,18,Math.PI),magRedMat);
    mag.position.set(tx-1.7,1.21,tz+0.4); scene.add(mag);
    // Pole tips
    [-1,1].forEach(s=>{
      const tip=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.06),s<0?magRedMat:magGreyMat);
      tip.position.set(tx-1.7+s*0.17,1.13,tz+0.4); scene.add(tip);
    });
    objs.mag=mag;

    // Protractor (flat semicircle look)
    const protMat=new THREE.MeshStandardMaterial({color:0xddcc88,roughness:0.7,depthWrite:true});
    const prot=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.015,24,1,false,0,Math.PI),protMat);
    prot.position.set(tx-0.3,1.08,tz-0.7); prot.rotation.x=-Math.PI/2; scene.add(prot);
    // Ruler
    const ruler=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.015,0.06),new THREE.MeshStandardMaterial({color:0xddcc77,roughness:0.6,depthWrite:true}));
    ruler.position.set(tx+0.1,1.08,tz-0.55); scene.add(ruler);
  }
  if(zk==='biology'){
    // Microscope
    const mscBase=new THREE.Mesh(new THREE.BoxGeometry(0.36,0.07,0.32),M.metal);
    mscBase.position.set(tx-0.9,1.085,tz); scene.add(mscBase);
    const mscArm=new THREE.Mesh(new THREE.BoxGeometry(0.065,0.58,0.065),M.metal);
    mscArm.position.set(tx-0.9,1.4,tz-0.06); scene.add(mscArm);
    const mscLens=new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.08,0.2,12),M.metal);
    mscLens.position.set(tx-0.9,1.73,tz-0.06); scene.add(mscLens);
    const mscEye=new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.038,0.12,10),M.metal);
    mscEye.position.set(tx-0.9,1.85,tz-0.06); scene.add(mscEye);
    // Slide on microscope
    const slG=new THREE.BoxGeometry(0.28,0.008,0.1);
    const slM=new THREE.MeshStandardMaterial({color:0xddeecc,transparent:true,opacity:0.85,roughness:0.1});
    const slide=new THREE.Mesh(slG,slM);
    slide.position.set(tx-0.9,1.085,tz+0.02); scene.add(slide);
    objs.slide=slide;
    // Petri dishes
    [0.22,-0.22].forEach(dz=>{
      const pd=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.19,0.035,20),new THREE.MeshStandardMaterial({color:0xccffdd,transparent:true,opacity:0.6}));
      pd.position.set(tx+1.1,1.052,tz+dz); scene.add(pd);
    });
    // Leaf specimen
    const leafMat=new THREE.MeshStandardMaterial({color:0x228822,roughness:0.85});
    const leaf=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,8),leafMat);
    leaf.scale.set(2.2,0.3,1.2);
    leaf.position.set(tx+1.8,1.07,tz); scene.add(leaf);
    objs.leaf=leaf; objs.leafMat=leafMat;
    // Plant
    const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.08,0.18,12),new THREE.MeshStandardMaterial({color:0x9a5a28,roughness:0.9}));
    pot.position.set(tx+2,1.17,tz); scene.add(pot);
    const pl=new THREE.Mesh(new THREE.SphereGeometry(0.2,10,10),new THREE.MeshStandardMaterial({color:0x228822,roughness:0.88}));
    pl.position.set(tx+2,1.44,tz); scene.add(pl);
  }
  return objs;
}

function buildCabinet(zk, cx, cz, col, hi){
  const cmat=new THREE.MeshStandardMaterial({color:0xd6ccb2,roughness:0.7});
  const body=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.1,0.72),cmat);
  body.position.set(cx,1.55,cz); body.castShadow=true; scene.add(body);
  const topcol=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.1,0.74),new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:0.22,roughness:0.6}));
  topcol.position.set(cx,3.15,cz); scene.add(topcol);
  // Doors
  [-0.58,0.58].forEach(dx=>{
    const door=new THREE.Mesh(new THREE.BoxGeometry(1.08,2.9,0.055),new THREE.MeshStandardMaterial({color:0xe8dcc4,roughness:0.65}));
    door.position.set(cx+dx,1.55,cz+0.4); scene.add(door);
    const win=new THREE.Mesh(new THREE.BoxGeometry(0.76,1.5,0.02),M.glass);
    win.position.set(cx+dx,1.62,cz+0.43); scene.add(win);
    const handle=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.26,0.07),M.metal);
    handle.position.set(cx+dx+(dx<0?0.24:-0.24),1.55,cz+0.45); scene.add(handle);
  });
  // Feet
  [-0.9,0.9].forEach(dx=>{
    const ft=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.09,0.55),M.metal);
    ft.position.set(cx+dx,0.045,cz); scene.add(ft);
  });
  // Invisible hit
  const chit=new THREE.Mesh(new THREE.BoxGeometry(2.6,3.4,1.2),new THREE.MeshBasicMaterial({visible:false}));
  chit.position.set(cx,1.6,cz+0.1); chit.userData={type:'cabinet',zone:zk}; scene.add(chit); interactables.push(chit);
  cabinetObjects[zk]=chit;
}

['chemistry','physics','biology'].forEach(z=>buildZone(z));

// Teacher desk
(()=>{
  const dmat=new THREE.MeshStandardMaterial({color:0x7a5230,roughness:0.6});
  const top=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.09,1.6),dmat);
  top.position.set(0,0.82,-10.5); scene.add(top);
  [1.1,-1.1].forEach(dx=>[0.6,-0.6].forEach(dz=>{
    const l=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.82,0.09),M.wood);
    l.position.set(dx,0.41,-10.5+dz); scene.add(l);
  }));
  const globe=new THREE.Mesh(new THREE.SphereGeometry(0.2,16,16),new THREE.MeshStandardMaterial({color:0x4488cc,roughness:0.5}));
  globe.position.set(0.9,0.99,-10.5); scene.add(globe);
  const gst=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.09,0.15,10),M.metal);
  gst.position.set(0.9,0.82,-10.5); scene.add(gst);
})();

// ════════════════════════════════════════════
// CHARACTER WITH ARTICULATED ARMS
// ════════════════════════════════════════════
let char = {};

function buildCharacter(){
  const root = new THREE.Group();

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.52,0.22),M.coat);
  torso.position.y=0.85; torso.castShadow=true; root.add(torso);
  const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.38,0.28,0.24),M.shirt);
  shirt.position.set(0,0.78,0); root.add(shirt);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.32,0.28),M.skin);
  head.position.y=1.28; head.castShadow=true; root.add(head);
  const hair = new THREE.Mesh(new THREE.BoxGeometry(0.34,0.16,0.3),M.hair);
  hair.position.set(0,1.43,0); root.add(hair);
  const hairB = new THREE.Mesh(new THREE.BoxGeometry(0.34,0.18,0.06),M.hair);
  hairB.position.set(0,1.35,-0.14); root.add(hairB);

  // Eyes
  [-0.07,0.07].forEach(ex=>{
    const eye=new THREE.Mesh(new THREE.SphereGeometry(0.038,8,8),new THREE.MeshStandardMaterial({color:0x111122}));
    eye.position.set(ex,1.29,0.138); root.add(eye);
    const shine=new THREE.Mesh(new THREE.SphereGeometry(0.012,6,6),new THREE.MeshStandardMaterial({color:0xffffff}));
    shine.position.set(ex+0.014,1.3,0.148); root.add(shine);
  });

  // Goggles
  const gmat=new THREE.MeshStandardMaterial({color:0x888880,roughness:0.4,metalness:0.4});
  const glmat=new THREE.MeshStandardMaterial({color:0x88ccff,transparent:true,opacity:0.5,roughness:0.05});
  [-0.09,0.09].forEach(gx=>{
    const gr=new THREE.Mesh(new THREE.TorusGeometry(0.062,0.016,8,16),gmat);
    gr.position.set(gx,1.29,0.14); gr.rotation.y=Math.PI/2; root.add(gr);
    const gl=new THREE.Mesh(new THREE.CircleGeometry(0.052,16),glmat);
    gl.position.set(gx,1.29,0.145); root.add(gl);
  });
  const gb=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.012,0.04),gmat);
  gb.position.set(0,1.29,0.142); root.add(gb);

  // Neck
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.065,0.09,10),M.skin);
  neck.position.y=1.09; root.add(neck);

  // Legs
  [-0.1,0.1].forEach((lx,li)=>{
    const lg=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.52,0.17),M.pants);
    lg.position.set(lx,0.32,0); root.add(lg);
    char['leg'+li]=lg;
    const sh=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.09,0.23),M.shoe);
    sh.position.set(lx,0.045,0.04); root.add(sh);
  });

  // === ARTICULATED ARMS (pivot at shoulder) ===
  // Left arm group (pivot at shoulder)
  const lShoulder = new THREE.Group();
  lShoulder.position.set(-0.26, 1.06, 0);
  root.add(lShoulder);
  char.lShoulder = lShoulder;

  const lUpper = new THREE.Mesh(new THREE.BoxGeometry(0.13,0.28,0.13),M.coat);
  lUpper.position.set(0,-0.14,0);
  lShoulder.add(lUpper);

  const lElbow = new THREE.Group();
  lElbow.position.set(0,-0.28,0);
  lShoulder.add(lElbow);
  char.lElbow = lElbow;

  const lFore = new THREE.Mesh(new THREE.BoxGeometry(0.11,0.26,0.11),M.coat);
  lFore.position.set(0,-0.13,0);
  lElbow.add(lFore);

  const lWrist = new THREE.Group();
  lWrist.position.set(0,-0.26,0);
  lElbow.add(lWrist);
  char.lWrist = lWrist;

  const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.065,8,8),M.skin);
  lHand.position.set(0,-0.065,0);
  lWrist.add(lHand);

  // Right arm group
  const rShoulder = new THREE.Group();
  rShoulder.position.set(0.26, 1.06, 0);
  root.add(rShoulder);
  char.rShoulder = rShoulder;

  const rUpper = new THREE.Mesh(new THREE.BoxGeometry(0.13,0.28,0.13),M.coat);
  rUpper.position.set(0,-0.14,0);
  rShoulder.add(rUpper);

  const rElbow = new THREE.Group();
  rElbow.position.set(0,-0.28,0);
  rShoulder.add(rElbow);
  char.rElbow = rElbow;

  const rFore = new THREE.Mesh(new THREE.BoxGeometry(0.11,0.26,0.11),M.coat);
  rFore.position.set(0,-0.13,0);
  rElbow.add(rFore);

  const rWrist = new THREE.Group();
  rWrist.position.set(0,-0.26,0);
  rElbow.add(rWrist);
  char.rWrist = rWrist;

  const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.065,8,8),M.skin);
  rHand.position.set(0,-0.065,0);
  rWrist.add(rHand);

  // Prop: test tube in right hand
  const propTube=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.036,0.26,10),new THREE.MeshStandardMaterial({color:0xaaddff,transparent:true,opacity:0.65,roughness:0.04}));
  propTube.position.set(0,-0.14,0); propTube.visible=false;
  rWrist.add(propTube); char.propTube=propTube;
  char.propTubeMat=propTube.material;

  // Prop: litmus strip in left hand
  const propLitmus=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.2,0.01),new THREE.MeshStandardMaterial({color:0x4466ff,roughness:0.9}));
  propLitmus.position.set(0,-0.12,0); propLitmus.visible=false;
  lWrist.add(propLitmus); char.propLitmus=propLitmus;
  char.propLitmusMat=propLitmus.material;

  // Prop: torch in right hand
  const propTorch=new THREE.Mesh(new THREE.CylinderGeometry(0.038,0.048,0.2,10),new THREE.MeshStandardMaterial({color:0x444433,roughness:0.7}));
  propTorch.position.set(0,-0.14,0); propTorch.visible=false;
  rWrist.add(propTorch); char.propTorch=propTorch;

  // Prop: leaf in left hand
  const propLeaf=new THREE.Mesh(new THREE.SphereGeometry(0.1,8,6),new THREE.MeshStandardMaterial({color:0x228822,roughness:0.85}));
  propLeaf.scale.set(1.8,0.25,1.1);
  propLeaf.position.set(0,-0.1,0); propLeaf.visible=false;
  lWrist.add(propLeaf); char.propLeaf=propLeaf;
  char.propLeafMat=propLeaf.material;

  root.position.set(0,0,6);
  root.castShadow=true;
  scene.add(root);
  char.root=root;

  return root;
}
buildCharacter();

// ════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════
const state = {
  mode:'free',      // free | walking | performing
  zone:null,
  exp:null,
  step:0,
  collected:[],
  walkTarget:null,
  walkCallback:null,
  performing:false,
  expPhase:0,       // animation sub-phase within current step
  phaseT:0,         // time in current phase
  gradeFilter:'All', // filter for experiments in panel
};

// ════════════════════════════════════════════
// INPUT
// ════════════════════════════════════════════
const keys={};
const mb={w:false,a:false,s:false,d:false};
document.addEventListener('keydown',e=>{
  keys[e.key.toLowerCase()]=true;
  if(e.key.toLowerCase()==='e') tryInteract();
});
document.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});

['w','a','s','d'].forEach(k=>{
  const b=document.getElementById('d'+k);
  b.addEventListener('pointerdown',()=>{mb[k]=true;b.classList.add('on');});
  ['pointerup','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>{mb[k]=false;b.classList.remove('on');}));
});

function isKey(k){return keys[k]||mb[k]||false;}

// ════════════════════════════════════════════
// MOVEMENT & WALK TO TARGET
// ════════════════════════════════════════════
let walkCycle=0, charAngle=0, isMoving=false;
const SPEED=0.07, BOUNDS={x:[-15,15],z:[-12,12]};

function updateFreeMove(){
  if(state.mode!=='free') return;
  let dx=0,dz=0;
  if(isKey('w')||isKey('arrowup'))    dz=-1;
  if(isKey('s')||isKey('arrowdown'))  dz=1;
  if(isKey('a')||isKey('arrowleft'))  dx=-1;
  if(isKey('d')||isKey('arrowright')) dx=1;
  isMoving=dx!==0||dz!==0;
  if(isMoving){
    const len=Math.sqrt(dx*dx+dz*dz);dx/=len;dz/=len;
    char.root.position.x=Math.max(BOUNDS.x[0],Math.min(BOUNDS.x[1],char.root.position.x+dx*SPEED));
    char.root.position.z=Math.max(BOUNDS.z[0],Math.min(BOUNDS.z[1],char.root.position.z+dz*SPEED));
    charAngle=Math.atan2(dx,dz);char.root.rotation.y=charAngle;
    walkCycle+=0.22;
    char.root.position.y=Math.sin(walkCycle)*0.035;
    animateWalk(walkCycle);
  } else {
    char.root.position.y*=0.82;
    idleArms();
  }
}

function walkToTarget(target, cb){
  state.mode='walking';
  state.walkTarget=target;
  state.walkCallback=cb;
  isMoving=true;
}

function updateWalk(dt){
  if(state.mode!=='walking'||!state.walkTarget) return;
  const pos=char.root.position;
  const tx=state.walkTarget.x, tz=state.walkTarget.z;
  const dx=tx-pos.x, dz=tz-pos.z;
  const dist=Math.sqrt(dx*dx+dz*dz);
  if(dist<0.18){
    char.root.position.x=tx; char.root.position.z=tz;
    state.mode='performing';
    isMoving=false;
    char.root.position.y=0;
    idleArms();
    if(state.walkCallback){state.walkCallback(); state.walkCallback=null;}
    return;
  }
  const spd=Math.min(SPEED*1.4, dist*0.12+SPEED*0.6);
  const len=dist; const nx=dx/len, nz=dz/len;
  char.root.position.x+=nx*spd; char.root.position.z+=nz*spd;
  charAngle=Math.atan2(nx,nz); char.root.rotation.y=charAngle;
  walkCycle+=0.22; char.root.position.y=Math.sin(walkCycle)*0.035;
  animateWalk(walkCycle);
}

function animateWalk(t){
  // Arm swing while walking
  char.lShoulder.rotation.x=Math.sin(t+Math.PI)*0.38;
  char.rShoulder.rotation.x=Math.sin(t)*0.38;
  char.lElbow.rotation.x=Math.max(0,Math.sin(t+Math.PI)*0.2);
  char.rElbow.rotation.x=Math.max(0,Math.sin(t)*0.2);
  char.leg0.rotation.x=Math.sin(t+Math.PI)*0.45;
  char.leg1.rotation.x=Math.sin(t)*0.45;
}

function idleArms(){
  const damp=0.12;
  char.lShoulder.rotation.x*=(1-damp);
  char.rShoulder.rotation.x*=(1-damp);
  char.lElbow.rotation.x*=(1-damp);
  char.rElbow.rotation.x*=(1-damp);
  char.leg0.rotation.x*=(1-damp);
  char.leg1.rotation.x*=(1-damp);
}

// ════════════════════════════════════════════
// ARM POSES for experiments
// ════════════════════════════════════════════
function poseArms(pose, t){
  // pose: 'idle'|'pourL'|'dip'|'stir'|'push'|'hold'|'write'|'examine'|'shake'
  switch(pose){
    case 'idle':
      idleArms(); break;
    case 'pourL': // right arm pours, left arm steady
      char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.9,0.1);
      char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.35,0.1);
      char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,1.1,0.1);
      char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.5,0.1);
      char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.6,0.1);
      break;
    case 'dip': // dip left hand down into beaker
      char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.7,0.1);
      char.lShoulder.rotation.z=lerp(char.lShoulder.rotation.z,0.3,0.1);
      char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.9+Math.sin(t*2)*0.15,0.1);
      char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.35,0.08);
      char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.5,0.08);
      break;
    case 'stir':
      char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.6,0.1);
      char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.15+Math.sin(t*3)*0.25,0.12);
      char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.75,0.1);
      char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.4,0.08);
      char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.55,0.08);
      break;
    case 'push': // both arms push forward
      char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.55+Math.sin(t*1.5)*0.1,0.08);
      char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.55+Math.sin(t*1.5+1)*0.1,0.08);
      char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.65,0.08);
      char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.65,0.08);
      break;
    case 'hold': // hold something up
      char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-1.1,0.1);
      char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.2,0.08);
      char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.7,0.1);
      char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.45,0.08);
      char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.5,0.08);
      break;
    case 'write': // right arm writes, left steady
      char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.5+Math.sin(t*3)*0.12,0.1);
      char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.2+Math.cos(t*2)*0.1,0.1);
      char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.8,0.1);
      char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.35,0.08);
      char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.45,0.08);
      break;
    case 'examine': // bend over and look, both arms forward
      char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.85,0.1);
      char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.85,0.1);
      char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.9+Math.sin(t*1.8)*0.08,0.1);
      char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.9,0.1);
      char.root.rotation.x=lerp(char.root.rotation.x,-0.15,0.06);
      break;
    case 'shake':
      char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.7,0.1);
      char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.2+Math.sin(t*5)*0.3,0.15);
      char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.8,0.1);
      char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.4,0.08);
      char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.5,0.08);
      break;
  }
}

function lerp(a,b,t){return a+(b-a)*t;}

// ════════════════════════════════════════════
// EXPERIMENT PERFORMANCE SYSTEM
// ════════════════════════════════════════════
// Pose sequences per experiment step
const EXP_POSES = {
  litmus:['idle','pourL','dip','dip','dip','dip','stir','write'],
  rust:  ['idle','push','hold','hold','push','write','examine','write'],
  filter:['idle','stir','push','push','hold','examine','write'],
  reflect:['idle','hold','hold','hold','examine','hold','write'],
  friction:['idle','push','push','hold','push','push','write'],
  magnet:['idle','hold','shake','examine','examine','examine','write'],
  flower:['idle','dip','dip','dip','examine','examine','write'],
  microscope:['idle','push','dip','hold','push','examine','examine','write'],
  leaf:['idle','hold','dip','stir','hold','dip','examine','write'],
  circuit:['idle','push','push','push','push','examine','examine','write'],
  lens:['idle','hold','push','push','examine','write','write'],
  foodtest:['idle','pourL','pourL','dip','dip','dip','examine','write'],
};

// Per step: which props visible, table fx
const EXP_FX = {
  litmus:[
    {showProps:[], tableFx:null},
    {showProps:['propTube'], tableFx:'beakerFill'},
    {showProps:['propTube','propLitmus'], tableFx:null},
    {showProps:['propLitmus'], tableFx:'litmusRed'},
    {showProps:['propLitmus'], tableFx:null},
    {showProps:['propLitmus'], tableFx:'litmusBlue'},
    {showProps:['propTube'], tableFx:'beakerColorChange'},
    {showProps:[], tableFx:null},
  ],
  rust:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:'tubeA'},
    {showProps:[], tableFx:'tubeB'},
    {showProps:[], tableFx:'tubeC'},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:'showRust'},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
  ],
  reflect:[
    {showProps:[], tableFx:null},
    {showProps:['propTorch'], tableFx:null},
    {showProps:['propTorch'], tableFx:'rayOn'},
    {showProps:['propTorch'], tableFx:'rayBounce'},
    {showProps:['propTorch'], tableFx:'rayBounce'},
    {showProps:['propTorch'], tableFx:'rayBounce'},
    {showProps:[], tableFx:null},
  ],
  magnet:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:'magPlace'},
    {showProps:[], tableFx:'filingsSpread'},
    {showProps:[], tableFx:'filingsAligned'},
    {showProps:[], tableFx:'compassShow'},
    {showProps:[], tableFx:'fieldLines'},
    {showProps:[], tableFx:null},
  ],
  leaf:[
    {showProps:['propLeaf'], tableFx:null},
    {showProps:['propLeaf'], tableFx:'leafBoil'},
    {showProps:['propLeaf'], tableFx:'leafDecolor'},
    {showProps:['propLeaf'], tableFx:'leafDecolor'},
    {showProps:['propLeaf'], tableFx:'leafWhite'},
    {showProps:['propLeaf'], tableFx:'iodineAdd'},
    {showProps:[], tableFx:'leafBlueBlack'},
    {showProps:[], tableFx:null},
  ],
  circuit:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  lens:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  stomata:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  foodtest:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  circuit:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  lens:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  stomata:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ],
  foodtest:[
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null},
    {showProps:[], tableFx:null}
  ]
};

// ════════════════════════════════════════════
// TABLE 3D EFFECTS
// ════════════════════════════════════════════
// Iron filings particles for magnetism
let filingParticles=null;
function createFilings(tx,tz){
  if(filingParticles){scene.remove(filingParticles);filingParticles=null;}
  const geo=new THREE.BufferGeometry();
  const count=120;
  const pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    pos[i*3]=tx+(-1.5+Math.random()*3);
    pos[i*3+1]=1.085+Math.random()*0.005;
    pos[i*3+2]=tz+(-1.2+Math.random()*2.4);
  }
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:0x888888,size:0.04,sizeAttenuation:true});
  filingParticles=new THREE.Points(geo,mat);
  scene.add(filingParticles);
}
function alignFilings(tx,tz,t){
  if(!filingParticles) return;
  const pos=filingParticles.geometry.attributes.position.array;
  const count=pos.length/3;
  for(let i=0;i<count;i++){
    const ox=pos[i*3]-tx, oz=pos[i*3+2]-tz;
    const angle=Math.atan2(oz,ox);
    const r=Math.sqrt(ox*ox+oz*oz);
    const targetAngle=angle+0.03;
    pos[i*3]=tx+r*Math.cos(targetAngle);
    pos[i*3+2]=tz+r*Math.sin(targetAngle);
  }
  filingParticles.geometry.attributes.position.needsUpdate=true;
}

// Particle burst (steam / colour change)
const particles=[];
function spawnParticle(pos, color){
  const p=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,6),new THREE.MeshStandardMaterial({color,transparent:true,opacity:0.9,emissive:color,emissiveIntensity:0.4}));
  p.position.copy(pos);
  p.userData.vel=new THREE.Vector3((Math.random()-0.5)*0.018,(Math.random()*0.025+0.012),(Math.random()-0.5)*0.018);
  p.userData.life=1.0;
  scene.add(p); particles.push(p);
}
function updateParticles(dt){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.position.add(p.userData.vel);
    p.userData.vel.y-=0.0004;
    p.userData.life-=dt*1.5;
    p.material.opacity=p.userData.life;
    p.scale.setScalar(p.userData.life*0.9+0.1);
    if(p.userData.life<=0){scene.remove(p);particles.splice(i,1);}
  }
}

// Apply step FX to table objects
function applyTableFX(zone, fxName, t){
  const objs=tableObjects[zone]||{};
  const cfg=ZONE_CFG[zone];
  if(!fxName) return;

  if(zone==='chemistry'){
    if(fxName==='beakerFill' && objs.liqMat){
      objs.liqMat.color.setHex(0xeedd55);
    }
    if(fxName==='litmusRed' && objs.litmusMat){
      objs.litmusMat.color.setHex(0xee2222);
    }
    if(fxName==='litmusBlue' && objs.litmusMat){
      objs.litmusMat.color.setHex(0x2233ee);
    }
    if(fxName==='beakerColorChange' && objs.liqMat){
      objs.liqMat.color.setHex(0x3333cc);
      if(objs.beaker) spawnParticle(objs.beaker.position.clone().add(new THREE.Vector3(0,0.25,0)),0x4466ff);
    }
    if(fxName==='showRust' && objs.tubes){
      objs.tubes[0].material.color.setHex(0xaa4400);
      spawnParticle(objs.tubes[0].position.clone().add(new THREE.Vector3(0,0.2,0)),0xaa4400);
    }
  }

  if(zone==='physics'){
    if(fxName==='rayOn' && objs.ray){
      objs.ray.visible=true;
      objs.ray.rotation.y=0.52;
    }
    if(fxName==='rayBounce' && objs.ray2){
      objs.ray.visible=true;
      objs.ray2.visible=true;
      objs.ray2.rotation.y=-0.52;
      spawnParticle(objs.ray.position.clone().add(new THREE.Vector3(0,0.05,0)),0xffff00);
    }
    if(fxName==='magPlace' && objs.mag){
      objs.mag.position.set(ZONE_CFG.physics.tx,1.14,ZONE_CFG.physics.tz-0.1);
    }
    if(fxName==='filingsSpread'){
      createFilings(ZONE_CFG.physics.tx,ZONE_CFG.physics.tz);
    }
    if(fxName==='filingsAligned' && filingParticles){
      alignFilings(ZONE_CFG.physics.tx,ZONE_CFG.physics.tz,t);
      filingParticles.material.color.setHex(0x555500);
    }
    if(fxName==='fieldLines' && filingParticles){
      filingParticles.material.color.setHex(0xaaaa00);
    }
  }

  if(zone==='biology'){
    if(fxName==='leafBoil' && objs.leafMat){
      objs.leafMat.color.setHex(0x88aa22);
      spawnParticle(objs.leaf.position.clone().add(new THREE.Vector3(0,0.2,0)),0xaaaaff);
    }
    if(fxName==='leafDecolor' && objs.leafMat){
      objs.leafMat.color.setHex(0xdddd88);
    }
    if(fxName==='leafWhite' && objs.leafMat){
      objs.leafMat.color.setHex(0xf0f0cc);
    }
    if(fxName==='iodineAdd'){
      spawnParticle(objs.leaf.position.clone().add(new THREE.Vector3(0,0.25,0)),0x884400);
    }
    if(fxName==='leafBlueBlack' && objs.leafMat){
      objs.leafMat.color.setHex(0x221166);
      spawnParticle(objs.leaf.position.clone().add(new THREE.Vector3(0,0.2,0)),0x2200aa);
    }
  }
}

function applyPropFX(fxName, zone){
  // Clear all props first
  ['propTube','propLitmus','propTorch','propLeaf'].forEach(p=>{ if(char[p]) char[p].visible=false; });
  const fx=EXP_FX[state.exp?.anim||'']?.[fxName]||{showProps:[]};
  fx.showProps.forEach(p=>{ if(char[p]) char[p].visible=true; });
}

// ════════════════════════════════════════════
// CAMERA
// ════════════════════════════════════════════
const camOff=new THREE.Vector3(0,3.1,5.2);
const camLookOff=new THREE.Vector3(0,1.1,0);
const camTgt=new THREE.Vector3();
let camMode='follow'; // follow | experiment

function updateCamera(){
  let desiredPos, desiredLook;
  if(camMode==='experiment' && state.zone){
    // Angle to see character at table from the side
    const cfg=ZONE_CFG[state.zone];
    desiredPos=new THREE.Vector3(cfg.tx+3.5, 3.2, cfg.tz+3.8);
    desiredLook=new THREE.Vector3(cfg.tx-0.5, 1.1, cfg.tz-0.2);
  } else {
    desiredPos=char.root.position.clone().add(camOff);
    desiredLook=char.root.position.clone().add(camLookOff);
  }
  camera.position.lerp(desiredPos, 0.055);
  camTgt.lerp(desiredLook, 0.07);
  camera.lookAt(camTgt);
}

// ════════════════════════════════════════════
// INTERACTION
// ════════════════════════════════════════════
const INTERACT_DIST=3.8;
let nearObj=null;
const hintEl=document.getElementById('interact-hint');
const zoneEl=document.getElementById('zone-pill');
const statusEl=document.getElementById('exp-status');

function checkInteract(){
  if(state.mode!=='free'){ hintEl.style.display='none'; return; }
  let best=null, bDist=Infinity;
  interactables.forEach(o=>{
    const d=char.root.position.distanceTo(o.position);
    if(d<INTERACT_DIST&&d<bDist){best=o;bDist=d;}
  });
  nearObj=best;
  if(best){
    const z=best.userData.zone, tp=best.userData.type;
    hintEl.style.display='block';
    hintEl.textContent='E - '+(tp==='table'?'Use '+ZONE_CFG[z].label+' Table':'Open Cabinet');
  } else { hintEl.style.display='none'; }

  const px=char.root.position.x;
  if(px<-5.5) zoneEl.textContent='Chemistry Zone';
  else if(px>5.5) zoneEl.textContent='Biology Zone';
  else zoneEl.textContent='Physics Zone';
}

function tryInteract(){
  if(state.mode!=='free'||!nearObj) return;
  const zone=nearObj.userData.zone, type=nearObj.userData.type;
  openPanel(zone, type);
}

// ════════════════════════════════════════════
// PANEL UI
// ════════════════════════════════════════════
const panel=document.getElementById('panel');
const ptitle=document.getElementById('ptitle');
const psub=document.getElementById('psub');

document.getElementById('pcls-btn').onclick=()=>{
  panel.classList.remove('show');
  if(state.mode==='performing'){
    state.mode='free';
    camMode='follow';
    // Clear props
    ['propTube','propLitmus','propTorch','propLeaf'].forEach(p=>{if(char[p])char[p].visible=false;});
    if(filingParticles){scene.remove(filingParticles);filingParticles=null;}
    resetTableFX();
  }
};

function resetTableFX(){
  // Reset chemistry liquid and litmus
  const co=tableObjects.chemistry;
  if(co&&co.liqMat) co.liqMat.color.setHex(0xeedd77);
  if(co&&co.litmusMat) co.litmusMat.color.setHex(0x3355ee);
  if(co&&co.tubes&&co.tubes[0]) co.tubes[0].material.color.setHex(0xee2222);
  // Reset physics rays
  const po=tableObjects.physics;
  if(po&&po.ray) po.ray.visible=false;
  if(po&&po.ray2) po.ray2.visible=false;
  // Reset biology leaf
  const bo=tableObjects.biology;
  if(bo&&bo.leafMat) bo.leafMat.color.setHex(0x228822);
}
resetTableFX();

function openPanel(zone, type){
  state.zone=zone;
  const info=ZONE_CFG[zone];
  ptitle.textContent=info.label;
  panel.classList.add('show');
  showExpList(zone);
}

function showExpList(zone){
  psub.textContent='SELECT EXPERIMENT';
  document.getElementById('p-apparatus').style.display='none';
  document.getElementById('p-steps').style.display='none';
  document.getElementById('outcome').style.display='none';
  
  const filters=document.getElementById('p-filters');
  filters.style.display='flex';
  filters.innerHTML='';
  ['All', '6', '7', '8'].forEach(g=>{
    const btn=document.createElement('button');
    btn.className='flt-btn'+(state.gradeFilter===g?' act':'');
    btn.textContent=g==='All'?'All Classes':'Class '+g;
    btn.onclick=()=>{
      state.gradeFilter=g;
      showExpList(zone);
    };
    filters.appendChild(btn);
  });

  const list=document.getElementById('p-explist');
  list.style.display='block';
  list.innerHTML='';
  EXPS[zone].filter(e=>state.gradeFilter==='All'||e.grade.toString()===state.gradeFilter).forEach(exp=>{
    const d=document.createElement('div');
    d.className='ecard';
    d.innerHTML='<div class="ecard-t">'+exp.title+'</div>'
      +'<div class="ecard-m">'
      +'<span class="bdg bg">Gr.'+exp.grade+'</span>'
      +'<span class="bdg '+(exp.diff==='Easy'?'be':'bm')+'">'+exp.diff+'</span>'
      +'<span style="font-size:9px;color:rgba(255,255,255,0.3);">'+exp.dur+'</span>'
      +'</div>'
      +'<div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:3px;">'+exp.topic+'</div>';
    d.onclick=()=>selectExp(exp);
    list.appendChild(d);
  });
}

function selectExp(exp){
  state.exp=exp; state.step=0; state.collected=[];
  document.getElementById('p-filters').style.display='none';
  document.getElementById('p-explist').style.display='none';
  document.getElementById('p-apparatus').style.display='block';
  document.getElementById('p-steps').style.display='none';
  document.getElementById('outcome').style.display='none';
  psub.textContent='COLLECT APPARATUS';
  renderApparatus();
  notify('Collect apparatus from the cabinet!');
  statusEl.textContent=exp.title+' - collecting apparatus...';
}

function renderApparatus(){
  const exp=state.exp;
  const grid=document.getElementById('app-grid');
  grid.innerHTML='';
  exp.apparatus.forEach((a,i)=>{
    const d=document.createElement('div');
    d.className='aitem'+(state.collected.includes(i)?' got':'');
    d.innerHTML='<div class="aitem-ic">'+a.ic+'</div><div class="aitem-nm">'+a.nm+'</div>';
    d.onclick=()=>collectItem(i,d);
    grid.appendChild(d);
  });
  updateAppProg();
}

function collectItem(i,el){
  if(state.collected.includes(i)) return;
  state.collected.push(i);
  el.classList.add('got');
  updateAppProg();
  notify('Got: '+state.exp.apparatus[i].nm+'!');
  if(state.collected.length===state.exp.apparatus.length){
    setTimeout(startExperiment, 500);
  }
}

function updateAppProg(){
  const e=state.exp;
  const pct=(state.collected.length/e.apparatus.length)*100;
  document.getElementById('app-fill').style.width=pct+'%';
  document.getElementById('app-count').textContent=state.collected.length+'/'+e.apparatus.length;
}

function startExperiment(){
  const exp=state.exp;
  state.step=0;
  hide('p-apparatus'); show('p-steps'); hide('outcome');
  psub.textContent='PERFORMING EXPERIMENT';
  notify('Walking to '+ZONE_CFG[state.zone].label+'...');
  statusEl.textContent=exp.title+' - Step 1 of '+exp.steps.length;

  // Walk character to table
  const cfg=ZONE_CFG[state.zone];
  const target={x:cfg.tx, z:cfg.tz+1.8};
  walkToTarget(target, ()=>{
    // Face the table
    char.root.rotation.y=Math.PI;
    camMode='experiment';
    state.performing=true;
    state.expPhase=0; state.phaseT=0;
    renderSteps();
    applyStepFX(state.step);
    notify('Starting: '+exp.title);
  });

  document.getElementById('btn-next').onclick=nextStep;
  document.getElementById('btn-prev').onclick=prevStep;
  document.getElementById('btn-reset').onclick=()=>selectExp(state.exp);
}

function applyStepFX(step){
  const exp=state.exp;
  const animKey=exp.anim;
  const fxArr=EXP_FX[animKey];
  if(fxArr&&fxArr[step]){
    const fx=fxArr[step];
    // show/hide props
    ['propTube','propLitmus','propTorch','propLeaf'].forEach(p=>{if(char[p])char[p].visible=false;});
    fx.showProps.forEach(p=>{if(char[p])char[p].visible=true;});
    // table fx
    if(fx.tableFx) applyTableFX(state.zone, fx.tableFx, state.phaseT);
  }
}

function renderSteps(){
  const exp=state.exp;
  const list=document.getElementById('steps-list');
  list.innerHTML='';
  exp.steps.forEach((s,i)=>{
    const d=document.createElement('div');
    d.className='step-row';
    const nc=i<state.step?'done':i===state.step?'act':'pend';
    const nt=i<state.step?'✓':i+1;
    d.innerHTML='<div class="snum '+nc+'">'+nt+'</div>'
      +'<div class="stxt" style="opacity:'+(i<=state.step?1:0.38)+'">'+s+'</div>';
    list.appendChild(d);
  });
  const pct=(state.step/exp.steps.length)*100;
  document.getElementById('step-fill').style.width=pct+'%';
  document.getElementById('btn-prev').disabled=state.step===0;
  const done=state.step>=exp.steps.length;
  const nb=document.getElementById('btn-next');
  nb.textContent=done?'Done!':'Next Step';
  nb.disabled=done;
  if(done){
    show('outcome');
    document.getElementById('outcome-txt').textContent=exp.outcome;
    statusEl.textContent=exp.title+' - COMPLETE!';
    notify('Experiment Complete! Great work!');
    ['propTube','propLitmus','propTorch','propLeaf'].forEach(p=>{if(char[p])char[p].visible=false;});
  } else {
    statusEl.textContent=exp.title+' - Step '+(state.step+1)+'/'+exp.steps.length;
  }
  // Scroll active step into view
  const rows=list.querySelectorAll('.step-row');
  if(rows[state.step]) rows[state.step].scrollIntoView({block:'nearest',behavior:'smooth'});
}

function nextStep(){
  if(state.step<state.exp.steps.length){
    state.step++;
    state.phaseT=0;
    applyStepFX(state.step);
    renderSteps();
  }
}
function prevStep(){
  if(state.step>0){state.step--;state.phaseT=0;applyStepFX(state.step);renderSteps();}
}

function show(id){document.getElementById(id).style.display='';}
function hide(id){document.getElementById(id).style.display='none';}

// ════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════
let notifTimer=null;
const notifEl=document.getElementById('notif');
function notify(msg){
  notifEl.textContent=msg; notifEl.style.display='block';
  clearTimeout(notifTimer);
  notifTimer=setTimeout(()=>{notifEl.style.display='none';},2200);
}

// ════════════════════════════════════════════
// MINIMAP
// ════════════════════════════════════════════
const mmc=document.getElementById('mmc').getContext('2d');
function drawMinimap(){
  const W=108,H=108;
  mmc.clearRect(0,0,W,H);
  mmc.fillStyle='rgba(10,14,30,0.96)'; mmc.fillRect(0,0,W,H);
  // Zones
  [{x:0,w:36,c:'rgba(255,102,0,0.28)'},{x:36,w:36,c:'rgba(51,68,204,0.28)'},{x:72,w:36,c:'rgba(34,102,51,0.28)'}].forEach(z=>{
    mmc.fillStyle=z.c; mmc.fillRect(z.x,0,z.w,H);
  });
  mmc.strokeStyle='rgba(255,255,255,0.14)'; mmc.strokeRect(1,1,W-2,H-2);
  // Tables
  [[6,42,30,12,'#ff6600'],[38,42,30,12,'#4455dd'],[70,42,30,12,'#44aa55']].forEach(([x,y,w,h,c])=>{
    mmc.fillStyle=c+'44'; mmc.fillRect(x,y,w,h);
    mmc.strokeStyle=c+'88'; mmc.strokeRect(x,y,w,h);
  });
  // Cabinets
  [[5,18,14,8],[37,18,14,8],[69,18,14,8]].forEach(([x,y,w,h])=>{
    mmc.fillStyle='rgba(255,255,255,0.13)'; mmc.fillRect(x,y,w,h);
  });
  // Player
  const px=((char.root.position.x+17)/34)*(W-4)+2;
  const pz=((char.root.position.z+14)/28)*(H-4)+2;
  mmc.beginPath(); mmc.arc(px,pz,5,0,Math.PI*2);
  mmc.fillStyle='#fbbf24'; mmc.fill();
  mmc.beginPath(); mmc.moveTo(px,pz);
  mmc.lineTo(px+Math.sin(charAngle)*9,pz+Math.cos(charAngle)*9);
  mmc.strokeStyle='#fbbf24'; mmc.lineWidth=2; mmc.stroke();
  // Labels
  [['C',16,103,'#ff6600'],['P',50,103,'#5566ff'],['B',84,103,'#44aa55']].forEach(([t,x,y,c])=>{
    mmc.fillStyle=c; mmc.font='8px monospace'; mmc.textAlign='center'; mmc.fillText(t,x,y);
  });
}

// ════════════════════════════════════════════
// EXPERIMENT ARM ANIMATION (continuous)
// ════════════════════════════════════════════
function updatePerformingAnimation(t, dt){
  if(!state.performing||!state.exp) return;
  state.phaseT+=dt;
  const animKey=state.exp.anim;
  const poses=EXP_POSES[animKey]||[];
  const pose=poses[Math.min(state.step, poses.length-1)]||'idle';
  poseArms(pose, t);
  // Keep character facing table
  char.root.rotation.x=lerp(char.root.rotation.x, -0.08, 0.04);

  // Animate filings continuously
  if(animKey==='magnet'&&state.step>=2&&filingParticles){
    alignFilings(ZONE_CFG.physics.tx, ZONE_CFG.physics.tz, t);
  }
  // Flame on burner flicker
  if(animKey==='litmus'){
    const fl=tableObjects.chemistry.flame;
    if(fl&&state.step>=1&&state.step<=5){
      fl.visible=true;
      fl.scale.setScalar(0.9+Math.sin(t*8)*0.12);
      fl.rotation.y=t*3;
      tableObjects.chemistry.flame.material.emissiveIntensity=0.8+Math.sin(t*6)*0.3;
    } else if(fl){ fl.visible=false; }
  }
  // Ray pulse for reflection experiment
  if(animKey==='reflect'&&tableObjects.physics.ray&&tableObjects.physics.ray.visible){
    tableObjects.physics.ray.material.emissiveIntensity=1.5+Math.sin(t*4)*0.6;
    if(tableObjects.physics.ray2&&tableObjects.physics.ray2.visible)
      tableObjects.physics.ray2.material.emissiveIntensity=1.5+Math.sin(t*4+1)*0.6;
  }
  // Beaker liquid shimmer
  if(animKey==='litmus'&&tableObjects.chemistry.liq){
    tableObjects.chemistry.liq.position.y=1.11+Math.sin(t*2.5)*0.005;
  }
}

// ════════════════════════════════════════════
// MAIN LOOP
// ════════════════════════════════════════════
function animate(){
  requestAnimationFrame(animate);
  const dt=clock.getDelta(), t=clock.getElapsedTime();

  updateFreeMove();
  updateWalk(dt);
  checkInteract();
  updateCamera();
  updateParticles(dt);
  updatePerformingAnimation(t, dt);
  drawMinimap();

  // Idle head bob
  if(!isMoving&&state.mode==='free'){
    char.root.position.y=Math.sin(t*1.4)*0.018;
  }
  // Ceiling lamp soft flicker
  ceilLights.forEach((l,i)=>{l.intensity=0.68+Math.sin(t*3.2+i)*0.04;});

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize',()=>{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
});

// Initial message
setTimeout(()=>notify('Welcome! Walk to a lab table and press E'),800);


// ════════════════════════════════════════════
// PROJECTOR SCREEN (3D in-world + HUD overlay)
// ════════════════════════════════════════════

// Build physical 3D projector screen on front wall
(function buildProjectorScreen(){
  // Screen frame (mounted on front wall between blackboard area, elevated)
  const frameGeo = new THREE.BoxGeometry(9,5.2,0.14);
  const frameMat = new THREE.MeshStandardMaterial({color:0x222233,roughness:0.6,metalness:0.3});
  const frame = new THREE.Mesh(frameGeo,frameMat);
  frame.position.set(0,2.8,-13.82); scene.add(frame);

  // Bezel trim
  const bezelMat = new THREE.MeshStandardMaterial({color:0x111122,roughness:0.4,metalness:0.5});
  [[9.2,0.14,0.12,0,2.8,-13.76],[9.2,0.14,0.12,0,5.26,-13.76],
   [0.14,5.2,0.12,-4.57,2.8,-13.76],[0.14,5.2,0.12,4.57,2.8,-13.76]].forEach(([w,h,d,x,y,z])=>{
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),bezelMat);
    b.position.set(x,y,z); scene.add(b);
  });

  // Stand legs
  [-2.5,2.5].forEach(x=>{
    const leg=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.6,0.08),new THREE.MeshStandardMaterial({color:0x333344,roughness:0.5,metalness:0.7}));
    leg.position.set(x,0.32,-13.55); scene.add(leg);
    const foot=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.06,0.18),new THREE.MeshStandardMaterial({color:0x222233,roughness:0.5,metalness:0.8}));
    foot.position.set(x,0.03,-13.55); scene.add(foot);
  });

  // Screen canvas texture
  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 1024; screenCanvas.height = 600;
  const screenCtx = screenCanvas.getContext('2d');
  const screenTex = new THREE.CanvasTexture(screenCanvas);

  const screenMat = new THREE.MeshBasicMaterial({map:screenTex});
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(8.6,4.9), screenMat);
  screenMesh.position.set(0,2.82,-13.73); scene.add(screenMesh);

  // Projector box on ceiling
  const proj=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.22,0.8),new THREE.MeshStandardMaterial({color:0x222222,roughness:0.5,metalness:0.4}));
  proj.position.set(0,4.8,-8); scene.add(proj);
  const projLens=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.08,0.14,12),new THREE.MeshStandardMaterial({color:0x88aacc,roughness:0.1,metalness:0.3}));
  projLens.rotation.x=Math.PI/2; projLens.position.set(0,4.78,-8.5); scene.add(projLens);
  // Projector beam (transparent cone)
  const beamGeo=new THREE.CylinderGeometry(3.8,0.1,6,20,1,true);
  const beamMat=new THREE.MeshBasicMaterial({color:0xaaccff,transparent:true,opacity:0.04,side:THREE.DoubleSide});
  const beam=new THREE.Mesh(beamGeo,beamMat);
  beam.rotation.x=Math.PI/2; beam.position.set(0,2.8,-11.5); scene.add(beam);

  // Glow light from screen
  const screenLight=new THREE.PointLight(0x8899ff,0.5,8);
  screenLight.position.set(0,2.8,-13.0); scene.add(screenLight);

  // Store refs
  window._screen = { canvas:screenCanvas, ctx:screenCtx, tex:screenTex, light:screenLight };
})();

// ─────────────────────────────────────────────
// SCREEN DEMO DATA - full animated explanations
// ─────────────────────────────────────────────
const SCREEN_DEMOS = {
  c1:{ // Acid-Base Indicators
    title:'Acid-Base Indicators',
    zone:'chemistry', color:'#ff8833',
    steps:[
      {label:'Setup', desc:'We have two test tubes. Left has lemon juice (acid). Right has baking soda solution (base).', draw:'litmus_setup'},
      {label:'Red Litmus in Acid', desc:'Dip red litmus paper into the lemon juice. Red litmus STAYS RED in an acid.', draw:'litmus_red_acid'},
      {label:'Blue Litmus in Acid', desc:'Dip blue litmus paper into lemon juice. Blue litmus TURNS RED - confirms acidic!', draw:'litmus_blue_acid'},
      {label:'Red Litmus in Base', desc:'Now dip red litmus in baking soda. Red litmus TURNS BLUE in a base!', draw:'litmus_red_base'},
      {label:'Blue Litmus in Base', desc:'Blue litmus in baking soda STAYS BLUE - confirms basic/alkaline nature.', draw:'litmus_blue_base'},
      {label:'Conclusion', desc:'ACIDS: pH < 7 (turn blue litmus RED). BASES: pH > 7 (turn red litmus BLUE). Neutral pH = 7.', draw:'litmus_conclusion'},
    ]
  },
  c2:{ // Rusting
    title:'Rusting of Iron',
    zone:'chemistry', color:'#ff6600',
    steps:[
      {label:'3 Test Tubes', desc:'Tube A: iron nail + water + air. Tube B: iron nail + boiled water + oil seal. Tube C: iron nail + dry air only.', draw:'rust_setup'},
      {label:'After 3 Days - A', desc:'Tube A shows RUST! Brown iron oxide forms on nail surface. Water AND air both present.', draw:'rust_a'},
      {label:'After 3 Days - B', desc:'Tube B: NO RUST! Oil layer blocked oxygen. Shows air is needed for rusting.', draw:'rust_b'},
      {label:'After 3 Days - C', desc:'Tube C: NO RUST! No water present. Shows water is also needed for rusting.', draw:'rust_c'},
      {label:'Equation', desc:'Iron + Water + Oxygen = Iron Oxide (Rust). Fe + H2O + O2 = Fe2O3.nH2O (rust)', draw:'rust_equation'},
      {label:'Prevention', desc:'Prevent rust by: painting, galvanising (zinc coat), oiling, using stainless steel.', draw:'rust_prevent'},
    ]
  },
  c3:{
    title:'Separating Mixtures',
    zone:'chemistry', color:'#ffaa00',
    steps:[
      {label:'The Mixture', desc:'We have a mixture of sand and water in a beaker. The sand is insoluble and settles.', draw:'filter_mixture'},
      {label:'Fold Filter Paper', desc:'Fold the filter paper into a cone shape. This creates tiny pores that only liquid can pass through.', draw:'filter_fold'},
      {label:'Setup Funnel', desc:'Place the paper cone inside the funnel. Position the funnel over an empty clean beaker.', draw:'filter_setup'},
      {label:'Pour Mixture', desc:'Slowly pour the sand-water mixture through the funnel. Water drips through as filtrate.', draw:'filter_pour'},
      {label:'Result', desc:'Clear water (filtrate) collected below. Sand remains on filter paper as the residue.', draw:'filter_result'},
      {label:'Conclusion', desc:'Filtration separates insoluble solids from liquids. Used in water treatment plants!', draw:'filter_conclusion'},
    ]
  },
  c4:{
    title:'Chemical vs Physical',
    zone:'chemistry', color:'#ff3366',
    steps:[
      {label:'Physical Change', desc:'Melt an ice cube over a burner. The solid ice turns into liquid water.', draw:'cp_ice'},
      {label:'Reversible', desc:'This is a PHYSICAL change. No new substance is formed, and we can freeze it back!', draw:'cp_ice_res'},
      {label:'Chemical Setup', desc:'Now, add baking soda (NaHCO3) to a flask. Pour in vinegar (Acetic Acid).', draw:'cp_chem_setup'},
      {label:'Chemical Reaction', desc:'Bubbles form rapidly! A balloon placed on top is inflated by Carbon Dioxide (CO2) gas.', draw:'cp_chem_react'},
      {label:'Irreversible', desc:'This is a CHEMICAL change. A new substance (CO2) is formed and it cannot be easily reversed.', draw:'cp_chem_res'},
      {label:'Conclusion', desc:'Physical: Reversible, no new substance. Chemical: Irreversible, new substance formed.', draw:'cp_conc'}
    ]
  },
  c5:{
    title:'Crystallization',
    zone:'chemistry', color:'#33ccff',
    steps:[
      {label:'Heating', desc:'Boil a beaker of water over a burner.', draw:'crys_heat'},
      {label:'Dissolving', desc:'Add Copper Sulphate powder while stirring continuously.', draw:'crys_add'},
      {label:'Saturated Solution', desc:'Keep adding until no more powder can dissolve. We now have a hot saturated solution.', draw:'crys_sat'},
      {label:'Filtering', desc:'Filter the hot solution into a clean beaker to remove impurities.', draw:'crys_filter'},
      {label:'Cooling', desc:'Allow the solution to cool completely undisturbed for 1-2 days.', draw:'crys_cool'},
      {label:'Crystals Formed', desc:'Large, pure blue crystals of Copper Sulphate have formed! This is a physical change.', draw:'crys_result'}
    ]
  },
  p1:{
    title:'Light Reflection',
    zone:'physics', color:'#5566ff',
    steps:[
      {label:'Setup', desc:'Place a plane mirror vertically. Draw a normal line (perpendicular) to the mirror surface.', draw:'reflect_setup'},
      {label:'Incident Ray 30 deg', desc:'Shine torch at 30 degrees to the normal. This is the incident ray hitting the mirror.', draw:'reflect_30'},
      {label:'Reflected Ray 30 deg', desc:'The reflected ray bounces off at exactly 30 degrees on the other side of the normal!', draw:'reflect_30r'},
      {label:'Try 45 degrees', desc:'Shine at 45 degrees. The reflected ray appears at exactly 45 degrees. Same angle!', draw:'reflect_45'},
      {label:'Try 60 degrees', desc:'Shine at 60 degrees. Reflected ray = 60 degrees. The law always holds true.', draw:'reflect_60'},
      {label:'Law of Reflection', desc:'ANGLE OF INCIDENCE = ANGLE OF REFLECTION. Both angles measured from the normal line.', draw:'reflect_law'},
    ]
  },
  p2:{
    title:'Friction on Surfaces',
    zone:'physics', color:'#7766ff',
    steps:[
      {label:'Setup', desc:'Connect wooden block to spring balance. Place on smooth wooden board. Note the reading at rest.', draw:'friction_setup'},
      {label:'Pull - Smooth Surface', desc:'Pull slowly. The force needed to START moving is STATIC FRICTION on smooth surface (~4N).', draw:'friction_smooth'},
      {label:'Moving Friction', desc:'Once moving, the force reading drops slightly. This is KINETIC (sliding) friction.', draw:'friction_kinetic'},
      {label:'Sandpaper Surface', desc:'Now place sandpaper under the block. Pull again - notice more force is needed (~8N)!', draw:'friction_rough'},
      {label:'Comparison', desc:'Rough surface: more friction. Smooth surface: less friction. Surface texture matters greatly!', draw:'friction_compare'},
      {label:'Conclusion', desc:'Friction = force resisting motion. F = mu x N. Rougher surfaces = higher coefficient (mu).', draw:'friction_conclusion'},
    ]
  },
  p3:{
    title:'Magnets and Field Lines',
    zone:'physics', color:'#4488ff',
    steps:[
      {label:'Bar Magnet', desc:'Place bar magnet on white paper. Label the North (red) and South (blue/grey) poles clearly.', draw:'magnet_bar'},
      {label:'Sprinkle Filings', desc:'Sprinkle iron filings around the magnet. Filings act as tiny compass needles!', draw:'magnet_filings'},
      {label:'Filings Align', desc:'Tap the paper gently. Filings arrange into curved lines showing the magnetic field pattern.', draw:'magnet_aligned'},
      {label:'Field Direction', desc:'Use a compass: field lines exit the NORTH pole and curve around to enter the SOUTH pole.', draw:'magnet_field'},
      {label:'Field Strength', desc:'Lines are densest near the poles where field is STRONGEST. Wider apart = weaker field.', draw:'magnet_strength'},
      {label:'Conclusion', desc:'Magnetic field lines: always N to S outside. Never cross. Form closed loops inside magnet.', draw:'magnet_conclusion'},
    ]
  },
  p4:{
    title:'Electric Circuits',
    zone:'physics', color:'#ffcc00',
    steps:[
      {label:'Circuit Components', desc:'We need a Battery (power source), Wires (conductors), Switch (control), and LED Bulb (load).', draw:'circ_setup'},
      {label:'Wiring', desc:'Connect wire from Positive terminal -> Switch. Then Switch -> LED -> Negative terminal.', draw:'circ_wire'},
      {label:'Open Circuit', desc:'Switch is OFF (open). The path is broken. Current cannot flow, bulb is off.', draw:'circ_open'},
      {label:'Closed Circuit', desc:'Switch is ON (closed). The path is complete. Current flows, LED lights up!', draw:'circ_closed'},
      {label:'Conductors', desc:'Replace switch with a metal paperclip. LED lights up - metal is a conductor.', draw:'circ_cond'},
      {label:'Insulators', desc:'Replace with a rubber eraser. No light - rubber is an insulator!', draw:'circ_insul'}
    ]
  },
  p5:{
    title:'Convex Lenses',
    zone:'physics', color:'#aa66ff',
    steps:[
      {label:'Convex Lens', desc:'A convex lens is thicker in the middle. It is a converging lens.', draw:'lens_setup'},
      {label:'Parallel Rays', desc:'Shine parallel light rays into the lens.', draw:'lens_rays'},
      {label:'Convergence', desc:'The lens bends (refracts) all rays towards a single point.', draw:'lens_bend'},
      {label:'Focal Point', desc:'This point is called the Principal Focus. Distance to it is the focal length.', draw:'lens_focus'},
      {label:'Real Image', desc:'A screen placed at the focal point captures a real, inverted image.', draw:'lens_image'}
    ]
  },
  b1:{
    title:'Parts of a Flower',
    zone:'biology', color:'#44cc66',
    steps:[
      {label:'Whole Flower', desc:'Take a hibiscus flower. Observe the four whorls: outermost to innermost structures.', draw:'flower_whole'},
      {label:'Sepals', desc:'Outermost whorl = SEPALS (calyx). Usually green, leaf-like. Protect the flower bud.', draw:'flower_sepal'},
      {label:'Petals', desc:'Next whorl = PETALS (corolla). Colourful! Attract pollinators like bees and butterflies.', draw:'flower_petal'},
      {label:'Stamens', desc:'STAMENS = male parts. Anther (top) produces pollen. Filament is the stalk supporting anther.', draw:'flower_stamen'},
      {label:'Pistil', desc:'PISTIL (carpel) = female part. Stigma (sticky top) + Style (tube) + Ovary (bottom, contains ovules).', draw:'flower_pistil'},
      {label:'Conclusion', desc:'Sepal (protect) > Petal (attract) > Stamen (male, makes pollen) > Pistil (female, makes seeds).', draw:'flower_diagram'},
    ]
  },
  b2:{
    title:'Onion Cell Observation',
    zone:'biology', color:'#55bb44',
    steps:[
      {label:'Prepare Slide', desc:'Peel a thin transparent layer from onion scale. Place flat on clean glass slide.', draw:'cell_prep'},
      {label:'Add Iodine', desc:'Add one drop of iodine solution. Iodine stains the nucleus brown/dark making it visible.', draw:'cell_iodine'},
      {label:'Add Coverslip', desc:'Lower coverslip at 45-degree angle to avoid air bubbles. Air bubbles ruin the view!', draw:'cell_coverslip'},
      {label:'Low Power View', desc:'Focus with low-power lens (10x). You can see many rectangular cells arranged in a grid.', draw:'cell_low'},
      {label:'High Power View', desc:'Switch to high power (40x). Now see individual cell wall, nucleus (dark dot), cytoplasm.', draw:'cell_high'},
      {label:'Cell Parts', desc:'CELL WALL (thick border) + CELL MEMBRANE + CYTOPLASM (fluid) + NUCLEUS (control centre).', draw:'cell_diagram'},
    ]
  },
  b3:{
    title:'Photosynthesis Test',
    zone:'biology', color:'#33aa44',
    steps:[
      {label:'Variegated Leaf', desc:'Take a leaf with green AND white (no chlorophyll) patches. This lets us compare both areas.', draw:'photo_leaf'},
      {label:'Boil in Water', desc:'Boil leaf 5 mins to break down cell walls and soften the tissue for decolourisation.', draw:'photo_boil'},
      {label:'Decolourise', desc:'Place in alcohol and heat in water bath. Alcohol removes the green chlorophyll pigment.', draw:'photo_decolor'},
      {label:'Wash Leaf', desc:'Wash the now-pale leaf with water. The leaf is decolourised and ready for iodine test.', draw:'photo_wash'},
      {label:'Add Iodine', desc:'Add iodine solution drops over the leaf. Iodine turns BLUE-BLACK in the presence of starch!', draw:'photo_iodine'},
      {label:'Result', desc:'GREEN areas = blue-black (starch made by photosynthesis!). WHITE areas = brown (no starch = no chlorophyll).', draw:'photo_result'},
    ]
  },
  b4:{
    title:'Stomata Observation',
    zone:'biology', color:'#aadd33',
    steps:[
      {label:'Peeling the Leaf', desc:'Tear a fresh leaf to peel off a thin, transparent epidermal layer from the underside.', draw:'stom_peel'},
      {label:'Staining', desc:'Place the peel on a glass slide and add a drop of red Safranin stain.', draw:'stom_stain'},
      {label:'Microscope Setup', desc:'Place a coverslip and put the slide under the light microscope.', draw:'stom_micro'},
      {label:'Low Power View', desc:'Under low magnification, plant cells look like a brick wall.', draw:'stom_low'},
      {label:'High Power View', desc:'Under high magnification, tiny pores (stomata) are visible surrounded by two guard cells.', draw:'stom_high'}
    ]
  },
  b5:{
    title:'Food Adulteration',
    zone:'biology', color:'#cc66ff',
    steps:[
      {label:'Milk Test Setup', desc:'Take a sample of milk in a test tube to test for starch adulteration.', draw:'food_milk_setup'},
      {label:'Iodine Add', desc:'Add a few drops of Iodine solution to the milk.', draw:'food_milk_add'},
      {label:'Starch Present!', desc:'If it turns blue-black, cheap starch was mixed into the milk!', draw:'food_milk_res'},
      {label:'Turmeric Test', desc:'Take turmeric powder. Adulterants like Metanil Yellow dye are often added.', draw:'food_turm_setup'},
      {label:'Acid Add', desc:'Add water and a few drops of concentrated acid (HCl).', draw:'food_turm_add'},
      {label:'Dye Present!', desc:'If the solution turns magenta/red, it contains harmful chemical dye.', draw:'food_turm_res'}
    ]
  }
};

// ─────────────────────────────────────────────
// CANVAS DRAWING FUNCTIONS (called each frame)
// ─────────────────────────────────────────────
const drawFns = {};

function reg(name, fn){ drawFns[name]=fn; }

function drawBase(ctx, W, H, title, step, total, zoneColor){
  // Dark background
  ctx.fillStyle='#050a1e'; ctx.fillRect(0,0,W,H);
  // Header band
  const hg=ctx.createLinearGradient(0,0,W,0);
  hg.addColorStop(0,zoneColor+'44'); hg.addColorStop(1,'#05081844');
  ctx.fillStyle=hg; ctx.fillRect(0,0,W,48);
  // Title
  ctx.fillStyle='#e2e8f0'; ctx.font='bold 22px monospace';
  ctx.fillText(title,18,31);
  // Step dots
  for(let i=0;i<total;i++){
    ctx.beginPath(); ctx.arc(W-20-(total-1-i)*18,24,5,0,Math.PI*2);
    ctx.fillStyle=i<step?'#4ade80':i===step?'#fbbf24':'rgba(255,255,255,0.2)'; ctx.fill();
  }
  // Divider
  ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,48); ctx.lineTo(W,48); ctx.stroke();
}

function txt(ctx,text,x,y,size,color,align){
  ctx.font=(size||14)+'px '+(size>16?'bold ':'')+' monospace';
  ctx.fillStyle=color||'#e2e8f0'; ctx.textAlign=align||'left'; ctx.fillText(text,x,y);
  ctx.textAlign='left';
}

function arrow(ctx,x1,y1,x2,y2,color,width){
  ctx.strokeStyle=color||'#fbbf24'; ctx.lineWidth=width||2;
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  const angle=Math.atan2(y2-y1,x2-x1);
  ctx.beginPath(); ctx.moveTo(x2,y2);
  ctx.lineTo(x2-12*Math.cos(angle-0.4),y2-12*Math.sin(angle-0.4));
  ctx.lineTo(x2-12*Math.cos(angle+0.4),y2-12*Math.sin(angle+0.4));
  ctx.closePath(); ctx.fillStyle=color||'#fbbf24'; ctx.fill();
}

// ──────── CHEMISTRY: LITMUS ────────
reg('litmus_setup',(ctx,W,H,t)=>{
  const y=H/2+20;
  // Two test tubes
  [[250,y,'#ffee88','Lemon Juice'],[700,y,'#ccddff','Baking Soda']].forEach(([x,yy,col,lbl])=>{
    ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.roundRect(x-28,yy-90,56,100,4); ctx.stroke();
    ctx.fillStyle=col; ctx.fillRect(x-24,yy-30,48,36); ctx.fill();
    txt(ctx,lbl,x,yy+20,11,'#aabbcc','center');
  });
  txt(ctx,'Acid',250,y-108,13,'#ff8844','center');
  txt(ctx,'Base',700,y-108,13,'#8888ff','center');
  txt(ctx,'Two test tubes with different solutions',W/2,H-18,13,'rgba(255,255,255,0.5)','center');
});
reg('litmus_red_acid',(ctx,W,H,t)=>{
  const y=H/2+10;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.roundRect(350,y-90,56,100,4); ctx.stroke();
  ctx.fillStyle='#ffee88'; ctx.fillRect(354,y-30,48,36);
  // Red litmus strip dipping
  const dipY=y-80+Math.sin(t*1.5)*12;
  ctx.fillStyle='#ff3333'; ctx.fillRect(372,dipY,12,55);
  txt(ctx,'Red',390,dipY+20,11,'#ff3333');
  txt(ctx,'RED stays RED in acid',W/2,H/2+80,14,'#ff6666','center');
  txt(ctx,'No colour change = ACID CONFIRMED',W/2,H/2+100,12,'rgba(255,100,100,0.7)','center');
});
reg('litmus_blue_acid',(ctx,W,H,t)=>{
  const y=H/2+10;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.roundRect(350,y-90,56,100,4); ctx.stroke();
  ctx.fillStyle='#ffee88'; ctx.fillRect(354,y-30,48,36);
  const dipY=y-80+Math.sin(t*1.5)*10;
  const phase=Math.min(1,(t%4)/2);
  const r=Math.floor(68+phase*180), gb=Math.floor(102-phase*82);
  ctx.fillStyle='rgb('+r+','+gb+',255)'; ctx.fillRect(372,dipY,12,55);
  txt(ctx,'Blue->',385,dipY+20,11,'#aaaaff');
  txt(ctx,'RED!',440,dipY+20,12,'#ff4444');
  txt(ctx,'BLUE litmus turns RED in acid!',W/2,H/2+80,14,'#ff6666','center');
});
reg('litmus_red_base',(ctx,W,H,t)=>{
  const y=H/2+10;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.roundRect(350,y-90,56,100,4); ctx.stroke();
  ctx.fillStyle='#ccddff'; ctx.fillRect(354,y-30,48,36);
  const dipY=y-80+Math.sin(t*1.5)*10;
  const phase=Math.min(1,(t%4)/2);
  const r=Math.floor(220-phase*180), b=Math.floor(50+phase*200);
  ctx.fillStyle='rgb('+r+',50,'+b+')'; ctx.fillRect(372,dipY,12,55);
  txt(ctx,'RED litmus turns BLUE in BASE!',W/2,H/2+80,14,'#8888ff','center');
});
reg('litmus_blue_base',(ctx,W,H,t)=>{
  const y=H/2+10;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.roundRect(350,y-90,56,100,4); ctx.stroke();
  ctx.fillStyle='#ccddff'; ctx.fillRect(354,y-30,48,36);
  const dipY=y-80;
  ctx.fillStyle='#4444ff'; ctx.fillRect(372,dipY,12,55);
  txt(ctx,'Blue stays BLUE in base',W/2,H/2+80,14,'#8888ff','center');
  txt(ctx,'No change = BASE CONFIRMED',W/2,H/2+100,12,'rgba(100,100,255,0.7)','center');
});
reg('litmus_conclusion',(ctx,W,H,t)=>{
  [[260,H/2,'#ff4444','ACID','Blue->Red','pH < 7'],[700,H/2,'#4444ff','BASE','Red->Blue','pH > 7']].forEach(([x,y,c,lbl,change,ph])=>{
    ctx.fillStyle=c+'33'; ctx.beginPath(); ctx.roundRect(x-90,y-80,180,140,10); ctx.fill();
    ctx.strokeStyle=c+'88'; ctx.lineWidth=2; ctx.stroke();
    txt(ctx,lbl,x,y-52,20,c,'center');
    txt(ctx,change,x,y-16,14,c,'center');
    txt(ctx,ph,x,y+24,16,c+'cc','center');
  });
  txt(ctx,'NEUTRAL = pH 7 (pure water)',W/2,H-30,14,'rgba(255,255,255,0.6)','center');
  // Pulse glow on active side based on t
  const side=Math.floor(t/3)%2;
  ctx.strokeStyle=side===0?'#ff444488':'#4444ff88'; ctx.lineWidth=3+Math.sin(t*4);
  ctx.beginPath(); ctx.roundRect(side===0?170:610,H/2-80,180,140,10); ctx.stroke();
});

// ──────── CHEMISTRY: RUSTING ────────
reg('rust_setup',(ctx,W,H,t)=>{
  [['A',220,'Water+Air','#aaddff','#bbccdd'],['B',512,'Boiled+Oil','#eef8ee','#aaccaa'],['C',800,'Dry Air','#f5f0e0','#ccbbaa']].forEach(([lbl,x,desc,lc,rc])=>{
    ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(x-34,H/2-100,68,120,5); ctx.stroke();
    ctx.fillStyle=lc; ctx.fillRect(x-30,H/2-20,60,36);
    if(lbl==='B'){ctx.fillStyle='rgba(230,200,120,0.6)'; ctx.fillRect(x-30,H/2-40,60,22);}
    txt(ctx,'Tube '+lbl,x,H/2-112,13,'#fbbf24','center');
    txt(ctx,desc,x,H/2+40,10,'#aabbcc','center');
    // Iron nail
    ctx.fillStyle='#aaaaaa'; ctx.fillRect(x-4,H/2-85,8,60);
  });
});
reg('rust_a',(ctx,W,H,t)=>{
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(W/2-34,H/2-100,68,120,5); ctx.stroke();
  ctx.fillStyle='#aaddff44'; ctx.fillRect(W/2-30,H/2-20,60,36);
  const rust=Math.min(1,(t%5)/3);
  const rustColor='rgba('+(150+Math.floor(rust*80))+','+(60+Math.floor(rust*20))+',0,'+rust+')';
  ctx.fillStyle=rustColor; ctx.fillRect(W/2-4,H/2-80,8,55);
  txt(ctx,'RUST forming!',W/2,H/2+50,15,'#ff8833','center');
  txt(ctx,'Fe2O3 (iron oxide) = brown/orange',W/2,H/2+75,12,'#ffaa66','center');
  // Molecules
  for(let i=0;i<6;i++){
    const px=W/2+Math.sin(t+i*1.1)*40, py=H/2-30+Math.cos(t*0.7+i)*25;
    ctx.beginPath(); ctx.arc(px,py,5,0,Math.PI*2);
    ctx.fillStyle=i%2===0?'#ff6600':'#6699ff'; ctx.fill();
  }
  txt(ctx,'O2',W/2+50,H/2-55,10,'#6699ff'); txt(ctx,'H2O',W/2-60,H/2-55,10,'#6699ff');
});
reg('rust_b',(ctx,W,H,t)=>{
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(W/2-34,H/2-100,68,120,5); ctx.stroke();
  ctx.fillStyle='rgba(200,230,200,0.3)'; ctx.fillRect(W/2-30,H/2-20,60,36);
  ctx.fillStyle='rgba(230,210,120,0.5)'; ctx.fillRect(W/2-30,H/2-42,60,24);
  ctx.fillStyle='#aaaaaa'; ctx.fillRect(W/2-4,H/2-80,8,55);
  txt(ctx,'Oil layer',W/2+38,H/2-32,10,'#ffcc44');
  txt(ctx,'BLOCKS oxygen!',W/2,H/2+55,15,'#44ff88','center');
  txt(ctx,'No oxygen = No rust!',W/2,H/2+80,12,'#88ffaa','center');
  // X over oxygen molecules
  for(let i=0;i<4;i++){
    const px=W/2+Math.sin(i*1.57)*55, py=H/2-20+Math.cos(i*1.57)*20;
    ctx.strokeStyle='#ff4444'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(px-8,py-8); ctx.lineTo(px+8,py+8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px+8,py-8); ctx.lineTo(px-8,py+8); ctx.stroke();
  }
});
reg('rust_c',(ctx,W,H,t)=>{
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(W/2-34,H/2-100,68,120,5); ctx.stroke();
  ctx.fillStyle='#aaaaaa'; ctx.fillRect(W/2-4,H/2-80,8,55);
  txt(ctx,'No water inside',W/2,H/2+55,12,'#44ff88','center');
  txt(ctx,'CaCl2 absorbs all moisture',W/2,H/2+75,12,'#88ffaa','center');
  ctx.fillStyle='rgba(200,180,150,0.4)'; ctx.fillRect(W/2-20,H/2+2,40,20);
  txt(ctx,'CaCl2',W/2,H/2+14,9,'#ccbbaa','center');
  txt(ctx,'No rust!',W/2,H/2-110,15,'#44ff88','center');
});
reg('rust_equation',(ctx,W,H,t)=>{
  ctx.fillStyle='rgba(255,100,30,0.12)'; ctx.beginPath(); ctx.roundRect(80,H/2-80,W-160,130,12); ctx.fill();
  txt(ctx,'Fe  +  H2O  +  O2',W/2,H/2-30,20,'#e2e8f0','center');
  arrow(ctx,W/2-30,H/2+10,W/2+30,H/2+10,'#fbbf24',3);
  txt(ctx,'Fe2O3.nH2O',W/2,H/2+50,22,'#ff6600','center');
  txt(ctx,'(RUST - hydrated iron oxide)',W/2,H/2+78,12,'rgba(255,255,255,0.5)','center');
  txt(ctx,'Iron + Water + Oxygen = Rust',W/2,H-30,13,'rgba(255,255,255,0.4)','center');
});
reg('rust_prevent',(ctx,W,H,t)=>{
  const methods=[['Paint',200,'#ff6644'],['Zinc coat',390,'#66bbff'],['Oil/Grease',580,'#ffcc44'],['Stainless',770,'#88ffaa']];
  methods.forEach(([nm,x,c])=>{
    ctx.fillStyle=c+'22'; ctx.beginPath(); ctx.roundRect(x-60,H/2-60,120,100,10); ctx.fill();
    ctx.strokeStyle=c+'66'; ctx.lineWidth=2; ctx.stroke();
    txt(ctx,nm,x,H/2+10,14,c,'center');
  });
  txt(ctx,'Prevention Methods',W/2,H/2-80,16,'#fbbf24','center');
});

// ──────── CHEMISTRY: FILTER ────────
reg('filter_mixture',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Beaker
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-80,cy-80); ctx.lineTo(cx-80,cy+60); ctx.lineTo(cx+80,cy+60); ctx.lineTo(cx+80,cy-80); ctx.stroke();
  // Water
  ctx.fillStyle='rgba(100,180,255,0.35)'; ctx.fillRect(cx-76,cy-10,152,66);
  // Sand particles
  for(let i=0;i<18;i++){
    const px=cx-60+Math.sin(i*0.7+t*0.2)*(40+i*2), py=cy+30+Math.cos(i*1.1)*15;
    ctx.beginPath(); ctx.arc(px,py,3+i%3,0,Math.PI*2);
    ctx.fillStyle='rgba(180,160,100,'+(0.4+i%3*0.2)+')'; ctx.fill();
  }
  txt(ctx,'Sand + Water mixture',cx,cy+90,14,'#aabbcc','center');
  txt(ctx,'Sand is insoluble - sinks to bottom',cx,cy+110,11,'rgba(255,255,255,0.4)','center');
});
reg('filter_fold',(ctx,W,H,t)=>{
  const cx=W/2;
  // Steps of folding
  ctx.strokeStyle='#ddcc88'; ctx.lineWidth=2;
  [[200,H/2,'circle'],[512,H/2,'half'],[800,H/2,'cone']].forEach(([x,y,sh])=>{
    if(sh==='circle'){ ctx.beginPath(); ctx.arc(x,y,60,0,Math.PI*2); ctx.stroke(); }
    if(sh==='half'){ ctx.beginPath(); ctx.arc(x,y,60,0,Math.PI); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x-60,y); ctx.lineTo(x+60,y); ctx.stroke(); }
    if(sh==='cone'){ ctx.beginPath(); ctx.moveTo(x,y-60); ctx.lineTo(x+50,y+50); ctx.lineTo(x-10,y+50); ctx.closePath(); ctx.stroke(); }
    arrow(ctx,x+70,y,x+100,y,'#fbbf24');
  });
  txt(ctx,'Fold in half','200',H/2+80,11,'#ddcc88','center');
  txt(ctx,'Filter paper folding steps',cx,H-30,13,'rgba(255,255,255,0.4)','center');
});
reg('filter_setup',(ctx,W,H,t)=>{
  const cx=W/2;
  // Funnel
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-80,H/2-100); ctx.lineTo(cx-10,H/2+20); ctx.lineTo(cx+10,H/2+20); ctx.lineTo(cx+80,H/2-100); ctx.stroke();
  // Paper cone inside
  ctx.strokeStyle='#ddcc88'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-60,H/2-100); ctx.lineTo(cx,H/2+10); ctx.lineTo(cx+60,H/2-100); ctx.stroke();
  // Stem
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(cx,H/2+20); ctx.lineTo(cx,H/2+80); ctx.stroke();
  // Beaker below
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-60,H/2+80); ctx.lineTo(cx-60,H/2+150); ctx.lineTo(cx+60,H/2+150); ctx.lineTo(cx+60,H/2+80); ctx.stroke();
  txt(ctx,'Funnel + filter paper',cx,H/2-120,13,'#aabbcc','center');
  txt(ctx,'Empty beaker below',cx,H/2+170,13,'#aabbcc','center');
});
reg('filter_pour',(ctx,W,H,t)=>{
  const cx=W/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-80,H/2-100); ctx.lineTo(cx-10,H/2+20); ctx.lineTo(cx+10,H/2+20); ctx.lineTo(cx+80,H/2-100); ctx.stroke();
  ctx.strokeStyle='#ddcc88'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-60,H/2-100); ctx.lineTo(cx,H/2+10); ctx.lineTo(cx+60,H/2-100); ctx.stroke();
  // Sandy mixture pouring
  ctx.fillStyle='rgba(100,180,255,0.4)';
  const pourX=cx+Math.sin(t*0.8)*5-50, pourY=H/2-140;
  ctx.beginPath(); ctx.ellipse(pourX,pourY,15,10,0.3,0,Math.PI*2); ctx.fill();
  arrow(ctx,cx-50+Math.sin(t)*5,H/2-130,cx-20,H/2-100,'rgba(100,200,255,0.7)',2);
  // Drip
  const dropY=H/2+20+(t%2)*50;
  ctx.beginPath(); ctx.arc(cx,dropY,4,0,Math.PI*2);
  ctx.fillStyle='rgba(100,200,255,0.8)'; ctx.fill();
  txt(ctx,'Water drips through as filtrate',cx,H-30,13,'rgba(100,200,255,0.7)','center');
});
reg('filter_result',(ctx,W,H,t)=>{
  const cx=W/2;
  // Left: funnel with sand residue
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-200,H/2-60); ctx.lineTo(cx-150,H/2+30); ctx.lineTo(cx-130,H/2+30); ctx.lineTo(cx-80,H/2-60); ctx.stroke();
  ctx.fillStyle='rgba(180,160,100,0.6)'; ctx.fillRect(cx-180,H/2+5,95,22);
  txt(ctx,'RESIDUE',cx-140,H/2+70,12,'#ffcc66','center'); txt(ctx,'(sand)',cx-140,H/2+88,10,'#ffcc6688','center');
  // Right: beaker with clear filtrate
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx+80,H/2-60); ctx.lineTo(cx+80,H/2+80); ctx.lineTo(cx+200,H/2+80); ctx.lineTo(cx+200,H/2-60); ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.35)'; ctx.fillRect(cx+84,H/2+10,112,66);
  txt(ctx,'FILTRATE',cx+140,H/2+110,12,'#66aaff','center'); txt(ctx,'(clear water)',cx+140,H/2+128,10,'#66aaff88','center');
});
reg('filter_conclusion',(ctx,W,H,t)=>{
  txt(ctx,'Filtration is used in:',W/2,H/2-70,16,'#fbbf24','center');
  [['Water Treatment',H/2-20],['Coffee Making',H/2+10],['Swimming Pools',H/2+40],['Air Purifiers',H/2+70]].forEach(([s,y])=>{
    ctx.fillStyle='rgba(100,200,100,0.15)'; ctx.beginPath(); ctx.roundRect(W/2-150,y-18,300,26,5); ctx.fill();
    txt(ctx,s,W/2,y,13,'#88ffaa','center');
  });
});

// ──────── CHEMISTRY: CHEM VS PHYS ────────
reg('cp_ice',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Burner
  ctx.fillStyle='#555'; ctx.fillRect(cx-30,cy+80,60,20);
  ctx.fillStyle='#ff7700'; ctx.beginPath(); ctx.moveTo(cx-15,cy+80); ctx.lineTo(cx,cy+40); ctx.lineTo(cx+15,cy+80); ctx.fill();
  // Beaker
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-50,cy-60); ctx.lineTo(cx-50,cy+30); ctx.lineTo(cx+50,cy+30); ctx.lineTo(cx+50,cy-60); ctx.stroke();
  // Ice shrinking / Water rising
  const melt = Math.min(1, (t%4)/3);
  ctx.fillStyle='rgba(100,180,255,0.4)'; ctx.fillRect(cx-46,cy+26-melt*40,92,melt*40);
  ctx.fillStyle='rgba(200,230,255,0.8)'; 
  const iw=40*(1-melt), ih=40*(1-melt);
  if(iw>0) ctx.fillRect(cx-iw/2,cy+26-ih-(melt*10),iw,ih);
  
  txt(ctx,'Heating Ice (Solid Water)', cx, cy-80, 14, '#aabbcc', 'center');
});
reg('cp_ice_res',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  txt(ctx,'PHYSICAL CHANGE',cx,cy-50,24,'#77ccff','center');
  txt(ctx,'Ice -> Water',cx,cy-10,16,'#fff','center');
  txt(ctx,'Still H2O! No new substance.',cx,cy+30,14,'#aaccff','center');
  txt(ctx,'(We can just freeze it back)',cx,cy+60,12,'#888','center');
});
reg('cp_chem_setup',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Flask
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-20,cy-80); ctx.lineTo(cx-20,cy-30); ctx.lineTo(cx-60,cy+60); ctx.lineTo(cx+60,cy+60); ctx.lineTo(cx+20,cy-30); ctx.lineTo(cx+20,cy-80); ctx.stroke();
  // Baking soda at bottom
  ctx.fillStyle='#eee'; ctx.beginPath(); ctx.ellipse(cx,cy+50,40,8,0,0,Math.PI*2); ctx.fill();
  // Vinegar pouring
  ctx.fillStyle='rgba(200,200,200,0.5)';
  const pourX=cx-40, pourY=cy-120;
  ctx.fillRect(pourX-20,pourY-40,40,40);
  ctx.fillRect(cx-4,pourY,8,60);
  txt(ctx,'Adding Vinegar (Acid) to Baking Soda (Base)',cx,cy+90,14,'#aabbcc','center');
});
reg('cp_chem_react',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Balloon attached
  const blow=Math.min(1,(t%3)/2);
  ctx.fillStyle='rgba(255,100,100,0.8)';
  ctx.beginPath(); ctx.arc(cx,cy-110-blow*30, 10+blow*40, 0,Math.PI*2); ctx.fill();
  
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-20,cy-80); ctx.lineTo(cx-20,cy-30); ctx.lineTo(cx-60,cy+60); ctx.lineTo(cx+60,cy+60); ctx.lineTo(cx+20,cy-30); ctx.lineTo(cx+20,cy-80); ctx.stroke();
  
  // Liquid + Bubbles
  ctx.fillStyle='rgba(200,200,200,0.4)'; ctx.fillRect(cx-50,cy+30,100,28);
  for(let i=0;i<15;i++){
     let by=cy+50-((t*40+i*13)%60);
     let bx=cx-40+(i*80/15);
     ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(bx,by,2+i%3,0,Math.PI*2); ctx.fill();
  }
  txt(ctx,'Fizzing! Gas filling balloon',cx,cy+90,14,'#ff7777','center');
  txt(ctx,'CO2',cx,cy-120-blow*30, 12, '#fff', 'center');
});
reg('cp_chem_res',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  txt(ctx,'CHEMICAL CHANGE',cx,cy-50,24,'#ff7777','center');
  txt(ctx,'Acid + Base -> Salt + Water + CO2',cx,cy-10,16,'#fff','center');
  txt(ctx,'NEW substance formed (CO2 gas)!',cx,cy+30,14,'#ffaaaa','center');
  txt(ctx,'(Irreversible easily)',cx,cy+60,12,'#888','center');
});
reg('cp_conc',(ctx,W,H,t)=>{
  txt(ctx,'Physical = State changes (melting/freezing). Reversible.',W/2,H/2-30,14,'#77ccff','center');
  txt(ctx,'Chemical = Chemical reactions (burning/rusting/fizzing). Irreversible.',W/2,H/2+30,14,'#ff7777','center');
});

// ──────── CHEMISTRY: CRYSTALLIZATION ────────
reg('crys_heat',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#555'; ctx.fillRect(cx-30,cy+80,60,20);
  ctx.fillStyle='#ff7700'; ctx.beginPath(); ctx.moveTo(cx-15,cy+80); ctx.lineTo(cx,cy+40); ctx.lineTo(cx+15,cy+80); ctx.fill();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-50,cy-60); ctx.lineTo(cx-50,cy+30); ctx.lineTo(cx+50,cy+30); ctx.lineTo(cx+50,cy-60); ctx.stroke();
  ctx.fillStyle='rgba(100,180,255,0.4)'; ctx.fillRect(cx-46,cy-10,92,38);
  // Steam
  for(let i=0;i<3;i++){
    ctx.fillStyle='rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.arc(cx-20+i*20,cy-70-((t*20+i*15)%30),5,0,Math.PI*2); ctx.fill();
  }
  txt(ctx,'Boiling Water', cx, cy-100, 14, '#aabbcc', 'center');
});
reg('crys_add',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-50,cy-60); ctx.lineTo(cx-50,cy+30); ctx.lineTo(cx+50,cy+30); ctx.lineTo(cx+50,cy-60); ctx.stroke();
  const amt=Math.min(1,(t%4)/2);
  ctx.fillStyle=`rgba(50,100,255,${0.2+amt*0.6})`; ctx.fillRect(cx-46,cy-10,92,38);
  
  // Spoon pouring
  ctx.fillStyle='#888'; ctx.fillRect(cx+40,cy-100, 60,10);
  ctx.fillStyle='#2266ff'; ctx.beginPath(); ctx.arc(cx+30,cy-95, 15, 0, Math.PI); ctx.fill();
  // Falling powder
  for(let i=0;i<5;i++){
    ctx.fillStyle='#2266ff'; ctx.fillRect(cx+25+(i*3), cy-90+((t*40+i*10)%80), 3, 3);
  }
  txt(ctx,'Adding Copper Sulphate', cx, cy+60, 14, '#66aaff', 'center');
});
reg('crys_sat',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-50,cy-60); ctx.lineTo(cx-50,cy+30); ctx.lineTo(cx+50,cy+30); ctx.lineTo(cx+50,cy-60); ctx.stroke();
  ctx.fillStyle='rgba(20,50,220,0.9)'; ctx.fillRect(cx-46,cy-10,92,38); // Dark blue saturated
  ctx.fillStyle='#1133aa'; ctx.fillRect(cx-20,cy+24,40,4); // Undissolved extra at bottom
  txt(ctx,'Hot Saturated Solution', cx, cy+60, 14, '#2266ff', 'center');
  txt(ctx,'(No more can dissolve)', cx, cy+80, 12, '#88aacc', 'center');
});
reg('crys_filter',(ctx,W,H,t)=>{
  const cx=W/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-80,H/2-100); ctx.lineTo(cx-10,H/2+20); ctx.lineTo(cx+10,H/2+20); ctx.lineTo(cx+80,H/2-100); ctx.stroke();
  ctx.strokeStyle='#ddcc88'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-60,H/2-100); ctx.lineTo(cx,H/2+10); ctx.lineTo(cx+60,H/2-100); ctx.stroke();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(cx,H/2+20); ctx.lineTo(cx,H/2+80); ctx.stroke();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-60,H/2+80); ctx.lineTo(cx-60,H/2+150); ctx.lineTo(cx+60,H/2+150); ctx.lineTo(cx+60,H/2+80); ctx.stroke();
  
  ctx.fillStyle='rgba(20,50,220,0.8)';
  ctx.beginPath(); ctx.arc(cx,H/2+60+(t%2)*30, 4, 0, Math.PI*2); ctx.fill(); // Blue drop
  ctx.fillRect(cx-56,H/2+140, 112, 8); // filtered liquid
  
  txt(ctx,'Filtering out dust/impurities', cx, H-30, 13, '#aabbcc', 'center');
});
reg('crys_cool',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  const tc=Math.min(1,(t%5)/4); // Cooling 
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-50,cy-60); ctx.lineTo(cx-50,cy+30); ctx.lineTo(cx+50,cy+30); ctx.lineTo(cx+50,cy-60); ctx.stroke();
  ctx.fillStyle=`rgba(20,50,220,${0.8-tc*0.3})`; ctx.fillRect(cx-46,cy-10,92,38); 
  
  // Crystals forming
  ctx.fillStyle='#1133ff';
  const cSize=tc*15;
  ctx.beginPath(); ctx.moveTo(cx,cy+28); ctx.lineTo(cx-cSize,cy+28-cSize); ctx.lineTo(cx,cy+28-cSize*2); ctx.lineTo(cx+cSize,cy+28-cSize); ctx.fill();
  
  txt(ctx,'Cooling slowly over days...', cx, cy+70, 14, '#66aaff', 'center');
});
reg('crys_result',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-60,cy-60); ctx.lineTo(cx-60,cy+30); ctx.lineTo(cx+60,cy+30); ctx.lineTo(cx+60,cy-60); ctx.stroke();
  // Large polygon crystals
  ctx.fillStyle='#3377ff'; ctx.strokeStyle='#fff'; ctx.lineWidth=1;
  [ [0,20,25], [-20,25,15], [30,22,18] ].forEach(([ox,oy,s])=>{
    ctx.beginPath(); ctx.moveTo(cx+ox,cy+oy); ctx.lineTo(cx+ox-s,cy+oy-s); ctx.lineTo(cx+ox,cy+oy-s*2); ctx.lineTo(cx+ox+s,cy+oy-s); ctx.fill(); ctx.stroke();
  });
  txt(ctx,'Large, Pure Crystals Formed!', cx, cy+80, 16, '#33aaff', 'center');
  txt(ctx,'(PHYSICAL Change)', cx, cy+100, 12, '#88aacc', 'center');
});

// ──────── PHYSICS: REFLECTION ────────
function drawMirror(ctx,x,y){
  ctx.fillStyle='#aaccee'; ctx.fillRect(x-4,y-80,8,160);
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2; ctx.stroke();
}
reg('reflect_setup',(ctx,W,H,t)=>{
  const mx=W/2;
  drawMirror(ctx,mx,H/2);
  // Normal line
  ctx.setLineDash([8,6]); ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(mx,H/2-120); ctx.lineTo(mx,H/2+120); ctx.stroke();
  ctx.setLineDash([]);
  txt(ctx,'MIRROR',mx+20,H/2-90,11,'#88aacc'); txt(ctx,'NORMAL',mx+12,H/2-125,10,'rgba(255,255,255,0.4)');
  txt(ctx,'Normal line is perpendicular to mirror',W/2,H-30,12,'rgba(255,255,255,0.4)','center');
});
reg('reflect_30',(ctx,W,H,t)=>{
  const mx=W/2, my=H/2;
  drawMirror(ctx,mx,my);
  ctx.setLineDash([8,6]); ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(mx,my-120); ctx.lineTo(mx,my+120); ctx.stroke(); ctx.setLineDash([]);
  // Incident ray 30 deg
  const a=30*Math.PI/180;
  ctx.strokeStyle='#ffdd00'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(mx-Math.sin(a)*130,my-Math.cos(a)*130); ctx.lineTo(mx,my); ctx.stroke();
  // Angle arc
  ctx.strokeStyle='#ffdd0066'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(mx,my,40,-Math.PI/2,-Math.PI/2+a); ctx.stroke();
  txt(ctx,'30',mx-55,my-75,14,'#ffdd00');
  txt(ctx,'i = 30 degrees (incident ray)',W/2,H-30,12,'rgba(255,255,200,0.5)','center');
});
reg('reflect_30r',(ctx,W,H,t)=>{
  const mx=W/2, my=H/2, a=30*Math.PI/180;
  drawMirror(ctx,mx,my);
  ctx.setLineDash([8,6]); ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(mx,my-120); ctx.lineTo(mx,my+120); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle='#ffdd00'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(mx-Math.sin(a)*130,my-Math.cos(a)*130); ctx.lineTo(mx,my); ctx.stroke();
  ctx.strokeStyle='#ffaa00'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(mx+Math.sin(a)*130,my-Math.cos(a)*130); ctx.stroke();
  txt(ctx,'30',mx-55,my-75,14,'#ffdd00'); txt(ctx,'30',mx+30,my-75,14,'#ffaa00');
  txt(ctx,'i = r = 30 degrees!',W/2,H-30,14,'#fbbf24','center');
});
reg('reflect_45',(ctx,W,H,t)=>{
  const mx=W/2, my=H/2, a=45*Math.PI/180;
  drawMirror(ctx,mx,my);
  ctx.setLineDash([8,6]); ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(mx,my-120); ctx.lineTo(mx,my+120); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle='#ffdd00'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(mx-Math.sin(a)*110,my-Math.cos(a)*110); ctx.lineTo(mx,my); ctx.stroke();
  ctx.strokeStyle='#ffaa00'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(mx+Math.sin(a)*110,my-Math.cos(a)*110); ctx.stroke();
  txt(ctx,'45',mx-75,my-55,14,'#ffdd00'); txt(ctx,'45',mx+42,my-55,14,'#ffaa00');
  txt(ctx,'45 = 45 degrees! Law holds',W/2,H-30,14,'#fbbf24','center');
});
reg('reflect_60',(ctx,W,H,t)=>{
  const mx=W/2, my=H/2, a=60*Math.PI/180;
  drawMirror(ctx,mx,my);
  ctx.setLineDash([8,6]); ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(mx,my-120); ctx.lineTo(mx,my+120); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle='#ffdd00'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(mx-Math.sin(a)*110,my-Math.cos(a)*110); ctx.lineTo(mx,my); ctx.stroke();
  ctx.strokeStyle='#ffaa00'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(mx+Math.sin(a)*110,my-Math.cos(a)*110); ctx.stroke();
  txt(ctx,'60',mx-90,my-28,14,'#ffdd00'); txt(ctx,'60',mx+50,my-28,14,'#ffaa00');
  txt(ctx,'60 = 60 degrees! Always equal!',W/2,H-30,14,'#fbbf24','center');
});
reg('reflect_law',(ctx,W,H,t)=>{
  ctx.fillStyle='rgba(99,102,241,0.15)'; ctx.beginPath(); ctx.roundRect(100,H/2-80,W-200,130,12); ctx.fill();
  ctx.strokeStyle='rgba(99,102,241,0.5)'; ctx.lineWidth=2; ctx.stroke();
  txt(ctx,'Angle of Incidence = Angle of Reflection',W/2,H/2-28,17,'#a5b4fc','center');
  txt(ctx,'i = r',W/2,H/2+20,26,'#fbbf24','center');
  txt(ctx,'Both angles measured from the NORMAL line',W/2,H/2+60,12,'rgba(255,255,255,0.4)','center');
  // Animated ray
  const pulse=0.7+Math.sin(t*3)*0.3;
  const a=(30+Math.sin(t*0.4)*20)*Math.PI/180;
  ctx.strokeStyle='rgba(255,221,0,'+pulse+')'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(120,H-50); ctx.lineTo(300,H/2+10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(300,H/2+10); ctx.lineTo(480,H-50); ctx.stroke();
});

// ──────── PHYSICS: FRICTION ────────
reg('friction_setup',(ctx,W,H,t)=>{
  const cy=H/2;
  ctx.fillStyle='#d4d4d4'; ctx.fillRect(80,cy+10,W-160,14);
  ctx.fillStyle='#8b5e3c'; ctx.fillRect(W/2-60,cy-30,120,40);
  ctx.strokeStyle='#555'; ctx.lineWidth=2; ctx.strokeRect(W/2-60,cy-30,120,40);
  ctx.strokeStyle='#aaa'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W/2+60,cy-10); ctx.lineTo(W/2+150,cy-10); ctx.stroke();
  ctx.fillStyle='#888'; ctx.fillRect(W/2+150,cy-30,35,40);
  txt(ctx,'Spring Balance',W/2+170,cy+15,10,'#aaa');
  txt(ctx,'Wooden Block on Smooth Board',W/2,cy+50,13,'#aabbcc','center');
});
reg('friction_smooth',(ctx,W,H,t)=>{
  const cy=H/2, moved=Math.sin(t*0.8)*15+15;
  ctx.fillStyle='#d4d4d4'; ctx.fillRect(80,cy+10,W-160,14);
  ctx.fillStyle='#8b5e3c'; ctx.fillRect(W/2-60+moved,cy-30,120,40);
  ctx.strokeStyle='#888'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W/2+60+moved,cy-10); ctx.lineTo(W/2+150,cy-10); ctx.stroke();
  ctx.fillStyle='#888'; ctx.fillRect(W/2+150,cy-30,35,40);
  txt(ctx,'~4 N',W/2+168,cy-5,14,'#44ff88');
  txt(ctx,'STATIC FRICTION (smooth) ~ 4N',W/2,cy+55,13,'#44cc88','center');
});
reg('friction_kinetic',(ctx,W,H,t)=>{
  const cy=H/2, moved=(t*30)%180;
  ctx.fillStyle='#d4d4d4'; ctx.fillRect(80,cy+10,W-160,14);
  ctx.fillStyle='#8b5e3c'; ctx.fillRect(80+moved,cy-30,120,40);
  txt(ctx,'MOVING ->',100+moved,cy-45,12,'#ffcc44');
  txt(ctx,'Kinetic friction ~ 3.5N (less than static)',W/2,cy+55,13,'#ffcc44','center');
});
reg('friction_rough',(ctx,W,H,t)=>{
  const cy=H/2, moved=Math.sin(t*0.5)*8+8;
  // Sandpaper texture
  for(let i=0;i<30;i++){
    ctx.fillStyle='rgba(180,130,60,0.6)';
    ctx.fillRect(80+i*28,cy+10,14,14);
  }
  ctx.fillStyle='#8b5e3c'; ctx.fillRect(W/2-60+moved,cy-30,120,40);
  ctx.strokeStyle='#888'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(W/2+60+moved,cy-10); ctx.lineTo(W/2+160,cy-10); ctx.stroke();
  ctx.fillStyle='#888'; ctx.fillRect(W/2+160,cy-30,35,40);
  txt(ctx,'~8 N',W/2+178,cy-5,15,'#ff6644');
  txt(ctx,'ROUGH SURFACE = MORE FRICTION ~8N!',W/2,cy+55,13,'#ff8866','center');
});
reg('friction_compare',(ctx,W,H,t)=>{
  [[250,H/2,'Smooth Board','4N','#44cc88'],[650,H/2,'Sandpaper','8N','#ff6644']].forEach(([x,y,lbl,force,col])=>{
    const h=lbl==='Smooth Board'?60:120;
    ctx.fillStyle=col+'22'; ctx.beginPath(); ctx.roundRect(x-80,y-h/2-20,160,h+40,8); ctx.fill();
    ctx.fillStyle=col; ctx.fillRect(x-30,y+20,60,5);
    txt(ctx,force,x,y-h/2,22,col,'center');
    txt(ctx,lbl,x,y+40,11,col+'bb','center');
  });
  txt(ctx,'Friction comparison: same block, different surfaces',W/2,H-25,12,'rgba(255,255,255,0.4)','center');
});
reg('friction_conclusion',(ctx,W,H,t)=>{
  txt(ctx,'F = mu x N',W/2,H/2-20,24,'#fbbf24','center');
  txt(ctx,'F = Friction force   |   mu = coefficient (surface)   |   N = Normal force',W/2,H/2+20,11,'rgba(255,255,255,0.45)','center');
  txt(ctx,'mu (smooth wood) ~ 0.2',W/2-150,H/2+70,12,'#44cc88','center');
  txt(ctx,'mu (sandpaper) ~ 0.6',W/2+150,H/2+70,12,'#ff6644','center');
});

// ──────── PHYSICS: MAGNETS ────────
reg('magnet_bar',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#e74c3c'; ctx.fillRect(cx-120,cy-20,120,40);
  ctx.fillStyle='#2c3e50'; ctx.fillRect(cx,cy-20,120,40);
  txt(ctx,'N',cx-60,cy+8,22,'#fff','center');
  txt(ctx,'S',cx+60,cy+8,22,'#fff','center');
  txt(ctx,'Bar Magnet',cx,cy+55,14,'#aabbcc','center');
  txt(ctx,'Red = North Pole   |   Dark = South Pole',cx,H-30,12,'rgba(255,255,255,0.4)','center');
});
reg('magnet_filings',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#e74c3c'; ctx.fillRect(cx-120,cy-20,120,40);
  ctx.fillStyle='#2c3e50'; ctx.fillRect(cx,cy-20,120,40);
  txt(ctx,'N',cx-60,cy+8,16,'#fff','center'); txt(ctx,'S',cx+60,cy+8,16,'#fff','center');
  // Random filings
  for(let i=0;i<80;i++){
    const px=cx-180+Math.random()*360, py=cy-120+Math.random()*240;
    ctx.fillStyle='rgba(150,150,120,'+(0.3+Math.random()*0.5)+')';
    ctx.fillRect(px,py,5+Math.random()*3,1.5);
  }
  txt(ctx,'Iron filings sprinkled randomly',cx,H-30,12,'rgba(255,255,255,0.35)','center');
});
reg('magnet_aligned',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#e74c3c'; ctx.fillRect(cx-120,cy-20,120,40);
  ctx.fillStyle='#2c3e50'; ctx.fillRect(cx,cy-20,120,40);
  txt(ctx,'N',cx-60,cy+8,16,'#fff','center'); txt(ctx,'S',cx+60,cy+8,16,'#fff','center');
  // Aligned field lines
  for(let i=-3;i<=3;i++){
    const dy=i*22;
    ctx.strokeStyle='rgba(220,200,80,0.5)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(cx,cy+dy,160,Math.abs(i)*18+8,0,Math.PI,0); ctx.stroke();
  }
  txt(ctx,'Filings align along field lines!',cx,H-30,13,'#ffcc44','center');
});
reg('magnet_field',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#e74c3c'; ctx.fillRect(cx-120,cy-20,120,40);
  ctx.fillStyle='#2c3e50'; ctx.fillRect(cx,cy-20,120,40);
  txt(ctx,'N',cx-60,cy+8,16,'#fff','center'); txt(ctx,'S',cx+60,cy+8,16,'#fff','center');
  for(let i=-3;i<=3;i++){
    const dy=i*22, r=Math.abs(i)*18+12;
    const col=i===0?'rgba(255,220,0,0.8)':'rgba(255,180,50,0.4)';
    ctx.strokeStyle=col; ctx.lineWidth=i===0?2.5:1.5;
    ctx.beginPath(); ctx.ellipse(cx,cy+dy,180,r,0,Math.PI,0); ctx.stroke();
    // Arrow
    const ax=cx+180, ay=cy+dy;
    arrow(ctx,ax,ay,ax-20,ay+5,col,1.5);
  }
  txt(ctx,'N -> S outside magnet (field direction)',cx,H-30,12,'rgba(255,220,50,0.6)','center');
});
reg('magnet_strength',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#e74c3c'; ctx.fillRect(cx-120,cy-20,120,40);
  ctx.fillStyle='#2c3e50'; ctx.fillRect(cx,cy-20,120,40);
  txt(ctx,'N',cx-60,cy+8,16,'#fff','center'); txt(ctx,'S',cx+60,cy+8,16,'#fff','center');
  // Dense lines at poles, sparse in middle
  [1,2,4,8,4,2,1].forEach((dens,ii)=>{
    const x=cx-180+ii*60;
    for(let d=0;d<dens;d++){
      ctx.strokeStyle='rgba(255,200,50,'+(dens/8)+')'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x,cy-60+d*15); ctx.lineTo(x,cy+60-d*15); ctx.stroke();
    }
  });
  txt(ctx,'Dense lines = STRONG field (near poles)',cx,H-30,12,'rgba(255,200,50,0.5)','center');
});
reg('magnet_conclusion',(ctx,W,H,t)=>{
  ctx.fillStyle='rgba(99,102,241,0.12)'; ctx.beginPath(); ctx.roundRect(60,H/2-100,W-120,160,12); ctx.fill();
  txt(ctx,'Magnetic Field Lines:',W/2,H/2-62,16,'#a5b4fc','center');
  ['Exit North pole, enter South pole','Never cross each other','Form closed loops (inside magnet too!)','Denser = stronger field'].forEach((s,i)=>{
    txt(ctx,'- '+s,W/2,H/2-22+i*28,12,'rgba(255,255,255,0.7)','center');
  });
});

// ──────── PHYSICS: CIRCUITS ────────
function drawBatt(ctx, x, y) {
  ctx.fillStyle='#333'; ctx.fillRect(x-15, y-25, 30, 50);
  ctx.fillStyle='#e22'; ctx.fillRect(x-15, y-25, 30, 15);
  ctx.fillStyle='#ccc'; ctx.fillRect(x-5, y-30, 10, 5); // + knob
  txt(ctx,'+',x,y-10,12,'#fff','center');
  txt(ctx,'-',x,y+15,12,'#fff','center');
}
function drawBulb(ctx, x, y, on) {
  ctx.fillStyle='#888'; ctx.fillRect(x-10, y, 20, 15);
  ctx.fillStyle=on?'#ffaa00':'#444';
  ctx.beginPath(); ctx.arc(x,y-10,15,0,Math.PI*2); ctx.fill();
  if(on){
    ctx.strokeStyle='rgba(255,200,50,0.5)'; ctx.lineWidth=4+Math.sin(Date.now()/100)*2;
    ctx.beginPath(); ctx.arc(x,y-10,22,0,Math.PI*2); ctx.stroke();
  }
}
function drawSwitch(ctx, x, y, closed) {
  ctx.fillStyle='#666'; ctx.beginPath(); ctx.arc(x-20,y,5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+20,y,5,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#ccc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(x-20,y); ctx.lineTo(closed ? x+20 : x+15, closed ? y : y-20); ctx.stroke();
}

reg('circ_setup',(ctx,W,H,t)=>{
  drawBatt(ctx, W/2-150, H/2); txt(ctx,'Battery',W/2-150,H/2+45,12,'#ccc','center');
  drawBulb(ctx, W/2, H/2, false); txt(ctx,'LED Bulb',W/2,H/2+45,12,'#ccc','center');
  drawSwitch(ctx, W/2+150, H/2, true); txt(ctx,'Switch',W/2+150,H/2+45,12,'#ccc','center');
  txt(ctx,'Wire = copper path',W/2,H/2+90,12,'#fc8','center');
});

reg('circ_wire',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  const wAmt = Math.min(1, (t%4)/3);
  ctx.strokeStyle='#fc8'; ctx.lineWidth=4;
  
  if(wAmt>0) { ctx.beginPath(); ctx.moveTo(cx-100,cy-30); ctx.lineTo(cx-100,cy-100); ctx.lineTo(cx+100,cy-100); ctx.lineTo(cx+100,cy-5); ctx.stroke(); }
  if(wAmt>0.5) { ctx.beginPath(); ctx.moveTo(cx+100,cy-5); ctx.lineTo(cx+100,cy+100); ctx.lineTo(cx+20,cy+100); ctx.stroke(); }
  if(wAmt>0.9) { ctx.beginPath(); ctx.moveTo(cx-20,cy+100); ctx.lineTo(cx-100,cy+100); ctx.lineTo(cx-100,cy+25); ctx.stroke(); }

  drawBatt(ctx, cx-100, cy);
  drawSwitch(ctx, cx+100, cy, false);
  drawBulb(ctx, cx, cy+100, false);
  txt(ctx,'Connecting components in a loop...',cx,cy-140,14,'#eee','center');
});

reg('circ_open',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#fc8'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(cx-100,cy-30); ctx.lineTo(cx-100,cy-100); ctx.lineTo(cx+100,cy-100); ctx.lineTo(cx+100,cy-5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+100,cy-5); ctx.lineTo(cx+100,cy+100); ctx.lineTo(cx+20,cy+100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-20,cy+100); ctx.lineTo(cx-100,cy+100); ctx.lineTo(cx-100,cy+25); ctx.stroke();
  drawBatt(ctx, cx-100, cy);
  drawSwitch(ctx, cx+100, cy, false); // OPEN
  drawBulb(ctx, cx, cy+100, false);
  
  txt(ctx,'OPEN CIRCUIT (Broken Path)',cx,cy-140,18,'#f66','center');
  txt(ctx,'Electrons cannot cross the gap.',cx,cy-50,14,'#aaccff','center');
});

reg('circ_closed',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#fc8'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(cx-100,cy-30); ctx.lineTo(cx-100,cy-100); ctx.lineTo(cx+100,cy-100); ctx.lineTo(cx+100,cy-5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+100,cy-5); ctx.lineTo(cx+100,cy+100); ctx.lineTo(cx+20,cy+100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-20,cy+100); ctx.lineTo(cx-100,cy+100); ctx.lineTo(cx-100,cy+25); ctx.stroke();
  
  // Electrons flowing
  ctx.fillStyle='#55aaff';
  for(let i=0;i<8;i++){
    let dist = ((t*100 + i*60) % 480);
    let ex, ey;
    if(dist<100) { ex=cx-100; ey=cy+25+dist; } // down from batt
    else if(dist<300) { ex=cx-100+(dist-100); ey=cy+100; } // across bottom
    else if(dist<400) { ex=cx+100; ey=cy+100-(dist-300); } // up left
    else { ex=cx+100-(dist-400); ey=cy-100; } // across top
    ctx.beginPath(); ctx.arc(ex,ey,4,0,Math.PI*2); ctx.fill();
  }

  drawBatt(ctx, cx-100, cy);
  drawSwitch(ctx, cx+100, cy, true); // CLOSED
  drawBulb(ctx, cx, cy+100, true);
  
  txt(ctx,'CLOSED CIRCUIT (Complete Path)',cx,cy-140,18,'#88ff88','center');
  txt(ctx,'Electrons flow! Bulb lights up.',cx,cy-50,14,'#aaccff','center');
});

reg('circ_cond',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#fc8'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(cx-100,cy-30); ctx.lineTo(cx-100,cy-100); ctx.lineTo(cx+100,cy-100); ctx.lineTo(cx+100,cy-5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+100,cy-5); ctx.lineTo(cx+100,cy+100); ctx.lineTo(cx+20,cy+100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-20,cy+100); ctx.lineTo(cx-100,cy+100); ctx.lineTo(cx-100,cy+25); ctx.stroke();
  
  drawBatt(ctx, cx-100, cy);
  drawBulb(ctx, cx, cy+100, true);
  // Paperclip
  ctx.strokeStyle='#ccc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.ellipse(cx+100,cy, 6,20, 0,0,Math.PI*2); ctx.stroke();
  
  txt(ctx,'Paperclip is a CONDUCTOR!',cx,cy-140,18,'#88ff88','center');
  txt(ctx,'(Metals allow electricity to pass)',cx,cy-50,14,'#aaccff','center');
});

reg('circ_insul',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#fc8'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(cx-100,cy-30); ctx.lineTo(cx-100,cy-100); ctx.lineTo(cx+100,cy-100); ctx.lineTo(cx+100,cy-5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+100,cy-5); ctx.lineTo(cx+100,cy+100); ctx.lineTo(cx+20,cy+100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-20,cy+100); ctx.lineTo(cx-100,cy+100); ctx.lineTo(cx-100,cy+25); ctx.stroke();
  
  drawBatt(ctx, cx-100, cy);
  drawBulb(ctx, cx, cy+100, false);
  // Eraser
  ctx.fillStyle='#f88'; ctx.fillRect(cx+90,cy-15, 20,30);
  
  txt(ctx,'Eraser is an INSULATOR!',cx,cy-140,18,'#f66','center');
  txt(ctx,'(Rubber stops electricity)',cx,cy-50,14,'#aaccff','center');
});

// ──────── PHYSICS: LENSES ────────
function drawLens(ctx,x,y) {
  ctx.fillStyle='rgba(150,200,255,0.4)'; ctx.strokeStyle='#aaccff'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.ellipse(x,y, 10,60, 0,0,Math.PI*2); ctx.fill(); ctx.stroke();
}
reg('lens_setup',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  drawLens(ctx, cx, cy);
  ctx.setLineDash([5,5]); ctx.strokeStyle='rgba(255,255,255,0.2)';
  ctx.beginPath(); ctx.moveTo(100,cy); ctx.lineTo(W-100,cy); ctx.stroke(); ctx.setLineDash([]);
  txt(ctx,'Principal Axis',cx,cy+80,11,'#666','center');
  txt(ctx,'Convex Lens (Converging)',cx,cy-80,16,'#aaccff','center');
});
reg('lens_rays',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  drawLens(ctx, cx, cy);
  const prog = Math.min(1, (t%3)/1.5);
  ctx.strokeStyle='rgba(255,255,0,0.6)'; ctx.lineWidth=2;
  for(let dy=-40; dy<=40; dy+=20) {
    if(dy===0) continue;
    ctx.beginPath(); ctx.moveTo(cx-200, cy+dy); ctx.lineTo(cx-200 + prog*200, cy+dy); ctx.stroke();
  }
  txt(ctx,'Parallel Light Rays entering...',cx,cy-90,14,'#ffdd55','center');
});
reg('lens_bend',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  drawLens(ctx, cx, cy);
  ctx.strokeStyle='rgba(255,255,0,0.6)'; ctx.lineWidth=2;
  const prog = Math.min(1, (t%3)/1.5);
  for(let dy=-40; dy<=40; dy+=20) {
    if(dy===0) continue;
    ctx.beginPath(); ctx.moveTo(cx-200, cy+dy); ctx.lineTo(cx, cy+dy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy+dy); ctx.lineTo(cx + prog*120, cy+dy - (dy*prog)); ctx.stroke();
  }
  txt(ctx,'Rays bend (refract) inwards',cx,cy-90,14,'#ffdd55','center');
});
reg('lens_focus',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  drawLens(ctx, cx, cy);
  ctx.strokeStyle='rgba(255,255,0,0.6)'; ctx.lineWidth=2;
  for(let dy=-40; dy<=40; dy+=20) {
    if(dy===0) continue;
    ctx.beginPath(); ctx.moveTo(cx-200, cy+dy); ctx.lineTo(cx, cy+dy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy+dy); ctx.lineTo(cx + 250, cy+dy - (dy*2.08)); ctx.stroke();
  }
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+120,cy, 6,0,Math.PI*2); ctx.fill();
  txt(ctx,'Principal Focus (F)',cx+120,cy-15,14,'#fff','center');
  
  arrow(ctx, cx,cy+75, cx+120,cy+75, '#f55',2);
  arrow(ctx, cx+120,cy+75, cx,cy+75, '#f55',2);
  txt(ctx,'Focal Length',cx+60,cy+95,12,'#f55','center');
});
reg('lens_image',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  drawLens(ctx, cx, cy);
  // Object
  ctx.fillStyle='#f55'; ctx.fillRect(cx-150, cy-50, 10,50); txt(ctx,'Object',cx-145,cy-60,12,'#f55','center');
  // Rays
  ctx.strokeStyle='rgba(255,255,0,0.4)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(cx-145,cy-50); ctx.lineTo(cx,cy-50); ctx.lineTo(cx+150, cy+50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-145,cy-50); ctx.lineTo(cx,cy); ctx.lineTo(cx+150, cy+50); ctx.stroke();
  // Image (inverted)
  ctx.fillStyle='#f55'; ctx.fillRect(cx+145, cy, -8,50); txt(ctx,'Image',cx+145,cy+65,12,'#f55','center');
  
  txt(ctx,'Real, Inverted Image on screen!',cx,cy-100,16,'#fff','center');
});

// ──────── BIOLOGY: STOMATA ────────
reg('stom_peel',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Leaf and peeling action
  ctx.fillStyle='#44aa55'; ctx.beginPath(); ctx.ellipse(cx-50,cy, 60,30, Math.PI/6, 0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(200,250,200,0.6)'; ctx.beginPath(); ctx.moveTo(cx-20,cy-10); ctx.lineTo(cx+40,cy-40); ctx.lineTo(cx+80,cy); ctx.lineTo(cx,cy+20); ctx.fill();
  // Forceps
  ctx.strokeStyle='#ccc'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(cx+100,cy-80); ctx.lineTo(cx+50,cy-20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+120,cy-70); ctx.lineTo(cx+50,cy-20); ctx.stroke();
  txt(ctx,'Peeling lower epidermis of a leaf',cx,H-30,14,'#aaccaa','center');
});
reg('stom_stain',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='rgba(220,230,200,0.35)'; ctx.fillRect(cx-120,cy-8,240,16);
  ctx.strokeStyle='#aabb88'; ctx.lineWidth=2; ctx.strokeRect(cx-120,cy-8,240,16);
  // Peel on slide
  ctx.fillStyle='rgba(200,250,200,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy, 30,15, 0, 0,Math.PI*2); ctx.fill();
  // Stain drop
  const dropY=cy-80+(t%3)*30;
  ctx.fillStyle='rgba(250,50,50,0.85)'; ctx.beginPath(); ctx.arc(cx,dropY,6,0,Math.PI*2); ctx.fill();
  txt(ctx,'Adding Safranin stain (red)',cx,H-30,14,'#ffaaaa','center');
});
reg('stom_micro',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Microscope simplified
  ctx.fillStyle='#333'; ctx.fillRect(cx-30,cy+40,60,10); // stage
  ctx.fillStyle='#555'; ctx.fillRect(cx-15,cy-60,30,80); // arm/tube
  ctx.fillStyle='#888'; ctx.fillRect(cx-20,cy+10,40,20); // objective
  ctx.fillStyle='rgba(220,230,200,0.8)'; ctx.fillRect(cx-40,cy+35,80,5); // slide
  txt(ctx,'Observing under microscope',cx,H-30,14,'#ccc','center');
});
reg('stom_low',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#ffaaaa'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(cx,cy, 120, 0,Math.PI*2); ctx.stroke();
  ctx.clip(); // circular FOV
  ctx.fillStyle='rgba(250,150,150,0.2)'; ctx.fillRect(cx-120,cy-120,240,240);
  // Cell grid
  ctx.strokeStyle='#cc4444'; ctx.lineWidth=2;
  for(let x=cx-120; x<cx+120; x+=40) {
    for(let y=cy-120; y<cy+120; y+=25) {
      ctx.strokeRect(x+Math.sin(y)*10, y, 40,25);
    }
  }
  txt(ctx,'Low Power (10x): Epidermal cells',cx,H-30,14,'#ffcccc','center');
});
reg('stom_high',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#ffaaaa'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(cx,cy, 140, 0,Math.PI*2); ctx.stroke();
  ctx.clip(); // circular FOV
  ctx.fillStyle='rgba(250,150,150,0.2)'; ctx.fillRect(cx-140,cy-140,280,280);
  
  // Stoma
  ctx.fillStyle='#cc4444'; ctx.strokeStyle='#aa2222'; ctx.lineWidth=3;
  // Left guard cell
  ctx.beginPath(); ctx.ellipse(cx-20,cy, 15,40, 0, 0,Math.PI*2); ctx.fill(); ctx.stroke();
  // Right guard cell
  ctx.beginPath(); ctx.ellipse(cx+20,cy, 15,40, 0, 0,Math.PI*2); ctx.fill(); ctx.stroke();
  // Pore
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.ellipse(cx,cy, 5,30, 0, 0,Math.PI*2); ctx.fill();
  
  // Nucleus in guard cells
  ctx.fillStyle='#551111';
  ctx.beginPath(); ctx.arc(cx-20,cy, 6, 0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+20,cy, 6, 0,Math.PI*2); ctx.fill();

  txt(ctx,'High Power (40x): Guard Cells & Stomatal Pore',cx,H-30,14,'#ffcccc','center');
});

// ──────── BIOLOGY: FOOD TESTS ────────
reg('food_milk_setup',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Test tube
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3; ctx.beginPath(); ctx.roundRect(cx-20,cy-60,40,120, 20); ctx.stroke();
  ctx.fillStyle='#fff'; ctx.fillRect(cx-16,cy,32,50); // milk
  txt(ctx,'Milk Sample',cx,cy+80,14,'#fff','center');
});
reg('food_milk_add',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3; ctx.beginPath(); ctx.roundRect(cx-20,cy-60,40,120, 20); ctx.stroke();
  ctx.fillStyle='#fff'; ctx.fillRect(cx-16,cy,32,50); // milk
  
  const dropY=cy-80+(t%3)*30;
  ctx.fillStyle='#773311'; ctx.beginPath(); ctx.arc(cx,dropY,5,0,Math.PI*2); ctx.fill(); // iodine drop
  txt(ctx,'Adding Iodine Solution',cx,cy+80,14,'#ffaa55','center');
});
reg('food_milk_res',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3; ctx.beginPath(); ctx.roundRect(cx-20,cy-60,40,120, 20); ctx.stroke();
  const cAmt = Math.min(1, (t%4)/2);
  const r=Math.floor(255 - cAmt*235), g=Math.floor(255 - cAmt*235), b=Math.floor(255 - cAmt*150);
  ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(cx-16,cy,32,50); 
  
  txt(ctx,'Turns Blue-Black!',cx,cy-80,16,'#aaaaff','center');
  txt(ctx,'STARCH ADULTERANT DETECTED',cx,cy+80,14,'#ff5555','center');
});

reg('food_turm_setup',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3; ctx.beginPath(); ctx.roundRect(cx-20,cy-60,40,120, 20); ctx.stroke();
  ctx.fillStyle='#ffcc00'; ctx.fillRect(cx-16,cy+30,32,20); // turmeric powder
  txt(ctx,'Turmeric Powder',cx,cy+80,14,'#ffdd55','center');
});
reg('food_turm_add',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3; ctx.beginPath(); ctx.roundRect(cx-20,cy-60,40,120, 20); ctx.stroke();
  ctx.fillStyle='rgba(255,200,0,0.8)'; ctx.fillRect(cx-16,cy,32,50); // mixed
  
  const dropY=cy-80+(t%3)*30;
  ctx.fillStyle='rgba(200,255,255,0.8)'; ctx.beginPath(); ctx.arc(cx,dropY,5,0,Math.PI*2); ctx.fill(); // acid drop
  txt(ctx,'Adding Concentrated HCl',cx,cy+80,14,'#aaffaa','center');
});
reg('food_turm_res',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3; ctx.beginPath(); ctx.roundRect(cx-20,cy-60,40,120, 20); ctx.stroke();
  const cAmt = Math.min(1, (t%4)/2);
  const r=255, g=Math.floor(200 - cAmt*150), b=Math.floor(0 + cAmt*100);
  ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(cx-16,cy,32,50);
  
  txt(ctx,'Turns Magenta/Red!',cx,cy-80,16,'#ff5588','center');
  txt(ctx,'METANIL YELLOW DYE DETECTED',cx,cy+80,14,'#ff5555','center');
});

// ──────── BIOLOGY: FLOWER ────────
reg('flower_whole',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2+20;
  // Stem
  ctx.strokeStyle='#228822'; ctx.lineWidth=5;
  ctx.beginPath(); ctx.moveTo(cx,cy+100); ctx.lineTo(cx,cy+30); ctx.stroke();
  // Petals
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2, r=70;
    ctx.fillStyle='rgba(255,100,100,0.7)';
    ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*r,cy+Math.sin(a)*r,22,12,a,0,Math.PI*2); ctx.fill();
  }
  // Sepals
  for(let i=0;i<5;i++){
    const a=i/5*Math.PI*2+0.3;
    ctx.fillStyle='rgba(30,140,30,0.7)';
    ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*40,cy+Math.sin(a)*40,14,8,a,0,Math.PI*2); ctx.fill();
  }
  // Centre
  ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2);
  ctx.fillStyle='#ffcc44'; ctx.fill();
  txt(ctx,'Hibiscus Flower',cx,cy-115,14,'#ffaaaa','center');
});
reg('flower_sepal',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  for(let i=0;i<5;i++){
    const a=i/5*Math.PI*2+0.3;
    const glow=i===2?1:0.55;
    ctx.fillStyle='rgba(30,140,30,'+glow+')';
    ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*55,cy+Math.sin(a)*55,18,10,a,0,Math.PI*2); ctx.fill();
    if(i===2){ ctx.strokeStyle='#88ff88'; ctx.lineWidth=2; ctx.stroke(); }
  }
  txt(ctx,'SEPAL (Calyx)',cx,cy-90,16,'#88ff88','center');
  txt(ctx,'Green leaf-like structures - protect the bud',cx,H-25,12,'rgba(100,255,100,0.5)','center');
  ctx.beginPath(); ctx.arc(cx,cy,12,0,Math.PI*2); ctx.fillStyle='#ffcc44'; ctx.fill();
});
reg('flower_petal',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  for(let i=0;i<8;i++){
    const a=i/8*Math.PI*2;
    const pulse=1+Math.sin(t*2+i*0.8)*0.06;
    ctx.fillStyle='rgba(255,80,80,0.8)';
    ctx.beginPath(); ctx.ellipse(cx+Math.cos(a)*70*pulse,cy+Math.sin(a)*70*pulse,24,13,a,0,Math.PI*2); ctx.fill();
    if(i===0){ ctx.strokeStyle='#ffaaaa'; ctx.lineWidth=2; ctx.stroke(); }
  }
  txt(ctx,'PETAL (Corolla)',cx,cy-110,16,'#ff9999','center');
  txt(ctx,'Colourful! Attracts pollinators like bees',cx,H-25,12,'rgba(255,150,150,0.5)','center');
  ctx.beginPath(); ctx.arc(cx,cy,12,0,Math.PI*2); ctx.fillStyle='#ffcc44'; ctx.fill();
});
reg('flower_stamen',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  for(let i=0;i<6;i++){
    const a=i/6*Math.PI*2;
    ctx.strokeStyle='#ffcc44'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(a)*14,cy+Math.sin(a)*14); ctx.lineTo(cx+Math.cos(a)*50,cy+Math.sin(a)*50); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+Math.cos(a)*54,cy+Math.sin(a)*54,6,0,Math.PI*2);
    ctx.fillStyle='#ffaa00'; ctx.fill();
    // Pollen dots
    if(Math.random()<0.3){
      ctx.beginPath(); ctx.arc(cx+Math.cos(a)*54+Math.random()*14-7,cy+Math.sin(a)*54+Math.random()*14-7,2,0,Math.PI*2);
      ctx.fillStyle='#ffee44'; ctx.fill();
    }
  }
  txt(ctx,'STAMEN',cx,cy-85,16,'#ffcc44','center');
  txt(ctx,'Anther (yellow ball) produces POLLEN',cx,H-25,12,'rgba(255,200,50,0.5)','center');
  ctx.beginPath(); ctx.arc(cx,cy,10,0,Math.PI*2); ctx.fillStyle='#ff6688'; ctx.fill();
});
reg('flower_pistil',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Pistil
  ctx.strokeStyle='#ff6688'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(cx,cy+30); ctx.lineTo(cx,cy-50); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx,cy-55,10,0,Math.PI*2); ctx.fillStyle='#ff6688'; ctx.fill();
  ctx.fillStyle='rgba(255,180,200,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy+38,22,18,0,0,Math.PI*2); ctx.fill();
  txt(ctx,'Stigma',cx+18,cy-58,11,'#ff9999');
  txt(ctx,'Style',cx+18,cy-5,11,'#ff9999');
  txt(ctx,'Ovary',cx+18,cy+40,11,'#ff9999');
  txt(ctx,'PISTIL (Carpel) - Female Reproductive Part',cx,cy-100,13,'#ff9999','center');
});
reg('flower_diagram',(ctx,W,H,t)=>{
  const parts=[['Sepal','protect','#44cc44'],['Petal','attract','#ff7777'],['Stamen','male/pollen','#ffcc44'],['Pistil','female/seeds','#ff9999']];
  parts.forEach(([nm,role,col],i)=>{
    const x=120+i*210, y=H/2;
    ctx.fillStyle=col+'22'; ctx.beginPath(); ctx.roundRect(x-80,y-60,160,100,8); ctx.fill();
    ctx.strokeStyle=col+'66'; ctx.lineWidth=2; ctx.stroke();
    txt(ctx,nm,x,y-28,15,col,'center'); txt(ctx,role,x,y+12,11,col+'aa','center');
    if(i<3) arrow(ctx,x+85,y,x+130,y,'rgba(255,255,255,0.25)',1.5);
  });
  txt(ctx,'Four whorls: outermost to innermost',W/2,H-25,12,'rgba(255,255,255,0.35)','center');
});

// ──────── BIOLOGY: CELLS ────────
reg('cell_prep',(ctx,W,H,t)=>{
  const cx=W/2;
  ctx.fillStyle='rgba(220,230,200,0.35)'; ctx.fillRect(cx-120,H/2-8,240,16);
  ctx.strokeStyle='#aabb88'; ctx.lineWidth=2; ctx.strokeRect(cx-120,H/2-8,240,16);
  txt(ctx,'Glass Slide',cx,H/2+35,13,'#aabb88','center');
  // Onion layer outline
  for(let i=0;i<20;i++){
    ctx.strokeStyle='rgba(200,180,120,'+(0.2+i%3*0.15)+')'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.ellipse(cx+(-8+i*12),H/2,5,8,0,0,Math.PI*2); ctx.stroke();
  }
  txt(ctx,'Thin onion peel layer on slide',cx,H-30,12,'rgba(255,255,255,0.35)','center');
});
reg('cell_iodine',(ctx,W,H,t)=>{
  const cx=W/2;
  ctx.fillStyle='rgba(220,230,200,0.35)'; ctx.fillRect(cx-120,H/2-8,240,16);
  ctx.strokeStyle='#aabb88'; ctx.lineWidth=2; ctx.strokeRect(cx-120,H/2-8,240,16);
  // Iodine drop
  const dropY=H/2-80+(t%3)*30;
  ctx.beginPath(); ctx.arc(cx,dropY,7,0,Math.PI*2);
  ctx.fillStyle='rgba(100,50,10,0.85)'; ctx.fill();
  ctx.strokeStyle='#884400'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx,dropY); ctx.lineTo(cx,H/2-12); ctx.stroke();
  txt(ctx,'Iodine stains nucleus dark brown',cx,H-30,13,'#aa7733','center');
});
reg('cell_coverslip',(ctx,W,H,t)=>{
  const cx=W/2, a=t%3;
  ctx.fillStyle='rgba(220,230,200,0.35)'; ctx.fillRect(cx-120,H/2,240,14);
  // Coverslip at angle
  const ang=Math.max(0,0.7-a*0.25);
  ctx.save(); ctx.translate(cx-120,H/2);
  ctx.rotate(-ang); ctx.fillStyle='rgba(180,220,255,0.5)'; ctx.fillRect(0,-3,240,8); ctx.restore();
  txt(ctx,'Lower coverslip at 45 degrees - no bubbles!',cx,H-30,13,'rgba(100,200,255,0.5)','center');
});
reg('cell_low',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.beginPath(); ctx.arc(cx,cy,100,0,Math.PI*2);
  ctx.fillStyle='rgba(200,220,160,0.15)'; ctx.fill();
  ctx.strokeStyle='#888'; ctx.lineWidth=4; ctx.stroke();
  // Many cells
  for(let i=-3;i<=3;i++) for(let j=-3;j<=3;j++){
    if(Math.sqrt(i*i+j*j)<3.5){
      ctx.strokeStyle='rgba(100,140,60,0.7)'; ctx.lineWidth=1.5;
      ctx.strokeRect(cx+i*28-14,cy+j*22-10,28,20);
    }
  }
  txt(ctx,'10x - See grid of cells',cx,cy+115,12,'rgba(200,220,160,0.6)','center');
});
reg('cell_high',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.beginPath(); ctx.arc(cx,cy,100,0,Math.PI*2);
  ctx.fillStyle='rgba(200,220,160,0.15)'; ctx.fill();
  ctx.strokeStyle='#888'; ctx.lineWidth=4; ctx.stroke();
  // One enlarged cell
  ctx.strokeStyle='rgba(100,140,60,0.9)'; ctx.lineWidth=3;
  ctx.strokeRect(cx-65,cy-45,130,90);
  // Nucleus
  ctx.beginPath(); ctx.arc(cx+10,cy+5,20,0,Math.PI*2);
  ctx.fillStyle='rgba(80,50,20,0.6)'; ctx.fill();
  ctx.strokeStyle='#aa7733'; ctx.lineWidth=2; ctx.stroke();
  txt(ctx,'Nucleus',cx+40,cy+8,10,'#bb8833');
  txt(ctx,'Cell Wall',cx-90,cy-20,10,'#88aa44');
  txt(ctx,'40x - Cell wall + Nucleus visible!',cx,cy+115,12,'rgba(200,220,160,0.6)','center');
});
reg('cell_diagram',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='rgba(100,140,60,0.9)'; ctx.lineWidth=3;
  ctx.strokeRect(cx-120,cy-80,240,160);
  ctx.strokeStyle='rgba(100,140,60,0.5)'; ctx.lineWidth=1.5;
  ctx.strokeRect(cx-112,cy-72,224,144);
  ctx.beginPath(); ctx.arc(cx+20,cy+10,28,0,Math.PI*2);
  ctx.fillStyle='rgba(80,50,20,0.6)'; ctx.fill();
  ctx.strokeStyle='#aa7733'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='rgba(200,220,160,0.08)'; ctx.fillRect(cx-112,cy-72,224,144);
  txt(ctx,'Cell Wall',cx-160,cy-30,11,'#88aa44');
  txt(ctx,'Cell Membrane',cx-160,cy,11,'#66cc66');
  txt(ctx,'Cytoplasm',cx-160,cy+30,11,'rgba(200,220,160,0.7)');
  txt(ctx,'Nucleus',cx+60,cy+14,11,'#bb8833');
  arrow(ctx,cx-90,cy-30,cx-120,cy-30,'#88aa44',1); arrow(ctx,cx-90,cy,cx-120,cy,'#66cc66',1);
  arrow(ctx,cx+60,cy+10,cx+50,cy+10,'#bb8833',1);
});

// ──────── BIOLOGY: PHOTOSYNTHESIS ────────
reg('photo_leaf',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Variegated leaf
  ctx.fillStyle='#228822';
  ctx.beginPath(); ctx.ellipse(cx,cy,160,90,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f0f0cc';
  ctx.beginPath(); ctx.ellipse(cx-60,cy-20,55,35,0.3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx+70,cy+20,45,28,-0.2,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#1a5522'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-160,cy); ctx.bezierCurveTo(cx-80,cy-30,cx+80,cy+30,cx+160,cy); ctx.stroke();
  txt(ctx,'Green areas = chlorophyll',cx-70,cy-60,11,'#66ff66');
  txt(ctx,'White areas = no chlorophyll',cx+20,cy+35,11,'#aabb88');
  txt(ctx,'Variegated Leaf',cx,cy+110,14,'#88cc88','center');
});
reg('photo_boil',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-60,cy-60); ctx.lineTo(cx-60,cy+70); ctx.lineTo(cx+60,cy+70); ctx.lineTo(cx+60,cy-60); ctx.stroke();
  ctx.fillStyle='rgba(100,180,255,0.4)'; ctx.fillRect(cx-56,cy-10,112,76);
  ctx.fillStyle='#228822'; ctx.beginPath(); ctx.ellipse(cx,cy-25,45,22,0,0,Math.PI*2); ctx.fill();
  // Bubbles
  for(let i=0;i<5;i++){
    const bx=cx-40+i*20, by=cy-15+(t*40+i*30)%80;
    ctx.beginPath(); ctx.arc(bx,by,3+i%3,0,Math.PI*2);
    ctx.strokeStyle='rgba(180,220,255,0.7)'; ctx.lineWidth=1; ctx.stroke();
  }
  // Flame
  ctx.fillStyle='#ff6600'; ctx.beginPath(); ctx.moveTo(cx-20,cy+80); ctx.lineTo(cx,cy+60+Math.sin(t*5)*5); ctx.lineTo(cx+20,cy+80); ctx.closePath(); ctx.fill();
  txt(ctx,'Boiling in water - 5 minutes',cx,H-30,13,'rgba(100,200,255,0.5)','center');
});
reg('photo_decolor',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  const fade=Math.min(1,(t%5)/3);
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx-60,cy-60); ctx.lineTo(cx-60,cy+70); ctx.lineTo(cx+60,cy+70); ctx.lineTo(cx+60,cy-60); ctx.stroke();
  const r=Math.floor(130+fade*110), g=Math.floor(200-fade*60);
  ctx.fillStyle='rgb('+r+','+g+',80)'; ctx.fillRect(cx-56,cy-5,112,71);
  const gc=Math.floor(34+fade*180);
  ctx.fillStyle='rgb('+gc+','+(gc+30)+','+gc+')';
  ctx.beginPath(); ctx.ellipse(cx,cy-25,45,22,0,0,Math.PI*2); ctx.fill();
  // Outer beaker in water bath
  ctx.strokeStyle='#668888'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-90,cy-80); ctx.lineTo(cx-90,cy+100); ctx.lineTo(cx+90,cy+100); ctx.lineTo(cx+90,cy-80); ctx.stroke();
  ctx.fillStyle='rgba(180,220,200,0.2)'; ctx.fillRect(cx-86,cy+50,172,46);
  txt(ctx,'Alcohol in water bath - removes chlorophyll',cx,H-30,12,'rgba(200,200,100,0.5)','center');
});
reg('photo_wash',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#f0eedd';
  ctx.beginPath(); ctx.ellipse(cx,cy,100,55,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#ccbb88'; ctx.lineWidth=2; ctx.stroke();
  // Water drops
  for(let i=0;i<5;i++){
    const dropT=(t+i*0.4)%2;
    ctx.beginPath(); ctx.arc(cx-60+i*30,cy-80+dropT*60,4,0,Math.PI*2);
    ctx.fillStyle='rgba(100,180,255,'+(1-dropT/2)+')'; ctx.fill();
  }
  txt(ctx,'Decolourised - pale/white',cx,cy+80,13,'#ccbb88','center');
  txt(ctx,'Wash with water - now ready for iodine',cx,H-30,12,'rgba(200,200,180,0.5)','center');
});
reg('photo_iodine',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#f0eedd';
  ctx.beginPath(); ctx.ellipse(cx,cy,100,55,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#ccbb88'; ctx.lineWidth=2; ctx.stroke();
  // Iodine drops
  const dropPhase=(t%3);
  ctx.beginPath(); ctx.arc(cx,cy-90+dropPhase*30,6,0,Math.PI*2);
  ctx.fillStyle='rgba(100,40,10,'+Math.max(0,1-dropPhase)+')'; ctx.fill();
  // Iodine stain spreading
  if(dropPhase>1.5){
    ctx.fillStyle='rgba(30,10,80,0.35)';
    ctx.beginPath(); ctx.arc(cx,cy,35+dropPhase*5,0,Math.PI*2); ctx.fill();
  }
  txt(ctx,'Iodine drops added over leaf',cx,H-30,12,'rgba(150,100,50,0.6)','center');
});
reg('photo_result',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  // Whole leaf - green parts blue-black
  ctx.fillStyle='#221166';
  ctx.beginPath(); ctx.ellipse(cx,cy,130,75,0,0,Math.PI*2); ctx.fill();
  // White areas stay brownish
  ctx.fillStyle='#8a6a2a';
  ctx.beginPath(); ctx.ellipse(cx-55,cy-18,45,28,0.3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx+65,cy+18,38,24,-0.2,0,Math.PI*2); ctx.fill();
  // Labels
  txt(ctx,'BLUE-BLACK = starch = photosynthesis!',cx-30,cy-55,11,'#8899ff','center');
  txt(ctx,'BROWN = no starch = no chlorophyll',cx+10,cy+55,11,'#aa8844','center');
  txt(ctx,'RESULT: Only green (chlorophyll) areas made starch!',cx,H-30,12,'#66ffaa','center');
  // Glow on blue-black area
  ctx.strokeStyle='rgba(100,80,220,'+(0.4+Math.sin(t*2)*0.2)+')'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.ellipse(cx,cy,132,77,0,0,Math.PI*2); ctx.stroke();
});

// ════════════════════════════════════════════
// SCREEN CONTROLLER
// Screen is OFF (black, standby) when idle.
// Screen turns ON only when an experiment is
// actively being performed, and tracks the
// exact current step in real-time.
// HUD overlay also only shows while performing.
// ════════════════════════════════════════════
const screenState = {
  expId: null,
  step: -1,
  isOn: false,
};

// HUD elements
const screenHud  = document.getElementById('screen-hud');
const shudTitle  = document.getElementById('shud-title');
const shudTopic  = document.getElementById('shud-topic');
const shudZoneDot= document.getElementById('shud-zone-dot');
const shudStepLabel = document.getElementById('shud-step-label');
const shudStepText  = document.getElementById('shud-step-text');
const shudProgress  = document.getElementById('shud-progress');
const shudCycleBar  = document.getElementById('shud-cycle-bar');
const shudHint   = document.getElementById('shud-hint');
const shudCanvas = document.getElementById('shud-canvas');
const shudCtx    = shudCanvas.getContext('2d');


// -- CIRCUITS --
reg('cir_setup',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#334'; ctx.fillRect(cx-120,cy-60,50,30); txt(ctx,'Battery',cx-95,cy-70,10,'#aaa','center');
  ctx.fillStyle='#334'; ctx.fillRect(cx-20,cy+40,40,20); txt(ctx,'Switch',cx,cy+75,10,'#aaa','center');
  ctx.fillStyle='#334'; ctx.fillRect(cx+80,cy-60,40,50); txt(ctx,'LED',cx+100,cy-70,10,'#aaa','center');
  ctx.fillStyle='#facc15'; ctx.beginPath(); ctx.arc(cx-105,cy-45,5,0,Math.PI*2); ctx.fill(); // +
  ctx.fillStyle='#4ade80'; ctx.beginPath(); ctx.arc(cx-85,cy-45,5,0,Math.PI*2); ctx.fill(); // -
});
reg('cir_wire1',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#334'; ctx.fillRect(cx-120,cy-60,50,30); ctx.fillStyle='#334'; ctx.fillRect(cx-20,cy+40,40,20); ctx.fillStyle='#334'; ctx.fillRect(cx+80,cy-60,40,50);
  ctx.strokeStyle='#facc15'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-105,cy-40); ctx.lineTo(cx-105,cy+50); ctx.lineTo(cx-20,cy+50); ctx.stroke();
  txt(ctx,'Red wire from Battery (+) to Switch',cx,cy-20,12,'#facc15','center');
});
reg('cir_wire2',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#334'; ctx.fillRect(cx-120,cy-60,50,30); ctx.fillStyle='#334'; ctx.fillRect(cx-20,cy+40,40,20); ctx.fillStyle='#334'; ctx.fillRect(cx+80,cy-60,40,50);
  ctx.strokeStyle='#facc15'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-105,cy-40); ctx.lineTo(cx-105,cy+50); ctx.lineTo(cx-20,cy+50); ctx.stroke();
  ctx.strokeStyle='#f87171'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+20,cy+50); ctx.lineTo(cx+100,cy+50); ctx.lineTo(cx+100,cy-10); ctx.stroke();
  txt(ctx,'Wire from Switch to LED',cx,cy-20,12,'#f87171','center');
});
reg('cir_wire3',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#334'; ctx.fillRect(cx-120,cy-60,50,30); ctx.fillStyle='#334'; ctx.fillRect(cx-20,cy+40,40,20); ctx.fillStyle='#334'; ctx.fillRect(cx+80,cy-60,40,50);
  ctx.strokeStyle='#facc15'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-105,cy-40); ctx.lineTo(cx-105,cy+50); ctx.lineTo(cx-20,cy+50); ctx.stroke();
  ctx.strokeStyle='#f87171'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+20,cy+50); ctx.lineTo(cx+100,cy+50); ctx.lineTo(cx+100,cy-10); ctx.stroke();
  ctx.strokeStyle='#4ade80'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+80,cy-25); ctx.lineTo(cx-85,cy-25); ctx.lineTo(cx-85,cy-40); ctx.stroke();
  txt(ctx,'Circuit is now completely assembled (Open)',cx,cy-10,12,'#aaa','center');
  // Switch is open Draw
  ctx.strokeStyle='#aaa'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(cx-20,cy+45); ctx.lineTo(cx+20,cy+30); ctx.stroke();
});
reg('cir_close',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#334'; ctx.fillRect(cx-120,cy-60,50,30); ctx.fillStyle='#334'; ctx.fillRect(cx-20,cy+40,40,20); ctx.fillStyle='#334'; ctx.fillRect(cx+80,cy-60,40,50);
  ctx.strokeStyle='#facc15'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-105,cy-40); ctx.lineTo(cx-105,cy+50); ctx.lineTo(cx-20,cy+50); ctx.stroke();
  ctx.strokeStyle='#f87171'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+20,cy+50); ctx.lineTo(cx+100,cy+50); ctx.lineTo(cx+100,cy-10); ctx.stroke();
  ctx.strokeStyle='#4ade80'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+80,cy-25); ctx.lineTo(cx-85,cy-25); ctx.lineTo(cx-85,cy-40); ctx.stroke();
  ctx.strokeStyle='#aaa'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(cx-20,cy+45); ctx.lineTo(cx+20,cy+45); ctx.stroke();
  txt(ctx,'Electrons flow! Circuit is CLOSED.',cx,cy-10,12,'#facc15','center');
});
reg('cir_lit',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#334'; ctx.fillRect(cx-120,cy-60,50,30); ctx.fillStyle='#334'; ctx.fillRect(cx-20,cy+40,40,20); ctx.fillStyle='#334'; ctx.fillRect(cx+80,cy-60,40,50);
  ctx.strokeStyle='#facc15'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-105,cy-40); ctx.lineTo(cx-105,cy+50); ctx.lineTo(cx-20,cy+50); ctx.stroke();
  ctx.strokeStyle='#f87171'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+20,cy+50); ctx.lineTo(cx+100,cy+50); ctx.lineTo(cx+100,cy-10); ctx.stroke();
  ctx.strokeStyle='#4ade80'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+80,cy-25); ctx.lineTo(cx-85,cy-25); ctx.lineTo(cx-85,cy-40); ctx.stroke();
  ctx.strokeStyle='#aaa'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(cx-20,cy+45); ctx.lineTo(cx+20,cy+45); ctx.stroke();
  ctx.fillStyle='rgba(250,204,21,'+(0.4+Math.sin(t*5)*0.2)+')'; ctx.beginPath(); ctx.arc(cx+100,cy-75,40,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#facc15'; ctx.beginPath(); ctx.arc(cx+100,cy-65,15,0,Math.PI*2); ctx.fill();
  txt(ctx,'LIGHT ENERGY!',cx,cy-10,14,'#facc15','center');
  const pt = (t*40)%100;
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.arc(cx-105, cy-40+pt*0.9, 3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+20+pt*0.8, cy+50, 3,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx+80-pt*1.6, cy-25, 3,0,Math.PI*2); ctx.fill();
});
reg('cir_open',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#334'; ctx.fillRect(cx-120,cy-60,50,30); ctx.fillStyle='#334'; ctx.fillRect(cx-20,cy+40,40,20); ctx.fillStyle='#334'; ctx.fillRect(cx+80,cy-60,40,50);
  ctx.strokeStyle='#facc15'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx-105,cy-40); ctx.lineTo(cx-105,cy+50); ctx.lineTo(cx-20,cy+50); ctx.stroke();
  ctx.strokeStyle='#f87171'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+20,cy+50); ctx.lineTo(cx+100,cy+50); ctx.lineTo(cx+100,cy-10); ctx.stroke();
  ctx.strokeStyle='#4ade80'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx+80,cy-25); ctx.lineTo(cx-85,cy-25); ctx.lineTo(cx-85,cy-40); ctx.stroke();
  ctx.strokeStyle='#888'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(cx-20,cy+45); ctx.lineTo(cx+20,cy+30); ctx.stroke();
  txt(ctx,'OPEN SWITCH = NO CURRENT',cx,cy-10,14,'#f87171','center');
  ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(cx+100,cy-65,15,0,Math.PI*2); ctx.fill();
});

// -- LENSES --
reg('lens_setup',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  txt(ctx,'Convex Lens',cx,cy-45,12,'#60a5fa','center');
  txt(ctx,'Light Source',cx-165,cy-20,12,'#d97706','center');
});
reg('lens_rays',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  ctx.strokeStyle='rgba(250,204,21,0.8)'; ctx.lineWidth=2;
  [-20,0,20].forEach(yoff=>{
     ctx.beginPath(); ctx.moveTo(cx-150,cy+yoff); ctx.lineTo(cx,cy+yoff); ctx.stroke();
  });
  txt(ctx,'Parallel Light Rays',cx-80,cy-35,12,'#facc15','center');
});
reg('lens_refract',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  ctx.strokeStyle='rgba(250,204,21,0.8)'; ctx.lineWidth=2;
  [-20,0,20].forEach(yoff=>{
     ctx.beginPath(); ctx.moveTo(cx-150,cy+yoff); ctx.lineTo(cx-6,cy+yoff); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(cx-6,cy+yoff); ctx.lineTo(cx+6,cy+yoff*0.8); ctx.stroke();
  });
  txt(ctx,'Light bends (refracts) inside glass',cx,cy-55,12,'#60a5fa','center');
});
reg('lens_converge',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  const spread=(t%3)/3; 
  ctx.strokeStyle='rgba(250,204,21,0.8)'; ctx.lineWidth=2;
  [-20,0,20].forEach(yoff=>{
     ctx.beginPath(); ctx.moveTo(cx-150,cy+yoff); ctx.lineTo(cx,cy+yoff); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(cx,cy+yoff); ctx.lineTo(cx+120*spread,cy+yoff - yoff*spread); ctx.stroke();
  });
  txt(ctx,'Rays converge together',cx,cy-55,12,'#facc15','center');
});
reg('lens_focus',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  ctx.strokeStyle='rgba(250,204,21,0.8)'; ctx.lineWidth=2;
  [-20,0,20].forEach(yoff=>{
     ctx.beginPath(); ctx.moveTo(cx-150,cy+yoff); ctx.lineTo(cx,cy+yoff); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(cx,cy+yoff); ctx.lineTo(cx+120,cy); ctx.lineTo(cx+170, cy - yoff*50/120); ctx.stroke();
  });
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+120,cy,3,0,Math.PI*2); ctx.fill();
  txt(ctx,'FOCAL POINT (F)',cx+120,cy-15,14,'#fff','center');
});
reg('lens_length',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  ctx.strokeStyle='rgba(250,204,21,0.5)'; ctx.lineWidth=2;
  [-20,0,20].forEach(yoff=>{
     ctx.beginPath(); ctx.moveTo(cx-150,cy+yoff); ctx.lineTo(cx,cy+yoff); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(cx,cy+yoff); ctx.lineTo(cx+120,cy); ctx.stroke();
  });
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+120,cy,3,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#4ade80'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx,cy+30); ctx.lineTo(cx+120,cy+30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx,cy+25); ctx.lineTo(cx,cy+35); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+120,cy+25); ctx.lineTo(cx+120,cy+35); ctx.stroke();
  txt(ctx,'Focal Length (f)',cx+60,cy+45,12,'#4ade80','center');
});

// -- STOMATA --
reg('stom_peel',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#228822'; ctx.beginPath(); ctx.ellipse(cx-40,cy,40,20,-0.2,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#228822'; ctx.beginPath(); ctx.ellipse(cx+40,cy,40,20,0.2,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(200,255,200,0.7)'; ctx.beginPath(); ctx.moveTo(cx-5,cy); ctx.lineTo(cx+15,cy-20); ctx.lineTo(cx+25,cy+10); ctx.fill();
  ctx.strokeStyle='#888'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx+80,cy-60); ctx.lineTo(cx+15,cy-20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+90,cy-40); ctx.lineTo(cx+15,cy-20); ctx.stroke();
  txt(ctx,'Tearing lower leaf epidermis',cx,cy+60,13,'#4ade80','center');
});
reg('stom_slide',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.fillRect(cx-80,cy-20,160,40);
  ctx.fillStyle='rgba(150,255,150,0.3)'; ctx.beginPath(); ctx.arc(cx,cy,15,0,Math.PI*2); ctx.fill(); 
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2); ctx.fill(); 
  ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.rect(cx-15,cy-15,30,30); ctx.stroke(); 
  txt(ctx,'Mounted on slide with coverslip',cx,cy+50,13,'#4ade80','center');
});
reg('stom_scope',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#444'; ctx.fillRect(cx-40,cy+40,80,20); 
  ctx.fillStyle='#555'; ctx.fillRect(cx-20,cy-40,20,80); 
  ctx.fillStyle='#666'; ctx.fillRect(cx-20,cy-60,50,20); 
  ctx.fillStyle='rgba(200,255,255,0.5)'; ctx.fillRect(cx+10,cy+10,40,5); 
  txt(ctx,'Microscope Stage',cx,cy+80,13,'#aaa','center');
});
reg('stom_low',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#052e16'; ctx.beginPath(); ctx.arc(cx,cy,90,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#22c55e'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.strokeStyle='rgba(34,197,94,0.4)'; ctx.lineWidth=1;
  for(let i=0;i<5;i++) {
    for(let j=0;j<5;j++) {
       ctx.strokeRect(cx-75+i*30 + (j%2?10:0), cy-75+j*30, 25, 20);
       if((i+j)%3==0) {
         ctx.fillStyle='rgba(134,239,172,0.8)'; ctx.beginPath(); ctx.arc(cx-62+i*30 + (j%2?10:0), cy-65+j*30, 2,0,Math.PI*2); ctx.fill();
       }
    }
  }
  txt(ctx,'Low Power (10x): Epidermal Cells',cx,cy-110,13,'#4ade80','center');
});
reg('stom_high',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#052e16'; ctx.beginPath(); ctx.arc(cx,cy,90,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#22c55e'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.fillStyle='#166534'; ctx.beginPath(); ctx.ellipse(cx-15,cy,15,40,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#166534'; ctx.beginPath(); ctx.ellipse(cx+15,cy,15,40,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#022c22'; ctx.beginPath(); ctx.ellipse(cx,cy,5,30,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#4ade80'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.ellipse(cx-15,cy,15,40,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+15,cy,15,40,0,0,Math.PI*2); ctx.stroke();
  txt(ctx,'High Power (40x): Stoma',cx,cy-110,14,'#4ade80','center');
});
reg('stom_guard',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#052e16'; ctx.beginPath(); ctx.arc(cx,cy,90,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#166534'; ctx.beginPath(); ctx.ellipse(cx-15,cy,15,40,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#166534'; ctx.beginPath(); ctx.ellipse(cx+15,cy,15,40,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#022c22'; ctx.beginPath(); ctx.ellipse(cx,cy,5,30,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#4ade80'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.ellipse(cx-15,cy,15,40,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx+15,cy,15,40,0,0,Math.PI*2); ctx.stroke();
  ctx.strokeStyle='#fff'; ctx.beginPath(); ctx.moveTo(cx-15,cy-10); ctx.lineTo(cx-60,cy-30); ctx.stroke();
  txt(ctx,'Guard Cell',cx-65,cy-35,11,'#fff','right');
  ctx.beginPath(); ctx.moveTo(cx,cy+10); ctx.lineTo(cx-30,cy+60); ctx.stroke();
  txt(ctx,'Stomatal Pore',cx-35,cy+65,11,'#fff','right');
  txt(ctx,'Guard cells open/close to allow gas exchange',cx,H-30,12,'#4ade80','center');
});

// -- FOOD TEST --
reg('ft_setup',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(cx-60,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fillRect(cx-57,cy,24,28);
  ctx.beginPath(); ctx.roundRect(cx+30,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fillRect(cx+33,cy,24,28);
  txt(ctx,'Tube 1',cx-45,cy+50,11,'#ccc','center'); txt(ctx,'Potato',cx-45,cy+65,11,'#fff','center');
  txt(ctx,'Tube 2',cx+45,cy+50,11,'#ccc','center'); txt(ctx,'Milk',cx+45,cy+65,11,'#fff','center');
});
reg('ft_milk',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(cx-60,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fillRect(cx-57,cy,24,28);
  ctx.beginPath(); ctx.roundRect(cx+30,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fillRect(cx+33,cy,24,28);
  txt(ctx,'Potato (Starch test)',cx-45,cy+50,11,'#fde047','center');
  txt(ctx,'Milk (Protein test)',cx+45,cy+50,11,'#60a5fa','center');
});
reg('ft_iodine',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(cx-60,cy-60,30,90,5); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.fillRect(cx-57,cy,24,28);
  const dp=(t%2)/2;
  ctx.fillStyle='#9a3412'; ctx.beginPath(); ctx.arc(cx-45,cy-60+dp*60,4,0,Math.PI*2); ctx.fill();
  txt(ctx,'Adding Iodine',cx-45,cy-80,11,'#9a3412','center');
  ctx.beginPath(); ctx.roundRect(cx+30,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fillRect(cx+33,cy,24,28);
});
reg('ft_starch',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(cx-60,cy-60,30,90,5); ctx.stroke();
  ctx.fillStyle='#1e1b4b'; ctx.fillRect(cx-57,cy,24,28); 
  txt(ctx,'Blue-Black!',cx-45,cy-80,12,'#60a5fa','center');
  txt(ctx,'STARCH CONFIRMED',cx-45,cy+50,11,'#60a5fa','center');
  ctx.beginPath(); ctx.roundRect(cx+30,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fillRect(cx+33,cy,24,28);
});
reg('ft_biuret',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(cx-60,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='#1e1b4b'; ctx.fillRect(cx-57,cy,24,28);
  ctx.beginPath(); ctx.roundRect(cx+30,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fillRect(cx+33,cy,24,28);
  const dp=(t%2)/2;
  ctx.fillStyle='#c084fc'; ctx.beginPath(); ctx.arc(cx+45,cy-60+dp*60,4,0,Math.PI*2); ctx.fill();
  txt(ctx,'Adding Biuret (CuSO4 + NaOH)',cx+45,cy-80,11,'#c084fc','center');
});
reg('ft_protein',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(cx-60,cy-60,30,90,5); ctx.stroke(); ctx.fillStyle='#1e1b4b'; ctx.fillRect(cx-57,cy,24,28);
  ctx.beginPath(); ctx.roundRect(cx+30,cy-60,30,90,5); ctx.stroke();
  ctx.fillStyle='#9333ea'; ctx.fillRect(cx+33,cy,24,28); 
  txt(ctx,'Purple!',cx+45,cy-80,12,'#d8b4fe','center');
  txt(ctx,'PROTEIN CONFIRMED',cx+45,cy+50,11,'#d8b4fe','center');
});


// ── helpers ──
function buildProgressDots(count){
  shudProgress.innerHTML='';
  for(let i=0;i<count;i++){
    const d=document.createElement('div');
    d.className='shud-dot'; d.id='sdot'+i;
    shudProgress.appendChild(d);
  }
}
function updateProgressDots(step,total){
  for(let i=0;i<total;i++){
    const d=document.getElementById('sdot'+i);
    if(d) d.className='shud-dot'+(i<step?' done':i===step?' active':'');
  }
}

// ── draw standby (off) screen ──
function drawScreenOff(ctx,W,H){
  ctx.fillStyle='#050a1e'; ctx.fillRect(0,0,W,H);
  ctx.textAlign='center'; 
  
  if (state.exp) {
    ctx.font='bold 40px monospace'; ctx.fillStyle='#fbbf24';
    ctx.fillText('Selected: ' + state.exp.title, W/2, H/2 - 20);
    ctx.font='20px monospace'; ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.fillText('Walk to the table and press E to begin', W/2, H/2 + 30);
  } else {
    ctx.font='bold 50px monospace'; ctx.fillStyle='#7dd3fc';
    ctx.fillText('WELCOME!', W/2, H/2 - 20);
    ctx.font='20px monospace'; ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.fillText('Select an experiment from the side panel', W/2, H/2 + 30);
  }
  ctx.textAlign='left';
}

// ── draw active experiment frame ──
function drawScreenFrame(ctx,W,H,demo,step,t,zoneColor){
  const stepData=demo.steps[step];
  if(!stepData){ drawScreenOff(ctx,W,H); return; }
  ctx.fillStyle='#050a1e'; ctx.fillRect(0,0,W,H);
  drawBase(ctx,W,H,demo.title,step,demo.steps.length,zoneColor);
  const fn=drawFns[stepData.draw];
  if(fn){
    ctx.save();
    ctx.beginPath(); ctx.rect(0,48,W,H-48); ctx.clip();
    fn(ctx,W,H,t);
    ctx.restore();
  } else {
    txt(ctx,'Diagram: '+stepData.draw,W/2,H/2,13,'rgba(255,255,255,0.25)','center');
  }
  // Footer gradient + description
  const fH=54;
  const fg=ctx.createLinearGradient(0,H-fH,0,H);
  fg.addColorStop(0,'rgba(5,10,30,0)'); fg.addColorStop(0.3,'rgba(5,10,30,0.94)'); fg.addColorStop(1,'rgba(5,10,30,1)');
  ctx.fillStyle=fg; ctx.fillRect(0,H-fH,W,fH);
  ctx.fillStyle='rgba(255,255,255,0.8)';
  ctx.font='13px monospace'; ctx.textAlign='center';
  const words=stepData.desc.split(' ');
  let line='',lines=[];
  words.forEach(w=>{ const test=line+(line?' ':'')+w; if(ctx.measureText(test).width>W-44){lines.push(line);line=w;}else line=test; });
  lines.push(line);
  lines.slice(0,2).forEach((l,i)=>ctx.fillText(l,W/2,H-fH+18+i*17));
  ctx.textAlign='left';
}

// ── main screen update (called every frame) ──
function updateScreen(dt,t){
  const performing = state.exp && state.mode==='performing';
  const walking    = state.exp && state.mode==='walking';
  const active     = performing || walking;

  // ── TURN SCREEN ON/OFF ──
  if(active !== screenState.isOn || (!active && screenState.cachedExp !== state.exp)){
    screenState.isOn = active;
    screenState.cachedExp = state.exp;
    if(!active){
      // Wipe to black immediately
      drawScreenOff(window._screen.ctx,1024,600);
      window._screen.tex.needsUpdate=true;
      // Kill HUD
      screenHud.classList.remove('show');
      // Kill glow
      if(window._screen.light) window._screen.light.intensity=0.2;
    } else {
      // Wake up
      screenHud.classList.add('show');
      if(window._screen.light) window._screen.light.intensity=0.55;
    }
  }

  if(!active) return; // nothing more to do when off

  // ── SYNC experiment + step ──
  const expId   = state.exp.id;
  const curStep = state.mode==='performing'
    ? Math.min(state.step, SCREEN_DEMOS[expId]?.steps.length-1 ?? 0)
    : 0; // while walking, show step 0

  const demo = SCREEN_DEMOS[expId];
  if(!demo) return;

  // Switch experiment?
  if(expId !== screenState.expId){
    screenState.expId = expId;
    screenState.step  = -1; // force redraw
    shudTitle.textContent  = demo.title;
    shudTopic.textContent  = demo.zone.toUpperCase();
    shudZoneDot.style.background = demo.color;
    screenHud.style.borderColor  = demo.color+'55';
    buildProgressDots(demo.steps.length);
  }

  // Step changed? Update everything
  if(curStep !== screenState.step){
    screenState.step = curStep;
    const stepData = demo.steps[curStep];
    if(stepData){
      shudStepLabel.textContent = 'STEP '+(curStep+1)+' / '+demo.steps.length+' — '+stepData.label;
      shudStepText.textContent  = stepData.desc;
    }
    updateProgressDots(curStep, demo.steps.length);
    // Reset cycle bar
    screenState._barT = 0;
  }

  // Animate cycle bar (just visual pulse, no timing logic)
  screenState._barT = (screenState._barT||0) + dt;
  const pulse = (Math.sin(screenState._barT*1.5)+1)/2;
  shudCycleBar.style.width = (20 + pulse*80)+'%';

  // ── DRAW 3D SCREEN TEXTURE every frame (animated) ──
  drawScreenFrame(window._screen.ctx,1024,600,demo,curStep,t,demo.color);
  window._screen.tex.needsUpdate=true;

  // ── DRAW HUD canvas ──
  drawScreenFrame(shudCtx,520,320,demo,curStep,t,demo.color);

  // Glow color matches zone
  const zoneGlow={chemistry:0xff7722,physics:0x4466ff,biology:0x44aa55};
  if(window._screen.light) window._screen.light.color.setHex(zoneGlow[demo.zone]||0x8899ff);
}

// ── screenLoop: own RAF so it's independent of main animate ──
const _screenClock = new THREE.Clock();

// Draw standby immediately on load
(function initScreen(){
  if(window._screen){
    drawScreenOff(window._screen.ctx,1024,600);
    window._screen.tex.needsUpdate=true;
    if(window._screen.light) window._screen.light.intensity=0;
  }
})();

function screenLoop(){
  requestAnimationFrame(screenLoop);
  const dt2=_screenClock.getDelta(), t2=_screenClock.getElapsedTime();
  updateScreen(dt2,t2);
}
screenLoop();


}
