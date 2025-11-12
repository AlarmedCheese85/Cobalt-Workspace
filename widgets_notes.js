// Notes widget
(function(){
  const widget = {
    id: 'notes',
    name: 'Notes',
    defaultConfig: { x: 30, y: 30, w: 360, h: 220 },
    defaultSettings: { text: '' },
    render: function(container, settings, updateCallback){
      container.innerHTML = '';
      const ta = document.createElement('textarea');
      ta.style.width = '100%';
      ta.style.height = '100%';
      ta.style.background = 'transparent';
      ta.style.border = '0';
      ta.style.color = 'inherit';
      ta.style.resize = 'none';
      ta.style.fontSize = '14px';
      ta.value = settings.text || '';
      container.appendChild(ta);

      // autosave on input
      ta.addEventListener('input', ()=>{
        settings.text = ta.value;
        // supply the widget's cfg via parent's handler by searching DOM
        // find parent .widget element
        const wEl = container.closest('.widget');
        const id = wEl.dataset.wid;
        const layout = JSON.parse(localStorage.getItem('nebula:v1') || '{}');
        const idx = (layout.widgets||[]).findIndex(it => it.instanceId === id);
        if(idx>=0){ layout.widgets[idx].settings = settings; localStorage.setItem('nebula:v1', JSON.stringify(layout)); }
      });
    }
  };
  window.Nebula && window.Nebula.registerWidget(widget);
})();
