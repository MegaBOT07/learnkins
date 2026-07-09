import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useGameProgress } from '../../../hooks/useGameProgress';

// ════════════════════════════════════════════
// EXPERIMENT DATA
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
  ]
};

const CSS = "\n*{margin:0;padding:0;box-sizing:border-box;}\nbody{overflow:hidden;background:#0a0a1a;font-family:'Segoe UI',sans-serif;}\ncanvas{display:block;}\n#ui-layer{position:fixed;inset:0;pointer-events:none;z-index:10;}\n\n/* TOP BAR */\n#topbar{position:fixed;top:0;left:0;right:0;height:52px;\n  background:linear-gradient(135deg,rgba(8,12,30,0.96),rgba(15,22,50,0.96));\n  backdrop-filter:blur(14px);border-bottom:1px solid rgba(100,180,255,0.2);\n  display:flex;align-items:center;padding:0 20px;gap:16px;pointer-events:all;z-index:20;}\n#logo{font-size:17px;font-weight:900;color:#7dd3fc;letter-spacing:2px;}\n#logo em{color:#fbbf24;font-style:normal;}\n#zone-pill{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);\n  border-radius:20px;padding:4px 14px;font-size:11px;color:#e2e8f0;font-weight:600;margin-left:auto;}\n#exp-status{font-size:11px;color:rgba(255,255,255,0.45);max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n\n/* DPAD */\n#dpad{position:fixed;bottom:18px;left:18px;display:grid;\n  grid-template-columns:44px 44px 44px;grid-template-rows:44px 44px;gap:3px;z-index:20;pointer-events:all;}\n.dk{background:rgba(255,255,255,0.12);border:2px solid rgba(255,255,255,0.22);border-radius:10px;\n  display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;\n  cursor:pointer;user-select:none;transition:all 0.1s;backdrop-filter:blur(6px);}\n.dk:active,.dk.on{background:rgba(100,180,255,0.45);border-color:#7dd3fc;}\n\n/* INTERACT BADGE */\n#interact-hint{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);\n  background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);\n  border:2px solid #fbbf24;border-radius:14px;padding:9px 22px;\n  color:#fbbf24;font-size:13px;font-weight:800;letter-spacing:1px;\n  z-index:20;display:none;pointer-events:none;white-space:nowrap;}\n\n/* NOTIFICATION */\n#notif{position:fixed;top:62px;left:50%;transform:translateX(-50%) translateY(-6px);\n  background:rgba(251,191,36,0.95);color:#1a1000;padding:7px 20px;border-radius:22px;\n  font-size:12px;font-weight:800;z-index:30;display:none;pointer-events:none;\n  letter-spacing:0.5px;box-shadow:0 4px 20px rgba(251,191,36,0.4);}\n\n/* SIDE PANEL */\n#panel{position:fixed;top:0;right:0;bottom:0;width:360px;\n  background:linear-gradient(160deg,rgba(8,12,32,0.98),rgba(12,20,45,0.98));\n  backdrop-filter:blur(18px);border-left:2px solid rgba(100,180,255,0.18);\n  z-index:25;transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);\n  overflow-y:auto;pointer-events:all;}\n#panel.show{transform:translateX(0);}\n#panel-inner{padding:18px;}\n#pcls{position:sticky;top:0;background:rgba(8,12,32,0.9);padding:10px 0 8px;\n  display:flex;justify-content:space-between;align-items:center;z-index:5;margin-bottom:4px;}\n#pcls-btn{background:rgba(255,60,60,0.18);border:1px solid rgba(255,60,60,0.35);\n  color:#f87171;border-radius:8px;padding:5px 14px;cursor:pointer;font-size:12px;font-weight:800;}\n#pcls-btn:hover{background:rgba(255,60,60,0.35);}\n.ptitle{font-size:17px;font-weight:900;color:#7dd3fc;margin-bottom:2px;}\n.psub{font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;}\n\n/* Exp cards */\n.ecard{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);\n  border-radius:12px;padding:13px;margin-bottom:9px;cursor:pointer;transition:all 0.2s;}\n.ecard:hover,.ecard.sel{background:rgba(100,180,255,0.1);border-color:rgba(100,180,255,0.35);transform:translateX(-2px);}\n.ecard-t{font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:5px;}\n.ecard-m{font-size:10px;color:rgba(255,255,255,0.35);}\n.bdg{display:inline-block;padding:2px 8px;border-radius:20px;font-size:9px;font-weight:800;margin-right:4px;}\n.bg{background:rgba(99,102,241,0.3);color:#a5b4fc;}\n.be{background:rgba(34,197,94,0.2);color:#86efac;}\n.bm{background:rgba(251,191,36,0.2);color:#fde68a;}\n\n/* Filters */\n.filter-row{display:flex;gap:6px;margin-bottom:12px;overflow-x:auto;padding-bottom:4px;}\n.filter-row::-webkit-scrollbar{display:none;}\n.flt-btn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);\n  padding:4px 10px;border-radius:14px;font-size:10px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all 0.2s;}\n.flt-btn:hover{background:rgba(100,180,255,0.15);color:#7dd3fc;border-color:rgba(100,180,255,0.3);}\n.flt-btn.act{background:rgba(100,180,255,0.25);color:#fff;border-color:#7dd3fc;box-shadow:0 0 8px rgba(100,180,255,0.3);}\n\n\n/* Apparatus */\n.app-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 0;}\n.aitem{background:rgba(255,255,255,0.04);border:2px solid rgba(255,255,255,0.09);\n  border-radius:10px;padding:9px 5px;text-align:center;cursor:pointer;transition:all 0.18s;}\n.aitem:hover{background:rgba(100,180,255,0.09);border-color:rgba(100,180,255,0.28);}\n.aitem.got{background:rgba(34,197,94,0.09);border-color:rgba(34,197,94,0.38);}\n.aitem-ic{font-size:20px;margin-bottom:3px;}\n.aitem-nm{font-size:8px;color:rgba(255,255,255,0.5);line-height:1.3;}\n.aitem.got .aitem-nm{color:#86efac;}\n\n/* Steps */\n.step-row{display:flex;gap:11px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05);}\n.snum{width:22px;height:22px;border-radius:50%;font-size:10px;font-weight:800;flex-shrink:0;\n  display:flex;align-items:center;justify-content:center;margin-top:1px;}\n.snum.done{background:rgba(34,197,94,0.28);color:#86efac;}\n.snum.act{background:rgba(251,191,36,0.38);color:#fde68a;box-shadow:0 0 8px rgba(251,191,36,0.4);}\n.snum.pend{background:rgba(99,102,241,0.2);color:#a5b4fc;}\n.stxt{font-size:11px;color:rgba(255,255,255,0.7);line-height:1.65;}\n\n/* Outcome */\n#outcome{background:linear-gradient(135deg,rgba(34,197,94,0.12),rgba(16,185,129,0.08));\n  border:2px solid rgba(34,197,94,0.35);border-radius:13px;padding:14px;\n  margin-top:12px;display:none;}\n#outcome .ot{font-size:13px;font-weight:800;color:#86efac;margin-bottom:7px;}\n#outcome .ob{font-size:11px;color:rgba(255,255,255,0.7);line-height:1.7;}\n\n/* Progress */\n.pbar{height:3px;background:rgba(255,255,255,0.08);border-radius:2px;margin:10px 0;}\n.pfill{height:100%;border-radius:2px;background:linear-gradient(90deg,#6366f1,#7dd3fc);transition:width 0.4s;}\n\n/* Buttons */\n.btn1{width:100%;padding:11px;border-radius:11px;border:none;\n  background:linear-gradient(135deg,#6366f1,#7dd3fc);color:#fff;\n  font-size:13px;font-weight:800;cursor:pointer;letter-spacing:1px;margin-top:8px;}\n.btn1:hover{filter:brightness(1.15);}\n.btn1:disabled{opacity:0.35;cursor:not-allowed;filter:none;}\n.btn2{width:100%;padding:9px;border-radius:11px;\n  border:2px solid rgba(255,255,255,0.18);background:transparent;\n  color:rgba(255,255,255,0.65);font-size:12px;font-weight:700;cursor:pointer;margin-top:6px;}\n.btn2:hover{border-color:rgba(100,180,255,0.4);color:#7dd3fc;}\n.nav-row{display:flex;gap:7px;margin-top:8px;}\n\n/* 3D preview label floating */\n#table-preview-label{position:fixed;bottom:130px;right:380px;\n  background:rgba(0,0,0,0.8);border:1px solid rgba(255,255,255,0.15);\n  border-radius:10px;padding:8px 14px;font-size:11px;color:rgba(255,255,255,0.8);\n  display:none;pointer-events:none;z-index:20;line-height:1.6;}\n\n/* Minimap */\n#mm{position:fixed;bottom:18px;right:18px;width:108px;height:108px;z-index:20;\n  border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.18);}\n#mm canvas{width:100%;height:100%;}\n\n/* SCREEN OVERLAY HUD (appears only while performing an experiment) */\n#screen-hud{position:fixed;top:60px;left:50%;transform:translateX(-50%);\n  width:520px;max-width:94vw;\n  background:linear-gradient(135deg,rgba(6,10,28,0.97),rgba(10,16,40,0.97));\n  border:2px solid rgba(100,180,255,0.25);border-radius:18px;\n  box-shadow:0 8px 40px rgba(0,0,0,0.7);z-index:22;display:none;pointer-events:none;\n  overflow:hidden;}\n#screen-hud.show{display:block;}\n#shud-header{background:linear-gradient(90deg,rgba(99,102,241,0.35),rgba(125,211,252,0.18));\n  padding:12px 20px;display:flex;align-items:center;gap:12px;\n  border-bottom:1px solid rgba(255,255,255,0.08);}\n#shud-zone-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}\n#shud-title{font-size:14px;font-weight:800;color:#e2e8f0;letter-spacing:0.5px;}\n#shud-topic{font-size:10px;color:rgba(255,255,255,0.4);margin-left:auto;letter-spacing:1px;text-transform:uppercase;}\n#shud-body{display:flex;gap:0;}\n#shud-canvas-wrap{width:260px;height:160px;flex-shrink:0;position:relative;background:#000;}\n#shud-canvas{width:260px;height:160px;display:block;}\n#shud-info{flex:1;padding:14px 16px;display:flex;flex-direction:column;gap:6px;min-width:0;}\n#shud-step-label{font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:2px;text-transform:uppercase;}\n#shud-step-text{font-size:12px;color:#e2e8f0;line-height:1.65;font-weight:500;}\n#shud-progress{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap;}\n.shud-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.18);transition:background 0.4s;}\n.shud-dot.active{background:#fbbf24;}\n.shud-dot.done{background:#4ade80;}\n#shud-footer{padding:8px 16px;border-top:1px solid rgba(255,255,255,0.05);\n  display:flex;align-items:center;justify-content:space-between;}\n#shud-cycle-bar-wrap{flex:1;height:3px;background:rgba(255,255,255,0.08);border-radius:2px;margin:0 12px;}\n#shud-cycle-bar{height:100%;background:linear-gradient(90deg,#6366f1,#7dd3fc);border-radius:2px;width:0%;transition:none;}\n#shud-auto-label{font-size:9px;color:rgba(255,255,255,0.3);letter-spacing:1px;white-space:nowrap;}\n#shud-hint{font-size:9px;color:rgba(255,255,255,0.3);white-space:nowrap;}\n\n";

export default function VirtualLab() {
  const { startGame: trackStart, completeGame: trackComplete } = useGameProgress('virtual-lab', 'Virtual Science Lab');
  const labStartedRef = useRef(false);
  const labCompletedExps = useRef(new Set());
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const charRef = useRef({});
  const stateRef = useRef({ mode:"free", zone:null, exp:null, step:0, collected:[], walkTarget:null, walkCallback:null, performing:false, expPhase:0, phaseT:0, gradeFilter:"All" });
  const keysRef = useRef({});
  const mbRef = useRef({w:false,a:false,s:false,d:false});
  const interactablesRef = useRef([]);
  const tableObjsRef = useRef({});
  const cabinetObjsRef = useRef({});
  const ceilLightsRef = useRef([]);
  const particlesRef = useRef([]);
  const filingRef = useRef(null);
  const screenRef = useRef({});
  const drawFnsRef = useRef({});
  const animFrameRef = useRef(null);
  const nearObjRef = useRef(null);
  const walkCycleRef = useRef(0);
  const charAngleRef = useRef(0);
  const isMovingRef = useRef(false);
  const camModeRef = useRef("follow");
  const camTgtRef = useRef(new THREE.Vector3());
  const clockRef = useRef(new THREE.Clock());

  const [currentZone, setCurrentZone] = useState("entrance");
  const [notification, setNotification] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTitle, setPanelTitle] = useState("Lab");
  const [panelSub, setPanelSub] = useState("SELECT EXPERIMENT");
  const [expList, setExpList] = useState([]);
  const [showApparatus, setShowApparatus] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [apparatusItems, setApparatusItems] = useState([]);
  const [collectedSet, setCollectedSet] = useState(new Set());
  const [stepsData, setStepsData] = useState([]);
  const [stepFill, setStepFill] = useState(0);
  const [appFill, setAppFill] = useState(0);
  const [appCount, setAppCount] = useState("0/0");
  const [outcomeText, setOutcomeText] = useState("");
  const [expStatus, setExpStatus] = useState("Walk to a lab table and press E");
  const [interactHint, setInteractHint] = useState("");
  const [screenHudVisible, setScreenHudVisible] = useState(false);
  const [shudStepLabel, setShudStepLabel] = useState("CURRENT STEP");
  const [shudStepText, setShudStepText] = useState("Walk near the projector screen to see the live demo");
  const [shudProgress, setShudProgress] = useState([]);
  const [shudCycBar, setShudCycBar] = useState(0);

  const collectedRef = useRef([]);
  const expRef = useRef(null);
  const zoneRef = useRef(null);
  const stepRef = useRef(0);
  const performingRef = useRef(false);
  const phaseTRef = useRef(0);
  const gradeFilterRef = useRef("All");
  const panelOpenRef = useRef(false);
  const notifTimerRef = useRef(null);

  const notify = useRef((msg) => {});
  useEffect(() => {
    notify.current = (msg) => {
      setNotification(msg);
      clearTimeout(notifTimerRef.current);
      notifTimerRef.current = setTimeout(() => setNotification(""), 2200);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = stateRef.current;
    const char = charRef.current;
    const keys = keysRef.current;
    const mb = mbRef.current;
    const interactables = interactablesRef.current;
    const tableObjects = tableObjsRef.current;
    const cabinetObjects = cabinetObjsRef.current;
    const ceilLights = ceilLightsRef.current;
    const particles = particlesRef.current;
    const drawFns = drawFnsRef.current;

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

    const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf2ede4);
    scene.fog = new THREE.FogExp2(0xf2ede4, 0.028);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(62, window.innerWidth/window.innerHeight, 0.05, 60);
    camera.position.set(0,3,8);
    cameraRef.current = camera;

    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Lighting
    scene.add(new THREE.AmbientLight(0xfff5e8, 0.65));
    const sun = new THREE.DirectionalLight(0xfff8f0, 0.45);
    sun.position.set(5,10,3); sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024); scene.add(sun);

    [[-7,4.85,0],[-7,4.85,-8],[0,4.85,0],[0,4.85,-8],[7,4.85,0],[7,4.85,-8]].forEach(([x,y,z])=>{
      const pl = new THREE.PointLight(0xfff5e0, 0.7, 16);
      pl.position.set(x,y,z); pl.castShadow=true; pl.shadow.mapSize.set(256,256); scene.add(pl); ceilLights.push(pl);
      const fix = new THREE.Mesh(new THREE.BoxGeometry(0.7,0.06,0.7),new THREE.MeshStandardMaterial({color:0xffffdd,emissive:0xffffbb,emissiveIntensity:0.55}));
      fix.position.set(x,4.9,z); scene.add(fix);
    });

    // Room
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(34,28), M.floor);
    floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);
    const grid = new THREE.GridHelper(34,34,0xbbaaa0,0xbbaaa0);
    grid.material.opacity=0.12; grid.material.transparent=true; grid.position.y=0.001; scene.add(grid);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(34,28), M.ceil);
    ceil.rotation.x=Math.PI/2; ceil.position.y=5; scene.add(ceil);

    [{s:[34,5],p:[0,2.5,-14],ry:0},{s:[34,5],p:[0,2.5,14],ry:Math.PI},
     {s:[28,5],p:[-17,2.5,0],ry:Math.PI/2},{s:[28,5],p:[17,2.5,0],ry:-Math.PI/2}
    ].forEach(w=>{
      const m=new THREE.Mesh(new THREE.PlaneGeometry(...w.s),M.wall.clone());
      m.position.set(...w.p); m.rotation.y=w.ry; m.receiveShadow=true; scene.add(m);
    });

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
      const tray=new THREE.Mesh(new THREE.BoxGeometry(10.6,0.1,0.22),M.wood);
      tray.position.set(0,1.67,-13.8); scene.add(tray);
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

    // Build zone tables and cabinets
    function buildTableItems(zk, tx, tz){
      const objs = {};
      if(zk==="chemistry"){
        const rack=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.09,0.2),M.wood);
        rack.position.set(tx-1.4,1.075,tz-0.5); scene.add(rack);
        const tubes=[];
        [0,0.24,0.48].forEach(dx=>{
          const post=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.22,8),M.wood);
          post.position.set(tx-1.55+dx,1.19,tz-0.5); scene.add(post);
        });
        [0,0.24,0.48].forEach((dx,i)=>{
          const tubeMat=new THREE.MeshStandardMaterial({color:[0xee2222,0xddcc00,0x22cc88][i],roughness:0.2,metalness:0.1,depthWrite:true});
          const tubeBody=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.036,0.26,12),tubeMat);
          tubeBody.position.set(tx-1.55+dx,1.22,tz-0.5); scene.add(tubeBody); tubes.push(tubeBody);
          const liqFillMat=new THREE.MeshStandardMaterial({color:[0xff5555,0xffee33,0x44ffaa][i],roughness:0.15,metalness:0.0,depthWrite:true});
          const liqFill=new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.025,0.1,10),liqFillMat);
          liqFill.position.set(tx-1.55+dx,1.14,tz-0.5); scene.add(liqFill);
        });
        objs.tubes=tubes;

        const bkBase=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.16,0.04,18),new THREE.MeshStandardMaterial({color:0x88bbdd,roughness:0.1,metalness:0.25,depthWrite:true}));
        bkBase.position.set(tx+0.6,1.065,tz); scene.add(bkBase);
        const bkWallMat=new THREE.MeshStandardMaterial({color:0x99ccee,roughness:0.1,metalness:0.2,side:THREE.DoubleSide,depthWrite:true});
        const bkWall=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.16,0.28,18,1,true),bkWallMat);
        bkWall.position.set(tx+0.6,1.19,tz); scene.add(bkWall);
        const liqM=new THREE.MeshStandardMaterial({color:0xeedd77,roughness:0.3,depthWrite:true});
        const liq=new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.13,0.1,16),liqM);
        liq.position.set(tx+0.6,1.1,tz); scene.add(liq);
        objs.beaker=bkWall; objs.liquid=liq; objs.liqMat=liqM;

        const litM=new THREE.MeshStandardMaterial({color:0x3355ee,roughness:0.8,depthWrite:true});
        const litmus=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.24,0.012),litM);
        litmus.position.set(tx-1.55,1.22,tz-0.5); litmus.visible=false; scene.add(litmus);
        objs.litmus=litmus; objs.litmusMat=litM;

        const bb=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.14,0.24,12),M.metal);
        bb.position.set(tx+1.5,1.13,tz-0.4); scene.add(bb);
        const bbpipe=new THREE.Mesh(new THREE.CylinderGeometry(0.032,0.032,0.34,8),M.metal);
        bbpipe.position.set(tx+1.5,1.35,tz-0.4); scene.add(bbpipe);
        const bbring=new THREE.Mesh(new THREE.TorusGeometry(0.05,0.014,8,14),new THREE.MeshStandardMaterial({color:0x555566,roughness:0.4,metalness:0.7}));
        bbring.position.set(tx+1.5,1.26,tz-0.4); bbring.rotation.x=Math.PI/2; scene.add(bbring);
        const flameMat=new THREE.MeshStandardMaterial({color:0xff7700,emissive:0xff5500,emissiveIntensity:1.2,roughness:0.8,depthWrite:true});
        const flame=new THREE.Mesh(new THREE.ConeGeometry(0.06,0.2,10),flameMat);
        flame.position.set(tx+1.5,1.58,tz-0.4); flame.visible=false; scene.add(flame);
        objs.flame=flame;

        const bottleMat=new THREE.MeshStandardMaterial({color:0x884400,roughness:0.4,depthWrite:true});
        const bottle=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.07,0.22,10),bottleMat);
        bottle.position.set(tx+1.2,1.14,tz+0.5); scene.add(bottle);
        const bottleTop=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.04,0.1,8),bottleMat);
        bottleTop.position.set(tx+1.2,1.3,tz+0.5); scene.add(bottleTop);
      }
      if(zk==="physics"){
        const mstand=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.55,0.1),M.metal);
        mstand.position.set(tx-1.2,1.34,tz); scene.add(mstand);
        const mfaceMat=new THREE.MeshStandardMaterial({color:0xddeeff,roughness:0.02,metalness:0.95,depthWrite:true});
        const mface=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.48,0.3),mfaceMat);
        mface.position.set(tx-1.16,1.34,tz); scene.add(mface);
        const mback=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.5,0.32),new THREE.MeshStandardMaterial({color:0x222233,roughness:0.8,depthWrite:true}));
        mback.position.set(tx-1.2,1.34,tz); scene.add(mback);
        const mfoot=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.04,0.28),M.metal);
        mfoot.position.set(tx-1.18,1.065,tz); scene.add(mfoot);
        const prismMat=new THREE.MeshStandardMaterial({color:0x55aacc,roughness:0.05,metalness:0.3,depthWrite:true});
        const prism=new THREE.Mesh(new THREE.CylinderGeometry(0,0.2,0.44,3),prismMat);
        prism.position.set(tx+0.7,1.29,tz); scene.add(prism);
        objs.prism=prism;
        const rayMat=new THREE.MeshStandardMaterial({color:0xffee00,emissive:0xffdd00,emissiveIntensity:2.0,roughness:0.0,depthWrite:true});
        const rayG=new THREE.BoxGeometry(0.018,0.018,1.4);
        const ray=new THREE.Mesh(rayG,rayMat);
        ray.position.set(tx-0.5,1.3,tz); ray.visible=false; scene.add(ray);
        objs.ray=ray; objs.rayMat=rayMat;
        const ray2Mat=new THREE.MeshStandardMaterial({color:0xffbb00,emissive:0xff9900,emissiveIntensity:2.0,roughness:0.0,depthWrite:true});
        const ray2=new THREE.Mesh(rayG.clone(),ray2Mat);
        ray2.position.set(tx-0.5,1.3,tz); ray2.visible=false; scene.add(ray2);
        objs.ray2=ray2; objs.ray2Mat=ray2Mat;
        const block=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.14,0.2),M.wood);
        block.position.set(tx+0.5,1.09,tz+0.5); scene.add(block);
        objs.block=block;
        const sb=new THREE.Mesh(new THREE.BoxGeometry(0.12,0.38,0.09),M.metal);
        sb.position.set(tx+1.6,1.27,tz-0.4); scene.add(sb);
        const sbDial=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.02,12),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.9,depthWrite:true}));
        sbDial.position.set(tx+1.6,1.35,tz-0.36); sbDial.rotation.x=Math.PI/2; scene.add(sbDial);
        const sbhook=new THREE.Mesh(new THREE.TorusGeometry(0.055,0.012,8,12,Math.PI),M.metal);
        sbhook.position.set(tx+1.6,1.47,tz-0.4); sbhook.rotation.z=Math.PI; scene.add(sbhook);
        const magRedMat=new THREE.MeshStandardMaterial({color:0xcc2222,roughness:0.4,metalness:0.25,depthWrite:true});
        const magGreyMat=new THREE.MeshStandardMaterial({color:0x888899,roughness:0.4,metalness:0.3,depthWrite:true});
        const mag=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.052,8,18,Math.PI),magRedMat);
        mag.position.set(tx-1.7,1.21,tz+0.4); scene.add(mag);
        [-1,1].forEach(s=>{
          const tip=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.06),s<0?magRedMat:magGreyMat);
          tip.position.set(tx-1.7+s*0.17,1.13,tz+0.4); scene.add(tip);
        });
        objs.mag=mag;
        const protMat=new THREE.MeshStandardMaterial({color:0xddcc88,roughness:0.7,depthWrite:true});
        const prot=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.015,24,1,false,0,Math.PI),protMat);
        prot.position.set(tx-0.3,1.08,tz-0.7); prot.rotation.x=-Math.PI/2; scene.add(prot);
        const ruler=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.015,0.06),new THREE.MeshStandardMaterial({color:0xddcc77,roughness:0.6,depthWrite:true}));
        ruler.position.set(tx+0.1,1.08,tz-0.55); scene.add(ruler);
      }
      if(zk==="biology"){
        const mscBase=new THREE.Mesh(new THREE.BoxGeometry(0.36,0.07,0.32),M.metal);
        mscBase.position.set(tx-0.9,1.085,tz); scene.add(mscBase);
        const mscArm=new THREE.Mesh(new THREE.BoxGeometry(0.065,0.58,0.065),M.metal);
        mscArm.position.set(tx-0.9,1.4,tz-0.06); scene.add(mscArm);
        const mscLens=new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.08,0.2,12),M.metal);
        mscLens.position.set(tx-0.9,1.73,tz-0.06); scene.add(mscLens);
        const mscEye=new THREE.Mesh(new THREE.CylinderGeometry(0.028,0.038,0.12,10),M.metal);
        mscEye.position.set(tx-0.9,1.85,tz-0.06); scene.add(mscEye);
        const slG=new THREE.BoxGeometry(0.28,0.008,0.1);
        const slM=new THREE.MeshStandardMaterial({color:0xddeecc,transparent:true,opacity:0.85,roughness:0.1});
        const slide=new THREE.Mesh(slG,slM);
        slide.position.set(tx-0.9,1.085,tz+0.02); scene.add(slide);
        objs.slide=slide;
        [0.22,-0.22].forEach(dz=>{
          const pd=new THREE.Mesh(new THREE.CylinderGeometry(0.19,0.19,0.035,20),new THREE.MeshStandardMaterial({color:0xccffdd,transparent:true,opacity:0.6}));
          pd.position.set(tx+1.1,1.052,tz+dz); scene.add(pd);
        });
        const leafMat=new THREE.MeshStandardMaterial({color:0x228822,roughness:0.85});
        const leaf=new THREE.Mesh(new THREE.SphereGeometry(0.16,12,8),leafMat);
        leaf.scale.set(2.2,0.3,1.2);
        leaf.position.set(tx+1.8,1.07,tz); scene.add(leaf);
        objs.leaf=leaf; objs.leafMat=leafMat;
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
      [-0.58,0.58].forEach(dx=>{
        const door=new THREE.Mesh(new THREE.BoxGeometry(1.08,2.9,0.055),new THREE.MeshStandardMaterial({color:0xe8dcc4,roughness:0.65}));
        door.position.set(cx+dx,1.55,cz+0.4); scene.add(door);
        const win=new THREE.Mesh(new THREE.BoxGeometry(0.76,1.5,0.02),M.glass);
        win.position.set(cx+dx,1.62,cz+0.43); scene.add(win);
        const handle=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.26,0.07),M.metal);
        handle.position.set(cx+dx+(dx<0?0.24:-0.24),1.55,cz+0.45); scene.add(handle);
      });
      [-0.9,0.9].forEach(dx=>{
        const ft=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.09,0.55),M.metal);
        ft.position.set(cx+dx,0.045,cz); scene.add(ft);
      });
      const chit=new THREE.Mesh(new THREE.BoxGeometry(2.6,3.4,1.2),new THREE.MeshBasicMaterial({visible:false}));
      chit.position.set(cx,1.6,cz+0.1); chit.userData={type:"cabinet",zone:zk}; scene.add(chit); interactables.push(chit);
      cabinetObjects[zk]=chit;
    }

    function buildZone(zk){
      const c = ZONE_CFG[zk];
      const tmat = new THREE.MeshStandardMaterial({color:c.col,roughness:0.45,metalness:0.06});
      const tabletop = new THREE.Mesh(new THREE.BoxGeometry(5.5,0.11,3.2),tmat);
      tabletop.position.set(c.tx,1.02,c.tz); tabletop.castShadow=true; tabletop.receiveShadow=true; scene.add(tabletop);
      const apronF = new THREE.Mesh(new THREE.BoxGeometry(5.3,0.14,0.06),new THREE.MeshStandardMaterial({color:c.col,roughness:0.5}));
      apronF.position.set(c.tx,0.95,c.tz+1.6); scene.add(apronF);
      [2.1,-2.1].forEach(dx=>[1.3,-1.3].forEach(dz=>{
        const leg=new THREE.Mesh(new THREE.BoxGeometry(0.1,1.02,0.1),M.wood);
        leg.position.set(c.tx+dx,0.51,c.tz+dz); leg.castShadow=true; scene.add(leg);
      }));
      const shelf=new THREE.Mesh(new THREE.BoxGeometry(5.1,0.05,2.8),M.wood);
      shelf.position.set(c.tx,0.32,c.tz); scene.add(shelf);
      const lmat=new THREE.MeshStandardMaterial({color:c.col,emissive:c.col,emissiveIntensity:0.18,roughness:0.6});
      const lp=new THREE.Mesh(new THREE.BoxGeometry(2,0.04,0.55),lmat);
      lp.position.set(c.tx,1.08,c.tz-1.28); scene.add(lp);
      const stoolT=new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.055,18),new THREE.MeshStandardMaterial({color:0x7a5230,roughness:0.7}));
      stoolT.position.set(c.tx,0.65,c.tz+2.4); scene.add(stoolT);
      const stoolL=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.6,8),M.metal);
      stoolL.position.set(c.tx,0.32,c.tz+2.4); scene.add(stoolL);
      tableObjects[zk] = buildTableItems(zk, c.tx, c.tz);
      const thit=new THREE.Mesh(new THREE.BoxGeometry(5.6,2.5,4),new THREE.MeshBasicMaterial({visible:false}));
      thit.position.set(c.tx,1,c.tz+0.5); thit.userData={type:"table",zone:zk}; scene.add(thit); interactables.push(thit);
      buildCabinet(zk, c.cx, c.cz, c.col, c.hi);
    }

    ["chemistry","physics","biology"].forEach(z=>buildZone(z));

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

    // Build Character
    function buildCharacter(){
      const root = new THREE.Group();
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.4,0.52,0.22),M.coat);
      torso.position.y=0.85; torso.castShadow=true; root.add(torso);
      const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.38,0.28,0.24),M.shirt);
      shirt.position.set(0,0.78,0); root.add(shirt);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.32,0.32,0.28),M.skin);
      head.position.y=1.28; head.castShadow=true; root.add(head);
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.34,0.16,0.3),M.hair);
      hair.position.set(0,1.43,0); root.add(hair);
      const hairB = new THREE.Mesh(new THREE.BoxGeometry(0.34,0.18,0.06),M.hair);
      hairB.position.set(0,1.35,-0.14); root.add(hairB);
      [-0.07,0.07].forEach(ex=>{
        const eye=new THREE.Mesh(new THREE.SphereGeometry(0.038,8,8),new THREE.MeshStandardMaterial({color:0x111122}));
        eye.position.set(ex,1.29,0.138); root.add(eye);
        const shine=new THREE.Mesh(new THREE.SphereGeometry(0.012,6,6),new THREE.MeshStandardMaterial({color:0xffffff}));
        shine.position.set(ex+0.014,1.3,0.148); root.add(shine);
      });
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
      const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.065,0.09,10),M.skin);
      neck.position.y=1.09; root.add(neck);
      [-0.1,0.1].forEach((lx,li)=>{
        const lg=new THREE.Mesh(new THREE.BoxGeometry(0.17,0.52,0.17),M.pants);
        lg.position.set(lx,0.32,0); root.add(lg);
        char["leg"+li]=lg;
        const sh=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.09,0.23),M.shoe);
        sh.position.set(lx,0.045,0.04); root.add(sh);
      });
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
      const propTube=new THREE.Mesh(new THREE.CylinderGeometry(0.04,0.036,0.26,10),new THREE.MeshStandardMaterial({color:0xaaddff,transparent:true,opacity:0.65,roughness:0.04}));
      propTube.position.set(0,-0.14,0); propTube.visible=false;
      rWrist.add(propTube); char.propTube=propTube;
      char.propTubeMat=propTube.material;
      const propLitmus=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.2,0.01),new THREE.MeshStandardMaterial({color:0x4466ff,roughness:0.9}));
      propLitmus.position.set(0,-0.12,0); propLitmus.visible=false;
      lWrist.add(propLitmus); char.propLitmus=propLitmus;
      char.propLitmusMat=propLitmus.material;
      const propTorch=new THREE.Mesh(new THREE.CylinderGeometry(0.038,0.048,0.2,10),new THREE.MeshStandardMaterial({color:0x444433,roughness:0.7}));
      propTorch.position.set(0,-0.14,0); propTorch.visible=false;
      rWrist.add(propTorch); char.propTorch=propTorch;
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

    // Input
    const handleKeyDown = (e) => {
      keys[e.key.toLowerCase()]=true;
      if(e.key.toLowerCase()==="e") tryInteract();
    };
    const handleKeyUp = (e) => { keys[e.key.toLowerCase()]=false; };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    document.querySelectorAll(".dk").forEach(b=>{
      const k=b.id.replace("d","");
      b.addEventListener("pointerdown",()=>{mb[k]=true;b.classList.add("on");});
      ["pointerup","pointerleave"].forEach(ev=>b.addEventListener(ev,()=>{mb[k]=false;b.classList.remove("on");}));
    });

    function isKey(k){return keys[k]||mb[k]||false;}

    const SPEED=0.07, BOUNDS={x:[-15,15],z:[-12,12]};
    let walkCycle=0, charAngle=0, isMoving=false;

    function animateWalk(t){
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

    function lerp(a,b,t){return a+(b-a)*t;}

    function updateFreeMove(){
      if(state.mode!=="free") return;
      let dx=0,dz=0;
      if(isKey("w")||isKey("arrowup"))    dz=-1;
      if(isKey("s")||isKey("arrowdown"))  dz=1;
      if(isKey("a")||isKey("arrowleft"))  dx=-1;
      if(isKey("d")||isKey("arrowright")) dx=1;
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
      state.mode="walking";
      state.walkTarget=target;
      state.walkCallback=cb;
      isMoving=true;
    }

    function updateWalk(dt){
      if(state.mode!=="walking"||!state.walkTarget) return;
      const pos=char.root.position;
      const tx=state.walkTarget.x, tz=state.walkTarget.z;
      const dx=tx-pos.x, dz=tz-pos.z;
      const dist=Math.sqrt(dx*dx+dz*dz);
      if(dist<0.18){
        char.root.position.x=tx; char.root.position.z=tz;
        state.mode="performing";
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

    // Arm poses
    function poseArms(pose, t){
      switch(pose){
        case "idle": idleArms(); break;
        case "pourL":
          char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.9,0.1);
          char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.35,0.1);
          char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,1.1,0.1);
          char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.5,0.1);
          char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.6,0.1);
          break;
        case "dip":
          char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.7,0.1);
          char.lShoulder.rotation.z=lerp(char.lShoulder.rotation.z,0.3,0.1);
          char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.9+Math.sin(t*2)*0.15,0.1);
          char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.35,0.08);
          char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.5,0.08);
          break;
        case "stir":
          char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.6,0.1);
          char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.15+Math.sin(t*3)*0.25,0.12);
          char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.75,0.1);
          char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.4,0.08);
          char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.55,0.08);
          break;
        case "push":
          char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.55+Math.sin(t*1.5)*0.1,0.08);
          char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.55+Math.sin(t*1.5+1)*0.1,0.08);
          char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.65,0.08);
          char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.65,0.08);
          break;
        case "hold":
          char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-1.1,0.1);
          char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.2,0.08);
          char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.7,0.1);
          char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.45,0.08);
          char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.5,0.08);
          break;
        case "write":
          char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.5+Math.sin(t*3)*0.12,0.1);
          char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.2+Math.cos(t*2)*0.1,0.1);
          char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.8,0.1);
          char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.35,0.08);
          char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.45,0.08);
          break;
        case "examine":
          char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.85,0.1);
          char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.85,0.1);
          char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.9+Math.sin(t*1.8)*0.08,0.1);
          char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.9,0.1);
          char.root.rotation.x=lerp(char.root.rotation.x,-0.15,0.06);
          break;
        case "shake":
          char.rShoulder.rotation.x=lerp(char.rShoulder.rotation.x,-0.7,0.1);
          char.rShoulder.rotation.z=lerp(char.rShoulder.rotation.z,-0.2+Math.sin(t*5)*0.3,0.15);
          char.rElbow.rotation.x=lerp(char.rElbow.rotation.x,0.8,0.1);
          char.lShoulder.rotation.x=lerp(char.lShoulder.rotation.x,-0.4,0.08);
          char.lElbow.rotation.x=lerp(char.lElbow.rotation.x,0.5,0.08);
          break;
      }
    }

    // Table FX
    function createFilings(tx,tz){
      if(filingRef.current){scene.remove(filingRef.current);filingRef.current=null;}
      const geo=new THREE.BufferGeometry();
      const count=120;
      const pos=new Float32Array(count*3);
      for(let i=0;i<count;i++){
        pos[i*3]=tx+(-1.5+Math.random()*3);
        pos[i*3+1]=1.085+Math.random()*0.005;
        pos[i*3+2]=tz+(-1.2+Math.random()*2.4);
      }
      geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
      const mat=new THREE.PointsMaterial({color:0x888888,size:0.04,sizeAttenuation:true});
      filingRef.current=new THREE.Points(geo,mat);
      scene.add(filingRef.current);
    }

    function alignFilings(tx,tz,t){
      if(!filingRef.current) return;
      const pos=filingRef.current.geometry.attributes.position.array;
      const count=pos.length/3;
      for(let i=0;i<count;i++){
        const ox=pos[i*3]-tx, oz=pos[i*3+2]-tz;
        const angle=Math.atan2(oz,ox);
        const r=Math.sqrt(ox*ox+oz*oz);
        pos[i*3]=tx+r*Math.cos(angle+0.03);
        pos[i*3+2]=tz+r*Math.sin(angle+0.03);
      }
      filingRef.current.geometry.attributes.position.needsUpdate=true;
    }

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

    function applyTableFX(zone, fxName, t){
      const objs=tableObjects[zone]||{};
      if(!fxName) return;
      if(zone==="chemistry"){
        if(fxName==="beakerFill" && objs.liqMat) objs.liqMat.color.setHex(0xeedd55);
        if(fxName==="litmusRed" && objs.litmusMat) objs.litmusMat.color.setHex(0xee2222);
        if(fxName==="litmusBlue" && objs.litmusMat) objs.litmusMat.color.setHex(0x2233ee);
        if(fxName==="beakerColorChange" && objs.liqMat){ objs.liqMat.color.setHex(0x3333cc);
          if(objs.beaker) spawnParticle(objs.beaker.position.clone().add(new THREE.Vector3(0,0.25,0)),0x4466ff);
        }
        if(fxName==="showRust" && objs.tubes){
          objs.tubes[0].material.color.setHex(0xaa4400);
          spawnParticle(objs.tubes[0].position.clone().add(new THREE.Vector3(0,0.2,0)),0xaa4400);
        }
      }
      if(zone==="physics"){
        if(fxName==="rayOn" && objs.ray){ objs.ray.visible=true; objs.ray.rotation.y=0.52; }
        if(fxName==="rayBounce" && objs.ray2){ objs.ray.visible=true; objs.ray2.visible=true; objs.ray2.rotation.y=-0.52; spawnParticle(objs.ray.position.clone().add(new THREE.Vector3(0,0.05,0)),0xffff00); }
        if(fxName==="magPlace" && objs.mag) objs.mag.position.set(ZONE_CFG.physics.tx,1.14,ZONE_CFG.physics.tz-0.1);
        if(fxName==="filingsSpread") createFilings(ZONE_CFG.physics.tx,ZONE_CFG.physics.tz);
        if(fxName==="filingsAligned" && filingRef.current){ alignFilings(ZONE_CFG.physics.tx,ZONE_CFG.physics.tz,t); filingRef.current.material.color.setHex(0x555500); }
        if(fxName==="fieldLines" && filingRef.current) filingRef.current.material.color.setHex(0xaaaa00);
      }
      if(zone==="biology"){
        if(fxName==="leafBoil" && objs.leafMat){ objs.leafMat.color.setHex(0x88aa22); spawnParticle(objs.leaf.position.clone().add(new THREE.Vector3(0,0.2,0)),0xaaaaff); }
        if(fxName==="leafDecolor" && objs.leafMat) objs.leafMat.color.setHex(0xdddd88);
        if(fxName==="leafWhite" && objs.leafMat) objs.leafMat.color.setHex(0xf0f0cc);
        if(fxName==="iodineAdd") spawnParticle(objs.leaf.position.clone().add(new THREE.Vector3(0,0.25,0)),0x884400);
        if(fxName==="leafBlueBlack" && objs.leafMat){ objs.leafMat.color.setHex(0x221166); spawnParticle(objs.leaf.position.clone().add(new THREE.Vector3(0,0.2,0)),0x2200aa); }
      }
    }

    function resetTableFX(){
      const co=tableObjects.chemistry;
      if(co&&co.liqMat) co.liqMat.color.setHex(0xeedd77);
      if(co&&co.litmusMat) co.litmusMat.color.setHex(0x3355ee);
      if(co&&co.tubes&&co.tubes[0]) co.tubes[0].material.color.setHex(0xee2222);
      const po=tableObjects.physics;
      if(po&&po.ray) po.ray.visible=false;
      if(po&&po.ray2) po.ray2.visible=false;
      const bo=tableObjects.biology;
      if(bo&&bo.leafMat) bo.leafMat.color.setHex(0x228822);
    }

    // Camera
    const camOff=new THREE.Vector3(0,3.1,5.2);
    const camLookOff=new THREE.Vector3(0,1.1,0);
    const camTgt=new THREE.Vector3();
    let camMode="follow";

    function updateCamera(){
      let desiredPos, desiredLook;
      if(camMode==="experiment" && state.zone){
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

    const INTERACT_DIST=3.8;
    let nearObj=null;

    function checkInteract(){
      if(state.mode!=="free"){ setInteractHint(""); return; }
      let best=null, bDist=Infinity;
      interactables.forEach(o=>{
        const d=char.root.position.distanceTo(o.position);
        if(d<INTERACT_DIST&&d<bDist){best=o;bDist=d;}
      });
      nearObjRef.current=nearObj=best;
      if(best){
        const z=best.userData.zone, tp=best.userData.type;
        setInteractHint("E - "+(tp==="table"?"Use "+ZONE_CFG[z].label+" Table":"Open Cabinet"));
      } else { setInteractHint(""); }

      const px=char.root.position.x;
      let zoneName="";
      if(px<-5.5) zoneName="Chemistry Zone";
      else if(px>5.5) zoneName="Biology Zone";
      else zoneName="Physics Zone";
      if (!labStartedRef.current && zoneName) {
        labStartedRef.current = true;
        trackStart();
      }
      setCurrentZone(zoneName);
      if (!labStartedRef.current && zoneName) {
        labStartedRef.current = true;
        trackStart();
      }
    }

    function tryInteract(){
      if(state.mode!=="free"||!nearObjRef.current) return;
      const zone=nearObjRef.current.userData.zone, type=nearObjRef.current.userData.type;
      openPanel(zone, type);
    }

    // Panel
    const panelEl = document.getElementById("panel");

    function openPanel(zone, type){
      state.zone=zone;
      zoneRef.current=zone;
      const info=ZONE_CFG[zone];
      setPanelTitle(info.label);
      setPanelOpen(true);
      panelOpenRef.current=true;
      if(panelEl) panelEl.classList.add("show");
      showExpList(zone);
    }

    function closePanel(){
      setPanelOpen(false);
      panelOpenRef.current=false;
      if(panelEl) panelEl.classList.remove("show");
      if(state.mode==="performing"){
        state.mode="free";
        camMode="follow";
        ["propTube","propLitmus","propTorch","propLeaf"].forEach(p=>{if(char[p])char[p].visible=false;});
        if(filingRef.current){scene.remove(filingRef.current);filingRef.current=null;}
        resetTableFX();
        setExpStatus("Walk to a lab table and press E");
        setScreenHudVisible(false);
      }
    }

    document.getElementById("pcls-btn").onclick = closePanel;

    function showExpList(zone){
      setPanelSub("SELECT EXPERIMENT");
      setShowApparatus(false);
      setShowSteps(false);
      setShowOutcome(false);
      const exps = EXPS[zone];
      const gf = gradeFilterRef.current;
      const filtered = exps.filter(e=>gf==="All"||e.grade.toString()===gf);
      setExpList(filtered.map((exp,i)=>({...exp, idx: i})));
    }

    window.showExpList = showExpList;
    window.closePanel = closePanel;

    function selectExp(exp){
      state.exp=exp; state.step=0; state.collected=[];
      expRef.current=exp; stepRef.current=0;
      collectedRef.current=[];
      setPanelSub("COLLECT APPARATUS");
      setShowApparatus(true);
      setShowSteps(false);
      setShowOutcome(false);
      setApparatusItems(exp.apparatus);
      setCollectedSet(new Set());
      setAppFill(0);
      setAppCount("0/"+exp.apparatus.length);
      notify.current("Collect apparatus from the cabinet!");
      setExpStatus(exp.title+" - collecting apparatus...");
    }
    window.selectExp = selectExp;

    function collectItem(i){
      if(collectedRef.current.includes(i)) return;
      collectedRef.current.push(i);
      setCollectedSet(new Set(collectedRef.current));
      const pct=(collectedRef.current.length/state.exp.apparatus.length)*100;
      setAppFill(pct);
      setAppCount(collectedRef.current.length+"/"+state.exp.apparatus.length);
      notify.current("Got: "+state.exp.apparatus[i].nm+"!");
      if(collectedRef.current.length===state.exp.apparatus.length){
        setTimeout(()=>startExperiment(), 500);
      }
    }
    window.collectItem = collectItem;

    function startExperiment(){
      const exp=state.exp;
      state.step=0; stepRef.current=0;
      setShowApparatus(false); setShowSteps(true); setShowOutcome(false);
      setPanelSub("PERFORMING EXPERIMENT");
      notify.current("Walking to "+ZONE_CFG[state.zone].label+"...");
      setExpStatus(exp.title+" - Step 1 of "+exp.steps.length);
      const cfg=ZONE_CFG[state.zone];
      walkToTarget({x:cfg.tx, z:cfg.tz+1.8}, ()=>{
        char.root.rotation.y=Math.PI;
        camMode="experiment";
        state.performing=true;
        performingRef.current=true;
        state.expPhase=0; state.phaseT=0;
        phaseTRef.current=0;
        renderSteps();
        applyStepFX(0);
        setScreenHudVisible(true);
        notify.current("Starting: "+exp.title);
      });
    }

    function applyStepFX(step){
      const exp=state.exp;
      const animKey=exp.anim;
      const fxArr=EXP_FX[animKey];
      if(fxArr&&fxArr[step]){
        const fx=fxArr[step];
        ["propTube","propLitmus","propTorch","propLeaf"].forEach(p=>{if(char[p])char[p].visible=false;});
        fx.showProps.forEach(p=>{if(char[p])char[p].visible=true;});
        if(fx.tableFx) applyTableFX(state.zone, fx.tableFx, phaseTRef.current);
      }
    }

    function renderSteps(){
      const exp=state.exp;
      const step=state.step;
      setStepsData(exp.steps.map((s,i)=>({text:s, status:i<step?"done":i===step?"act":"pend", num:i<step?"✓":(i+1)})));
      const pct=(step/exp.steps.length)*100;
      setStepFill(pct);
      if(step>=exp.steps.length){
        setShowOutcome(true);
        setOutcomeText(exp.outcome);
        setExpStatus(exp.title+" - COMPLETE!");
        notify.current("Experiment Complete! Great work!");
        if (!labCompletedExps.current.has(exp.id)) {
          labCompletedExps.current.add(exp.id);
          const diff = exp.diff === "Hard" ? "Hard" : exp.diff === "Easy" ? "Easy" : "Medium";
          trackComplete(100, 100, diff);
        }
        ["propTube","propLitmus","propTorch","propLeaf"].forEach(p=>{if(char[p])char[p].visible=false;});
      } else {
        setExpStatus(exp.title+" - Step "+(step+1)+"/"+exp.steps.length);
      }
    }

    function nextStep(){
      if(state.step<state.exp.steps.length){
        state.step++; stepRef.current=state.step;
        state.phaseT=0; phaseTRef.current=0;
        applyStepFX(state.step);
        renderSteps();
      }
    }

    function prevStep(){
      if(state.step>0){state.step--; stepRef.current=state.step; state.phaseT=0; phaseTRef.current=0; applyStepFX(state.step); renderSteps();}
    }

    document.getElementById("btn-next").onclick=nextStep;
    document.getElementById("btn-prev").onclick=prevStep;
    document.getElementById("btn-reset").onclick=()=>selectExp(state.exp);

    // Minimap
    const mmc=document.getElementById("mmc").getContext("2d");
    function drawMinimap(){
      const W=108,H=108;
      mmc.clearRect(0,0,W,H);
      mmc.fillStyle="rgba(10,14,30,0.96)"; mmc.fillRect(0,0,W,H);
      [{x:0,w:36,c:"rgba(255,102,0,0.28)"},{x:36,w:36,c:"rgba(51,68,204,0.28)"},{x:72,w:36,c:"rgba(34,102,51,0.28)"}].forEach(z=>{
        mmc.fillStyle=z.c; mmc.fillRect(z.x,0,z.w,H);
      });
      mmc.strokeStyle="rgba(255,255,255,0.14)"; mmc.strokeRect(1,1,W-2,H-2);
      [[6,42,30,12,"#ff6600"],[38,42,30,12,"#4455dd"],[70,42,30,12,"#44aa55"]].forEach(([x,y,w,h,c])=>{
        mmc.fillStyle=c+"44"; mmc.fillRect(x,y,w,h);
        mmc.strokeStyle=c+"88"; mmc.strokeRect(x,y,w,h);
      });
      [[5,18,14,8],[37,18,14,8],[69,18,14,8]].forEach(([x,y,w,h])=>{
        mmc.fillStyle="rgba(255,255,255,0.13)"; mmc.fillRect(x,y,w,h);
      });
      const px=((char.root.position.x+17)/34)*(W-4)+2;
      const pz=((char.root.position.z+14)/28)*(H-4)+2;
      mmc.beginPath(); mmc.arc(px,pz,5,0,Math.PI*2);
      mmc.fillStyle="#fbbf24"; mmc.fill();
      mmc.beginPath(); mmc.moveTo(px,pz);
      mmc.lineTo(px+Math.sin(charAngle)*9,pz+Math.cos(charAngle)*9);
      mmc.strokeStyle="#fbbf24"; mmc.lineWidth=2; mmc.stroke();
      [["C",16,103,"#ff6600"],["P",50,103,"#5566ff"],["B",84,103,"#44aa55"]].forEach(([t,x,y,c])=>{
        mmc.fillStyle=c; mmc.font="8px monospace"; mmc.textAlign="center"; mmc.fillText(t,x,y);
      });
    }

    // Experiment arm animation
    function updatePerformingAnimation(t, dt){
      if(!state.performing||!state.exp) return;
      state.phaseT+=dt;
      phaseTRef.current=state.phaseT;
      const animKey=state.exp.anim;
      const poses=EXP_POSES[animKey]||[];
      const pose=poses[Math.min(state.step, poses.length-1)]||"idle";
      poseArms(pose, t);
      char.root.rotation.x=lerp(char.root.rotation.x, -0.08, 0.04);
      if(animKey==="magnet"&&state.step>=2&&filingRef.current) alignFilings(ZONE_CFG.physics.tx, ZONE_CFG.physics.tz, t);
      if(animKey==="litmus"){
        const fl=tableObjects.chemistry.flame;
        if(fl&&state.step>=1&&state.step<=5){
          fl.visible=true;
          fl.scale.setScalar(0.9+Math.sin(t*8)*0.12);
          fl.rotation.y=t*3;
          if(tableObjects.chemistry&&tableObjects.chemistry.flame)
            tableObjects.chemistry.flame.material.emissiveIntensity=0.8+Math.sin(t*6)*0.3;
        } else if(fl){ fl.visible=false; }
      }
      if(animKey==="reflect"&&tableObjects.physics.ray&&tableObjects.physics.ray.visible){
        tableObjects.physics.ray.material.emissiveIntensity=1.5+Math.sin(t*4)*0.6;
        if(tableObjects.physics.ray2&&tableObjects.physics.ray2.visible)
          tableObjects.physics.ray2.material.emissiveIntensity=1.5+Math.sin(t*4+1)*0.6;
      }
      if(animKey==="litmus"&&tableObjects.chemistry.liq) tableObjects.chemistry.liq.position.y=1.11+Math.sin(t*2.5)*0.005;
    }

    // Main loop
    function animate(){
      animFrameRef.current = requestAnimationFrame(animate);
      const dt=clock.getDelta(), t=clock.getElapsedTime();
      updateFreeMove();
      updateWalk(dt);
      checkInteract();
      updateCamera();
      updateParticles(dt);
      updatePerformingAnimation(t, dt);
      drawMinimap();
      if(!isMoving&&state.mode==="free") char.root.position.y=Math.sin(t*1.4)*0.018;
      ceilLights.forEach((l,i)=>{l.intensity=0.68+Math.sin(t*3.2+i)*0.04;});
      renderer.render(scene, camera);
    }
    animate();

    setTimeout(()=>notify.current("Welcome! Walk to a lab table and press E"),800);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect=window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", handleResize);
      if(animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, []);

  const grades = ["All", "6", "7", "8"];

  return (
    <div style={{width:"100%",height:"100vh",position:"relative",overflow:"hidden",background:"#0a0a1a"}}>
      <style>{CSS}</style>
      <canvas ref={canvasRef} style={{display:"block",position:"absolute",inset:0}} />
      {/* TOP BAR */}
      <div id="topbar">
        <div id="logo">Virtual<em>Lab</em></div>
        <div id="exp-status">{expStatus}</div>
        <div id="zone-pill">{currentZone || "Entrance"}</div>
      </div>
      {/* DPAD */}
      <div id="dpad">
        <div></div><div className="dk" id="dw">&#9650;</div><div></div>
        <div className="dk" id="da">&#9664;</div>
        <div className="dk" id="ds">&#9660;</div>
        <div className="dk" id="dd">&#9654;</div>
      </div>
      <div id="interact-hint" style={{display: interactHint ? "block" : "none"}}>{interactHint}</div>
      <div id="notif" style={{display: notification ? "block" : "none"}}>{notification}</div>
      {/* SIDE PANEL */}
      <div id="panel">
        <div id="panel-inner">
          <div id="pcls">
            <span className="ptitle" id="ptitle">{panelTitle}</span>
            <button id="pcls-btn">X Close</button>
          </div>
          <div className="psub" id="psub">{panelSub}</div>
          {/* Experiment list */}
          <div id="p-explist" style={{display: !showApparatus && !showSteps && !showOutcome ? "block" : "none"}}>
            <div className="filter-row">
              {grades.map(g => (
                <button key={g} className={"flt-btn" + (gradeFilterRef.current===g ? " act" : "")} onClick={() => {
                  gradeFilterRef.current = g;
                  if (window.showExpList) window.showExpList(zoneRef.current);
                }}>{g === "All" ? "All Classes" : "Class " + g}</button>
              ))}
            </div>
            {expList.map(exp => (
              <div key={exp.id} className="ecard" onClick={() => window.selectExp && window.selectExp(exp)}>
                <div className="ecard-t">{exp.title}</div>
                <div className="ecard-m">
                  <span className="bdg bg">Gr.{exp.grade}</span>
                  <span className={"bdg " + (exp.diff==="Easy" ? "be" : "bm")}>{exp.diff}</span>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.3)"}}>{exp.dur}</span>
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:3}}>{exp.topic}</div>
              </div>
            ))}
          </div>
          {/* Apparatus */}
          <div id="p-apparatus" style={{display: showApparatus ? "block" : "none"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginBottom:6}}>Click each item to collect from cabinet</div>
            <div className="app-grid">
              {apparatusItems.map((a, i) => (
                <div key={i} className={"aitem" + (collectedSet.has(i) ? " got" : "")} onClick={() => window.collectItem && window.collectItem(i)}>
                  <div className="aitem-ic">{a.ic}</div>
                  <div className="aitem-nm">{a.nm}</div>
                </div>
              ))}
            </div>
            <div className="pbar"><div className="pfill" style={{width: appFill + "%"}}></div></div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",textAlign:"right"}}>{appCount}</div>
          </div>
          {/* Steps */}
          <div id="p-steps" style={{display: showSteps ? "block" : "none"}}>
            <div id="steps-list">
              {stepsData.map((s, i) => (
                <div key={i} className="step-row">
                  <div className={"snum " + s.status}>{s.num}</div>
                  <div className="stxt" style={{opacity: s.status !== "pend" ? 1 : 0.38}}>{s.text}</div>
                </div>
              ))}
            </div>
            <div className="pbar"><div className="pfill" style={{width: stepFill + "%"}}></div></div>
            <div className="nav-row">
              <button className="btn2" id="btn-prev" style={{flex:1}}>Prev</button>
              <button className="btn1" id="btn-next" style={{flex:2}} disabled={showOutcome}>Next Step</button>
            </div>
            <button className="btn2" id="btn-reset">Restart Experiment</button>
          </div>
          {/* Outcome */}
          <div id="outcome" style={{display: showOutcome ? "block" : "none"}}>
            <div className="ot">Experiment Complete!</div>
            <div className="ob" id="outcome-txt">{outcomeText}</div>
          </div>
        </div>
      </div>
      {/* Minimap */}
      <div id="mm"><canvas id="mmc" width="108" height="108"></canvas></div>
    </div>
  );
}
