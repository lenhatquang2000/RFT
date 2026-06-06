// ═══════════════════════════════════════
// MAIN - INITIALIZATION & TAB CONTROL
// ═══════════════════════════════════════

function showTab(id) {
  ['tab-dashboard', 'tab-data', 'tab-pivot', 'tab-upload'].forEach(t => {
    const tabEl = document.getElementById(t);
    const panelEl = document.getElementById('panel-' + t.replace('tab-', ''));
    if (tabEl) tabEl.classList.toggle('active', t === id);
    if (panelEl) panelEl.classList.toggle('active', t === id);
  });
  if (id === 'tab-data') renderTable();
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
setupFile();
applyLang();
// loadSample(); // Uncomment to auto-load sample data
