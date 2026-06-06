// ═══════════════════════════════════════
// DATA MANAGEMENT
// ═══════════════════════════════════════
let allRows = [];
let filteredRows = [];
let searchKW = '';
let file1Data = null; // File 1 (Detail Data)
let file2Data = null; // File 2 (RFT Report Wide)

// ═══════════════════════════════════════
// MERGE FILE 1 + FILE 2 DATA
// ═══════════════════════════════════════
function mergeFiles() {
  if (!file1Data && !file2Data) {
    // Không có data gì cả
    return;
  }
  
  if (file1Data && !file2Data) {
    // Chỉ có File 1 → dùng như cũ
    allRows = file1Data.slice();
    filteredRows = allRows.slice();
    return;
  }
  
  if (!file1Data && file2Data) {
    // Chỉ có File 2 → convert File 2 sang định dạng allRows
    allRows = file2Data.map(function(f2) {
      const released = f2.inspected - f2.defect;
      return {
        date: new Date().toISOString().slice(0, 10),
        lean: f2.lean,
        model: 'From File 2',
        inspected: f2.inspected,
        released: released,
        defects: f2.defect,
        rft: f2.rft,
        d1n: '', d1q: 0,
        d2n: '', d2q: 0,
        d3n: '', d3q: 0
      };
    });
    filteredRows = allRows.slice();
    return;
  }
  
  // Có cả File 1 và File 2 → Merge
  // Strategy: Lấy File 2 làm base (có RFT + Top defects chính xác), bổ sung Model từ File 1
  const mergedRows = [];
  
  file2Data.forEach(function(f2) {
    // Tìm tất cả records trong File 1 có cùng LEAN
    const f1Records = file1Data.filter(x => x.lean === f2.lean);
    
    if (f1Records.length === 0) {
      // Không có File 1 data cho LEAN này → dùng File 2 thôi
      const topDefects = [f2.top1, f2.top2, f2.top3].filter(d => d !== null);
      topDefects.forEach(function(d, idx) {
        mergedRows.push({
          date: new Date().toISOString().slice(0, 10),
          lean: f2.lean,
          model: '(No model info)',
          inspected: Math.round(f2.inspected / Math.max(topDefects.length, 1)),
          released: Math.round((f2.inspected - f2.defect) / Math.max(topDefects.length, 1)),
          defects: Math.round(f2.defect / Math.max(topDefects.length, 1)),
          rft: f2.rft,
          d1n: d.name || '',
          d1q: Math.round(f2.defect * d.pct / 100),
          d2n: '', d2q: 0,
          d3n: '', d3q: 0
        });
      });
    } else {
      // Có File 1 data → tạo row cho mỗi model trong LEAN
      // Dùng top defects từ File 2 thay vì File 1
      f1Records.forEach(function(f1) {
        // Tính tỷ lệ của model này trong tổng inspected của LEAN
        const totalF1Inspected = f1Records.reduce((s, r) => s + r.inspected, 0);
        const modelRatio = totalF1Inspected > 0 ? (f1.inspected / totalF1Inspected) : (1 / f1Records.length);
        
        // Phân bổ số liệu từ File 2 theo tỷ lệ
        const inspected = Math.round(f2.inspected * modelRatio);
        const defects = Math.round(f2.defect * modelRatio);
        const released = inspected - defects;
        
        // Lấy top defects từ File 2 (có mã lỗi)
        const topDefects = [f2.top1, f2.top2, f2.top3].filter(d => d !== null);
        
        mergedRows.push({
          date: f1.date,
          lean: f2.lean,
          model: f1.model,
          inspected: inspected,
          released: released,
          defects: defects,
          rft: f2.rft, // Dùng RFT từ File 2 (chính xác)
          d1n: topDefects[0] ? topDefects[0].name : '',
          d1q: topDefects[0] ? Math.round(defects * topDefects[0].pct / 100) : 0,
          d2n: topDefects[1] ? topDefects[1].name : '',
          d2q: topDefects[1] ? Math.round(defects * topDefects[1].pct / 100) : 0,
          d3n: topDefects[2] ? topDefects[2].name : '',
          d3q: topDefects[2] ? Math.round(defects * topDefects[2].pct / 100) : 0
        });
      });
    }
  });
  
  allRows = mergedRows;
  filteredRows = allRows.slice();
}

// ═══════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════
function loadSample() {
  // Sample data theo format FILE 1 (raw data)
  allRows = [
    {date:'2026-06-03', lean:'GCD_C1', model:'BELIEVE THAT 1 J', inspected:1447, released:1140, defects:307, rft:78.78, d1n:'Soiling', d1q:158, d2n:'Bottom part bonding', d2q:149, d3n:'', d3q:0},
    {date:'2026-06-03', lean:'GCD_C2', model:'BELIEVE THAT 1', inspected:219, released:149, defects:70, rft:68.04, d1n:'Soiling', d1q:40, d2n:'Bottom part bonding', d2q:22, d3n:'Symmetry / Alignment', d3q:8},
    {date:'2026-06-03', lean:'GCD_C2', model:'ADIDAS INITIATION', inspected:446, released:308, defects:138, rft:69.06, d1n:'Soiling', d1q:72, d2n:'Bottom part bonding', d2q:63, d3n:'Symmetry / Alignment', d3q:3},
    {date:'2026-06-03', lean:'GCD_C3', model:'CRAZY ENERGY', inspected:245, released:235, defects:10, rft:95.92, d1n:'Soiling', d1q:6, d2n:'Bottom part bonding', d2q:4, d3n:'', d3q:0},
    {date:'2026-06-03', lean:'GCD_C3', model:'CRAZY ENERGY DDLM', inspected:651, released:635, defects:16, rft:97.54, d1n:'Soiling', d1q:10, d2n:'Bottom part bonding', d2q:6, d3n:'', d3q:0},
    {date:'2026-06-03', lean:'GCD_C4', model:'ADISTAR CONTROL 5 W', inspected:318, released:250, defects:68, rft:78.62, d1n:'Soiling', d1q:35, d2n:'Bottom part bonding', d2q:33, d3n:'', d3q:0},
    {date:'2026-06-03', lean:'GCD_C5', model:'BELIEVE THAT 1 J', inspected:517, released:311, defects:206, rft:60.15, d1n:'Soiling', d1q:159, d2n:'Bottom part bonding', d2q:47, d3n:'', d3q:0},
    {date:'2026-06-03', lean:'GCD_C6', model:'BELIEVE THAT 1 C', inspected:1215, released:859, defects:356, rft:70.70, d1n:'Soiling', d1q:158, d2n:'Bottom part bonding', d2q:121, d3n:'Wrong part / component', d3q:77},
  ];
  
  filteredRows = [...allRows];
  populateFilters();
  renderAll();
  showTab('tab-dashboard');
  ulog(t('sampleLoaded') + ': ' + allRows.length + ' ' + t('dtCount'));
}

// ═══════════════════════════════════════
// FILTERS + SEARCH
// ═══════════════════════════════════════
function populateFilters() {
  const lines = [...new Set(allRows.map(r => r.lean))].sort();
  const models = [...new Set(allRows.map(r => r.model))].sort();
  const lSel = document.getElementById('f-line');
  const mSel = document.getElementById('f-model');
  const lv = lSel.value, mv = mSel.value;
  lSel.innerHTML = '<option value="">' + t('fAll') + '</option>' + lines.map(l => '<option value="' + l + '">' + l + '</option>').join('');
  mSel.innerHTML = '<option value="">' + t('fAll') + '</option>' + models.map(m => '<option value="' + m + '">' + m + '</option>').join('');
  if (lv) lSel.value = lv;
  if (mv) mSel.value = mv;
}

function applyFilter() {
  const from = document.getElementById('f-from').value;
  const to = document.getElementById('f-to').value;
  const line = document.getElementById('f-line').value;
  const model = document.getElementById('f-model').value;
  searchKW = document.getElementById('f-search').value.trim().toLowerCase();

  filteredRows = allRows.filter(function(r) {
    if (from && r.date < from) return false;
    if (to && r.date > to) return false;
    if (line && r.lean !== line) return false;
    if (model && r.model !== model) return false;
    if (searchKW) {
      const haystack = [r.lean, r.model, r.d1n, r.d2n, r.d3n, r.date].join(' ').toLowerCase();
      if (!haystack.includes(searchKW)) return false;
    }
    return true;
  });

  const badge = searchKW ? '<span class="search-badge">🔍 "' + searchKW + '" — ' + filteredRows.length + ' ' + t('fResults') + '</span>' : '';
  document.getElementById('fstatus').innerHTML = t('fFiltering') + ': ' + filteredRows.length + '/' + allRows.length + ' ' + t('fRows') + badge;
  renderAll();
}

function clearFilter() {
  ['f-from', 'f-to', 'f-search'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('f-line').value = '';
  document.getElementById('f-model').value = '';
  searchKW = '';
  filteredRows = allRows.slice();
  document.getElementById('fstatus').textContent = '';
  renderAll();
}

function hlText(txt) {
  if (!searchKW || !txt) return txt || '';
  const re = new RegExp('(' + searchKW.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return String(txt).replace(re, '<span class="hl">$1</span>');
}

// ═══════════════════════════════════════
// COMPUTE - AGGREGATE THEO LEAN
// ═══════════════════════════════════════
function compute(rows) {
  if (!rows || !rows.length) return null;
  
  // Tổng toàn bộ
  const totalI = rows.reduce((s, r) => s + r.inspected, 0);
  const totalD = rows.reduce((s, r) => s + r.defects, 0);
  const totalR = totalI - totalD;
  const rft = totalI > 0 ? (totalR / totalI * 100) : 0;
  const dr = totalI > 0 ? (totalD / totalI * 100) : 0;

  // Aggregate theo LEAN
  const lm = {};
  rows.forEach(function(r) {
    if (!lm[r.lean]) lm[r.lean] = {lean: r.lean, models: new Set(), i: 0, d: 0, dm: {}};
    const l = lm[r.lean];
    l.models.add(r.model);
    l.i += r.inspected;
    l.d += r.defects;
    [[r.d1n, r.d1q], [r.d2n, r.d2q], [r.d3n, r.d3q]].forEach(function(p) {
      if (p[0] && p[1] > 0) l.dm[p[0]] = (l.dm[p[0]] || 0) + p[1];
    });
  });

  const lineArr = Object.values(lm).map(function(l) {
    const released = l.i - l.d;
    const rft = l.i > 0 ? (released / l.i * 100) : 0;
    const dr = l.i > 0 ? (l.d / l.i * 100) : 0;
    
    // Top 3 defects với % trong tổng kiểm của line
    const topD = Object.entries(l.dm)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(function(e) {
        const pct = l.i > 0 ? (e[1] / l.i * 100) : 0;
        return {name: e[0], qty: e[1], pct: pct};
      });

    return {
      lean: l.lean,
      models: [...l.models].join(', '),
      inspected: l.i,
      released: released,
      defects: l.d,
      rft: rft,
      dr: dr,
      topD: topD
    };
  }).sort((a, b) => b.rft - a.rft);

  // Aggregate theo Model
  const mm = {};
  rows.forEach(function(r) {
    if (!mm[r.model]) mm[r.model] = {model: r.model, i: 0, d: 0};
    mm[r.model].i += r.inspected;
    mm[r.model].d += r.defects;
  });

  const modelArr = Object.values(mm).map(function(m) {
    const released = m.i - m.d;
    return {
      model: m.model,
      inspected: m.i,
      released: released,
      defects: m.d,
      rft: m.i > 0 ? (released / m.i * 100) : 0,
      dr: m.i > 0 ? (m.d / m.i * 100) : 0
    };
  }).sort((a, b) => b.rft - a.rft);

  // Defects tổng hợp
  const dm2 = {};
  rows.forEach(function(r) {
    [[r.d1n, r.d1q], [r.d2n, r.d2q], [r.d3n, r.d3q]].forEach(function(p) {
      if (p[0] && p[1] > 0) dm2[p[0]] = (dm2[p[0]] || 0) + p[1];
    });
  });

  const dArr = Object.entries(dm2).sort((a, b) => b[1] - a[1]).map(function(e) {
    return {name: e[0], qty: e[1]};
  });

  let cum = 0, tot = dArr.reduce((s, d) => s + d.qty, 0);
  dArr.forEach(function(d) {
    cum += d.qty;
    d.cumPct = tot > 0 ? cum / tot * 100 : 0;
    d.pct = tot > 0 ? d.qty / tot * 100 : 0;
    d.rate = totalI > 0 ? d.qty / totalI * 100 : 0;
  });

  return {totalI, totalD, totalR, rft, dr, lineArr, modelArr, dArr, rows};
}

// ═══════════════════════════════════════
// TABLE ACTIONS
// ═══════════════════════════════════════
function delRow(i) {
  filteredRows.splice(i, 1);
  allRows = filteredRows.slice();
  renderAll();
  renderTable();
}

function clearAll() {
  if (confirm(t('confirmClear'))) {
    allRows = [];
    filteredRows = [];
    renderAll();
    renderTable();
  }
}

function ulog(msg) {
  const el = document.getElementById('upload-log1');
  if (el) el.innerHTML = '<span>' + msg + '</span><br>' + el.innerHTML;
}
