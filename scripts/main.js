/* RetroBoard + Nebula Workspace main.js */

import { typeEffect, randomFlicker } from "./utils.js";
import { initUI } from "./ui.js";
import { initWidgets } from "./widgets.js";
import { loadSettings } from "./settings.js";
import { restoreLayout } from "./storage.js";

(() => {
  const STORE_KEY = 'nebula:v1';
  const stage = document.getElementById('stage');
  const btnAdd = document.getElementById('btn-add');
  const btnTheme = document.getElementById('btn-theme');
  const menu = document.getElementById('widget-menu');
  const menuList = document.getElementById('menu-list');
  const fileInput = document.getElementById('file-input');
  const btnImport = document.getElementById('btn-import');
  const btnExport = document.getElementById('btn-export');
  const palette = document.getElementById('palette');
  const paletteSearch = document.getElementById('palette-search');
  const paletteList = document.getElementById('palette-list');

  window.Nebula = {
    widgetsRegistry: {},
    layout: { widgets: [], theme: 'green' },
    registerWidget: function(widget){
      this.widgetsRegistry[widget.id] = widget;
      // add to menu UI
      const row = document.createElement('div');
      row.className = 'menu-item';
      row.innerHTML = `<div style="padding:8px;cursor:pointer;border-radius:8px">${widget.name}</div>`;
      row.onclick = ()=>{ addWidget(widget.id); hideMenu(); };
      menuList.appendChild(row);

      // palette entry
      const pi = document.createElement('div');
      pi.className = 'item';
      pi.textContent = widget.name + ' — ' + widget.id;
      pi.onclick = ()=>{ addWidget(widget.id); hidePalette(); };
      paletteList.appendChild(pi);
    },
    save: function(){ localStorage.setItem(STORE_KEY, JSON.stringify(this.layout)); },
    load: function(){
      const raw = localStorage.getItem(STORE_KEY);
      if(raw){ try { this.layout = JSON.parse(raw); } catch(e){ console.warn('load fail',e); } }
    }
  };

  // load saved layout
  Nebula.load();

  // Set theme immediately for RetroBoard
  const savedTheme = Nebula.layout.theme || 'green';
  document.body.setAttribute('data-theme', savedTheme);
  if(document.getElementById('theme')) document.getElementById('theme').value = savedTheme;

  // -------------------
  // Boot animation
  // -------------------
  async function bootAnimation() {
    const container = document.querySelector(".main");
    container.innerHTML = "";
    const bootMessages = [
      "Initializing RetroBoard v1.0...",
      "Loading kernel modules...",
      "Checking system integrity...",
      "Activating terminal interface...",
      "Welcome, Operator."
    ];
    for (let msg of bootMessages) {
      const line = document.createElement("div");
      line.className = "boot-line";
      container.appendChild(line);
      await typeLine(line, msg, 50);
      await wait(300);
    }

    container.querySelectorAll(".boot-line").forEach(line => {
      setInterval(() => randomFlicker(line), 200);
    });

    await wait(800);
    container.innerHTML = ""; // clear boot text
  }

  // -------------------
  // Widget logic
  // -------------------
  function renderAll(){
    stage.innerHTML = '';
    (Nebula.layout.widgets || []).forEach(w => {
      createWidgetEl(w);
    });
  }

  function createWidgetEl(cfg){
    const def = Nebula.widgetsRegistry[cfg.id];
    if(!def) return;
    const el = document.createElement('div');
    el.className = 'widget';
    el.style.left = cfg.x + 'px';
    el.style.top = cfg.y + 'px';
    el.style.width = cfg.w + 'px';
    el.style.height = cfg.h + 'px';
    el.dataset.wid = cfg.instanceId || cfg.id + ':' + Date.now();

    const title = document.createElement('div');
    title.className = 'title';
    title.innerHTML = `<div class="handle">${def.name}</div>
      <div class="actions">
        <button class="btn-close" title="remove">✕</button>
      </div>`;

    const content = document.createElement('div');
    content.className = 'content';

    el.appendChild(title);
    el.appendChild(content);

    const grip = document.createElement('div');
    grip.className = 'grip';
    el.appendChild(grip);

    stage.appendChild(el);

    // wire up widget render
    try{ def.render(content, cfg.settings || {}, saveInstanceCfg.bind(null, el, cfg)); }
    catch(e){ content.textContent = 'render error'; console.error(e); }

    // events: close
    title.querySelector('.btn-close').onclick = () => {
      removeWidget(cfg.instanceId);
    };

    // drag
    makeDraggable(el, title.querySelector('.handle'));

    // resize
    makeResizable(el, grip);

    return el;
  }

  function saveInstanceCfg(el, cfg){
    const idx = Nebula.layout.widgets.findIndex(it => it.instanceId === cfg.instanceId);
    if(idx >= 0){
      Nebula.layout.widgets[idx] = Object.assign({}, cfg, {
        x: el.offsetLeft,
        y: el.offsetTop,
        w: el.offsetWidth,
        h: el.offsetHeight
      });
      Nebula.save();
    }
  }

  function addWidget(id){
    const def = Nebula.widgetsRegistry[id];
    if(!def) return;
    const base = def.defaultConfig || { x:50, y:50, w:320, h:180 };
    const instanceId = id + ':' + Date.now();
    const cfg = { id, instanceId, x: base.x, y: base.y, w: base.w, h: base.h, settings: def.defaultSettings || {} };
    Nebula.layout.widgets.push(cfg);
    Nebula.save();
    createWidgetEl(cfg);
  }

  function removeWidget(instanceId){
    Nebula.layout.widgets = Nebula.layout.widgets.filter(w => w.instanceId !== instanceId);
    Nebula.save();
    renderAll();
  }

  // -------------------
  // Drag & Resize helpers
  // -------------------
  function makeDraggable(el, handle){
    handle.addEventListener('pointerdown', startDrag);
    let startX, startY, origX, origY, dragging=false;
    function startDrag(e){
      dragging = true;
      el.setPointerCapture(e.pointerId);
      startX = e.clientX; startY = e.clientY;
      origX = el.offsetLeft; origY = el.offsetTop;
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp, { once:true });
    }
    function onMove(e){
      if(!dragging) return;
      let nx = origX + (e.clientX - startX);
      let ny = origY + (e.clientY - startY);
      nx = Math.max(6, nx); ny = Math.max(6, ny);
      el.style.left = nx + 'px';
      el.style.top = ny + 'px';
    }
    function onUp(e){
      dragging=false;
      document.removeEventListener('pointermove', onMove);
      const cfg = Nebula.layout.widgets.find(w => w.instanceId === el.dataset.wid);
      if(cfg){ cfg.x = el.offsetLeft; cfg.y = el.offsetTop; Nebula.save(); }
    }
  }

  function makeResizable(el, grip){
    grip.addEventListener('pointerdown', startResize);
    let startW, startH, startX, startY;
    function startResize(e){
      e.stopPropagation();
      el.setPointerCapture(e.pointerId);
      startW = el.offsetWidth; startH = el.offsetHeight;
      startX = e.clientX; startY = e.clientY;
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp, { once:true });
    }
    function onMove(e){
      const nw = Math.max(160, startW + (e.clientX - startX));
      const nh = Math.max(80, startH + (e.clientY - startY));
      el.style.width = nw + 'px';
      el.style.height = nh + 'px';
    }
    function onUp(e){
      document.removeEventListener('pointermove', onMove);
      const cfg = Nebula.layout.widgets.find(w => w.instanceId === el.dataset.wid);
      if(cfg){ cfg.w = el.offsetWidth; cfg.h = el.offsetHeight; Nebula.save(); }
    }
  }

  // -------------------
  // Menu & Palette
  // -------------------
  function showMenu(){ menu.classList.remove('hidden'); }
  function hideMenu(){ menu.classList.add('hidden'); }

  btnAdd.onclick = () => { menu.classList.contains('hidden') ? showMenu() : hideMenu(); };

  function showPalette(){ palette.classList.remove('hidden'); paletteSearch.focus(); }
  function hidePalette(){ palette.classList.add('hidden'); paletteSearch.value=''; }

  document.addEventListener('keydown', (e)=>{
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); showPalette(); }
    if(e.key === 'Escape'){ hideMenu(); hidePalette(); }
  });

  paletteSearch.addEventListener('input', ()=>{
    const q = paletteSearch.value.toLowerCase();
    Array.from(paletteList.children).forEach(item=>{
      item.style.display = item.textContent.toLowerCase().includes(q) ? 'block' : 'none';
    });
  });

  // -------------------
  // Theme toggle
  // -------------------
  btnTheme.onclick = () => {
    const current = document.body.getAttribute('data-theme');
    let next;
    if(current==='green') next='amber';
    else if(current==='amber') next='cyan';
    else next='green';
    document.body.setAttribute('data-theme', next);
    Nebula.layout.theme = next;
    Nebula.save();
    if(document.getElementById('theme')) document.getElementById('theme').value = next;
  };

  // -------------------
  // Import / Export
  // -------------------
  btnExport.onclick = () => {
    const blob = new Blob([JSON.stringify(Nebula.layout,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'retroboard-layout.json';
    a.click(); URL.revokeObjectURL(url);
  };

  btnImport.onclick = ()=> fileInput.click();
  fileInput.onchange = (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=> {
      try{
        Nebula.layout = JSON.parse(reader.result);
        Nebula.save();
        renderAll();
        alert('Imported layout');
      }catch(err){ alert('Import failed'); }
    };
    reader.readAsText(f);
  };

  // -------------------
  // Init
  // -------------------
  async function init(){
    await bootAnimation();
    renderAll();
    initUI();
    initWidgets();
  }

  init();

  // expose helper for widgets
  window.__nebulaSaveInstance = saveInstanceCfg;

})();

// -------------------
// Boot helpers
// -------------------
function wait(ms){ return new Promise(resolve=>setTimeout(resolve, ms)); }
function typeLine(el, text, speed){
  return new Promise(resolve=>{
    typeEffect(el,text,speed);
    setTimeout(resolve,text.length*speed+50);
  });
}
