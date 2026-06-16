import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

// ═══════════════════════════════════════════════════════════════════
// GAME DATA
// ═══════════════════════════════════════════════════════════════════

const THEMES = [
  { bgHex:0x060612, floorHex:0x0b0d2b, wallHex:0x151a55, glow:0x4fc3f7, glowS:"#4fc3f7", name:"DUNGEON LEVEL Ⅰ" },
  { bgHex:0x130820, floorHex:0x1d0a36, wallHex:0x38096a, glow:0xce93d8, glowS:"#ce93d8", name:"CRYSTAL CAVES Ⅱ" },
  { bgHex:0x061206, floorHex:0x091e09, wallHex:0x0d380d, glow:0x69f0ae, glowS:"#69f0ae", name:"JUNGLE RUINS Ⅲ"  },
  { bgHex:0x200505, floorHex:0x310707, wallHex:0x521208, glow:0xff7043, glowS:"#ff7043", name:"LAVA CHAMBERS Ⅳ"  },
  { bgHex:0x120f00, floorHex:0x1e1900, wallHex:0x342b00, glow:0xffd700, glowS:"#ffd700", name:"GOLDEN VAULT Ⅴ"   },
];

const CHAPTER_QUESTIONS = {
  class6: {
    1: [{q:"Successor of 9999?", a:10000}, {q:"Place value of 5 in 6543?", a:500}, {q:"Estimate 730 + 998 to nearest hundreds. (700+1000)", a:1700}, {q:"Predecessor of 100000?", a:99999}, {q:"Write Roman numeral 'C' as a number.", a:100}, {q:"Difference between 1000 and 234?", a:766}, {q:"What is 10 million in crores?", a:1}],
    2: [{q:"Predecessor of 1000?", a:999}, {q:"Value of 0 divided by 5?", a:0}, {q:"Additive identity for whole numbers?", a:0}, {q:"Multiplicative identity?", a:1}, {q:"What is 25 × 8?", a:200}, {q:"Solve using distributive: 12 × 35 (12×30 + 12×5)", a:420}, {q:"Smallest whole number?", a:0}],
    3: [{q:"Smallest prime number?", a:2}, {q:"LCM of 4 and 6?", a:12}, {q:"HCF of 12 and 16?", a:4}, {q:"Number of factors of 8?", a:4}, {q:"Is 27 prime? (0=No, 1=Yes)", a:0}, {q:"First multiple of 15?", a:15}, {q:"Smallest composite number?", a:4}],
    4: [{q:"Endpoints in a line segment?", a:2}, {q:"Sides in a quadrilateral?", a:4}, {q:"Intersecting points of parallel lines?", a:0}, {q:"Sides in a pentagon?", a:5}, {q:"Minimum points to form a line?", a:2}, {q:"How many diagonals in a triangle?", a:0}, {q:"Sides in a heptagon?", a:7}],
    5: [{q:"Measure of right angle?", a:90}, {q:"Faces of a cube?", a:6}, {q:"Degrees in a straight angle?", a:180}, {q:"Degrees in a complete revolution?", a:360}, {q:"Number of edges in a cube?", a:12}, {q:"Vertices in a triangle?", a:3}, {q:"Angle of an equilateral triangle?", a:60}],
    6: [{q:"Evaluate: (-3) + (-4)", a:-7}, {q:"Solve: 15 - (-5)", a:20}, {q:"Additive inverse of 8?", a:-8}, {q:"Solve: (-10) + 15", a:5}, {q:"Multiply: (-2) × (-5)", a:10}, {q:"Divide: (-20) / 4", a:-5}, {q:"Absolute value of -100?", a:100}],
    7: [{q:"Convert 3/4 to percentage.", a:75}, {q:"Numerator of 15/20 in simplest form?", a:3}, {q:"Add 1/4 + 2/4. Numerator?", a:3}, {q:"Half of 50?", a:25}, {q:"Denominator of 7/9?", a:9}, {q:"Convert 1/5 to percentage.", a:20}, {q:"Subtract 3/5 - 1/5. Numerator?", a:2}],
    8: [{q:"Add 0.5 + 0.3. Multiply by 10.", a:8}, {q:"Multiply 1.5 by 10.", a:15}, {q:"Convert 2.5 kg to grams.", a:2500}, {q:"0.2 × 5 = ?", a:1}, {q:"Convert 50 paise to rupees. Multiply by 100.", a:50}, {q:"Place value of 5 in 2.5 (in tenths).", a:5}, {q:"Solve: 10.5 - 0.5", a:10}],
    9: [{q:"If 1 symbol = 10 cars, how many for 5 symbols?", a:50}, {q:"Bar graph: 1 unit = 5, value of 4 units?", a:20}, {q:"Tally mark for 5 consists of how many lines?", a:5}, {q:"If total is 100, and half is red, how many red?", a:50}, {q:"Average of 2 and 4?", a:3}, {q:"Difference between highest 10 and lowest 2?", a:8}, {q:"Mode of 1, 2, 2, 3?", a:2}],
    10: [{q:"Perimeter of square is 20cm, side = ?", a:5}, {q:"Area of rectangle 5 by 4?", a:20}, {q:"Perimeter of equilateral triangle side 6?", a:18}, {q:"Area of square side 10?", a:100}, {q:"Perimeter of regular pentagon side 4?", a:20}, {q:"Length of rectangle if Area=50, width=5?", a:10}, {q:"Cost of fencing 10m at Rs 5/m?", a:50}],
    11: [{q:"Solve: 2x = 10, x = ?", a:5}, {q:"Evaluate 3n + 2 for n=4.", a:14}, {q:"Solve: y - 5 = 7", a:12}, {q:"If z/3 = 4, z = ?", a:12}, {q:"Solve: 5m = 25", a:5}, {q:"Evaluate 10 - 2x for x=2", a:6}, {q:"Coefficient of x in 7x?", a:7}],
    12: [{q:"Simplify ratio 15:20. What is consequent?", a:4}, {q:"If 5 pens cost 50, cost of 1 pen?", a:10}, {q:"Find x if 2:3 = 4:x.", a:6}, {q:"Ratio of 10 to 50? (Antecedent if simplified)", a:1}, {q:"Divide 20 in ratio 1:1. First part?", a:10}, {q:"Proportion: 3:4 :: 6:x. Find x.", a:8}, {q:"Ratio of 1 hour to 30 mins?", a:2}],
    13: [{q:"Lines of symmetry of a square?", a:4}, {q:"Lines of symmetry of regular hexagon?", a:6}, {q:"Lines of symmetry in letter A?", a:1}, {q:"Lines of symmetry in a rectangle?", a:2}, {q:"Lines of symmetry in an equilateral triangle?", a:3}, {q:"Lines of symmetry in letter H?", a:2}, {q:"Does letter S have line symmetry? (0=No, 1=Yes)", a:0}],
    14: [{q:"Radius of circle if diameter is 14cm?", a:7}, {q:"Arcs needed for 60 degree angle?", a:1}, {q:"Angle in a semicircle?", a:90}, {q:"Degrees bisected from 90?", a:45}, {q:"Diameter of circle with radius 5?", a:10}, {q:"Total degrees in a circle?", a:360}, {q:"Instrument for measuring angles? (1=Protractor)", a:1}]
  },
  class7: {
    1: [{q:"(-2) × (-3) × (-4) = ?", a:-24}, {q:"Additive inverse of -15?", a:15}, {q:"(-10) / (-2) = ?", a:5}, {q:"Product of 5 and -3?", a:-15}, {q:"Absolute value of -42?", a:42}, {q:"Sum of -5 and 5?", a:0}],
    2: [{q:"1/2 of 24?", a:12}, {q:"2.5 × 4 = ?", a:10}, {q:"Reciprocal of 1/8?", a:8}, {q:"0.5 × 0.5 × 100?", a:25}, {q:"Add 1.2 and 3.8", a:5}, {q:"Divide 10 by 0.5?", a:20}],
    3: [{q:"Mean of 2, 4, 6, 8, 10?", a:6}, {q:"Mode of 2, 3, 3, 4?", a:3}, {q:"Median of 1, 2, 3, 4, 5?", a:3}, {q:"Range of 10, 5, 20?", a:15}, {q:"Probability of rolling 6 on a die? (Multiply by 6)", a:1}, {q:"Mean of first 5 natural numbers?", a:3}],
    4: [{q:"Solve: 3x - 5 = 10, x = ?", a:5}, {q:"If y/2 = 8, find y.", a:16}, {q:"Solve 2(x+3) = 14", a:4}, {q:"If 5 subtracted from a number is 10, the number?", a:15}, {q:"Solve: 4p - 2 = 18", a:5}, {q:"Value of x if x/5 = 4", a:20}],
    5: [{q:"Complement of 40 degrees?", a:50}, {q:"Supplement of 100 degrees?", a:80}, {q:"Complement of 89 degrees?", a:1}, {q:"Vertically opposite to 60 degrees?", a:60}, {q:"Angles forming a linear pair add up to?", a:180}, {q:"Supplement of 90 degrees?", a:90}],
    6: [{q:"Sum of angles of triangle?", a:180}, {q:"Hypotenuse if legs are 3 and 4?", a:5}, {q:"Exterior angle if opposite interiors are 50 and 60?", a:110}, {q:"Hypotenuse squared if legs are 6 and 8?", a:100}, {q:"Base of right triangle if hypotenuse=13, height=12?", a:5}, {q:"Is a triangle with sides 3,4,5 right-angled? (1=Yes)", a:1}],
    7: [{q:"Congruence SSS means how many sides equal?", a:3}, {q:"Angle of equilateral triangle?", a:60}, {q:"ASA means Angle-Side-___?", a:1}, {q:"RHS congruence requires a ___ angle.", a:90}, {q:"Number of conditions for SAS?", a:3}, {q:"If ABC ≅ PQR, angle B corresponds to angle Q? (1=Yes)", a:1}],
    8: [{q:"20% of 250?", a:50}, {q:"Simple interest: P=1000, R=5%, T=2 yrs.", a:100}, {q:"Convert 0.75 to %.", a:75}, {q:"SP if CP=100, Profit=20%?", a:120}, {q:"Ratio of 5m to 10m?", a:1}, {q:"Discount% if MP=100, SP=80?", a:20}],
    9: [{q:"Add 1/2 + 1/4. Multiply by 4.", a:3}, {q:"Multiplicative inverse of 1/5?", a:5}, {q:"Standard form of 10/15. Numerator?", a:2}, {q:"Equivalent fraction of 2/3 with denominator 6. Numerator?", a:4}, {q:"Product of a rational number and its reciprocal?", a:1}, {q:"Is 0 a rational number? (1=Yes)", a:1}],
    10: [{q:"Sum of interior angles on same side of transversal?", a:180}, {q:"Minimum points to draw a line?", a:2}, {q:"Alternate interior angles of parallel lines are ___? (Enter 1 for equal)", a:1}, {q:"Measure of corresponding angle to 45 deg?", a:45}, {q:"Intersecting lines form how many vertically opposite pairs?", a:2}, {q:"Parallel lines intersect at how many points?", a:0}],
    11: [{q:"Area of circle with radius 7 (use π=22/7).", a:154}, {q:"Perimeter of rectangle 10 by 5?", a:30}, {q:"Area of parallelogram base 5, height 4?", a:20}, {q:"Circumference of circle radius 7 (π=22/7)?", a:44}, {q:"Area of triangle base 10 height 5?", a:25}, {q:"Side of square with area 64?", a:8}],
    12: [{q:"Value of 2x + 3 for x=4?", a:11}, {q:"Coefficient of x in 5x?", a:5}, {q:"Terms in trinomial?", a:3}, {q:"Evaluate x² for x=5?", a:25}, {q:"Degree of 4x³?", a:3}, {q:"Add 3x and 4x. Coefficient?", a:7}],
    13: [{q:"Value of 2³ × 3²?", a:72}, {q:"Value of 10³?", a:1000}, {q:"5² × 5³ = 5^?", a:5}, {q:"Anything to the power 0 is?", a:1}, {q:"Value of 2⁴?", a:16}, {q:"Square root of 81?", a:9}],
    14: [{q:"Order of rotational symmetry of square?", a:4}, {q:"Lines of symmetry of rectangle?", a:2}, {q:"Rotational symmetry order of equilateral triangle?", a:3}, {q:"Order of rotational symmetry of a circle? (Enter 0 for infinite)", a:0}, {q:"Lines of symmetry of a kite?", a:1}, {q:"Angle of rotation for square?", a:90}],
    15: [{q:"Vertices of a cube?", a:8}, {q:"Edges of a triangular pyramid?", a:6}, {q:"Faces of a cuboid?", a:6}, {q:"Euler's formula: F + V - E = ?", a:2}, {q:"Vertices of a cone?", a:1}, {q:"Faces of a sphere?", a:1}]
  },
  class8: {
    1: [{q:"Additive identity of rational numbers?", a:0}, {q:"Multiplicative inverse of 1/5?", a:5}, {q:"Additive inverse of 7?", a:-7}, {q:"Is subtraction commutative for rational numbers? (0=No)", a:0}, {q:"Reciprocal of -2 is -1/2. Multiply by -4?", a:2}, {q:"Product of 1 and any rational number x? (Enter 1 for x)", a:1}],
    2: [{q:"Solve: 5x + 9 = 5 + 3x, x = ?", a:-2}, {q:"Solve: 2y = 18, y = ?", a:9}, {q:"Solve: m - m/2 = 4", a:8}, {q:"Age of x if x+5 = 15?", a:10}, {q:"Solve: 3(t-3) = 15", a:8}, {q:"Solve: x/3 + 1 = 2", a:3}],
    3: [{q:"Sum of exterior angles of any polygon?", a:360}, {q:"Interior angle sum of quadrilateral?", a:360}, {q:"Sides of a regular polygon with exterior angle 36?", a:10}, {q:"Interior angle sum of pentagon?", a:540}, {q:"Diagonals in a quadrilateral?", a:2}, {q:"Measure of each angle in rectangle?", a:90}],
    4: [{q:"Probability of heads in coin toss (in %)?", a:50}, {q:"Central angle of half a pie chart?", a:180}, {q:"Total angle of a pie chart?", a:360}, {q:"Probability of sure event?", a:1}, {q:"Probability of impossible event?", a:0}, {q:"Possible outcomes of rolling a die?", a:6}],
    5: [{q:"Square of 15?", a:225}, {q:"Square root of 144?", a:12}, {q:"Number of zeros in square of 100?", a:4}, {q:"Is 25 a perfect square? (1=Yes)", a:1}, {q:"Square root of 400?", a:20}, {q:"Square of 11?", a:121}],
    6: [{q:"Cube of 5?", a:125}, {q:"Cube root of 512?", a:8}, {q:"Cube of 10?", a:1000}, {q:"Cube root of 27?", a:3}, {q:"Is 8 a perfect cube? (1=Yes)", a:1}, {q:"Cube of 2?", a:8}],
    7: [{q:"Selling price is 120, profit 20, find CP.", a:100}, {q:"Discount on 500 at 10%?", a:50}, {q:"GST is 10% on 100. Total amount?", a:110}, {q:"Compound interest: P=100, R=10%, 1 yr?", a:10}, {q:"Ratio of 2km to 500m?", a:4}, {q:"If MP=200, SP=150, discount amount?", a:50}],
    8: [{q:"Evaluate a² + b² for a=2, b=3.", a:13}, {q:"Highest power in quadratic equation?", a:2}, {q:"Evaluate (x+1)² for x=2?", a:9}, {q:"Subtract 2x from 5x?", a:3}, {q:"Multiply (x)(x²)? (Enter exponent)", a:3}, {q:"Value of (a-b)² + 2ab for a=2,b=1?", a:5}],
    9: [{q:"Area of square side 12cm?", a:144}, {q:"Volume of cube side 5cm?", a:125}, {q:"Area of trapezium: h=4, parallel sides=3,5?", a:16}, {q:"Volume of cuboid: 5×4×3?", a:60}, {q:"Curved surface area of cylinder: radius=7, h=10 (use π=22/7)?", a:440}, {q:"Surface area of cube side 2?", a:24}],
    10: [{q:"Calculate 2⁴ × 3²?", a:144}, {q:"Value of 5⁰?", a:1}, {q:"(2²)^3 = 2^?", a:6}, {q:"10^-2 × 10^4 = 10^?", a:2}, {q:"Value of (-1)^4?", a:1}, {q:"Scientific notation exponent for 150000?", a:5}],
    11: [{q:"If 2 workers take 6 days, how many days for 3 workers?", a:4}, {q:"If speed is 60km/h, dist in 2h?", a:120}, {q:"If x and y vary directly, x/y is ___? (Enter 1 for constant)", a:1}, {q:"10 pens cost 50, cost of 5 pens?", a:25}, {q:"Speed if 100km covered in 2 hours?", a:50}, {q:"Inverse proportion: xy = ___? (Enter 1 for constant)", a:1}],
    12: [{q:"Common factor of 2x and 4x²?", a:2}, {q:"Evaluate 10x / 2x?", a:5}, {q:"Factorise 3x + 9. What is inside bracket? (x+?)", a:3}, {q:"Divide 15x² by 3x. Coefficient?", a:5}, {q:"Common factor of 6a and 9a²?", a:3}, {q:"Factorise x²+2x+1. Base of square is (x+?)", a:1}],
    13: [{q:"Number of axes in Cartesian plane?", a:2}, {q:"Y-coordinate of x-intercept?", a:0}, {q:"Origin coordinates sum?", a:0}, {q:"Quadrant of point (2,3)?", a:1}, {q:"X-coordinate of y-intercept?", a:0}, {q:"If a point is on X-axis, its y-coordinate is?", a:0}]
  }
};

const GENERIC_HINTS = [
  "🔷 The next floor awaits! Look near the NORTH wall.",
  "🌿 Deeper into the maze... Find the box near the EAST pillar.",
  "🔥 Keep going! The box smoulders BEHIND the orange column.",
  "✨ Almost there! Seek the chest in the corners.",
  "💎 Look carefully, the treasure is hidden well.",
  "🔮 The magical box is somewhere around here."
];

function buildChapterData(selectedClass, chapterId) {
  const bank = CHAPTER_QUESTIONS[selectedClass];
  const numChapters = Object.keys(bank).length;
  let activeQuestions = [];
  let vaultQuestions = [];

  if(chapterId === "vault") {
    // 5 random questions from all chapters
    for(let i=0; i<5; i++) {
      const rCh = Math.floor(Math.random() * numChapters) + 1;
      let pool = [...bank[rCh]].sort(() => Math.random() - 0.5);
      vaultQuestions.push(pool[0]);
      activeQuestions.push({
        q: pool[0].q, a: pool[0].a,
        hint: i===4 ? "🏆 ALL BOXES SOLVED!\nApproach the Golden Door!" : GENERIC_HINTS[i % GENERIC_HINTS.length],
        title: `FINAL VAULT - Q${i+1}`,
        isLastOfChapter: (i===4),
        chapter: "vault",
        isFinal: true
      });
    }
  } else {
    // 5 questions from the specific chapter
    let pool = [...bank[chapterId]].sort(() => Math.random() - 0.5);
    for(let i=0; i<5; i++) {
      let qd = pool[i % pool.length];
      activeQuestions.push({
        q: qd.q, a: qd.a,
        hint: i===4 ? "🚪 CHAPTER COMPLETE! Go through the glowing door!" : GENERIC_HINTS[i % GENERIC_HINTS.length],
        title: `CH ${chapterId} - Lvl ${i+1}`,
        isLastOfChapter: (i===4),
        chapter: chapterId
      });
    }
  }
  return { activeQuestions, vaultQuestions, numChapters };
}

// [box[x,z], stairs[x,z]|null, door[x,z]|null]
const BASE_LAYOUTS = [
  { box:[4,4],   stairs:[6,-6], door:null    },
  { box:[-5,-3], stairs:[6,-6], door:null    },
  { box:[6,-5],  stairs:[6,-6], door:null    },
  { box:[-3,5],  stairs:[6,-6], door:null    },
];

const getLayout = (fi, totalLevels) => {
  if (fi >= totalLevels - 1) return { box:[0,1], stairs:null, door:[-6,5] };
  return BASE_LAYOUTS[fi % BASE_LAYOUTS.length];
};
const getTheme = (fi) => THEMES[fi % THEMES.length];
const getIW = (fi) => IW[fi % IW.length];
const getSpawn = (fi) => SPAWNS[fi % SPAWNS.length];

// Inner wall AABBs per floor — full bhul bhulaiya maze layout
// All walls: x1<x2, z1<z2, corridors ≥1.8 wide, key positions clear
const IW = [
  // ── FLOOR 0  Dungeon  S-curve spiral ──────────────────────────
  // Spawn(0,3) → Box(4,4) [NE] → Stairs(6,-6) [SE]
  [
    {x1:-6.5,x2: 2.5,z1: 0.3,z2: 0.6},   // long center wall forces east detour
    {x1: 2.5,x2: 2.8,z1:-4.5,z2: 0.3},   // vertical pillar going south
    {x1:-3.5,x2: 2.8,z1:-4.5,z2:-4.2},   // horizontal mid — forms corner
    {x1:-3.5,x2:-3.2,z1:-6.5,z2:-4.5},   // vertical going deep south
    {x1:-6.5,x2:-3.2,z1:-6.5,z2:-6.2},   // bottom-left sweep
    {x1:-6.5,x2:-6.2,z1:-6.2,z2:-2.5},   // left side going north
    {x1: 4.5,x2: 4.8,z1:-2.0,z2: 2.0},   // right-area divider (box at z=4 is above)
    {x1: 2.8,x2: 4.5,z1:-2.0,z2:-1.7},   // connects vertical to divider
  ],
  // ── FLOOR 1  Crystal Caves  big loop ─────────────────────────
  // Spawn(0,3) → Box(-5,-3) [SW] → Stairs(6,-6) [SE]
  [
    {x1: 1.5,x2: 6.5,z1: 0.3,z2: 0.6},   // right wall — forces west route first
    {x1: 1.5,x2: 1.8,z1:-3.5,z2: 0.3},   // vertical connector
    {x1:-2.5,x2: 1.8,z1:-3.5,z2:-3.2},   // center horizontal
    {x1:-2.5,x2:-2.2,z1:-6.5,z2:-3.5},   // vertical going south
    {x1:-6.5,x2:-2.2,z1:-6.5,z2:-6.2},   // bottom sweep
    {x1:-6.5,x2:-6.2,z1:-6.2,z2:-1.5},   // left side
    {x1:-6.5,x2:-1.5,z1:-1.5,z2:-1.2},   // mid horizontal (box at -5,-3 is below this)
    {x1: 3.5,x2: 3.8,z1:-5.5,z2: 0.3},   // right divider near stairs
  ],
  // ── FLOOR 2  Jungle Ruins  east push ─────────────────────────
  // Spawn(-2,3) → Box(6,-5) [SE] → Stairs(6,-6) [SE]
  [
    {x1:-6.5,x2: 2.0,z1: 0.3,z2: 0.6},   // big left wall — forces player east
    {x1:-6.5,x2:-4.0,z1:-2.0,z2:-1.7},   // left area horizontal
    {x1:-4.0,x2:-3.7,z1:-5.5,z2:-2.0},   // vertical left-center
    {x1:-6.5,x2:-3.7,z1:-5.5,z2:-5.2},   // bottom-left
    {x1: 2.0,x2: 2.3,z1:-3.5,z2: 0.3},   // right-of-center vertical
    {x1:-1.0,x2: 2.3,z1:-3.5,z2:-3.2},   // horizontal mid-right
    {x1:-1.0,x2:-0.7,z1:-5.5,z2:-3.5},   // small south stub
    {x1: 3.5,x2: 3.8,z1:-3.5,z2: 2.5},   // right divider (box+stairs are east of this)
  ],
  // ── FLOOR 3  Lava Chambers  north box challenge ───────────────
  // Spawn(0,3) → Box(-3,5) [NW] → Stairs(6,-6) [SE]
  [
    {x1: 1.0,x2: 6.5,z1: 1.5,z2: 1.8},   // right wall — box is NW so player goes left
    {x1: 1.0,x2: 1.3,z1:-3.0,z2: 1.5},   // vertical connector going south
    {x1:-3.5,x2: 1.3,z1:-3.0,z2:-2.7},   // horizontal forcing west detour
    {x1:-3.5,x2:-3.2,z1:-5.5,z2:-3.0},   // vertical going deep south
    {x1:-6.5,x2:-3.2,z1:-5.5,z2:-5.2},   // bottom sweep
    {x1:-6.5,x2:-6.2,z1:-5.2,z2:-2.0},   // left side going north
    {x1:-6.5,x2:-1.5,z1:-2.0,z2:-1.7},   // mid horizontal
    {x1: 3.5,x2: 3.8,z1:-5.5,z2: 1.5},   // right divider
  ],
  // ── FLOOR 4  Golden Vault  final labyrinth ────────────────────
  // Spawn(0,3) → Box(0,1) [close] → Door(-6,5) [NW far]
  [
    {x1: 1.5,x2: 6.5,z1: 0.3,z2: 0.6},   // right wall
    {x1: 1.5,x2: 1.8,z1:-4.0,z2: 0.3},   // vertical right
    {x1:-2.5,x2: 1.8,z1:-4.0,z2:-3.7},   // horizontal mid
    {x1:-2.5,x2:-2.2,z1:-6.5,z2:-4.0},   // vertical going south
    {x1:-6.5,x2:-2.2,z1:-6.5,z2:-6.2},   // bottom sweep
    {x1:-6.5,x2:-6.2,z1:-6.2,z2:-1.0},   // left side (door at -6,5 is above this)
    {x1:-6.5,x2:-1.5,z1:-1.0,z2:-0.7},   // mid horizontal
    {x1:-1.5,x2:-1.2,z1:-1.0,z2: 3.5},   // tall blocker — forces going around to door
    {x1:-5.0,x2: 0.0,z1: 4.5,z2: 4.8},   // north wall — forces west gap to reach door
  ],
];

// Safe spawn positions per floor (verified clear of all maze walls)
const SPAWNS = [
  [ 0,  3],   // Floor 0: open NE area
  [ 0,  3],   // Floor 1: west of right wall
  [-2,  3],   // Floor 2: west side, above main horizontal
  [ 0,  3],   // Floor 3: west of right wall, box is north
  [ 0,  3],   // Floor 4: between box and maze walls
];

const ROOM=16, WH=4, HR=7.6;

function isBlocked(x,z,fi){
  const R=0.42;
  if(x<-HR||x>HR||z<-HR||z>HR) return true;
  for(const w of getIW(fi)){
    const cx=Math.max(w.x1,Math.min(w.x2,x));
    const cz=Math.max(w.z1,Math.min(w.z2,z));
    if((x-cx)**2+(z-cz)**2<R*R) return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════
// GEOMETRY BUILDERS
// ═══════════════════════════════════════════════════════════════════

function buildChest(solved, glowHex) {
  const g = new THREE.Group();

  const goldMat = new THREE.MeshStandardMaterial({
    color: solved?0x555555:0xd4a017, metalness:0.85, roughness:0.25,
    emissive: solved?0:new THREE.Color(glowHex).multiplyScalar(0.15),
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: solved?0x333333:0x7a5a0a, metalness:0.7, roughness:0.4,
  });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1,0.7,0.85),goldMat);
  body.position.y=0.35; body.castShadow=true; g.add(body);

  const lid = new THREE.Mesh(new THREE.BoxGeometry(1,0.22,0.85),darkMat);
  lid.position.set(0,solved?0.9:0.75,0);
  if(solved) lid.rotation.x=-1.1;
  lid.castShadow=true; g.add(lid);

  const lockM = new THREE.MeshStandardMaterial({color:solved?0x333:0xffd700,metalness:1});
  const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.13,8),lockM);
  lock.position.set(0,0.71,0.43); g.add(lock);

  // Binding strips
  const stripM = new THREE.MeshStandardMaterial({color:solved?0x444:0xb8860b,metalness:0.9});
  [-0.3,0.3].forEach(z=>{
    const s=new THREE.Mesh(new THREE.BoxGeometry(1.02,0.06,0.04),stripM);
    s.position.set(0,0.35,z); g.add(s);
  });

  if(!solved){
    const orbM=new THREE.MeshStandardMaterial({color:glowHex,emissive:glowHex,emissiveIntensity:3,transparent:true,opacity:0.92});
    const orb=new THREE.Mesh(new THREE.SphereGeometry(0.14,16,16),orbM);
    orb.position.y=1.18; g.add(orb);
    const pl=new THREE.PointLight(glowHex,3,5);
    pl.position.y=0.9; g.add(pl);
    // Particles ring
    const pM=new THREE.MeshBasicMaterial({color:glowHex});
    for(let i=0;i<6;i++){
      const p=new THREE.Mesh(new THREE.SphereGeometry(0.04,6,6),pM);
      const a=i/6*Math.PI*2;
      p.position.set(Math.cos(a)*0.3,1.15,Math.sin(a)*0.3);
      g.add(p);
    }
  }
  return g;
}

function buildPortal(glowHex) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({color:glowHex,emissive:glowHex,emissiveIntensity:2.5,transparent:true,opacity:0.95});
  [-0.7,0.7].forEach(x=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(0.13,3,0.13),mat);
    m.position.set(x,1.5,0); g.add(m);
  });
  const top=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.13,0.13),mat);
  top.position.set(0,3,0); g.add(top);
  const fillM=new THREE.MeshBasicMaterial({color:glowHex,transparent:true,opacity:0.12,side:THREE.DoubleSide,depthWrite:false});
  const fill=new THREE.Mesh(new THREE.PlaneGeometry(1.4,2.85),fillM);
  fill.position.set(0,1.5,0.02); g.add(fill);
  // Shimmer layers
  for(let i=1;i<=3;i++){
    const sm=new THREE.MeshBasicMaterial({color:glowHex,transparent:true,opacity:0.04*i,side:THREE.DoubleSide,depthWrite:false});
    const sf=new THREE.Mesh(new THREE.PlaneGeometry(1.4+i*0.1,2.85+i*0.1),sm);
    sf.position.set(0,1.5,0.01*i); g.add(sf);
  }
  const pl=new THREE.PointLight(glowHex,4,7);
  pl.position.set(0,1.5,0.6); g.add(pl);
  const arrowM=new THREE.MeshBasicMaterial({color:0xffffff});
  const arrow=new THREE.Mesh(new THREE.ConeGeometry(0.13,0.38,4),arrowM);
  arrow.position.set(0,3.6,0); g.add(arrow);
  // Step blocks
  const stepM=new THREE.MeshStandardMaterial({color:0x888888,metalness:0.4});
  [0.2,0.45,0.7].forEach((y,i)=>{
    const s=new THREE.Mesh(new THREE.BoxGeometry(1.2-i*0.2,0.15,0.3),stepM);
    s.position.set(0,y,0.45-i*0.15); g.add(s);
  });
  return g;
}

function buildGoldenDoor() {
  const g = new THREE.Group();
  const goldM=new THREE.MeshStandardMaterial({color:0xffd700,metalness:1,roughness:0.1,emissive:0xffd700,emissiveIntensity:0.6});
  [-1.15,1.15].forEach(x=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(0.28,3.8,0.28),goldM);
    m.position.set(x,1.9,0); g.add(m);
  });
  const top=new THREE.Mesh(new THREE.BoxGeometry(2.7,0.28,0.28),goldM);
  top.position.set(0,3.8,0); g.add(top);
  // Arch
  const archPts=[];
  for(let i=0;i<=12;i++){
    const a=i/12*Math.PI;
    archPts.push(new THREE.Vector3(Math.cos(a)*1.15,Math.sin(a)*0.8+3.8,0));
  }
  const archGeo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(archPts),20,0.08,8);
  g.add(new THREE.Mesh(archGeo,goldM));
  const panM=new THREE.MeshStandardMaterial({color:0xffd700,metalness:0.8,roughness:0.2,transparent:true,opacity:0.5,emissive:0xffd700,emissiveIntensity:0.4});
  const pan=new THREE.Mesh(new THREE.PlaneGeometry(2.1,3.4),panM);
  pan.position.set(0,1.7,0.1); g.add(pan);
  // Stars on door
  const starM=new THREE.MeshBasicMaterial({color:0xffffff});
  [[0,2.5],[0.6,1.5],[-0.6,1.5],[0,0.8]].forEach(([sx,sy])=>{
    const s=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,6),starM);
    s.position.set(sx,sy,0.15); g.add(s);
  });
  const pl=new THREE.PointLight(0xffd700,6,12);
  pl.position.set(0,2.5,1.5); g.add(pl);
  return g;
}

function buildRoom(scene, fi, solved, totalLevels) {
  const grp = new THREE.Group();
  const t = getTheme(fi);
  const layout = getLayout(fi, totalLevels);

  scene.background = new THREE.Color(t.bgHex);
  scene.fog = new THREE.FogExp2(t.bgHex, 0.052);

  const floorM = new THREE.MeshStandardMaterial({color:t.floorHex,roughness:1});
  const wallM  = new THREE.MeshStandardMaterial({color:t.wallHex, roughness:0.9});
  const ceilM  = new THREE.MeshStandardMaterial({color:0x060606});

  // Floor
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(ROOM,ROOM),floorM);
  fl.rotation.x=-Math.PI/2; fl.receiveShadow=true; grp.add(fl);
  // Ceiling
  const ce=new THREE.Mesh(new THREE.PlaneGeometry(ROOM,ROOM),ceilM);
  ce.rotation.x=Math.PI/2; ce.position.y=WH; grp.add(ce);

  const addBox=(w,d,x,z)=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,WH,d),wallM);
    m.position.set(x,WH/2,z); m.castShadow=true; m.receiveShadow=true; grp.add(m);
  };
  // Outer walls
  addBox(ROOM,0.3,0,-HR-0.1); addBox(ROOM,0.3,0,HR+0.1);
  addBox(0.3,ROOM,-HR-0.1,0); addBox(0.3,ROOM,HR+0.1,0);
  // Inner walls
  for(const w of getIW(fi)){
    const ww=w.x2-w.x1, wd=w.z2-w.z1;
    addBox(ww,wd,(w.x1+w.x2)/2,(w.z1+w.z2)/2);
  }
  // Pillars
  const pilM=new THREE.MeshStandardMaterial({color:0x383838,metalness:0.4,roughness:0.7});
  [[-5,-5],[5,-5],[-5,5]].forEach(([px,pz])=>{
    const m=new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,WH,12),pilM);
    m.position.set(px,WH/2,pz); m.castShadow=true; grp.add(m);
    // Pillar cap
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.38,0.2,12),pilM);
    cap.position.set(px,WH-0.1,pz); grp.add(cap);
  });

  // Lights
  grp.add(new THREE.AmbientLight(t.glow, 0.8));
  const dir=new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(3,8,3); dir.castShadow=true; grp.add(dir);
  for(let x=-5;x<=5;x+=5) for(let z=-5;z<=5;z+=5){
    const pl=new THREE.PointLight(t.glow,0.22,10);
    pl.position.set(x,3.7,z); grp.add(pl);
  }
  // Atmospheric floor glow
  const fgPl=new THREE.PointLight(t.glow,0.4,6);
  fgPl.position.set(0,0.3,0); grp.add(fgPl);

  // Chest
  const chest = buildChest(solved[fi], t.glow);
  chest.position.set(layout.box[0],0,layout.box[1]);
  grp.add(chest);

  // Portal
  let stairsMesh=null;
  if(layout.stairs){
    const portal=buildPortal(t.glow);
    portal.position.set(layout.stairs[0],0,layout.stairs[1]);
    grp.add(portal); stairsMesh=portal;
  }
  // Door
  let doorMesh=null;
  if(layout.door){
    const door=buildGoldenDoor();
    door.position.set(layout.door[0],0,layout.door[1]);
    grp.add(door); doorMesh=door;
  }

  scene.add(grp);
  return { grp, chest, stairsMesh, doorMesh };
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function TreasureHunt() {
  const mountRef = useRef(null);
  const gameRef  = useRef(null); // { scene, state, reload }

  const phaseRef = useRef("menu");

  const [phase,     setUiPhase]    = useState("menu");
  const [uiFloor,   setUiFloor]    = useState(1);
  const [uiSolved,  setUiSolved]   = useState(0);
  const [floorName, setFloorName]  = useState("DUNGEON LEVEL Ⅰ");
  const [nearBox,   setNearBox]    = useState(false);
  const [nearStairs,setNearStairs] = useState(false);
  const [nearDoor,  setNearDoor]   = useState(false);
  const [hintText,  setHintText]   = useState("");
  const [wrongAns,  setWrongAns]   = useState(false);
  const [tokens,    setTokens]     = useState(0);
  const [answer,    setAnswer]     = useState("");
  const [activeQ,   setActiveQ]    = useState(0);
  const [finalAns,  setFinalAns]   = useState(Array(5).fill(""));
  const [finalErr,  setFinalErr]   = useState(Array(5).fill(false));
  const [showHint,  setShowHint]   = useState(false);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [vaultQuestions, setVaultQuestions]   = useState([]);
  const [completedChapter, setCompletedChapter] = useState(1);
  const [gameClass, setGameClass] = useState("class6");
  const [hasSave, setHasSave] = useState(false);

  const [saveData, setSaveData] = useState({});

  useEffect(() => {
    const s = localStorage.getItem("treasureHuntSave");
    if(s) setHasSave(true);
    
    const p = localStorage.getItem("treasureHuntProfile");
    if(p) setSaveData(JSON.parse(p));
  }, []);

  const setPhase = useCallback((p)=>{ phaseRef.current=p; setUiPhase(p); },[]);

  const openMap = (cls) => {
    setGameClass(cls);
    setPhase("map");
  };

  const startChapter = useCallback((chapterId, resume=false) => {
    let aq, vq, fl = 0, slvd = [];
    let gc = gameClass;
    if (resume) {
      try {
        const saved = JSON.parse(localStorage.getItem("treasureHuntSave"));
        aq = saved.aq; vq = saved.vq; fl = saved.fl; slvd = saved.slvd;
        chapterId = saved.chapterId;
        gc = saved.gClass;
        setGameClass(gc);
      } catch(e){}
    }
    if (!aq) {
      const data = buildChapterData(gc, chapterId);
      aq = data.activeQuestions; vq = data.vaultQuestions;
      slvd = Array(aq.length).fill(false);
      fl = 0;
    }
    
    setActiveQuestions(aq);
    setVaultQuestions(vq);
    
    const g = gameRef.current;
    if(g) {
      g.state.gameClass = gameClass;
      g.state.chapterId = chapterId;
      g.state.activeQuestions = aq;
      g.state.vaultQuestions = vq;
      g.state.totalLevels = aq.length;
      g.state.solved = slvd;
      setUiSolved(slvd.filter(Boolean).length); 
      setTokens(0);
      setFinalAns(Array(5).fill("")); setFinalErr(Array(5).fill(false));
      g.loadFloor(fl);
      if(!resume) g.state.saveProgress();
    }
    setPhase("playing");
  }, [gameClass, setPhase]);

  // Joystick visual state
  const [joyPos, setJoyPos] = useState({ x:0, y:0 });
  const joyBaseRef = useRef(null);

  // ── THREE.JS SETUP ──────────────────────────────────────────────
  useEffect(()=>{
    const mount = mountRef.current;
    const W=mount.clientWidth, H=mount.clientHeight;

    const renderer=new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(W,H);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.2;
    mount.appendChild(renderer.domElement);

    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(72,W/H,0.05,60);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(W, H), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.1;
    bloomPass.strength = 1.3; // Adds dramatic glow
    bloomPass.radius = 0.6;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    const st={
      floor:0, solved:Array(5).fill(false), totalLevels: 5,
      px:0, pz:3, pry:Math.PI,
      keys:{},
      touch:{ dx:0, dz:0, turn:0, active:false }, // Mobile touch state
      chest:null, stairsMesh:null, doorMesh:null, floorGrp:null,
      nearBox:false, nearStairs:false, nearDoor:false,
    };
    st.saveProgress = () => {
      try {
        if(st.activeQuestions && st.activeQuestions.length > 0) {
          localStorage.setItem("treasureHuntSave", JSON.stringify({
            gClass: st.gameClass, chapterId: st.chapterId, aq: st.activeQuestions, vq: st.vaultQuestions, fl: st.floor, slvd: st.solved
          }));
        }
      } catch(e){}
    };

    // ── LOAD FLOOR ──────────────────────────────────────────────
    const loadFloor=(fi, resetPos=true)=>{
      st.floor=fi;
      if(st.floorGrp) scene.remove(st.floorGrp);
      const {grp,chest,stairsMesh,doorMesh}=buildRoom(scene, fi, st.solved, st.totalLevels);
      st.floorGrp=grp; st.chest=chest; st.stairsMesh=stairsMesh; st.doorMesh=doorMesh;
      if(resetPos){ const sp = getSpawn(fi); st.px=sp[0]; st.pz=sp[1]; st.pry=Math.PI; }
      setUiFloor(fi+1);
      setFloorName(getTheme(fi).name);
      setUiSolved(st.solved.filter(Boolean).length);
      setNearBox(false); setNearStairs(false); setNearDoor(false);
      st.nearBox=false; st.nearStairs=false; st.nearDoor=false;
      st.saveProgress();
    };

    loadFloor(0);
    gameRef.current={ scene, state:st, loadFloor };

    // ── MOVEMENT ──────────────────────────────────────────────
    const doMove=(dt)=>{
      const k=st.keys;
      const t=st.touch;
      
      // Keyboard turn
      if(k.ArrowLeft||k.KeyQ)  st.pry+=0.042*dt;
      if(k.ArrowRight||k.KeyZ) st.pry-=0.042*dt;
      // Touch turn
      if(t.turn !== 0) st.pry += t.turn * 0.042 * dt;

      const sin=Math.sin(st.pry),cos=Math.cos(st.pry);
      const spd=0.1*dt;
      let dx=0,dz=0;
      
      // Keyboard move
      if(k.KeyW||k.ArrowUp)   {dx-=sin*spd;dz-=cos*spd;}
      if(k.KeyS||k.ArrowDown) {dx+=sin*spd;dz+=cos*spd;}
      if(k.KeyA) {dx-=cos*spd;dz+=sin*spd;}
      if(k.KeyD) {dx+=cos*spd;dz-=sin*spd;}
      
        // Touch move
      if(t.dx !== 0 || t.dz !== 0) {
        // t.dz < 0 means dragging UP (forward)
        // t.dx < 0 means dragging LEFT (strafe left)
        const fwd = t.dz * spd;
        const sde = t.dx * spd;
        dx += sin * fwd - cos * sde;
        dz += cos * fwd + sin * sde;
      }

      const nx=st.px+dx, nz=st.pz+dz;
      if(!isBlocked(nx,st.pz,st.floor)) st.px=nx;
      if(!isBlocked(st.px,nz,st.floor)) st.pz=nz;
      camera.position.set(st.px,1.65,st.pz);
      camera.rotation.order="YXZ";
      camera.rotation.y=st.pry;
      camera.rotation.x=0;
    };

    // ── PROXIMITY ────────────────────────────────────────────
    const doProx=()=>{
      const l=getLayout(st.floor, st.totalLevels);
      const d=(ax,az)=>Math.hypot(st.px-ax,st.pz-az);
      const nb=d(l.box[0],l.box[1])<2.6&&!st.solved[st.floor];
      const ns=l.stairs?d(l.stairs[0],l.stairs[1])<2.6:false;
      const nd=l.door?d(l.door[0],l.door[1])<3.2:false;
      if(nb!==st.nearBox){st.nearBox=nb;setNearBox(nb);}
      if(ns!==st.nearStairs){st.nearStairs=ns;setNearStairs(ns);}
      if(nd!==st.nearDoor){st.nearDoor=nd;setNearDoor(nd);}
    };

    // ── ANIMATE ───────────────────────────────────────────────
    const doAnim=(t)=>{
      if(st.chest&&!st.solved[st.floor]){
        st.chest.position.y=Math.sin(t*0.0022)*0.13;
        st.chest.rotation.y+=0.007;
      }
      if(st.stairsMesh){
        st.stairsMesh.children.forEach(c=>{
          if(c.isPointLight) c.intensity=3.5+Math.sin(t*0.003)*1.5;
        });
      }
      if(st.doorMesh){
        st.doorMesh.children.forEach(c=>{
          if(c.isPointLight) c.intensity=5+Math.sin(t*0.002)*3;
        });
      }
    };

    // ── KEY PRESS / INTERACT ──────────────────────────────────
    const handleInteract=(e)=>{
      if(e && e.type==="keydown" && e.code!=="KeyE" && e.code!=="Space") return;
      if(phaseRef.current!=="playing") return;
      if(st.nearBox){
        setActiveQ(st.floor);
        setAnswer(""); setWrongAns(false);
        setPhase("question");
      } else if(st.nearStairs&&st.floor<st.totalLevels-1){
        loadFloor(st.floor+1);
      } else if(st.nearDoor){
        if(st.solved.every(Boolean)){
          const currentLvl = activeQuestions[st.floor];
          if(currentLvl && currentLvl.chapter !== "vault") {
            setCompletedChapter(currentLvl.chapter);
            setPhase("chapter_complete");
          } else {
            setFinalAns(Array(5).fill(""));
            setFinalErr(Array(5).fill(false));
            setPhase("final");
          }
        } else {
          setHintText(`⚠️  Solve ALL ${st.totalLevels} treasure boxes first before passing through the door!`);
          setShowHint(true);
          setPhase("hint");
        }
      }
    };
    st.handleInteract = handleInteract;

    const kd=(e)=>{
      st.keys[e.code]=true;
      if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault();
    };
    const ku=(e)=>{ delete st.keys[e.code]; };
    window.addEventListener("keydown",kd);
    window.addEventListener("keyup",ku);
    window.addEventListener("keydown",handleInteract);

    // ── LOOP ──────────────────────────────────────────────────
    let last=0;
    const loop=(t)=>{
      mount._raf=requestAnimationFrame(loop);
      const dt=Math.min((t-last)/16.67,3); last=t;
      if(phaseRef.current==="playing"){
        doMove(dt); doProx(); doAnim(t);
      }
      composer.render();
    };
    mount._raf=requestAnimationFrame(loop);

    const onResize=()=>{
      const w=mount.clientWidth,h=mount.clientHeight;
      renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix();
      composer.setSize(w,h);
    };
    window.addEventListener("resize",onResize);

    return ()=>{
      cancelAnimationFrame(mount._raf);
      window.removeEventListener("keydown",kd);
      window.removeEventListener("keyup",ku);
      window.removeEventListener("keydown",handleInteract);
      window.removeEventListener("resize",onResize);
      if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  },[setPhase]);

  // ── UI HANDLERS ──────────────────────────────────────────────────
  const submitAnswer = useCallback(()=>{
    const g = gameRef.current; if(!g) return;
    const { state:st, scene, loadFloor } = g;
    const num = parseInt(answer.trim());
    if(isNaN(num)){ setWrongAns(true); return; }
    if(num===activeQuestions[st.floor].a){
      st.solved[st.floor]=true;
      st.saveProgress();
      loadFloor(st.floor, false); // rebuild with solved chest, keep position
      setHintText(activeQuestions[st.floor].hint);
      setShowHint(true);
      setWrongAns(false);
      setPhase("hint");
    } else {
      setWrongAns(true);
    }
  },[answer, setPhase, activeQuestions]);

  const closeHint = useCallback(()=>{ setShowHint(false); setPhase("playing"); },[setPhase]);

  const submitFinal = useCallback(()=>{
    const errors = vaultQuestions.map((q,i)=>parseInt(finalAns[i])!==q.a);
    setFinalErr(errors);
    if(errors.every(e=>!e)){
      setTokens(500);
      setPhase("won");
    }
  },[finalAns, setPhase, activeQuestions]);

  const playAgain = useCallback(()=>{
    setPhase("menu");
  },[setPhase]);

  // ── DERIVED THEME FOR UI ──────────────────────────────────────
  const T = THEMES[Math.max(0, (uiFloor-1)) % THEMES.length];
  const isPlaying = phase === "playing";

  return (
    <div style={{width:"100%",height:"100vh",position:"relative",background:"#000",overflow:"hidden",fontFamily:"'Courier New',monospace"}}>

      {/* ── CANVAS ── */}
      <div ref={mountRef} style={{width:"100%",height:"100%"}} />

      {/* ── CROSSHAIR ── */}
      {isPlaying&&(
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",color:"rgba(255,255,255,0.55)",fontSize:22,lineHeight:1,textShadow:"0 0 8px rgba(255,255,255,0.3)"}}>+</div>
      )}

      {/* ── HUD TOP LEFT ── */}
      {isPlaying&&(
        <div style={{position:"absolute",top:18,left:18,color:T.glowS,textShadow:`0 0 12px ${T.glowS}`,fontSize:12,lineHeight:2,pointerEvents:"none",userSelect:"none",letterSpacing:1}}>
          <div style={{fontSize:15,fontWeight:"bold",letterSpacing:3,marginBottom:2,opacity:0.95}}>{floorName}</div>
          <div>FLOOR  <span style={{color:"#fff"}}>{uiFloor}</span> / {activeQuestions.length}</div>
          <div>SOLVED  <span style={{color:"#fff"}}>{uiSolved}</span> / {activeQuestions.length}</div>
          <div style={{marginTop:8,fontSize:10,opacity:0.55,letterSpacing:2}}>W A S D — MOVE</div>
          <div style={{fontSize:10,opacity:0.55,letterSpacing:2}}>◄ ► / Q Z — TURN</div>
          <div style={{fontSize:10,opacity:0.55,letterSpacing:2}}>[ E ] — INTERACT</div>
        </div>
      )}

      {/* ── MENU SCREEN ── */}
      {phase==="menu"&&(
        <div style={{
          position:"absolute",inset:0,
          background:"radial-gradient(circle at center,#1a1a2e 0%,#000 100%)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          animation:"fadeIn 0.6s ease", zIndex: 10
        }}>
          <div style={{textAlign:"center",color:"#fff",padding:20}}>
            <div style={{fontSize:70,marginBottom:10,animation:"bounceLoop 1.5s ease-in-out infinite alternate"}}>🎓</div>
            <div style={{fontSize:36,fontWeight:"bold",letterSpacing:4,marginBottom:8,textShadow:"0 0 30px #4fc3f7"}}>
              NCERT MATH QUEST
            </div>
            <div style={{fontSize:16,color:"rgba(255,255,255,0.6)",letterSpacing:2,marginBottom:40}}>
              Select your class to begin the Treasure Hunt
            </div>
            
            <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap", flexDirection:"column"}}>
              {hasSave && (
                <button onClick={()=>startGame("", true)} style={{
                  padding:"20px 40px", background:"linear-gradient(135deg,#ffaa00,#ff7700)",
                  color:"#fff", border:"2px solid #ffcc80", borderRadius:12,
                  fontSize:20, fontWeight:"bold", cursor:"pointer", letterSpacing:2,
                  boxShadow:"0 0 30px rgba(255,170,0,0.4)", transition:"transform 0.2s",
                  marginBottom: 20
                }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                  🔄 CONTINUE SAVED GAME
                </button>
              )}
              <div style={{display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={()=>openMap("class6")} style={{
                padding:"20px 40px", background:"linear-gradient(135deg,#0d47a1,#1976d2)",
                color:"#fff", border:"2px solid #4fc3f7", borderRadius:12,
                fontSize:20, fontWeight:"bold", cursor:"pointer", letterSpacing:2,
                boxShadow:"0 0 30px rgba(79,195,247,0.4)", transition:"transform 0.2s"
              }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                CLASS 6
              </button>
              
              <button onClick={()=>openMap("class7")} style={{
                padding:"20px 40px", background:"linear-gradient(135deg,#1b5e20,#388e3c)",
                color:"#fff", border:"2px solid #81c784", borderRadius:12,
                fontSize:20, fontWeight:"bold", cursor:"pointer", letterSpacing:2,
                boxShadow:"0 0 30px rgba(129,199,132,0.4)", transition:"transform 0.2s"
              }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                CLASS 7
              </button>
              
              <button onClick={()=>openMap("class8")} style={{
                padding:"20px 40px", background:"linear-gradient(135deg,#b71c1c,#d32f2f)",
                color:"#fff", border:"2px solid #e57373", borderRadius:12,
                fontSize:20, fontWeight:"bold", cursor:"pointer", letterSpacing:2,
                boxShadow:"0 0 30px rgba(229,115,115,0.4)", transition:"transform 0.2s"
              }} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                CLASS 8
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LEVEL MAP ── */}
      {phase==="map"&&(()=>{
        const maxUnl = (saveData.maxUnlocked && saveData.maxUnlocked[gameClass]) || 1;
        const scores = (saveData.scores && saveData.scores[gameClass]) || {};
        const numCh = Object.keys(CHAPTER_QUESTIONS[gameClass]).length;
        const totalNodes = numCh + 1;
        
        const genPath = () => {
          let d = "";
          for(let i=0; i<totalNodes; i++) {
            const x = 50 + Math.sin(i * 1.2) * 30;
            const y = i * 120 + 60;
            if(i === 0) d += `M ${x} ${y} `;
            else {
              const prevX = 50 + Math.sin((i-1) * 1.2) * 30;
              const prevY = (i-1) * 120 + 60;
              const cpY = (prevY + y) / 2;
              d += `C ${prevX} ${cpY}, ${x} ${cpY}, ${x} ${y} `;
            }
          }
          return d;
        };

        return (
          <div style={{
            position:"absolute",inset:0,
            background:"radial-gradient(circle at top, #4a148c 0%, #1a0b2e 60%, #000 100%)",
            overflowY:"auto", overflowX:"hidden",
            display:"flex",flexDirection:"column",alignItems:"center",
            zIndex:15, animation:"fadeIn 0.5s ease"
          }}>
             {Array.from({length:15}).map((_,i)=>(
               <div key={i} style={{
                 position:"absolute", pointerEvents:"none",
                 left:`${Math.random()*100}%`, top:`${Math.random()*150}%`,
                 fontSize: Math.random()*20+10, opacity: Math.random()*0.3+0.1, color:"#fff",
                 animation:`floatBg ${Math.random()*4+3}s infinite ease-in-out alternate`
               }}>
                 {["+", "-", "×", "÷", "★", "☁️"][Math.floor(Math.random()*6)]}
               </div>
             ))}

             <div style={{
               marginTop:40, padding:"10px 40px",
               background:"rgba(0,0,0,0.4)", borderRadius:30, border:"2px solid #ff00aa",
               boxShadow:"0 0 20px rgba(255,0,170,0.5), inset 0 0 10px rgba(255,0,170,0.3)",
               zIndex: 2
             }}>
               <h2 style={{
                 color:"#fff", margin:0, fontSize:36,
                 letterSpacing:6, textShadow:"0 4px 0 #ff00aa, 0 0 20px #ff00aa"
               }}>
                 {gameClass.toUpperCase()} SAGA
               </h2>
             </div>
             
             <div style={{position:"relative", width:"100%", maxWidth:500, height: totalNodes*130 + 150, margin:"50px 0"}}>
                <svg viewBox={`0 0 100 ${totalNodes*130 + 150}`} preserveAspectRatio="none" style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none"}}>
                   <path d={genPath()} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="16" strokeLinecap="round" style={{filter:"blur(8px)"}} />
                   <path d={genPath()} fill="none" stroke="#ff00aa" strokeWidth="8" strokeDasharray="15, 20" strokeLinecap="round" />
                </svg>
                {Array.from({length: totalNodes}).map((_, i) => {
                   const ch = i+1;
                   const isVault = ch > numCh;
                   const x = 50 + Math.sin(i * 1.2) * 30;
                   const y = i * 130 + 80;
                   const unlocked = ch <= maxUnl;
                   const isCurrent = ch === maxUnl;
                   const isCompleted = ch < maxUnl;
                   const sc = scores[ch];
                   
                   return (
                     <div key={ch} style={{
                       position:"absolute", left:`${x}%`, top:y, transform:"translate(-50%, -50%)",
                       width: isVault ? 100 : 80, height: isVault ? 100 : 80, borderRadius:"50%", 
                       background: isVault ? "linear-gradient(135deg, #ffd700, #ff8c00)" : (unlocked ? "linear-gradient(135deg, #00d2ff, #3a7bd5)" : "linear-gradient(135deg, #444, #222)"),
                       border: unlocked ? (isVault ? "6px solid #fff" : "5px solid #fff") : "4px solid #555",
                       display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                       color: unlocked ? "#fff" : "#777", cursor: unlocked ? "pointer" : "not-allowed",
                       boxShadow: isCurrent ? "none" : (unlocked ? (isVault ? "0 10px 30px #ffd700, inset 0 -5px 15px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.5), inset 0 -5px 10px rgba(0,0,0,0.3)") : "inset 0 -5px 10px rgba(0,0,0,0.5)"),
                       animation: isCurrent ? "pulseNode 2s infinite" : "none",
                       transition: isCurrent ? "none" : "transform 0.2s"
                     }} 
                     onMouseOver={e=>{if(unlocked && !isCurrent)e.currentTarget.style.transform="translate(-50%, -50%) scale(1.1)";}}
                     onMouseOut={e=>{if(unlocked && !isCurrent)e.currentTarget.style.transform="translate(-50%, -50%) scale(1)";}}
                     onClick={() => { if(unlocked) startChapter(isVault ? "vault" : ch); }}>
                       <span style={{fontSize:isVault?40:32, fontWeight:"900", textShadow: unlocked ? "0 3px 5px rgba(0,0,0,0.4)" : "none"}}>{isVault ? "🏆" : ch}</span>
                       
                       {isCompleted && (
                         <div style={{position:"absolute", bottom:-22, display:"flex", gap:2, fontSize:18, filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.8))"}}>
                           <span>⭐</span><span>⭐</span><span>⭐</span>
                         </div>
                       )}
                       {sc !== undefined && (
                          <div style={{position:"absolute", bottom: isCompleted ? -42 : -30, fontSize:14, color:"#ffd700", whiteSpace:"nowrap", fontWeight:"bold", textShadow:"0 0 10px #000", background:"rgba(0,0,0,0.6)", padding:"2px 8px", borderRadius:10}}>
                            SCORE: {sc}
                          </div>
                       )}
                     </div>
                   );
                })}
             </div>
             
             <button onClick={()=>setPhase("menu")} style={{
               position:"fixed", top:20, left:20, padding:"12px 24px", 
               background:"rgba(255,255,255,0.1)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)", 
               borderRadius:20, cursor:"pointer", fontWeight:"bold"
             }}>
               ← BACK TO MENU
             </button>
          </div>
        );
      })()}

      {/* ── BOX TRACKER TOP RIGHT ── */}
      {isPlaying&&(
        <div style={{position:"absolute",top:18,right:18,display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end",pointerEvents:"none"}}>
          <div style={{color:"#fff", fontSize:12, marginBottom:5, opacity:0.8, letterSpacing:2}}>PROGRESS</div>
          <div style={{display:"flex", gap:4, maxWidth:180, flexWrap:"wrap", justifyContent:"flex-end"}}>
            {activeQuestions.map((_,i)=>{
              const solved = gameRef.current?.state?.solved[i];
              return (
                <div key={i} style={{
                  width: 14, height: 14, borderRadius: 3,
                  background: solved ? "#ffd700" : (i===uiFloor-1 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"),
                  border: `1px solid ${solved ? "#fff" : "rgba(255,255,255,0.2)"}`,
                  boxShadow: solved ? "0 0 10px #ffd700" : (i===uiFloor-1 ? "0 0 10px #fff" : "none")
                }} title={`Box ${i+1}`} />
              );
            })}
          </div>
        </div>
      )}

      {/* ── MOBILE CONTROLS ── */}
      {isPlaying && (
        <div style={{
          position:"absolute", bottom:30, left:0, right:0, 
          height:120, pointerEvents:"none", display:"flex", 
          justifyContent:"space-between", alignItems:"center", padding:"0 40px"
        }}>
          {/* Joystick Area */}
          <div 
            ref={joyBaseRef}
            style={{
              width:120, height:120, borderRadius:"50%", 
              background:"rgba(255,255,255,0.1)", border:"2px solid rgba(255,255,255,0.2)",
              position:"relative", pointerEvents:"auto", touchAction:"none"
            }}
            onPointerDown={(e)=>{
              if(!gameRef.current) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              const rect = e.currentTarget.getBoundingClientRect();
              const cx = rect.left + rect.width/2;
              const cy = rect.top + rect.height/2;
              const dx = e.clientX - cx, dy = e.clientY - cy;
              const dist = Math.hypot(dx,dy);
              const maxR = 40;
              const nx = Math.abs(dx)>maxR ? dx/dist*maxR : dx;
              const ny = Math.abs(dy)>maxR ? dy/dist*maxR : dy;
              
              setJoyPos({x:nx, y:ny});
              gameRef.current.state.touch.dx = nx/maxR;
              gameRef.current.state.touch.dz = ny/maxR;
              gameRef.current.state.touch.active = true;
            }}
            onPointerMove={(e)=>{
              if(!gameRef.current || !gameRef.current.state.touch.active) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const cx = rect.left + rect.width/2;
              const cy = rect.top + rect.height/2;
              const dx = e.clientX - cx, dy = e.clientY - cy;
              const dist = Math.hypot(dx,dy);
              const maxR = 40;
              const nx = Math.abs(dx)>maxR ? dx/dist*maxR : dx;
              const ny = Math.abs(dy)>maxR ? dy/dist*maxR : dy;
              
              setJoyPos({x:nx, y:ny});
              gameRef.current.state.touch.dx = nx/maxR;
              gameRef.current.state.touch.dz = ny/maxR;
            }}
            onPointerUp={(e)=>{
              if(!gameRef.current) return;
              e.currentTarget.releasePointerCapture(e.pointerId);
              setJoyPos({x:0, y:0});
              gameRef.current.state.touch.dx = 0;
              gameRef.current.state.touch.dz = 0;
              gameRef.current.state.touch.active = false;
            }}
            onPointerCancel={(e)=>{
              if(!gameRef.current) return;
              setJoyPos({x:0, y:0});
              gameRef.current.state.touch.dx = 0;
              gameRef.current.state.touch.dz = 0;
              gameRef.current.state.touch.active = false;
            }}
          >
            <div style={{
              width:50, height:50, borderRadius:"50%", 
              background:"rgba(255,255,255,0.4)", position:"absolute",
              top:"50%", left:"50%", 
              transform:`translate(calc(-50% + ${joyPos.x}px), calc(-50% + ${joyPos.y}px))`,
              boxShadow:"0 0 10px rgba(0,0,0,0.5)"
            }}/>
          </div>

          <div style={{display:"flex", gap:15, pointerEvents:"auto"}}>
            {/* View Swipe Area (hidden standard touch area for camera turning) */}
            <div 
              style={{
                position:"fixed", top:0, left:"50%", right:0, bottom:150, 
                touchAction:"none"
              }}
              onPointerDown={(e)=>{
                if(!gameRef.current) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                e.currentTarget.dataset.lx = e.clientX;
              }}
              onPointerMove={(e)=>{
                if(!gameRef.current || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
                const lx = parseFloat(e.currentTarget.dataset.lx);
                const dx = e.clientX - lx;
                // Move camera based on horizontal drag
                gameRef.current.state.touch.turn = -dx * 0.5;
                e.currentTarget.dataset.lx = e.clientX;
              }}
              onPointerUp={(e)=>{
                if(!gameRef.current) return;
                e.currentTarget.releasePointerCapture(e.pointerId);
                gameRef.current.state.touch.turn = 0;
              }}
              onPointerCancel={(e)=>{
                if(!gameRef.current) return;
                gameRef.current.state.touch.turn = 0;
              }}
            />

            {/* Interact Button */}
            <button 
              onPointerDown={()=>{
                if(gameRef.current) gameRef.current.state.handleInteract();
              }}
              style={{
                width:80, height:80, borderRadius:"50%", 
                background: (nearBox||nearStairs||nearDoor) ? T.glowS : "rgba(255,255,255,0.1)",
                border:`2px solid ${(nearBox||nearStairs||nearDoor) ? T.glowS : "rgba(255,255,255,0.2)"}`,
                color:"#000", fontWeight:"bold", fontSize:24,
                boxShadow:(nearBox||nearStairs||nearDoor) ? `0 0 20px ${T.glowS}` : "none",
                display:"flex", alignItems:"center", justifyContent:"center"
              }}>
              ✋
            </button>
          </div>
        </div>
      )}

      {/* ── PROXIMITY PROMPT ── */}
      {isPlaying&&(nearBox||nearStairs||nearDoor)&&(
        <div style={{
          position:"absolute",bottom:80,left:"50%",transform:"translateX(-50%)",
          background:"rgba(0,0,0,0.75)",border:`1px solid ${T.glowS}`,
          color:T.glowS,padding:"9px 24px",borderRadius:6,fontSize:13,
          textShadow:`0 0 10px ${T.glowS}`,letterSpacing:2,backdropFilter:"blur(4px)",
          boxShadow:`0 0 20px ${T.glowS}33`,animation:"pulse 1.2s ease-in-out infinite"
        }}>
          {nearBox&&"[ E ]  OPEN TREASURE BOX"}
          {nearStairs&&!nearBox&&"[ E ]  ASCEND TO NEXT FLOOR  ↑"}
          {nearDoor&&!nearBox&&"[ E ]  ENTER THE GOLDEN VAULT"}
        </div>
      )}

      {/* ── QUESTION MODAL ── */}
      {phase==="question"&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.88)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
          <div style={{
            background:`linear-gradient(145deg,#0a0a1e,#101030)`,
            border:`2px solid ${T.glowS}`,
            boxShadow:`0 0 50px ${T.glowS}44, inset 0 0 30px rgba(0,0,0,0.5)`,
            borderRadius:14,padding:"40px 48px",maxWidth:440,width:"90%",textAlign:"center"
          }}>
            <div style={{fontSize:12,color:T.glowS,letterSpacing:4,marginBottom:6,opacity:0.8}}>TREASURE BOX {activeQ+1}  •  {activeQuestions[activeQ]?.title}</div>
            <div style={{fontSize:28,marginBottom:8}}>🔐</div>
            <div style={{fontSize:14,color:"rgba(255,255,255,0.6)",marginBottom:20,letterSpacing:1}}>Solve the math challenge to open the chest!</div>
            <div style={{
              fontSize:26,color:"#fff",fontWeight:"bold",
              marginBottom:28,padding:"18px 24px",
              background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:10,letterSpacing:2,textShadow:`0 0 20px ${T.glowS}`
            }}>
              {activeQuestions[activeQ]?.q}
            </div>
            <input
              autoFocus type="number" value={answer}
              onChange={e=>{setAnswer(e.target.value);setWrongAns(false);}}
              onKeyDown={e=>e.key==="Enter"&&submitAnswer()}
              placeholder="Your answer..."
              style={{
                width:"100%",padding:"14px 18px",
                background:"rgba(255,255,255,0.07)",
                border:`2px solid ${wrongAns?"#ff5555":T.glowS}`,
                borderRadius:8,color:"#fff",fontSize:20,textAlign:"center",
                outline:"none",marginBottom:10,boxSizing:"border-box",
                boxShadow:wrongAns?"0 0 15px #ff555544":`0 0 15px ${T.glowS}33`
              }}
            />
            {wrongAns&&<div style={{color:"#ff7777",fontSize:13,marginBottom:10,animation:"shake 0.3s"}}>❌  Incorrect — try again!</div>}
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <button onClick={submitAnswer} style={{flex:1,padding:"13px",background:T.glowS,color:"#000",border:"none",borderRadius:8,fontSize:15,fontWeight:"bold",cursor:"pointer",letterSpacing:2,boxShadow:`0 0 20px ${T.glowS}66`}}>
                SUBMIT
              </button>
              <button onClick={()=>setPhase("playing")} style={{padding:"13px 20px",background:"transparent",color:"rgba(255,255,255,0.45)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,fontSize:14,cursor:"pointer",letterSpacing:1}}>
                ESC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HINT MODAL ── */}
      {phase==="hint"&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.84)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
          <div style={{
            background:"linear-gradient(145deg,#141000,#1e1800)",
            border:"2px solid #ffd700",
            boxShadow:"0 0 60px #ffd70055, inset 0 0 30px rgba(0,0,0,0.4)",
            borderRadius:14,padding:"40px 48px",maxWidth:460,width:"90%",textAlign:"center"
          }}>
            <div style={{fontSize:48,marginBottom:12,animation:"bounceIn 0.5s"}}>✅</div>
            <div style={{fontSize:22,color:"#ffd700",fontWeight:"bold",marginBottom:6,letterSpacing:2,textShadow:"0 0 20px #ffd700"}}>
              CORRECT!
            </div>
            <div style={{fontSize:13,color:"rgba(255,215,0,0.6)",marginBottom:22,letterSpacing:1}}>
              Box {uiSolved} of {activeQuestions.length} solved — {activeQuestions.length-uiSolved} remaining
            </div>
            <div style={{
              fontSize:14,color:"rgba(255,255,255,0.85)",lineHeight:1.9,
              background:"rgba(255,215,0,0.06)",border:"1px solid rgba(255,215,0,0.25)",
              borderRadius:10,padding:"18px 22px",marginBottom:26,whiteSpace:"pre-line",letterSpacing:0.5
            }}>
              {hintText}
            </div>
            <button onClick={closeHint} style={{
              padding:"13px 40px",background:"#ffd700",color:"#000",border:"none",
              borderRadius:8,fontSize:15,fontWeight:"bold",cursor:"pointer",
              letterSpacing:3,boxShadow:"0 0 25px #ffd70066"
            }}>
              CONTINUE  →
            </button>
          </div>
        </div>
      )}

      {/* ── FINAL VAULT MODAL ── */}
      {phase==="final"&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)",overflowY:"auto"}}>
          <div style={{
            background:"linear-gradient(145deg,#1a1400,#221b00)",
            border:"2px solid #ffd700",
            boxShadow:"0 0 80px #ffd70066, inset 0 0 40px rgba(0,0,0,0.5)",
            borderRadius:16,padding:"38px 46px",maxWidth:500,width:"90%",textAlign:"center",margin:20
          }}>
            <div style={{fontSize:36,marginBottom:8}}>🏛️</div>
            <div style={{fontSize:22,color:"#ffd700",fontWeight:"bold",letterSpacing:3,marginBottom:4,textShadow:"0 0 25px #ffd700"}}>
              THE GOLDEN VAULT
            </div>
            <div style={{fontSize:12,color:"rgba(255,215,0,0.55)",letterSpacing:2,marginBottom:28}}>
              SOLVE THE FINAL 5 CHALLENGES TO UNLOCK
            </div>
            {vaultQuestions.map((q,i)=>(
              <div key={i} style={{marginBottom:16,textAlign:"left"}}>
                <div style={{fontSize:12,color:"rgba(255,215,0,0.75)",marginBottom:5,letterSpacing:1}}>
                  📦 BOX {i+1}  —  {q.q}
                </div>
                <input
                  type="number" value={finalAns[i]}
                  onChange={e=>setFinalAns(p=>{const n=[...p];n[i]=e.target.value;return n;})}
                  onKeyDown={e=>e.key==="Enter"&&i===4&&submitFinal()}
                  style={{
                    width:"100%",padding:"11px 16px",
                    background:"rgba(255,255,255,0.06)",
                    border:`1px solid ${finalErr[i]?"#ff5555":"rgba(255,215,0,0.35)"}`,
                    borderRadius:7,color:"#fff",fontSize:17,outline:"none",
                    boxSizing:"border-box",letterSpacing:1
                  }}
                />
                {finalErr[i]&&<div style={{color:"#ff7777",fontSize:12,marginTop:3}}>❌  Incorrect</div>}
              </div>
            ))}
            <button onClick={submitFinal} style={{
              width:"100%",marginTop:14,padding:"15px",
              background:"linear-gradient(135deg,#ffd700,#ffaa00)",
              color:"#000",border:"none",borderRadius:10,
              fontSize:16,fontWeight:"bold",cursor:"pointer",
              letterSpacing:3,boxShadow:"0 0 30px #ffd70088"
            }}>
              🔓  UNLOCK THE VAULT
            </button>
            <button onClick={()=>setPhase("playing")} style={{marginTop:10,padding:"8px",background:"transparent",color:"rgba(255,255,255,0.35)",border:"none",fontSize:12,cursor:"pointer",width:"100%",letterSpacing:1}}>
              ← BACK TO GAME
            </button>
          </div>
        </div>
      )}

      {/* ── CHAPTER COMPLETE ── */}
      {phase==="chapter_complete"&&(
        <div style={{
          position:"absolute",inset:0,zIndex:999,
          background:"radial-gradient(ellipse at center, rgba(10,5,30,0.95) 0%, #000 100%)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          animation:"fadeIn 0.5s ease"
        }}>
          <div style={{fontSize:80, marginBottom:10, animation:"bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)"}}>🍬</div>
          <div style={{
            fontSize:54,fontWeight:"bold",color:"#ff007f",
            textShadow:"0 0 20px #ff007f, 0 0 50px #ff007f",
            animation:"bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            letterSpacing:4,textAlign:"center",marginBottom:20
          }}>
            SWEET!
          </div>
          <div style={{fontSize:24,color:"#fff",animation:"fadeIn 1s 0.5s both",letterSpacing:3}}>
            CHAPTER {completedChapter} CONQUERED
          </div>
          <div style={{fontSize:20,color:"#ffd700",marginTop:10,animation:"fadeIn 1s 0.7s both",fontWeight:"bold"}}>
            SCORE: 500
          </div>
          <div style={{display:"flex", gap:20, marginTop:40, animation:"fadeIn 1s 1s both"}}>
            <button onClick={()=>{
              let s = {...saveData};
              if(!s.maxUnlocked) s.maxUnlocked = {};
              if(!s.scores) s.scores = {};
              if(!s.maxUnlocked[gameClass]) s.maxUnlocked[gameClass] = 1;
              if(!s.scores[gameClass]) s.scores[gameClass] = {};
              
              let chNum = parseInt(completedChapter);
              if(!isNaN(chNum)) {
                s.maxUnlocked[gameClass] = Math.max(s.maxUnlocked[gameClass], chNum + 1);
                s.scores[gameClass][chNum] = 500;
              }
              localStorage.setItem("treasureHuntProfile", JSON.stringify(s));
              setSaveData(s);
              setPhase("map");
            }} style={{
              padding:"18px 40px",fontSize:18,fontWeight:"bold",
              background:"transparent",color:"rgba(255,255,255,0.8)",
              border:"2px solid rgba(255,255,255,0.3)",borderRadius:40,cursor:"pointer",
              letterSpacing:2
            }}>
              🗺️ MAP
            </button>
            <button onClick={()=>{
              let s = {...saveData};
              if(!s.maxUnlocked) s.maxUnlocked = {};
              if(!s.scores) s.scores = {};
              if(!s.maxUnlocked[gameClass]) s.maxUnlocked[gameClass] = 1;
              if(!s.scores[gameClass]) s.scores[gameClass] = {};
              
              let chNum = parseInt(completedChapter);
              let nextCh = "vault";
              if(!isNaN(chNum)) {
                s.maxUnlocked[gameClass] = Math.max(s.maxUnlocked[gameClass], chNum + 1);
                s.scores[gameClass][chNum] = 500;
                
                const numCh = Object.keys(CHAPTER_QUESTIONS[gameClass]).length;
                nextCh = (chNum < numCh) ? (chNum + 1) : "vault";
              }
              localStorage.setItem("treasureHuntProfile", JSON.stringify(s));
              setSaveData(s);
              startChapter(nextCh);
            }} style={{
              padding:"18px 50px",fontSize:18,fontWeight:"bold",
              background:"linear-gradient(135deg, #ff007f, #ff00aa)",color:"#fff",
              border:"none",borderRadius:40,cursor:"pointer",boxShadow:"0 0 30px rgba(255,0,127,0.6)",
              letterSpacing:2
            }}>
              NEXT LEVEL 🚀
            </button>
          </div>
        </div>
      )}

      {/* ── WIN SCREEN ── */}
      {phase==="won"&&(
        <div style={{
          position:"absolute",inset:0,
          background:"radial-gradient(ellipse at center,#2a2000 0%,#0a0800 60%,#000 100%)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          animation:"fadeIn 0.6s ease"
        }}>
          <div style={{textAlign:"center",color:"#ffd700",padding:20}}>
            <div style={{fontSize:80,marginBottom:16,animation:"bounceLoop 0.8s ease-in-out infinite alternate"}}>🏆</div>
            <div style={{fontSize:32,fontWeight:"bold",letterSpacing:5,marginBottom:8,textShadow:"0 0 40px #ffd700"}}>
              TREASURE FOUND!
            </div>
            <div style={{fontSize:14,color:"rgba(255,215,0,0.7)",letterSpacing:3,marginBottom:32}}>
              You conquered all {activeQuestions.length} floors  •  All riddles solved
            </div>
            <div style={{
              fontSize:72,fontWeight:"bold",marginBottom:6,
              textShadow:"0 0 60px #ffd700, 0 0 120px #ffd70044",animation:"glow 1.5s ease-in-out infinite alternate"
            }}>
              {tokens}
            </div>
            <div style={{fontSize:20,letterSpacing:6,marginBottom:48,opacity:0.8}}>TOKENS EARNED</div>
            <div style={{display:"flex",gap:14,justifyContent:"center",marginBottom:48}}>
              {Array(7).fill(0).map((_,i)=>(
                <div key={i} style={{fontSize:28,animation:`coinFlip 0.8s ${i*0.1}s ease-in-out infinite`}}>🪙</div>
              ))}
            </div>
            <div style={{
              display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",
              background:"rgba(255,215,0,0.08)",border:"1px solid rgba(255,215,0,0.2)",
              borderRadius:12,padding:"16px 24px",marginBottom:36,fontSize:13,letterSpacing:2,
              color:"rgba(255,215,0,0.8)"
            }}>
              {vaultQuestions.map((q,i)=>(
                <span key={i}>Vault Lock {i+1}: <strong style={{color:"#ffd700"}}>{q.a}</strong></span>
              ))}
            </div>
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap: 15}}>
              <button onClick={()=>{
                let s = {...saveData};
                if(!s.scores) s.scores = {};
                if(!s.scores[gameClass]) s.scores[gameClass] = {};
                s.scores[gameClass]["vault"] = 1000;
                localStorage.setItem("treasureHuntProfile", JSON.stringify(s));
                setSaveData(s);
                setPhase("map");
              }} style={{
                padding:"18px 50px",
                background:"linear-gradient(135deg, #00d2ff, #3a7bd5)",
                color:"#fff",border:"none",borderRadius:40,
                fontSize:20,fontWeight:"bold",cursor:"pointer",letterSpacing:2,
                boxShadow:"0 0 30px rgba(0,210,255,0.6)"
              }}>
                🗺️ BACK TO MAP
              </button>
              
              <button onClick={playAgain} style={{
                padding:"10px 24px",
                background:"transparent",
                color:"rgba(255,215,0,0.8)",border:"1px solid rgba(255,215,0,0.5)",borderRadius:8,
                fontSize:12,fontWeight:"bold",cursor:"pointer",letterSpacing:1,
              }}>
                🔄 REPLAY VAULT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CSS ANIMATIONS ── */}
      <style>{`
        @keyframes fadeIn    { from{opacity:0}   to{opacity:1} }
        @keyframes bounceIn  { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }
        @keyframes bounceLoop{ from{transform:translateY(0)} to{transform:translateY(-20px)} }
        @keyframes glow      { from{text-shadow:0 0 40px #ffd700} to{text-shadow:0 0 80px #ffd700,0 0 160px #ffd70066} }
        @keyframes coinFlip  { 0%,100%{transform:rotateY(0) scale(1)} 50%{transform:rotateY(180deg) scale(1.2)} }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes pulseNode { 0%{transform:translate(-50%,-50%) scale(1); box-shadow: 0 0 20px #ff007f;} 50%{transform:translate(-50%,-50%) scale(1.15); box-shadow: 0 0 50px #ff007f, 0 0 100px #ff007f;} 100%{transform:translate(-50%,-50%) scale(1); box-shadow: 0 0 20px #ff007f;} }
        @keyframes floatBg   { 0%{transform:translateY(0) rotate(0deg);} 50%{transform:translateY(-20px) rotate(10deg);} 100%{transform:translateY(0) rotate(0deg);} }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input[type=number]{-moz-appearance:textfield;}
        *{box-sizing:border-box;}
      `}</style>
    </div>
  );
}
