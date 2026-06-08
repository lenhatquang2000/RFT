// ═══════════════════════════════════════
// RENDER - DASHBOARD VISUALIZATION
// ═══════════════════════════════════════

function renderAll() {
  const s = compute(filteredRows);
  const hasDash = document.getElementById('dash-content');
  const noData = document.getElementById('no-data');
  
  if (!s || !s.totalI) {
    if (hasDash) hasDash.style.display = 'none';
    if (noData) noData.style.display = 'block';
    return;
  }
  
  if (noData) noData.style.display = 'none';
  if (hasDash) hasDash.style.display = 'block';
  
  renderKPI(s);
  renderLeanModels(s);
  renderBar(s);
  renderBestWorst(s);
  renderPareto(s);
  renderHeatmap(s);
  renderModel(s);
  renderConc(s);
}

// ═══════════════════════════════════════
// LEAN → MODELS MAPPING
// ═══════════════════════════════════════
function renderLeanModels(s) {
  let html = '<div class="card-hd ch-blue" style="display:flex;justify-content:space-between;align-items:center">';
  html += '<span>🏭 LEAN → Models đang chạy</span>';
  html += '<span style="font-size:9px;font-weight:400;color:var(--tx3)">' + s.lineArr.length + ' lines active</span>';
  html += '</div>';
  
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;padding:12px;">';
  
  s.lineArr.forEach(function(l) {
    const modelList = l.models.split(', ');
    const rftColor = l.rft >= TARGET ? '#00B853' : l.rft >= (TARGET - 10) ? '#FF9500' : '#FF4444';
    const rftBg = l.rft >= TARGET ? 'rgba(0,184,83,0.1)' : l.rft >= (TARGET - 10) ? 'rgba(255,149,0,0.1)' : 'rgba(255,68,68,0.1)';
    
    html += '<div style="background:var(--bg3);border:1px solid var(--bd);border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:6px;">';
    
    // Header: LEAN + RFT
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:6px;border-bottom:1px solid var(--bd);">';
    html += '<b style="font-size:12px;color:var(--tx)">' + hlText(l.lean) + '</b>';
    html += '<span style="background:' + rftBg + ';color:' + rftColor + ';padding:3px 8px;border-radius:4px;font-size:10px;font-weight:700">' + l.rft.toFixed(1) + '%</span>';
    html += '</div>';
    
    // Stats
    html += '<div style="display:flex;gap:12px;font-size:9px;color:var(--tx3);">';
    html += '<span>📦 ' + l.inspected.toLocaleString() + ' prs</span>';
    html += '<span>✓ ' + l.released.toLocaleString() + '</span>';
    html += '<span style="color:#FF4444">✗ ' + l.defects + '</span>';
    html += '</div>';
    
    // Models
    html += '<div style="margin-top:4px;">';
    html += '<div style="font-size:8px;font-weight:700;color:var(--tx3);margin-bottom:4px;text-transform:uppercase">Models (' + modelList.length + '):</div>';
    
    if (modelList.length <= 3) {
      modelList.forEach(function(m) {
        html += '<div style="font-size:9px;color:var(--tx2);padding:2px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">• ' + hlText(m) + '</div>';
      });
    } else {
      // Show first 2 + "... +N more"
      modelList.slice(0, 2).forEach(function(m) {
        html += '<div style="font-size:9px;color:var(--tx2);padding:2px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">• ' + hlText(m) + '</div>';
      });
      html += '<div style="font-size:8px;color:var(--tx3);padding:2px 0;font-style:italic">... +' + (modelList.length - 2) + ' models</div>';
    }
    html += '</div>';
    
    html += '</div>';
  });
  
  html += '</div>';
  
  document.getElementById('card-lean-models').innerHTML = html;
}

// ═══════════════════════════════════════
// KPI CARDS
// ═══════════════════════════════════════
function renderKPI(s) {
  const rBadge = s.rft >= TARGET 
    ? '<span class="kpi-badge kb-green">' + t('kpiBadgePass') + '</span>'
    : '<span class="kpi-badge kb-red">' + t('kpiBadgeFail') + '</span>';
  
  document.getElementById('kpi-row').innerHTML =
    kpiCard('blue', t('kpiInspected'), s.totalI.toLocaleString(), t('kpiPairs'), '') +
    kpiCard(s.rft >= TARGET ? 'green' : 'red', t('kpiRFT'), s.rft.toFixed(2) + '%', 
      t('kpiTarget') + ' ≥' + TARGET + '% · ' + (s.rft - TARGET).toFixed(2) + '%', rBadge) +
    kpiCard('red', t('kpiDefects'), s.totalD.toLocaleString(), t('kpiDefectsFound'), '') +
    kpiCard(s.dr <= 15 ? 'green' : s.dr <= 25 ? 'orange' : 'red', t('kpiDR'), s.dr.toFixed(2) + '%',
      '= ' + s.totalD + ' ÷ ' + s.totalI + ' · ' + t('kpiTarget') + ' ≤ 15%', '') +
    kpiCard('blue', t('kpiLines'), s.lineArr.length, 
      s.lineArr.filter(l => l.rft >= TARGET).length + ' ' + t('kpiPass'), '');
}

function kpiCard(c, lbl, val, sub, badge) {
  const cv = c === 'red' ? 'cv-red' : c === 'green' ? 'cv-green' : c === 'orange' ? 'cv-orange' : '';
  return '<div class="kpi c-' + c + '">' + badge + 
    '<div class="kpi-lbl">' + lbl + '</div>' +
    '<div class="kpi-val ' + cv + '">' + val + '</div>' +
    '<div class="kpi-sub">' + sub + '</div></div>';
}

// ═══════════════════════════════════════
// BAR CHART - RFT RANKING
// ═══════════════════════════════════════
function renderBar(s) {
  const rows = s.lineArr.map(function(l) {
    const pct = Math.min(l.rft, 100);
    const fc = pct >= TARGET ? 'bf-green' : pct >= (TARGET - 10) ? 'bf-orange' : 'bf-red';
    const vc = pct >= TARGET ? 'bv-green' : pct >= (TARGET - 10) ? 'bv-orange' : 'bv-red';
    const lc = pct < 60 ? 'color:#FF8888' : '';
    
    return '<div class="bar-row">' +
      '<div class="bar-lbl" style="' + lc + '">' + hlText(l.lean) + '</div>' +
      '<div class="bar-track">' +
        '<div class="bar-fill ' + fc + '" style="width:' + pct + '%"></div>' +
        '<div class="bar-target" style="left:' + TARGET + '%"></div>' +
      '</div>' +
      '<div class="bar-val ' + vc + '">' + l.rft.toFixed(1) + '%</div>' +
    '</div>';
  }).join('');

  document.getElementById('card-bar').innerHTML =
    '<div class="card-hd ch-blue">' + t('barTitle') +
    '<span style="margin-left:auto;font-size:8px;color:var(--yellow);">— ' + t('barMucTieu') + ' ' + TARGET + '%</span></div>' +
    rows +
    '<div class="legend">' +
      '<div class="leg-item"><div class="leg-dot" style="background:#006B30"></div>≥' + TARGET + '% ' + t('barLegPass') + '</div>' +
      '<div class="leg-item"><div class="leg-dot" style="background:#7A4400"></div>' + (TARGET - 10) + '–' + TARGET + '% ' + t('barLegNear') + '</div>' +
      '<div class="leg-item"><div class="leg-dot" style="background:#7A1A1A"></div>&lt;' + (TARGET - 10) + '% ' + t('barLegFail') + '</div>' +
      '<div class="leg-item"><div class="leg-dot" style="background:var(--yellow);height:3px;border-radius:1px;"></div>' + t('barMucTieu') + ' ' + TARGET + '%</div>' +
    '</div>';
}

// ═══════════════════════════════════════
// BEST / WORST LINES
// ═══════════════════════════════════════
function renderBestWorst(s) {
  // Lấy top 3 tốt nhất (bao gồm các line có cùng RFT)
  const top3 = [];
  let currentRank = 0;
  let previousRFT = null;
  
  for (let i = 0; i < s.lineArr.length && currentRank < 3; i++) {
    const currentRFT = s.lineArr[i].rft;
    
    if (previousRFT === null || currentRFT !== previousRFT) {
      currentRank++;
      previousRFT = currentRFT;
    }
    
    if (currentRank <= 3) {
      top3.push(s.lineArr[i]);
    }
  }
  
  // Lấy bottom 3 tệ nhất (bao gồm các line có cùng RFT)
  const bot3 = [];
  currentRank = 0;
  previousRFT = null;
  
  for (let i = s.lineArr.length - 1; i >= 0 && currentRank < 3; i--) {
    const currentRFT = s.lineArr[i].rft;
    
    if (previousRFT === null || currentRFT !== previousRFT) {
      currentRank++;
      previousRFT = currentRFT;
    }
    
    if (currentRank <= 3) {
      bot3.push(s.lineArr[i]);
    }
  }
  
  // Best lines
  let bestHTML = '<div class="card-hd ch-green">' + t('bestTitle') + '</div>';
  if (top3.length === 0) {
    bestHTML += '<p style="padding:20px;color:var(--tx3);text-align:center">' + t('noData') + '</p>';
  } else {
    bestHTML += '<div style="padding:12px 15px;display:flex;flex-direction:column;gap:12px;">';
    
    let displayRank = 0;
    let prevRFT = null;
    
    top3.forEach(function(l, i) {
      // Tính rank hiển thị
      if (prevRFT === null || l.rft !== prevRFT) {
        displayRank++;
        prevRFT = l.rft;
      }
      
      const medal = displayRank === 1 ? '🥇' : displayRank === 2 ? '🥈' : '🥉';
      
      bestHTML += '<div style="display:flex;flex-direction:column;gap:4px;padding-bottom:10px;border-bottom:1px solid var(--divider);">';
      bestHTML += '<div style="display:flex;justify-content:space-between;align-items:center;">';
      bestHTML += '<div style="display:flex;align-items:center;gap:6px;"><span style="font-size:18px">' + medal + '</span><b style="font-size:12px">' + hlText(l.lean) + '</b></div>';
      bestHTML += '<span style="font-size:16px;font-weight:700;color:#00B853">' + l.rft.toFixed(1) + '%</span>';
      bestHTML += '</div>';
      bestHTML += '<div style="font-size:9px;color:var(--tx3)">' + l.inspected.toLocaleString() + ' ' + t('kpiPairs') + ' · ' + l.defects + ' ' + t('kpiDefects').toLowerCase() + '</div>';
      if (l.topD && l.topD.length > 0) {
        bestHTML += '<div style="margin-top:4px;display:flex;flex-direction:column;gap:2px;">';
        l.topD.forEach(function(d) {
          bestHTML += '<div style="font-size:9px;display:flex;justify-content:space-between;">';
          bestHTML += '<span style="color:var(--tx2)">• ' + hlText(d.name) + '</span>';
          bestHTML += '<span style="color:var(--tx3)">' + d.qty + ' (' + d.pct.toFixed(1) + '%)</span>';
          bestHTML += '</div>';
        });
        bestHTML += '</div>';
      }
      bestHTML += '</div>';
    });
    bestHTML += '</div>';
  }
  
  // Worst lines
  let worstHTML = '<div class="card-hd ch-red">' + t('worstTitle') + '</div>';
  if (bot3.length === 0) {
    worstHTML += '<p style="padding:20px;color:var(--tx3);text-align:center">' + t('noData') + '</p>';
  } else {
    worstHTML += '<div style="padding:12px 15px;display:flex;flex-direction:column;gap:12px;">';
    
    let displayRank = 0;
    let prevRFT = null;
    
    bot3.forEach(function(l, i) {
      // Tính rank hiển thị
      if (prevRFT === null || l.rft !== prevRFT) {
        displayRank++;
        prevRFT = l.rft;
      }
      
      const icon = displayRank === 1 ? '⚠️' : displayRank === 2 ? '🔴' : '🚨';
      
      worstHTML += '<div style="display:flex;flex-direction:column;gap:4px;padding-bottom:10px;border-bottom:1px solid var(--divider);">';
      worstHTML += '<div style="display:flex;justify-content:space-between;align-items:center;">';
      worstHTML += '<div style="display:flex;align-items:center;gap:6px;"><span style="font-size:18px">' + icon + '</span><b style="font-size:12px">' + hlText(l.lean) + '</b></div>';
      worstHTML += '<span style="font-size:16px;font-weight:700;color:#FF4444">' + l.rft.toFixed(1) + '%</span>';
      worstHTML += '</div>';
      worstHTML += '<div style="font-size:9px;color:var(--tx3)">' + l.inspected.toLocaleString() + ' ' + t('kpiPairs') + ' · ' + l.defects + ' ' + t('kpiDefects').toLowerCase() + '</div>';
      if (l.topD && l.topD.length > 0) {
        worstHTML += '<div style="margin-top:4px;display:flex;flex-direction:column;gap:2px;">';
        l.topD.forEach(function(d) {
          worstHTML += '<div style="font-size:9px;display:flex;justify-content:space-between;">';
          worstHTML += '<span style="color:var(--tx2)">• ' + hlText(d.name) + '</span>';
          worstHTML += '<span style="color:var(--tx3)">' + d.qty + ' (' + d.pct.toFixed(1) + '%)</span>';
          worstHTML += '</div>';
        });
        worstHTML += '</div>';
      }
      worstHTML += '</div>';
    });
    worstHTML += '</div>';
  }
  
  document.getElementById('card-best').innerHTML = bestHTML;
  document.getElementById('card-worst').innerHTML = worstHTML;
}

// ═══════════════════════════════════════
// PARETO CHART - TOP DEFECTS
// ═══════════════════════════════════════
function renderPareto(s) {
  let html = '<div class="card-hd ch-orange">' + t('paretoTitle') + '</div>';
  
  if (!s.dArr || s.dArr.length === 0) {
    html += '<p style="padding:20px;color:var(--tx3);text-align:center">' + t('noData') + '</p>';
  } else {
    // Lấy top 10 (bao gồm các defect có cùng qty)
    const top10 = [];
    let currentRank = 0;
    let previousQty = null;
    
    for (let i = 0; i < s.dArr.length && currentRank < 10; i++) {
      const currentQty = s.dArr[i].qty;
      
      if (previousQty === null || currentQty !== previousQty) {
        currentRank++;
        previousQty = currentQty;
      }
      
      if (currentRank <= 10) {
        top10.push(s.dArr[i]);
      }
    }
    
    const maxQty = Math.max(...top10.map(d => d.qty));
    
    html += '<div style="padding:15px;display:flex;flex-direction:column;gap:10px;">';
    
    let displayRank = 0;
    let prevQty = null;
    
    top10.forEach(function(d, i) {
      // Tính rank hiển thị
      if (prevQty === null || d.qty !== prevQty) {
        displayRank++;
        prevQty = d.qty;
      }
      
      const barW = maxQty > 0 ? (d.qty / maxQty * 100) : 0;
      const cumColor = d.cumPct <= 80 ? '#FF9500' : '#FFC966';
      const showCum = displayRank <= 5 || d.cumPct <= 90;
      
      html += '<div style="display:flex;flex-direction:column;gap:3px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:baseline;">';
      html += '<div style="font-size:10px;font-weight:600;max-width:200px;overflow:hidden;text-overflow:ellipsis">' + displayRank + '. ' + hlText(d.name) + '</div>';
      html += '<div style="display:flex;gap:8px;align-items:baseline;">';
      html += '<span style="font-size:11px;font-weight:700;color:var(--orange)">' + d.qty.toLocaleString() + '</span>';
      html += '<span style="font-size:9px;color:var(--tx3)">(' + d.pct.toFixed(1) + '%)</span>';
      if (showCum) {
        html += '<span style="font-size:8px;color:' + cumColor + '">Σ' + d.cumPct.toFixed(0) + '%</span>';
      }
      html += '</div>';
      html += '</div>';
      
      html += '<div style="position:relative;height:8px;background:var(--divider);border-radius:4px;overflow:hidden;">';
      html += '<div style="position:absolute;left:0;top:0;bottom:0;width:' + barW + '%;background:linear-gradient(90deg,#FF6B00,#FFB366);border-radius:4px;"></div>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
    
    if (s.dArr.length > top10.length) {
      const others = s.dArr.slice(top10.length).reduce((sum, d) => sum + d.qty, 0);
      html += '<div style="padding:8px 15px;font-size:9px;color:var(--tx3);border-top:1px solid var(--divider);">';
      html += t('paretoOthers') + ': ' + others.toLocaleString() + ' (' + (s.totalD > 0 ? (others / s.totalD * 100).toFixed(1) : 0) + '%)';
      html += '</div>';
    }
  }
  
  document.getElementById('card-pareto').innerHTML = html;
}

// ═══════════════════════════════════════
// HEATMAP - LINE × DEFECT
// ═══════════════════════════════════════
function renderHeatmap(s) {
  let html = '<div class="card-hd ch-blue">' + t('heatmapTitle') + '</div>';
  
  if (!s.lineArr || s.lineArr.length === 0 || !s.dArr || s.dArr.length === 0) {
    html += '<p style="padding:20px;color:var(--tx3);text-align:center">' + t('noData') + '</p>';
  } else {
    const topDefects = s.dArr.slice(0, 8).map(d => d.name);
    const maxVal = Math.max(...s.lineArr.flatMap(l => l.topD.map(d => d.qty)));
    
    html += '<div style="padding:12px;overflow-x:auto;">';
    html += '<table style="width:100%;font-size:9px;border-collapse:collapse;">';
    
    // Header
    html += '<thead><tr><th style="text-align:left;padding:6px;font-weight:700;border-bottom:2px solid var(--divider)">Line</th>';
    topDefects.forEach(function(dn) {
      html += '<th style="text-align:center;padding:6px;font-weight:600;border-bottom:2px solid var(--divider);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + dn.substring(0, 15) + '</th>';
    });
    html += '</tr></thead><tbody>';
    
    // Rows
    s.lineArr.forEach(function(l) {
      html += '<tr>';
      html += '<td style="padding:6px;font-weight:600;border-bottom:1px solid var(--divider)">' + hlText(l.lean) + '</td>';
      
      topDefects.forEach(function(dn) {
        const d = l.topD.find(x => x.name === dn);
        const qty = d ? d.qty : 0;
        const intensity = maxVal > 0 ? Math.min(qty / maxVal, 1) : 0;
        const bgColor = qty === 0 ? 'transparent' : 
          'rgba(255, 68, 68, ' + (0.15 + intensity * 0.7) + ')';
        const txtColor = intensity > 0.5 ? '#FFF' : 'var(--tx2)';
        
        html += '<td style="text-align:center;padding:6px;background:' + bgColor + ';color:' + txtColor + ';border-bottom:1px solid var(--divider)">';
        html += qty > 0 ? qty : '—';
        html += '</td>';
      });
      html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    
    html += '<div style="padding:8px 15px;font-size:8px;color:var(--tx3);display:flex;align-items:center;gap:8px;border-top:1px solid var(--divider);">';
    html += '<span>' + t('heatmapLegend') + ':</span>';
    html += '<div style="display:flex;gap:4px;">';
    [0.2, 0.4, 0.6, 0.8, 1.0].forEach(function(v) {
      html += '<div style="width:16px;height:12px;background:rgba(255,68,68,' + (0.15 + v * 0.7) + ');border:1px solid #DDD;border-radius:2px;"></div>';
    });
    html += '</div>';
    html += '</div>';
  }
  
  document.getElementById('card-heatmap').innerHTML = html;
}

// ═══════════════════════════════════════
// MODEL COMPARISON
// ═══════════════════════════════════════
function renderModel(s) {
  let html = '<div class="card-hd ch-blue">' + t('modelTitle') + '</div>';
  
  if (!s.modelArr || s.modelArr.length === 0) {
    html += '<p style="padding:20px;color:var(--tx3);text-align:center">' + t('noData') + '</p>';
  } else {
    // Lấy top 8 (bao gồm các model có cùng RFT)
    const top8 = [];
    let currentRank = 0;
    let previousRFT = null;
    
    for (let i = 0; i < s.modelArr.length && currentRank < 8; i++) {
      const currentRFT = s.modelArr[i].rft;
      
      if (previousRFT === null || currentRFT !== previousRFT) {
        currentRank++;
        previousRFT = currentRFT;
      }
      
      if (currentRank <= 8) {
        top8.push(s.modelArr[i]);
      }
    }
    
    const maxRFT = Math.max(...top8.map(m => m.rft));
    
    html += '<div style="padding:12px 15px;display:flex;flex-direction:column;gap:10px;">';
    
    let displayRank = 0;
    let prevRFT = null;
    
    top8.forEach(function(m, i) {
      // Tính rank hiển thị
      if (prevRFT === null || m.rft !== prevRFT) {
        displayRank++;
        prevRFT = m.rft;
      }
      
      const barW = maxRFT > 0 ? (m.rft / maxRFT * 100) : 0;
      const rftColor = m.rft >= TARGET ? '#00B853' : m.rft >= (TARGET - 10) ? '#FF9500' : '#FF4444';
      
      html += '<div style="display:flex;flex-direction:column;gap:3px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
      html += '<div style="font-size:10px;font-weight:600;max-width:250px;overflow:hidden;text-overflow:ellipsis">' + displayRank + '. ' + hlText(m.model) + '</div>';
      html += '<div style="display:flex;gap:10px;align-items:center;">';
      html += '<span style="font-size:9px;color:var(--tx3)">' + m.inspected.toLocaleString() + ' prs</span>';
      html += '<span style="font-size:12px;font-weight:700;color:' + rftColor + '">' + m.rft.toFixed(1) + '%</span>';
      html += '</div>';
      html += '</div>';
      
      html += '<div style="position:relative;height:6px;background:var(--divider);border-radius:3px;overflow:hidden;">';
      html += '<div style="position:absolute;left:0;top:0;bottom:0;width:' + barW + '%;background:' + rftColor + ';border-radius:3px;"></div>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
    
    if (s.modelArr.length > top8.length) {
      html += '<div style="padding:8px 15px;font-size:9px;color:var(--tx3);border-top:1px solid var(--divider);">';
      html += '+ ' + (s.modelArr.length - top8.length) + ' ' + t('modelOthers');
      html += '</div>';
    }
  }
  
  document.getElementById('card-model').innerHTML = html;
}

// ═══════════════════════════════════════
// CONCLUSION / MANAGEMENT SUMMARY
// ═══════════════════════════════════════
function renderConc(s) {
  let html = '<div style="font-size:10px;font-weight:700;color:var(--orange);margin-bottom:9px;text-transform:uppercase">' + t('concTitle') + '</div>';
  
  if (!s || !s.lineArr || s.lineArr.length === 0) {
    html += '<p style="color:var(--tx3);font-size:11px">' + t('noData') + '</p>';
    document.getElementById('card-conc').innerHTML = html;
    return;
  }
  
  const pass = s.lineArr.filter(l => l.rft >= TARGET).length;
  const fail = s.lineArr.length - pass;
  const passRate = s.lineArr.length > 0 ? (pass / s.lineArr.length * 100) : 0;
  const best = s.lineArr[0];
  const worst = s.lineArr[s.lineArr.length - 1];
  const top3Defects = s.dArr.slice(0, 3);
  
  // Status badge
  const statusBadge = s.rft >= TARGET
    ? '<span style="display:inline-block;padding:3px 8px;background:#00B853;color:#FFF;border-radius:4px;font-size:9px;font-weight:700;margin-right:8px">✓ ĐẠT MỤC TIÊU</span>'
    : '<span style="display:inline-block;padding:3px 8px;background:#FF4444;color:#FFF;border-radius:4px;font-size:9px;font-weight:700;margin-right:8px">✗ CHƯA ĐẠT</span>';
  
  html += '<div style="display:flex;flex-direction:column;gap:12px;font-size:11px;line-height:1.7;">';
  
  // Overall status
  html += '<div>' + statusBadge;
  html += '<span style="color:var(--tx2)">Tổng thể RFT đạt <b style="color:' + (s.rft >= TARGET ? '#00B853' : '#FF4444') + '">' + s.rft.toFixed(2) + '%</b>';
  html += ' (mục tiêu ≥' + TARGET + '%, chênh lệch: <b>' + (s.rft >= TARGET ? '+' : '') + (s.rft - TARGET).toFixed(2) + '%</b>)</span>';
  html += '</div>';
  
  // Line performance
  html += '<div style="color:var(--tx2)">• <b>' + pass + '/' + s.lineArr.length + ' lines</b> đạt mục tiêu (' + passRate.toFixed(1) + '%)';
  if (fail > 0) {
    html += ', <b style="color:#FF4444">' + fail + ' lines</b> chưa đạt';
  }
  html += '</div>';
  
  // Best line
  if (best) {
    html += '<div style="color:var(--tx2)">• 🥇 <b style="color:#00B853">' + best.lean + '</b> dẫn đầu với RFT <b>' + best.rft.toFixed(1) + '%</b>';
    if (best.topD && best.topD[0]) {
      html += ' (lỗi chính: ' + best.topD[0].name + ' - ' + best.topD[0].qty + ' cases)';
    }
    html += '</div>';
  }
  
  // Worst line
  if (worst && worst.rft < TARGET) {
    html += '<div style="color:var(--tx2)">• ⚠️ <b style="color:#FF4444">' + worst.lean + '</b> cần cải thiện với RFT <b>' + worst.rft.toFixed(1) + '%</b>';
    if (worst.topD && worst.topD[0]) {
      html += ' (lỗi chính: ' + worst.topD[0].name + ' - ' + worst.topD[0].qty + ' cases)';
    }
    html += '</div>';
  }
  
  // Top defects
  if (top3Defects.length > 0) {
    html += '<div style="color:var(--tx2)">• 🔍 Top ' + top3Defects.length + ' lỗi chiếm <b>' + 
      (top3Defects.reduce((sum, d) => sum + d.pct, 0)).toFixed(1) + '%</b> tổng defects: ';
    html += top3Defects.map(d => '<b>' + d.name + '</b> (' + d.qty + ')').join(', ');
    html += '</div>';
  }
  
  // Recommendation
  html += '<div style="margin-top:8px;padding:10px;background:rgba(255,149,0,0.1);border-left:3px solid var(--orange);border-radius:4px;font-size:10px;color:var(--tx2)">';
  html += '<b style="color:var(--orange)">💡 ' + t('concRecommend') + ':</b> ';
  if (s.rft < TARGET) {
    html += 'Tập trung cải thiện ' + fail + ' lines chưa đạt, ưu tiên giảm lỗi "' + (top3Defects[0] ? top3Defects[0].name : '') + '" để nâng RFT lên ≥' + TARGET + '%.';
  } else {
    html += 'Duy trì chất lượng hiện tại, tiếp tục giám sát và cải tiến liên tục để tối ưu hóa RFT.';
  }
  html += '</div>';
  
  html += '</div>';
  
  document.getElementById('card-conc').innerHTML = html;
}

// ═══════════════════════════════════════
// DATA TABLE
// ═══════════════════════════════════════
function renderTable() {
  document.getElementById('data-count').textContent = filteredRows.length + ' ' + t('dtCount');
  document.getElementById('dt-body').innerHTML = filteredRows.map(function(r, i) {
    const rc = r.rft >= TARGET ? 'rb-g' : r.rft >= (TARGET - 10) ? 'rb-o' : 'rb-r';
    const dr = r.inspected > 0 ? (r.defects / r.inspected * 100).toFixed(1) : '0';
    
    return '<tr>' +
      '<td>' + r.date + '</td>' +
      '<td><b>' + hlText(r.lean) + '</b></td>' +
      '<td>' + hlText(r.model) + '</td>' +
      '<td>' + r.inspected.toLocaleString() + '</td>' +
      '<td><span class="rbadge ' + rc + '">' + r.rft.toFixed(1) + '%</span></td>' +
      '<td>' + r.defects + '</td>' +
      '<td>' + dr + '%</td>' +
      '<td>' + hlText(r.d1n || '—') + '</td><td>' + r.d1q + '</td>' +
      '<td>' + hlText(r.d2n || '—') + '</td><td>' + r.d2q + '</td>' +
      '<td>' + hlText(r.d3n || '—') + '</td><td>' + r.d3q + '</td>' +
      '<td><button class="btn bx" style="padding:2px 7px;font-size:9px" onclick="delRow(' + i + ')">✕</button></td>' +
    '</tr>';
  }).join('');
}
