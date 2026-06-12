// ═══════════════════════════════════════
// MOBILE VIEW - RENDER & EXPORT
// ═══════════════════════════════════════

function renderMobileDashboard() {
  const container = document.getElementById('mobile-dashboard-content');
  if (!container) return;
  
  // Sử dụng filteredRows từ data.js
  const rows = typeof filteredRows !== 'undefined' && filteredRows.length > 0 ? filteredRows : 
               (typeof allRows !== 'undefined' && allRows.length > 0 ? allRows : []);
  
  if (rows.length === 0) {
    container.innerHTML = `
      <div class="mobile-no-data">
        <i class="fas fa-mobile-alt" style="font-size:48px;color:var(--tx3);margin-bottom:10px;"></i>
        <p style="font-size:12px;color:var(--tx2);">${t('mobileNoData')}</p>
        <p style="font-size:10px;color:var(--tx3);margin-top:4px;">${t('mobileNoDataSub')}</p>
      </div>
    `;
    return;
  }
  
  // Calculate metrics
  const totalQty = rows.reduce((s, r) => s + r.inspected, 0);
  const totalDefects = rows.reduce((s, r) => s + r.defects, 0);
  const avgRFT = rows.length > 0 ? (rows.reduce((s, r) => s + r.rft, 0) / rows.length).toFixed(1) : 0;
  const avgDefectRate = totalQty > 0 ? ((totalDefects / totalQty) * 100).toFixed(2) : 0;
  
  // Line performance
  const byLine = {};
  rows.forEach(r => {
    if (!byLine[r.lean]) {
      byLine[r.lean] = { 
        qty: 0, 
        defects: 0, 
        rft: [],
        models: new Set(),
        released: 0
      };
    }
    byLine[r.lean].qty += r.inspected;
    byLine[r.lean].defects += r.defects;
    byLine[r.lean].released += r.released;
    byLine[r.lean].rft.push(r.rft);
    byLine[r.lean].models.add(r.model);
  });
  
  const linePerf = Object.entries(byLine).map(([lean, d]) => ({
    lean,
    avgRFT: (d.rft.reduce((s, v) => s + v, 0) / d.rft.length).toFixed(1),
    qty: d.qty,
    defects: d.defects,
    released: d.released,
    models: Array.from(d.models)
  })).sort((a, b) => parseFloat(b.avgRFT) - parseFloat(a.avgRFT));
  
  // Top defects
  const defectCount = {};
  rows.forEach(r => {
    [[r.d1n, r.d1q], [r.d2n, r.d2q], [r.d3n, r.d3q]].forEach(([name, qty]) => {
      if (name && qty > 0) {
        defectCount[name] = (defectCount[name] || 0) + qty;
      }
    });
  });
  
  const topDefects = Object.entries(defectCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  
  const maxDefect = topDefects.length > 0 ? topDefects[0][1] : 1;
  
  // Best & Worst performers
  const bestLine = linePerf[0] || null;
  const worstLine = linePerf[linePerf.length - 1] || null;
  
  // Build mobile HTML
  let html = '';
  
  // KPI Cards - 3 cột trên cùng 1 hàng
  html += `<div class="mobile-kpi-grid">`;
  
  html += `
    <div class="mobile-kpi c-blue">
      <div class="mobile-kpi-label">${t('mobileKpiInspected')}</div>
      <div class="mobile-kpi-value">${totalQty.toLocaleString()}</div>
      <div class="mobile-kpi-sub">${rows.length} ${t('mobileKpiSub1')}</div>
    </div>
    
    <div class="mobile-kpi c-green">
      <div class="mobile-kpi-label">${t('mobileKpiRFT')}</div>
      <div class="mobile-kpi-value cv-${avgRFT >= 95 ? 'green' : avgRFT >= 90 ? 'orange' : 'red'}">${avgRFT}%</div>
      <div class="mobile-kpi-sub">${t('mobileKpiSub2')}</div>
    </div>
    
    <div class="mobile-kpi c-red">
      <div class="mobile-kpi-label">${t('mobileKpiDefects')}</div>
      <div class="mobile-kpi-value cv-red">${totalDefects.toLocaleString()}</div>
      <div class="mobile-kpi-sub">${t('mobileKpiSub3')} ${avgDefectRate}%</div>
    </div>
  `;
  
  html += `</div>`; // close mobile-kpi-grid
  
  html += `<div class="mobile-divider"></div>`;
  
  // Line Performance - Ranking với target line
  html += `
    <div style="margin-bottom:10px;">
      <div style="font-size:10px;font-weight:700;color:var(--tx2);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
        <span>${t('mobileRanking')}</span>
        <span style="font-size:8px;color:var(--yellow);">${t('mobileTarget')} 85%</span>
      </div>
  `;
  
  linePerf.slice(0, 6).forEach((line, index) => {
    const rft = parseFloat(line.avgRFT);
    const color = rft >= 95 ? 'green' : rft >= 90 ? 'orange' : 'red';
    const width = Math.min((rft / 100) * 100, 100);
    const targetPos = 85; // Target position at 85%
    
    html += `
      <div class="mobile-bar-row">
        <div class="mobile-bar-rank">${index + 1}</div>
        <div class="mobile-bar-label">${line.lean}</div>
        <div class="mobile-bar-track">
          <div class="mobile-bar-fill bf-${color}" style="width:${width}%"></div>
          <div class="mobile-bar-target" style="left:${targetPos}%"></div>
        </div>
        <div class="mobile-bar-value bv-${color}">${line.avgRFT}%</div>
      </div>
    `;
  });
  
  html += `</div>`;
  html += `<div class="mobile-divider"></div>`;
  
  // Line Details - Grid 3 cột với tất cả lines
  html += `
    <div style="margin-bottom:12px;">
      <div style="font-size:10px;font-weight:700;color:var(--tx2);margin-bottom:8px;">
        ${t('mobileDetails')}
      </div>
      <div class="mobile-line-grid">
  `;
  
  linePerf.forEach((line, index) => {
    const rft = parseFloat(line.avgRFT);
    const isGood = rft >= 85;
    const cardClass = isGood ? 'pi-green' : 'pi-red';
    const rftColor = isGood ? '#4AE88A' : '#FF7070';
    const rftBg = isGood ? 'rgba(0,196,90,0.15)' : 'rgba(224,48,48,0.15)';
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : 
                  index === linePerf.length - 1 ? '⚠️' : '';
    
    const modelList = line.models || [];
    
    html += `
      <div class="mobile-perf-item ${cardClass}">
        <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:6px;border-bottom:1px solid var(--bd);">
          <div style="font-size:11px;font-weight:700;color:var(--tx);">${medal} ${line.lean}</div>
          <div style="background:${rftBg};color:${rftColor};padding:2px 6px;border-radius:4px;font-size:11px;font-weight:700;">${line.avgRFT}%</div>
        </div>
        
        <div style="display:flex;gap:8px;font-size:8px;color:var(--tx3);margin:6px 0;">
          <span>${line.qty.toLocaleString()} prs</span>
          <span style="color:#4AE88A;">${line.released.toLocaleString()}</span>
          <span style="color:#FF7070;">${line.defects}</span>
        </div>
        
        <div style="margin-top:6px;">
          <div style="font-size:7px;font-weight:700;color:var(--tx3);margin-bottom:3px;">MODELS (${modelList.length}):</div>
    `;
    
    if (modelList.length <= 2) {
      modelList.forEach(m => {
        html += `<div style="font-size:8px;color:var(--tx2);padding:1px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">• ${m}</div>`;
      });
    } else {
      modelList.slice(0, 1).forEach(m => {
        html += `<div style="font-size:8px;color:var(--tx2);padding:1px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">• ${m}</div>`;
      });
      html += `<div style="font-size:7px;color:var(--tx3);padding:1px 0;font-style:italic;">... +${modelList.length - 1} models</div>`;
    }
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += `</div></div>`;
  
  html += `<div class="mobile-divider"></div>`;
  
  // Top Models - Best & Worst (1 row 2 cols)
  // Calculate model performance
  const byModel = {};
  rows.forEach(r => {
    if (!byModel[r.model]) {
      byModel[r.model] = { 
        model: r.model,
        qty: 0, 
        defects: 0,
        released: 0,
        rft: []
      };
    }
    byModel[r.model].qty += r.inspected;
    byModel[r.model].defects += r.defects;
    byModel[r.model].released += r.released;
    byModel[r.model].rft.push(r.rft);
  });
  
  const modelPerf = Object.values(byModel).map(m => ({
    model: m.model,
    avgRFT: (m.rft.reduce((s, v) => s + v, 0) / m.rft.length).toFixed(1),
    qty: m.qty,
    defects: m.defects,
    released: m.released
  })).sort((a, b) => parseFloat(b.avgRFT) - parseFloat(a.avgRFT));
  
  const topModels = modelPerf.slice(0, 3);
  const bottomModels = modelPerf.slice(-3).reverse();
  
  html += `
    <div style="margin-bottom:12px;">
      <div style="font-size:10px;font-weight:700;color:var(--tx2);margin-bottom:8px;">
        ${t('mobileTopModels')}
      </div>
      <div class="mobile-model-grid">
  `;
  
  // Best Models
  html += `
    <div class="mobile-model-card card-green">
      <div class="mobile-model-header">${t('mobileBestModels')}</div>
  `;
  
  topModels.forEach((model, idx) => {
    const rft = parseFloat(model.avgRFT);
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
    
    html += `
      <div class="mobile-model-item">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <div style="font-size:9px;font-weight:700;color:var(--tx);display:flex;align-items:center;gap:4px;">
            <span>${medal}</span>
            <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${model.model}</span>
          </div>
          <div style="font-size:11px;font-weight:700;color:#4AE88A;">${model.avgRFT}%</div>
        </div>
        <div style="font-size:7px;color:var(--tx3);">
          ${model.qty.toLocaleString()} prs • ${model.released.toLocaleString()} OK • ${model.defects} NG
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  
  // Worst Models
  html += `
    <div class="mobile-model-card card-red">
      <div class="mobile-model-header">${t('mobileWorstModels')}</div>
  `;
  
  bottomModels.forEach((model, idx) => {
    const rft = parseFloat(model.avgRFT);
    const icon = idx === 0 ? '⚠️' : idx === 1 ? '🔴' : '🚨';
    
    html += `
      <div class="mobile-model-item">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <div style="font-size:9px;font-weight:700;color:var(--tx);display:flex;align-items:center;gap:4px;">
            <span>${icon}</span>
            <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${model.model}</span>
          </div>
          <div style="font-size:11px;font-weight:700;color:#FF7070;">${model.avgRFT}%</div>
        </div>
        <div style="font-size:7px;color:var(--tx3);">
          ${model.qty.toLocaleString()} prs • ${model.released.toLocaleString()} OK • ${model.defects} NG
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  html += `</div></div>`;
  
  html += `<div class="mobile-divider"></div>`;
  
  // Top Defects (Pareto)
  if (topDefects.length > 0) {
    html += `<div class="mobile-card">`;
    html += `<div class="mobile-card-title"><i class="fas fa-chart-bar"></i> Top Defects (Pareto)</div>`;
    
    topDefects.forEach(([name, qty]) => {
      const pct = ((qty / totalDefects) * 100).toFixed(1);
      const width = (qty / maxDefect) * 100;
      const hue = Math.floor((1 - qty / maxDefect) * 120);
      
      html += `
        <div class="mobile-pareto-row">
          <div class="mobile-pareto-name">${name}</div>
          <div class="mobile-pareto-track">
            <div class="mobile-pareto-fill" style="width:${width}%;background:hsl(${hue},70%,45%)">
              <span class="mobile-pareto-qty">${qty}</span>
            </div>
          </div>
          <div class="mobile-pareto-pct">${pct}%</div>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  // Update date/time
  const now = new Date();
  html += `
    <div style="text-align:center;padding:20px 0;border-top:1px solid var(--bd);margin-top:10px;">
      <div style="font-size:9px;color:var(--tx3);">
        <i class="fas fa-clock"></i> Cập nhật: ${now.toLocaleString('vi-VN')}
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// ═══════════════════════════════════════
// EXPORT MOBILE TO PNG
// ═══════════════════════════════════════

async function exportMobilePNG() {
  // Check if data exists
  const rows = typeof filteredRows !== 'undefined' && filteredRows.length > 0 ? filteredRows : 
               (typeof allRows !== 'undefined' && allRows.length > 0 ? allRows : []);
  
  if (rows.length === 0) {
    alert('Vui lòng tải dữ liệu trước khi xuất PNG!');
    return;
  }
  
  try {
    // Show loading
    Swal.fire({
      title: 'Đang xuất PNG...',
      html: 'Vui lòng chờ trong giây lát',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Get the mobile content element
    const mobileContent = document.getElementById('mobile-dashboard-content');
    if (!mobileContent) {
      throw new Error('Không tìm thấy nội dung mobile');
    }
    
    // Create a temporary container for export
    const exportContainer = document.createElement('div');
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = '390px';
    exportContainer.style.background = '#0D0D14';
    exportContainer.style.padding = '0';
    exportContainer.style.fontFamily = "'Noto Sans','Noto Sans SC','Segoe UI',sans-serif";
    
    // Create header
    const header = document.createElement('div');
    header.style.cssText = 'background:#111827;border-bottom:2px solid #00C45A;padding:12px 16px;display:flex;align-items:center;gap:10px;';
    header.innerHTML = `
      <div style="background:#006B30;color:#fff;font-weight:900;font-size:16px;width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;">SF</div>
      <div style="line-height:1.3;flex:1;">
        <div style="font-size:13px;font-weight:700;color:#F0F4FF;">STOCKFITTING QUALITY</div>
        <div style="font-size:8px;color:rgba(240,244,255,.38);">Bảng kết quả chất lượng</div>
      </div>
    `;
    exportContainer.appendChild(header);
    
    // Clone the mobile content
    const contentClone = mobileContent.cloneNode(true);
    contentClone.style.padding = '12px';
    contentClone.style.background = '#0D0D14';
    exportContainer.appendChild(contentClone);
    
    // Add to document
    document.body.appendChild(exportContainer);
    
    // Wait for fonts and styles to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture with html2canvas
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: '#0D0D14',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: false,
      scrollY: 0,
      scrollX: 0,
      width: 390,
      height: exportContainer.scrollHeight
    });
    
    // Remove temporary container
    document.body.removeChild(exportContainer);
    
    // Convert to blob and download
    canvas.toBlob(blob => {
      if (!blob) {
        throw new Error('Không thể tạo PNG');
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0,19).replace(/[:-]/g, '').replace('T', '_');
      a.href = url;
      a.download = `Stockfitting_Mobile_${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      Swal.fire({
        icon: 'success',
        title: 'Xuất PNG thành công!',
        text: 'File đã được tải xuống',
        timer: 2000,
        showConfirmButton: false
      });
    }, 'image/png', 1.0);
    
  } catch (error) {
    console.error('Export error:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi xuất PNG',
      text: 'Không thể xuất PNG. Vui lòng thử lại.'
    });
  }
}
