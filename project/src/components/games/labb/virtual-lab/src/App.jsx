import { useEffect, useRef } from 'react';
import './index.css';
import { initLab } from './lab.js';

function App() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initLab();
    }
  }, []);

  // Ensure strict identical structure to original HTML
  const rawHTML = `<!-- TOP BAR -->
<div id="topbar">
  <div id="logo">Virtual<em>Lab</em></div>
  <div id="exp-status">Walk to a lab table and press E</div>
  <div id="zone-pill">Entrance</div>
</div>

<!-- DPAD -->
<div id="dpad">
  <div></div><div class="dk" id="dw">&#9650;</div><div></div>
  <div class="dk" id="da">&#9664;</div>
  <div class="dk" id="ds">&#9660;</div>
  <div class="dk" id="dd">&#9654;</div>
</div>

<div id="interact-hint">Press E to Interact</div>
<div id="notif"></div>

<!-- SCREEN HUD (projector overlay) -->
<div id="screen-hud">
  <div id="shud-header">
    <div id="shud-zone-dot"></div>
    <div id="shud-title">Experiment Screen</div>
    <div id="shud-topic">NCERT Science</div>
  </div>
  <div id="shud-body">
    <div id="shud-canvas-wrap">
      <canvas id="shud-canvas" width="520" height="320"></canvas>
    </div>
    <div id="shud-info">
      <div id="shud-step-label">CURRENT STEP</div>
      <div id="shud-step-text">Walk near the projector screen to see the live demo</div>
      <div id="shud-progress"></div>
    </div>
  </div>
  <div id="shud-footer">
    <div id="shud-hint">Live experiment demo</div>
    <div id="shud-cycle-bar-wrap"><div id="shud-cycle-bar"></div></div>
    <div id="shud-auto-label">AUTO DEMO</div>
  </div>
</div>

<div id="table-preview-label"></div>

<!-- SIDE PANEL -->
<div id="panel">
  <div id="panel-inner">
    <div id="pcls"><span class="ptitle" id="ptitle">Lab</span><button id="pcls-btn">X Close</button></div>
    <div class="psub" id="psub">SELECT EXPERIMENT</div>
    <div id="p-filters" class="filter-row" style="display:none;"></div>
    <div id="p-explist"></div>
    <div id="p-apparatus" style="display:none">
      <div style="font-size:10px;color:rgba(255,255,255,0.35);margin-bottom:6px;">Click each item to collect from cabinet</div>
      <div class="app-grid" id="app-grid"></div>
      <div class="pbar"><div class="pfill" id="app-fill" style="width:0%"></div></div>
      <div style="font-size:10px;color:rgba(255,255,255,0.35);text-align:right;" id="app-count">0/0</div>
    </div>
    <div id="p-steps" style="display:none">
      <div id="steps-list"></div>
      <div class="pbar"><div class="pfill" id="step-fill" style="width:0%"></div></div>
      <div class="nav-row">
        <button class="btn2" id="btn-prev" style="flex:1">Prev</button>
        <button class="btn1" id="btn-next" style="flex:2">Next Step</button>
      </div>
      <button class="btn2" id="btn-reset">Restart Experiment</button>
    </div>
    <div id="outcome">
      <div class="ot">Experiment Complete!</div>
      <div class="ob" id="outcome-txt"></div>
    </div>
  </div>
</div>

<!-- MINIMAP -->
<div id="mm"><canvas id="mmc" width="108" height="108"></canvas></div>`;

  return (
    <div dangerouslySetInnerHTML={{ __html: rawHTML }} />
  );
}

export default App;
