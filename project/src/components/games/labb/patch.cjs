const fs = require('fs');

const labPath = 'virtual-lab/src/lab.js';
let content = fs.readFileSync(labPath, 'utf8');

// 1. ADD PHYSICS EXPS
const physAdd = `,
    {id:'p4',title:'Electric Circuits',topic:'Electricity',grade:6,diff:'Medium',dur:'30 min',
     apparatus:[{ic:'🔋',nm:'Battery'},{ic:'💡',nm:'LED Bulb'},{ic:'🔌',nm:'Wires'},{ic:'🔘',nm:'Switch'}],
     steps:['Place the battery on the board.','Connect a wire from the positive terminal to the switch.','Connect a wire from the switch to the LED bulb.','Connect the LED bulb back to the negative terminal.','Close the switch to complete the circuit.','The LED lights up!','Open the switch to break the circuit.'],
     outcome:'A closed path allows electric current to flow, lighting the bulb.',anim:'circuit'},
    {id:'p5',title:'Convex Lenses',topic:'Light',grade:8,diff:'Medium',dur:'25 min',
     apparatus:[{ic:'🔍',nm:'Convex Lens'},{ic:'🔦',nm:'Light Source'},{ic:'📏',nm:'Optical Bench'},{ic:'📃',nm:'Screen'}],
     steps:['Mount the convex lens on the optical bench.','Place the light source (candle/laser) on one side.','Turn on the light source.','Move the screen on the other side until a sharp image forms.','Observe the light rays converging to a focal point.','Measure the focal length of the lens.'],
     outcome:'Convex lenses converge parallel light rays to a focal point.',anim:'lens'}`;

content = content.replace(
  `outcome:'Magnetic field lines run from North to South pole outside the magnet.',anim:'magnet'},`,
  `outcome:'Magnetic field lines run from North to South pole outside the magnet.',anim:'magnet'},${physAdd}`
);

// 2. ADD BIOLOGY EXPS
const bioAdd = `,
    {id:'b4',title:'Stomata Observation',topic:'Getting to Know Plants',grade:6,diff:'Medium',dur:'35 min',
     apparatus:[{ic:'🍃',nm:'Leaf'},{ic:'🥄',nm:'Forceps'},{ic:'🟦',nm:'Glass Slide'},{ic:'⬜',nm:'Coverslip'},{ic:'🔬',nm:'Microscope'}],
     steps:['Tear the leaf to peel off a thin layer from the lower epidermis.','Place the peel on a glass slide.','Add a drop of water and a coverslip.','Place the slide on the microscope.','Observe under low power and high power.','Identify the bean-shaped guard cells and the stomatal pore.'],
     outcome:'Stomata are tiny pores guarded by guard cells, allowing gas exchange.',anim:'microscope'},
    {id:'b5',title:'Testing Food (Starch & Protein)',topic:'Components of Food',grade:6,diff:'Medium',dur:'40 min',
     apparatus:[{ic:'🥔',nm:'Potato'},{ic:'🥛',nm:'Milk'},{ic:'🧪',nm:'Test Tubes'},{ic:'🟤',nm:'Iodine'},{ic:'💧',nm:'Biuret Reagent'}],
     steps:['Add potato extract to Test Tube 1.','Add milk to Test Tube 2.','Add drops of iodine to Tube 1.','Observe Tube 1 turn blue-black indicating starch.','Add Biuret reagent to Tube 2.','Observe Tube 2 turn purple indicating protein.'],
     outcome:'Iodine tests for starch (blue-black). Biuret tests for protein (purple).',anim:'litmus'}`;

content = content.replace(
  `outcome:'Only chlorophyll-containing (green) areas perform photosynthesis and produce starch.',anim:'leaf'},`,
  `outcome:'Only chlorophyll-containing (green) areas perform photosynthesis and produce starch.',anim:'leaf'},${bioAdd}`
);

// 3. ADD POSES (reusing existing ones)
content = content.replace(
  `leaf:['idle','hold','dip','stir','hold','dip','examine','write'],`,
  `leaf:['idle','hold','dip','stir','hold','dip','examine','write'],
  circuit:['idle','push','push','push','push','examine','examine','write'],
  lens:['idle','hold','push','push','examine','write','write'],
  foodtest:['idle','pourL','pourL','dip','dip','dip','examine','write'],`
);

// 4. ADD SCREEN DEMOS
const screenDemosAdd = `
  p4:{
    title:'Electric Circuits', zone:'physics', color:'#facc15',
    steps:[
      {label:'Setup Components', desc:'Place battery, switch, and LED bulb on the board.', draw:'cir_setup'},
      {label:'Wire 1', desc:'Connect wire from battery positive to the switch.', draw:'cir_wire1'},
      {label:'Wire 2', desc:'Connect wire from switch to the LED bulb.', draw:'cir_wire2'},
      {label:'Wire 3', desc:'Connect LED back to battery negative to complete the loop.', draw:'cir_wire3'},
      {label:'Close Switch', desc:'Close the switch! Electrons can now flow through the connected wires.', draw:'cir_close'},
      {label:'LED Lights Up', desc:'Current flows! Electric energy converts to light energy.', draw:'cir_lit'},
      {label:'Open Switch', desc:'Open the switch to break the path. The circuit is incomplete, LED turns off.', draw:'cir_open'}
    ]
  },
  p5:{
    title:'Convex Lenses', zone:'physics', color:'#60a5fa',
    steps:[
      {label:'Setup', desc:'Mount a convex lens in the middle. Place a laser or light source on the left.', draw:'lens_setup'},
      {label:'Parallel Rays', desc:'Laser shines parallel rays of light towards the convex lens.', draw:'lens_rays'},
      {label:'Refraction', desc:'Light enters the thicker glass and bends (refracts).', draw:'lens_refract'},
      {label:'Convergence', desc:'A convex lens is thicker in the middle, causing rays to converge.', draw:'lens_converge'},
      {label:'Focal Point', desc:'All parallel rays meet at exactly one spot: the FOCAL POINT.', draw:'lens_focus'},
      {label:'Focal Length', desc:'The distance from the lens to the focal point is the FOCAL LENGTH.', draw:'lens_length'}
    ]
  },
  b4:{
    title:'Stomata Observation', zone:'biology', color:'#4ade80',
    steps:[
      {label:'Epidermis Peel', desc:'Tear a leaf and peel the thin, transparent lower epidermis.', draw:'stom_peel'},
      {label:'Slide Prep', desc:'Place peel on slide, add water drop, and put coverslip.', draw:'stom_slide'},
      {label:'Microscope', desc:'Place slide on the microscope stage.', draw:'stom_scope'},
      {label:'Low Power', desc:'Observe under low power. See tightly packed epidermal cells with pores.', draw:'stom_low'},
      {label:'High Power', desc:'Observe a single pore (stoma) under high magnification.', draw:'stom_high'},
      {label:'Guard Cells', desc:'Identify two bean-shaped guard cells controlling the stomatal pore opening.', draw:'stom_guard'}
    ]
  },
  b5:{
    title:'Food Testing', zone:'biology', color:'#f472b6',
    steps:[
      {label:'Samples', desc:'Tube 1: Potato extract. Tube 2: Milk sample.', draw:'ft_setup'},
      {label:'Milk Prep', desc:'Milk is ready for protein testing.', draw:'ft_milk'},
      {label:'Add Iodine', desc:'Add a few drops of Iodine solution to the potato extract.', draw:'ft_iodine'},
      {label:'Starch Confirmed', desc:'Tube 1 turns BLUE-BLACK! Iodine confirms the presence of STARCH.', draw:'ft_starch'},
      {label:'Add Biuret', desc:'Add Biuret reagent (Copper Sulphate + Caustic Soda) to the milk.', draw:'ft_biuret'},
      {label:'Protein Confirmed', desc:'Tube 2 turns PURPLE! Biuret test confirms the presence of PROTEIN.', draw:'ft_protein'}
    ]
  },`;

content = content.replace(
  `}
};

// ─────────────────────────────────────────────`,
  `${screenDemosAdd}
};

// ─────────────────────────────────────────────`
);

// 5. ADD DRAW FNS
const drawFnsAdd = `

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
  // Switch closed
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
  // LED
  ctx.fillStyle='rgba(250,204,21,'+(0.4+Math.sin(t*5)*0.2)+')'; ctx.beginPath(); ctx.arc(cx+100,cy-75,40,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#facc15'; ctx.beginPath(); ctx.arc(cx+100,cy-65,15,0,Math.PI*2); ctx.fill();
  txt(ctx,'LIGHT ENERGY!',cx,cy-10,14,'#facc15','center');
  // flowing dots
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
  // Switch is open
  ctx.strokeStyle='#888'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(cx-20,cy+45); ctx.lineTo(cx+20,cy+30); ctx.stroke();
  txt(ctx,'OPEN SWITCH = NO CURRENT',cx,cy-10,14,'#f87171','center');
  ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(cx+100,cy-65,15,0,Math.PI*2); ctx.fill();
});

// -- LENSES --
reg('lens_setup',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  // Lens
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2; ctx.stroke();
  // Laser
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  txt(ctx,'Convex Lens',cx,cy-45,12,'#60a5fa','center');
  txt(ctx,'Light Source',cx-165,cy-20,12,'#d97706','center');
});
reg('lens_rays',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  // Lens
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  // Rays
  ctx.strokeStyle='rgba(250,204,21,0.8)'; ctx.lineWidth=2;
  [-20,0,20].forEach(yoff=>{
     ctx.beginPath(); ctx.moveTo(cx-150,cy+yoff); ctx.lineTo(cx,cy+yoff); ctx.stroke();
  });
  txt(ctx,'Parallel Light Rays',cx-80,cy-35,12,'#facc15','center');
});
reg('lens_refract',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.strokeStyle='#555'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(cx-200,cy+50); ctx.lineTo(cx+200,cy+50); ctx.stroke();
  // Lens
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#88aacc'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  // Rays inside lens
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
  // Lens
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  const spread=(t%3)/3; // 0 to 1
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
  // Lens
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
  // Lens
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.ellipse(cx,cy,10,35,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#d97706'; ctx.fillRect(cx-180,cy-5,30,10);
  ctx.strokeStyle='rgba(250,204,21,0.5)'; ctx.lineWidth=2;
  [-20,0,20].forEach(yoff=>{
     ctx.beginPath(); ctx.moveTo(cx-150,cy+yoff); ctx.lineTo(cx,cy+yoff); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(cx,cy+yoff); ctx.lineTo(cx+120,cy); ctx.stroke();
  });
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(cx+120,cy,3,0,Math.PI*2); ctx.fill();
  // Focal length arrow
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
  // Peel
  ctx.fillStyle='rgba(200,255,200,0.7)'; ctx.beginPath(); ctx.moveTo(cx-5,cy); ctx.lineTo(cx+15,cy-20); ctx.lineTo(cx+25,cy+10); ctx.fill();
  // Forceps
  ctx.strokeStyle='#888'; ctx.lineWidth=3;
  ctx.beginPath(); ctx.moveTo(cx+80,cy-60); ctx.lineTo(cx+15,cy-20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx+90,cy-40); ctx.lineTo(cx+15,cy-20); ctx.stroke();
  txt(ctx,'Tearing lower leaf epidermis',cx,cy+60,13,'#4ade80','center');
});
reg('stom_slide',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='rgba(255,255,255,0.2)'; ctx.fillRect(cx-80,cy-20,160,40);
  ctx.fillStyle='rgba(150,255,150,0.3)'; ctx.beginPath(); ctx.arc(cx,cy,15,0,Math.PI*2); ctx.fill(); // Peel
  ctx.fillStyle='rgba(100,200,255,0.4)'; ctx.beginPath(); ctx.arc(cx,cy,18,0,Math.PI*2); ctx.fill(); // Water
  ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.rect(cx-15,cy-15,30,30); ctx.stroke(); // Coverslip
  txt(ctx,'Mounted on slide with coverslip',cx,cy+50,13,'#4ade80','center');
});
reg('stom_scope',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#444'; ctx.fillRect(cx-40,cy+40,80,20); // base
  ctx.fillStyle='#555'; ctx.fillRect(cx-20,cy-40,20,80); // arm
  ctx.fillStyle='#666'; ctx.fillRect(cx-20,cy-60,50,20); // tube
  ctx.fillStyle='rgba(200,255,255,0.5)'; ctx.fillRect(cx+10,cy+10,40,5); // slide
  txt(ctx,'Microscope Stage',cx,cy+80,13,'#aaa','center');
});
reg('stom_low',(ctx,W,H,t)=>{
  const cx=W/2, cy=H/2;
  ctx.fillStyle='#052e16'; ctx.beginPath(); ctx.arc(cx,cy,90,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#22c55e'; ctx.lineWidth=1.5; ctx.stroke();
  // grid
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
  // Single stoma
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
  // Labels
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
  ctx.fillStyle='#1e1b4b'; ctx.fillRect(cx-57,cy,24,28); // Blue-Black!
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
  ctx.fillStyle='#9333ea'; ctx.fillRect(cx+33,cy,24,28); // Purple
  txt(ctx,'Purple!',cx+45,cy-80,12,'#d8b4fe','center');
  txt(ctx,'PROTEIN CONFIRMED',cx+45,cy+50,11,'#d8b4fe','center');
});
\`;

content = content.replace(
  '// ── helpers ──',
  drawFnsAdd + '\n\n// ── helpers ──'
);

fs.writeFileSync(labPath, content);
console.log('Patch complete!');
