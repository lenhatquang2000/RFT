// ═══════════════════════════════════════
// PIVOT TABLE FUNCTIONALITY - INDEPENDENT
// ═══════════════════════════════════════

let pivotRawData = [];

function handlePivotFileUpload(file) {
  if (!file) return;
  
  if (!file.name.match(/\.(xlsx|xls)$/)) {
    Swal.fire('❌ Lỗi', 'Vui lòng chọn file Excel (.xlsx hoặc .xls)', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      
      // Lấy sheet đầu tiên có dữ liệu
      let worksheetData = [];
      for (let sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(ws);
        if (data.length > 0) {
          worksheetData = data;
          break;
        }
      }

      if (worksheetData.length === 0) {
        throw new Error('Không tìm thấy dữ liệu trong file');
      }

      // Xử lý dữ liệu
      pivotRawData = worksheetData.filter((row, idx) => {
        return Object.values(row).some(val => val && String(val).trim() !== '');
      }).map((row, idx) => {
        // Chuyển date từ Excel format
        const dateNum = row['CONG TY TNHH JIAZHI - SOC TRANG  QUALITY TRACKING '];
        if (typeof dateNum === 'number') {
          const date = new Date((dateNum - 25569) * 86400 * 1000);
          row['Date'] = date.toISOString().split('T')[0];
        }
        return row;
      });

      // Rename columns
      pivotRawData = pivotRawData.map(row => {
        const cleanRow = {};
        
        cleanRow['Ngày'] = row['CONG TY TNHH JIAZHI - SOC TRANG  QUALITY TRACKING '] || row['Date'];
        cleanRow['MatID'] = row['__EMPTY'] || '';
        cleanRow['Vật Liệu'] = row['__EMPTY_1'] || '';
        cleanRow['RY'] = row['__EMPTY_2'] || '';
        cleanRow['Bài Hàng'] = row['__EMPTY_3'] || '';
        cleanRow['Model'] = row['__EMPTY_4'] || '';
        cleanRow['Nhận'] = parseInt(row['__EMPTY_5']) || 0;
        cleanRow['Kiểm Tra'] = parseInt(row['__EMPTY_6']) || 0;
        cleanRow['Đạt'] = parseInt(row['__EMPTY_7']) || 0;
        cleanRow['Lỗi'] = parseInt(row['__EMPTY_8']) || 0;
        cleanRow['Tỷ Lệ Lỗi%'] = parseFloat(row['__EMPTY_9']) || 0;
        
        // Các loại lỗi
        cleanRow['Contamination'] = parseInt(row['__EMPTY_10']) || 0;
        cleanRow['ColorIssue'] = parseInt(row['__EMPTY_11']) || 0;
        cleanRow['MidsoleQuality'] = parseInt(row['__EMPTY_12']) || 0;
        cleanRow['Delamination_Large'] = parseInt(row['__EMPTY_13']) || 0;
        cleanRow['Delamination_Small'] = parseInt(row['__EMPTY_14']) || 0;
        
        return cleanRow;
      });

      // Lọc bỏ dòng không hợp lệ (không có Model hoặc Kiểm Tra = 0)
      pivotRawData = pivotRawData.filter(row => {
        return row['Model'] && 
               row['Model'].trim() !== '' && 
               row['Model'] !== 'Model Name' && // Bỏ header
               row['Kiểm Tra'] > 0;
      });

      // Hiển thị file info
      document.getElementById('pivot-file-info').innerHTML = `
        <div style="color: #10b981; font-weight: 500;">
          <i class="fas fa-check-circle"></i> File: ${file.name}<br>
          <i class="fas fa-list"></i> Dòng: ${pivotRawData.length}
        </div>
      `;

      // Ẩn upload, hiển thị pivot
      document.getElementById('pivot-upload-section').style.display = 'none';
      document.getElementById('pivot-table-ui').style.display = 'block';

      // Tạo Pivot Table
      createIndependentPivotTable();

      Swal.fire('✅ Thành công', 'File đã được tải lên thành công!', 'success');

    } catch (error) {
      Swal.fire('❌ Lỗi', 'Lỗi xử lý file: ' + error.message, 'error');
      console.error(error);
    }
  };
  reader.readAsBinaryString(file);
}

function createIndependentPivotTable() {
  if (pivotRawData.length === 0) {
    document.getElementById('pivot-table-ui').innerHTML = '<p style="color:#999; text-align:center; padding:40px;">Không có dữ liệu</p>';
    return;
  }

  const elem = document.getElementById('pivot-table-ui');
  elem.innerHTML = '';

  // Tạo pivot table với cấu hình dễ hiểu hơn
  $(elem).pivot(pivotRawData, {
    rows: ['Ngày'],
    cols: ['Model'],
    vals: ['Kiểm Tra'],
    aggregatorName: 'Sum',
    rendererName: 'Table Heatmap',
    sorters: {
      'Ngày': $.pivotUtilities.sortAs
    },
    renderers: $.extend(
      $.pivotUtilities.renderers,
      $.pivotUtilities.plotly_renderers
    )
  });

  // Thêm phân tích Top Models & Defects
  const analysisHTML = generateTopModelsAnalysis();
  elem.innerHTML += analysisHTML;
}

function generateTopModelsAnalysis() {
  // Tính tổng lỗi theo model
  const modelStats = {};
  const modelDefects = {};

  pivotRawData.forEach(row => {
    const model = row['Model'] || '';
    
    // Bỏ qua nếu không có tên model hợp lệ
    if (!model || model.trim() === '' || model === 'Model Name') return;
    
    const kiemTra = row['Kiểm Tra'] || 0;
    const loi = row['Lỗi'] || 0;

    if (!modelStats[model]) {
      modelStats[model] = { totalKiemTra: 0, totalLoi: 0 };
      modelDefects[model] = {};
    }

    modelStats[model].totalKiemTra += kiemTra;
    modelStats[model].totalLoi += loi;

    // Tính từng loại lỗi
    const defectTypes = ['Contamination', 'ColorIssue', 'MidsoleQuality', 'Delamination_Large', 'Delamination_Small'];
    defectTypes.forEach(type => {
      const qty = row[type] || 0;
      if (qty > 0) {
        if (!modelDefects[model][type]) {
          modelDefects[model][type] = 0;
        }
        modelDefects[model][type] += qty;
      }
    });
  });

  // Tính tỷ lệ lỗi
  Object.keys(modelStats).forEach(model => {
    const stat = modelStats[model];
    stat.defectRate = stat.totalKiemTra > 0 ? (stat.totalLoi / stat.totalKiemTra * 100).toFixed(2) : 0;
  });

  // Lấy top 5 models với tỷ lệ lỗi cao nhất
  const topModels = Object.entries(modelStats)
    .sort((a, b) => b[1].defectRate - a[1].defectRate)
    .slice(0, 5);

  let html = '<div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid var(--bd);">';
  html += '<h3 style="color: var(--tx); margin-bottom: 20px; font-size: 14px;"><i class="fas fa-exclamation-triangle"></i> TOP 5 MODEL CÓ TỶ LỆ LỖI CAO NHẤT</h3>';

  html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px;">';

  topModels.forEach((item, idx) => {
    const model = item[0];
    const stat = item[1];
    const defects = modelDefects[model] || {};

    // Sắp xếp top 3 lỗi
    const top3Defects = Object.entries(defects)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const defectNames = {
      'Contamination': '🔴 Nhiễm bẩn',
      'ColorIssue': '🟡 Lỗi màu sắc',
      'MidsoleQuality': '🟠 Chất lượng đế giữa',
      'Delamination_Large': '🔵 Tách lớp lớn',
      'Delamination_Small': '🟣 Tách lớp nhỏ'
    };

    const rateColor = stat.defectRate >= 5 ? '#E03030' : stat.defectRate >= 2 ? '#FF8C00' : '#00C45A';

    html += `<div style="background: var(--bg3); border: 1px solid var(--bd); border-radius: 8px; padding: 15px; border-left: 4px solid ${rateColor};">`;
    html += `<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">`;
    html += `<div>`;
    html += `<div style="font-weight: 700; color: var(--tx); font-size: 13px; margin-bottom: 4px;">#${idx + 1} ${model}</div>`;
    html += `<div style="color: var(--tx2); font-size: 12px;">Kiểm: ${stat.totalKiemTra} | Lỗi: ${stat.totalLoi}</div>`;
    html += `</div>`;
    html += `<div style="background: ${rateColor}20; color: ${rateColor}; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 13px;">`;
    html += `${stat.defectRate}%`;
    html += `</div>`;
    html += `</div>`;

    html += `<div style="background: var(--bg2); padding: 10px; border-radius: 6px;">`;
    html += `<div style="color: var(--tx2); font-size: 11px; font-weight: 600; margin-bottom: 8px;">TOP 3 LỖI:</div>`;

    top3Defects.forEach((defect, defIdx) => {
      const defectType = defect[0];
      const defectQty = defect[1];
      const defectPercent = ((defectQty / stat.totalLoi) * 100).toFixed(1);
      const defectName = defectNames[defectType] || defectType;

      html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 6px; background: var(--bg3); border-radius: 4px;">`;
      html += `<span style="color: var(--tx2); font-size: 11px;">`;
      html += `${defectName}<br><span style="color: var(--tx3); font-size: 10px;">${defectQty} cái</span>`;
      html += `</span>`;
      html += `<span style="background: var(--bd2); color: var(--tx); padding: 3px 8px; border-radius: 3px; font-size: 10px; font-weight: 600;">`;
      html += `${defectPercent}%`;
      html += `</span>`;
      html += `</div>`;
    });

    if (top3Defects.length === 0) {
      html += `<div style="color: var(--tx3); font-size: 11px; text-align: center; padding: 10px;">Không có dữ liệu lỗi chi tiết</div>`;
    }

    html += `</div>`;
    html += `</div>`;
  });

  html += '</div>';
  html += '</div>';

  // Thêm Data Verification Section
  html += generateDataVerification();

  return html;
}

function generateDataVerification() {
  let html = '<div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid var(--bd);">';
  html += '<h3 style="color: var(--tx); margin-bottom: 20px; font-size: 14px;"><i class="fas fa-check-circle"></i> XÁC MINH DỮ LIỆU (DATA VERIFICATION)</h3>';

  // Tính tổng từ dữ liệu gốc
  let totalKiemTra = 0;
  let totalLoi = 0;
  let totalDat = 0;
  const modelData = {};

  pivotRawData.forEach(row => {
    const model = row['Model'] || '';
    
    // Bỏ qua nếu không có tên model hợp lệ
    if (!model || model.trim() === '' || model === 'Model Name') return;
    
    const kiemTra = row['Kiểm Tra'] || 0;
    const loi = row['Lỗi'] || 0;
    const dat = row['Đạt'] || 0;

    totalKiemTra += kiemTra;
    totalLoi += loi;
    totalDat += dat;

    if (!modelData[model]) {
      modelData[model] = { kiemTra: 0, loi: 0, dat: 0 };
    }
    modelData[model].kiemTra += kiemTra;
    modelData[model].loi += loi;
    modelData[model].dat += dat;
  });

  const avgDefectRate = totalKiemTra > 0 ? (totalLoi / totalKiemTra * 100).toFixed(2) : 0;

  html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">';

  // Tổng kết chung
  html += '<div style="background: var(--bg3); padding: 15px; border-radius: 8px; border-left: 4px solid #00C45A;">';
  html += '<h4 style="color: var(--tx); margin-bottom: 15px; font-size: 13px;">📊 TỔNG KẾT CHUNG</h4>';
  html += '<table style="width: 100%; font-size: 12px; color: var(--tx2);">';
  html += '<tr><td>Tổng số dòng dữ liệu:</td><td style="text-align: right; font-weight: 700; color: var(--tx);">' + pivotRawData.length + '</td></tr>';
  html += '<tr><td>Tổng kiểm tra:</td><td style="text-align: right; font-weight: 700; color: var(--tx);">' + totalKiemTra.toLocaleString() + ' prs</td></tr>';
  html += '<tr><td>Tổng đạt:</td><td style="text-align: right; font-weight: 700; color: #00C45A;">' + totalDat.toLocaleString() + ' prs</td></tr>';
  html += '<tr><td>Tổng lỗi:</td><td style="text-align: right; font-weight: 700; color: #E03030;">' + totalLoi.toLocaleString() + ' prs</td></tr>';
  html += '<tr><td style="border-top: 1px solid var(--bd); padding-top: 8px;">Tỷ lệ lỗi trung bình:</td><td style="border-top: 1px solid var(--bd); padding-top: 8px; text-align: right; font-weight: 700; color: #FF8C00;">' + avgDefectRate + '%</td></tr>';
  html += '</table>';
  html += '</div>';

  // Top 5 models kiểm tra nhiều nhất
  const topModels = Object.entries(modelData)
    .sort((a, b) => b[1].kiemTra - a[1].kiemTra)
    .slice(0, 5);

  html += '<div style="background: var(--bg3); padding: 15px; border-radius: 8px; border-left: 4px solid #3A7BD5;">';
  html += '<h4 style="color: var(--tx); margin-bottom: 15px; font-size: 13px;">🏆 TOP 5 MODEL ĐƯỢC KIỂM TRA NHIỀU NHẤT</h4>';
  html += '<table style="width: 100%; font-size: 11px; color: var(--tx2);">';
  html += '<tr style="border-bottom: 1px solid var(--bd); color: var(--tx3);"><th style="text-align: left; padding: 5px 0;">#</th><th style="text-align: left;">Model</th><th style="text-align: right;">Kiểm tra</th><th style="text-align: right;">Lỗi</th><th style="text-align: right;">%</th></tr>';
  
  topModels.forEach((item, idx) => {
    const model = item[0];
    const data = item[1];
    const rate = data.kiemTra > 0 ? (data.loi / data.kiemTra * 100).toFixed(2) : 0;
    const rateColor = rate >= 5 ? '#E03030' : rate >= 2 ? '#FF8C00' : '#00C45A';
    
    html += '<tr style="border-bottom: 1px solid var(--bd2);">';
    html += '<td style="padding: 5px 0; color: var(--tx3);">' + (idx + 1) + '</td>';
    html += '<td style="color: var(--tx);">' + model + '</td>';
    html += '<td style="text-align: right; color: var(--tx);">' + data.kiemTra.toLocaleString() + '</td>';
    html += '<td style="text-align: right; color: #E03030;">' + data.loi.toLocaleString() + '</td>';
    html += '<td style="text-align: right; color: ' + rateColor + '; font-weight: 700;">' + rate + '%</td>';
    html += '</tr>';
  });
  html += '</table>';
  html += '</div>';

  html += '</div>';

  // Công thức tính
  html += '<div style="background: rgba(58, 123, 213, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #3A7BD5;">';
  html += '<h4 style="color: var(--tx); margin-bottom: 10px; font-size: 13px;"><i class="fas fa-calculator"></i> CÔNG THỨC TÍNH TOÁN</h4>';
  html += '<div style="font-size: 11px; color: var(--tx2); line-height: 1.8;">';
  html += '<div>• <strong style="color: var(--tx);">Tỷ lệ lỗi (%)</strong> = (Tổng lỗi / Tổng kiểm tra) × 100</div>';
  html += '<div>• <strong style="color: var(--tx);">Số đạt</strong> = Tổng kiểm tra - Tổng lỗi</div>';
  html += '<div>• <strong style="color: var(--tx);">TOP 5 Model có lỗi cao</strong> = Sắp xếp theo tỷ lệ lỗi (%) giảm dần</div>';
  html += '<div>• <strong style="color: var(--tx);">TOP 3 Lỗi</strong> = Tổng từng loại lỗi (Contamination, ColorIssue, MidsoleQuality, Delamination_Large, Delamination_Small)</div>';
  html += '</div>';
  html += '</div>';

  html += '</div>';

  return html;
}

function exportPivotData() {
  if (pivotRawData.length === 0) {
    Swal.fire('⚠️ Cảnh báo', 'Không có dữ liệu để xuất', 'warning');
    return;
  }

  try {
    const ws = XLSX.utils.json_to_sheet(pivotRawData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pivot Data');
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
    XLSX.writeFile(wb, `Pivot_Analysis_${timestamp}.xlsx`);
    
    Swal.fire('✅ Thành công', 'Dữ liệu đã được xuất', 'success');
  } catch (error) {
    Swal.fire('❌ Lỗi', 'Lỗi xuất dữ liệu: ' + error.message, 'error');
  }
}
