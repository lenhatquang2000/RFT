// ═══════════════════════════════════════
// FILE UPLOAD & MANUAL ADD
// ═══════════════════════════════════════

function setupFile() {
  // File 1 (Detail)
  const f1 = document.getElementById('fileInput1');
  if (f1) f1.addEventListener('change', e => { if (e.target.files[0]) readFile1(e.target.files[0]); });
  
  // File 2 (RFT Report Wide)
  const f2 = document.getElementById('fileInput2');
  if (f2) f2.addEventListener('change', e => { if (e.target.files[0]) readFile2(e.target.files[0]); });
  
  // Topbar upload (default to File 1)
  const ft = document.getElementById('fileInput');
  if (ft) ft.addEventListener('change', e => { if (e.target.files[0]) readFile1(e.target.files[0]); });
  
  // Drag & drop for zone 1
  const zone1 = document.getElementById('uploadZone1');
  if (zone1) {
    zone1.addEventListener('dragover', e => { e.preventDefault(); zone1.classList.add('drag'); });
    zone1.addEventListener('dragleave', () => zone1.classList.remove('drag'));
    zone1.addEventListener('drop', e => {
      e.preventDefault();
      zone1.classList.remove('drag');
      if (e.dataTransfer.files[0]) readFile1(e.dataTransfer.files[0]);
    });
  }
  
  // Drag & drop for zone 2
  const zone2 = document.getElementById('uploadZone2');
  if (zone2) {
    zone2.addEventListener('dragover', e => { e.preventDefault(); zone2.classList.add('drag'); });
    zone2.addEventListener('dragleave', () => zone2.classList.remove('drag'));
    zone2.addEventListener('drop', e => {
      e.preventDefault();
      zone2.classList.remove('drag');
      if (e.dataTransfer.files[0]) readFile2(e.dataTransfer.files[0]);
    });
  }
}

// ═══════════════════════════════════════
// READ FILE 1 - DETAIL DATA
// ═══════════════════════════════════════
function readFile1(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const wb = XLSX.read(e.target.result, {type: 'binary'});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, {defval: ''});
      const imported = [];

      json.forEach(function(r) {
        // Parse date
        let date = r['QcDate'] || r['Date'] || r['date'] || r['Ngày'] || '';
        if (!date) {
          date = new Date().toISOString().slice(0, 10);
        } else if (typeof date === 'number') {
          date = new Date(Math.round((date - 25569) * 86400 * 1000)).toISOString().slice(0, 10);
        } else {
          date = String(date).slice(0, 10);
        }

        // Parse numbers
        const inspected = parseInt(r['Total inspect Qty'] || r['Inspected Qty'] || 0);
        const released = parseInt(r['Total released Qty'] || r['Released Qty'] || 0);
        const defects = parseInt(r['Total defect Qty'] || r['Defect Qty'] || 0);
        
        // Parse RFT
        const rftStr = String(r['% RFT'] || r['RFT'] || '0').replace('%', '').trim();
        let rft = parseFloat(rftStr) || 0;
        
        // Auto-calculate RFT if missing
        if (!rft && inspected > 0) {
          rft = ((inspected - defects) / inspected * 100);
        }

        // Parse defects
        const d1q = parseInt(r['Top 1 defect QTY'] || 0);
        const d2q = parseInt(r['Top 2 defect QTY'] || 0);
        const d3q = parseInt(r['Top 3 defect QTY'] || 0);

        const row = {
          date: date,
          lean: String(r['LEAN'] || '').trim(),
          model: String(r['Model'] || r['Article'] || '').trim(),
          inspected: inspected > 0 ? inspected : (released + defects),
          released: released > 0 ? released : (inspected - defects),
          defects: defects,
          rft: rft,
          d1n: String(r['1. DFname'] || r['Top 1 Defect'] || '').trim(),
          d1q: d1q,
          d2n: String(r['2. DFname'] || r['Top 2 Defect'] || '').trim(),
          d2q: d2q,
          d3n: String(r['3. DFname'] || r['Top 3 Defect'] || '').trim(),
          d3q: d3q
        };

        imported.push(row);
      });

      file1Data = imported;
      ulog1('✅ File 1: ' + imported.length + ' records từ "' + file.name + '"');
      
      // Merge và render
      mergeFiles();
      populateFilters();
      renderAll();
      compareFiles();
    } catch (err) {
      ulog1('❌ Lỗi đọc file: ' + err.message);
      Swal.fire('❌ Lỗi', 'Lỗi đọc file: ' + err.message, 'error');
    }
  };
  reader.readAsBinaryString(file);
}

// ═══════════════════════════════════════
// READ FILE 2 - RFT REPORT (WIDE FORMAT)
// ═══════════════════════════════════════
function readFile2(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const wb = XLSX.read(e.target.result, {type: 'binary'});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, {header: 1, defval: ''});
      
      // Find header row (contains LEAN columns)
      let headerIdx = -1;
      let leanColumns = [];
      for (let i = 0; i < data.length && i < 5; i++) {
        if (data[i][1] === 'LEAN' || String(data[i][1]).includes('LEAN')) {
          headerIdx = i;
          leanColumns = data[i].slice(2); // Skip first 2 columns
          break;
        }
      }
      
      if (headerIdx === -1) {
        ulog2('❌ Không tìm thấy header LEAN trong file');
        Swal.fire('❌ Lỗi', 'Không tìm thấy header LEAN trong file', 'error');
        return;
      }
      
      // Find data rows
      let inspectedRow = null, defectRow = null, rftRow = null;
      let top1Row = null, top2Row = null, top3Row = null;
      
      for (let i = headerIdx + 1; i < data.length; i++) {
        const label = String(data[i][1]).toLowerCase();
        if (label.includes('inspect') || label.includes('kiểm')) {
          inspectedRow = data[i].slice(2);
        } else if (label.includes('defect') && label.includes('qty')) {
          defectRow = data[i].slice(2);
        } else if (label === 'rft' || (label.includes('rft') && !label.includes('defect'))) {
          rftRow = data[i].slice(2);
        } else if (label.includes('top 1') || label.includes('lỗi 1')) {
          top1Row = data[i].slice(2);
        } else if (label.includes('top 2') || label.includes('lỗi 2')) {
          top2Row = data[i].slice(2);
        } else if (label.includes('top 3') || label.includes('lỗi 3')) {
          top3Row = data[i].slice(2);
        }
      }
      
      // Build File 2 data structure
      const f2Data = [];
      leanColumns.forEach(function(lean, idx) {
        const leanStr = String(lean).trim();
        if (!leanStr || leanStr === 'TOTAL') return;
        
        const inspected = parseInt(inspectedRow ? inspectedRow[idx] : 0) || 0;
        const defect = parseInt(defectRow ? defectRow[idx] : 0) || 0;
        const rftStr = String(rftRow ? rftRow[idx] : '0').replace('%', '').trim();
        const rft = parseFloat(rftStr) || 0;
        
        // Parse top defects (format: "48.53%\n41.10.1.A\nBONDING GAP\nHO KEO")
        const parseDefect = function(cell) {
          if (!cell || cell === '-') return null;
          const str = String(cell);
          const lines = str.split('\n').map(s => s.trim()).filter(s => s);
          if (lines.length < 3) return null;
          
          const pct = parseFloat(lines[0].replace('%', '')) || 0;
          const code = lines[1] || '';
          const nameEN = lines[2] || '';
          const nameVI = lines[3] || '';
          
          return {
            code: code,
            nameEN: nameEN,
            nameVI: nameVI,
            name: code + ' - ' + nameEN, // Combined for display
            pct: pct
          };
        };
        
        const top1 = parseDefect(top1Row ? top1Row[idx] : null);
        const top2 = parseDefect(top2Row ? top2Row[idx] : null);
        const top3 = parseDefect(top3Row ? top3Row[idx] : null);
        
        if (inspected > 0) {
          f2Data.push({
            lean: leanStr,
            inspected: inspected,
            defect: defect,
            rft: rft,
            top1: top1,
            top2: top2,
            top3: top3
          });
        }
      });
      
      file2Data = f2Data;
      ulog2('✅ File 2: ' + f2Data.length + ' lines từ "' + file.name + '"');
      
      // Merge và render
      mergeFiles();
      populateFilters();
      renderAll();
      compareFiles();
    } catch (err) {
      ulog2('❌ Lỗi đọc file: ' + err.message);
      Swal.fire('❌ Lỗi', 'Lỗi đọc file: ' + err.message, 'error');
    }
  };
  reader.readAsBinaryString(file);
}

// ═══════════════════════════════════════
// COMPARE FILE 1 vs FILE 2
// ═══════════════════════════════════════
function compareFiles() {
  const resultDiv = document.getElementById('comparison-result');
  if (!resultDiv) return;
  
  if (!file1Data || !file2Data) {
    resultDiv.innerHTML = '<p style="text-align:center;padding:20px 0;color:var(--tx3);font-size:9px">Upload cả 2 file để xem tổng hợp</p>';
    return;
  }
  
  // Build LEAN → Models mapping from File 1
  const leanToModels = {};
  file1Data.forEach(function(r) {
    if (!leanToModels[r.lean]) {
      leanToModels[r.lean] = new Set();
    }
    leanToModels[r.lean].add(r.model);
  });
  
  // Build combined data: File2[LEAN] + Models from File1
  const combinedData = [];
  file2Data.forEach(function(f2) {
    const models = leanToModels[f2.lean] ? Array.from(leanToModels[f2.lean]).join(', ') : '—';
    const released = f2.inspected - f2.defect;
    const defectPct = f2.inspected > 0 ? (f2.defect / f2.inspected * 100) : 0;
    
    // Get top defects from File 1 for this LEAN
    const f1Records = file1Data.filter(x => x.lean === f2.lean);
    const defectMap = {};
    f1Records.forEach(function(r) {
      [[r.d1n, r.d1q], [r.d2n, r.d2q], [r.d3n, r.d3q]].forEach(function(d) {
        if (d[0] && d[1] > 0) {
          defectMap[d[0]] = (defectMap[d[0]] || 0) + d[1];
        }
      });
    });
    
    const topDefects = Object.entries(defectMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(function(e) {
        const pct = f2.inspected > 0 ? (e[1] / f2.inspected * 100) : 0;
        return {name: e[0], qty: e[1], pct: pct};
      });
    
    combinedData.push({
      lean: f2.lean,
      models: models,
      inspected: f2.inspected,
      defects: f2.defect,
      released: released,
      rft: f2.rft,
      defectPct: defectPct,
      topD: topDefects
    });
  });
  
  // Render combined table
  let html = '<div style="max-height:400px;overflow-y:auto;">';
  html += '<table style="width:100%;font-size:8px;border-collapse:collapse;">';
  html += '<thead style="position:sticky;top:0;background:var(--bg2);z-index:1">';
  html += '<tr style="border-bottom:2px solid var(--divider)">';
  html += '<th style="padding:6px 4px;text-align:left;font-weight:700;min-width:60px">LEAN</th>';
  html += '<th style="padding:6px 4px;text-align:left;font-weight:700;min-width:120px">Model</th>';
  html += '<th style="padding:6px 4px;text-align:center;font-weight:700">Inspect</th>';
  html += '<th style="padding:6px 4px;text-align:center;font-weight:700">Defect</th>';
  html += '<th style="padding:6px 4px;text-align:center;font-weight:700">Released</th>';
  html += '<th style="padding:6px 4px;text-align:center;font-weight:700">RFT%</th>';
  html += '<th style="padding:6px 4px;text-align:center;font-weight:700">Defect%</th>';
  html += '<th style="padding:6px 4px;text-align:left;font-weight:700;min-width:100px">Top Defects</th>';
  html += '</tr></thead><tbody>';
  
  combinedData.forEach(function(row) {
    const rftColor = row.rft >= TARGET ? '#00B853' : row.rft >= (TARGET - 10) ? '#FF9500' : '#FF4444';
    
    html += '<tr style="border-bottom:1px solid var(--divider)">';
    html += '<td style="padding:6px 4px;font-weight:700;color:var(--tx2)">' + row.lean + '</td>';
    html += '<td style="padding:6px 4px;color:var(--tx3);font-size:7px;line-height:1.3">' + row.models + '</td>';
    html += '<td style="padding:6px 4px;text-align:center;color:var(--tx2)">' + row.inspected.toLocaleString() + '</td>';
    html += '<td style="padding:6px 4px;text-align:center;color:#FF4444">' + row.defects.toLocaleString() + '</td>';
    html += '<td style="padding:6px 4px;text-align:center;color:#00B853">' + row.released.toLocaleString() + '</td>';
    html += '<td style="padding:6px 4px;text-align:center;font-weight:700;color:' + rftColor + '">' + row.rft.toFixed(1) + '%</td>';
    html += '<td style="padding:6px 4px;text-align:center;color:#FF4444">' + row.defectPct.toFixed(1) + '%</td>';
    html += '<td style="padding:6px 4px;font-size:7px;line-height:1.4">';
    
    if (row.topD.length > 0) {
      row.topD.forEach(function(d, i) {
        html += (i + 1) + '. ' + d.name + ' (' + d.qty + ' - ' + d.pct.toFixed(1) + '%)<br>';
      });
    } else {
      html += '—';
    }
    
    html += '</td></tr>';
  });
  
  html += '</tbody></table></div>';
  
  // Summary stats
  const totalInspected = combinedData.reduce((s, r) => s + r.inspected, 0);
  const totalDefects = combinedData.reduce((s, r) => s + r.defects, 0);
  const totalReleased = combinedData.reduce((s, r) => s + r.released, 0);
  const overallRFT = totalInspected > 0 ? (totalReleased / totalInspected * 100) : 0;
  const overallDefectPct = totalInspected > 0 ? (totalDefects / totalInspected * 100) : 0;
  
  html += '<div style="margin-top:10px;padding:8px;background:rgba(0,102,204,0.1);border-left:3px solid #0066CC;font-size:9px;line-height:1.6">';
  html += '<b>📊 Tổng kết:</b><br>';
  html += '• ' + combinedData.length + ' lines<br>';
  html += '• Inspected: <b>' + totalInspected.toLocaleString() + '</b> pairs<br>';
  html += '• Released: <b style="color:#00B853">' + totalReleased.toLocaleString() + '</b> pairs<br>';
  html += '• Defects: <b style="color:#FF4444">' + totalDefects.toLocaleString() + '</b> pairs<br>';
  html += '• RFT: <b style="color:' + (overallRFT >= TARGET ? '#00B853' : '#FF4444') + '">' + overallRFT.toFixed(2) + '%</b><br>';
  html += '• Defect Rate: <b style="color:#FF4444">' + overallDefectPct.toFixed(2) + '%</b>';
  html += '</div>';
  
  resultDiv.innerHTML = html;
}


// ═══════════════════════════════════════
// MANUAL ADD
// ═══════════════════════════════════════
function addRow() {
  const lean = document.getElementById('m-lean').value.trim();
  const model = document.getElementById('m-model').value.trim();
  const qty = parseInt(document.getElementById('m-qty').value) || 0;
  const d1n = document.getElementById('m-d1n').value.trim();
  const d1q = parseInt(document.getElementById('m-d1q').value) || 0;
  const d2n = document.getElementById('m-d2n').value.trim();
  const d2q = parseInt(document.getElementById('m-d2q').value) || 0;
  const d3n = document.getElementById('m-d3n').value.trim();
  const d3q = parseInt(document.getElementById('m-d3q').value) || 0;
  const date = document.getElementById('m-date').value || new Date().toISOString().slice(0, 10);
  const msg = document.getElementById('add-msg');

  if (!lean || !model || !qty) {
    Swal.fire('⚠️ Cảnh báo', 'Vui lòng nhập Line, Model và SL Kiểm', 'warning');
    return;
  }

  const defects = d1q + d2q + d3q;
  const released = qty - defects;
  const rft = released / qty * 100;

  const row = {
    date: date,
    lean: lean,
    model: model,
    inspected: qty,
    released: released,
    defects: defects,
    rft: rft,
    d1n: d1n,
    d1q: d1q,
    d2n: d2n,
    d2q: d2q,
    d3n: d3n,
    d3q: d3q
  };

  allRows.push(row);
  filteredRows = allRows.slice();
  populateFilters();
  renderAll();
  
  msg.innerHTML = '<span style="color:#4AE88A">✓ Đã thêm</span>';
  setTimeout(() => { msg.innerHTML = ''; }, 2500);
  
  ['m-lean', 'm-model', 'm-qty', 'm-d1n', 'm-d1q', 'm-d2n', 'm-d2q', 'm-d3n', 'm-d3q'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// Logging helpers
function ulog1(msg) {
  const el = document.getElementById('upload-log1');
  if (el) el.innerHTML = '<span>' + msg + '</span><br>' + el.innerHTML;
}

function ulog2(msg) {
  const el = document.getElementById('upload-log2');
  if (el) el.innerHTML = '<span>' + msg + '</span><br>' + el.innerHTML;
}

