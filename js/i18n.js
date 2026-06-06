// ═══════════════════════════════════════
// LANGUAGE SYSTEM
// ═══════════════════════════════════════
let LANG = 'vi';

const I18N = {
  vi: {
    // topbar
    subtitle: 'Bảng kết quả chất lượng gia công đế ngoài',
    btnUpload: '⬆ Upload Excel',
    btnPNG: '🖼 Xuất PNG',
    btnPPT: '📊 Xuất PPT',
    btnAdd: '➕ Thêm dữ liệu',
    // tabs
    tabDashboard: '📊 Dashboard',
    tabData: '📋 Dữ liệu',
    tabUpload: '⬆ Upload / Nhập liệu',
    // no-data
    noDataTitle: 'Chưa có dữ liệu',
    noDataSub: 'Upload Excel hoặc thêm dữ liệu thủ công để bắt đầu',
    noDataBtn: 'Tải dữ liệu mẫu',
    // filter bar
    fFrom: 'Từ:', fTo: 'Đến:', fLine: 'Line:', fModel: 'Model:',
    fSearchPlaceholder: 'Tìm theo line, model, lỗi...',
    fBtn: 'Lọc', fClearBtn: '✕ Xóa',
    fAll: 'Tất cả',
    fFiltering: 'Đang lọc',
    fRows: 'dòng',
    fResults: 'kết quả',
    // kpi labels
    kpiInspected: 'Số Lượng Kiểm Tra',
    kpiRFT: 'RFT Tổng Thể',
    kpiDefects: 'Tổng Lỗi',
    kpiDR: 'Tỷ Lệ Lỗi (Lỗi ÷ Kiểm Tra)',
    kpiLines: 'Dây Chuyền',
    kpiTarget: 'Mục tiêu',
    kpiPass: 'đạt mục tiêu',
    kpiPairs: 'pairs / đôi',
    kpiDefectsFound: 'lỗi phát hiện',
    kpiBadgePass: '✓ ĐẠT',
    kpiBadgeFail: '⚠ DƯỚI MỤC TIÊU',
    // bar chart
    barTitle: 'RFT Xếp Hạng Dây Chuyền',
    barMucTieu: 'Mục tiêu',
    barLegPass: 'Đạt',
    barLegNear: 'Gần đạt',
    barLegFail: 'Không đạt',
    // best/worst
    bestTitle: '🏆 Top 3 Dây Chuyền Tốt Nhất',
    worstTitle: '⚠️ Top 3 Dây Chuyền Kém Nhất',
    inspected: 'Kiểm tra',
    defects: 'Lỗi',
    defectRate: 'Tỷ lệ lỗi',
    // pareto
    paretoTitle: 'Pareto Lỗi',
    // heatmap
    heatmapTitle: 'Bản Đồ Nhiệt Lỗi',
    hmLow: 'Thấp', hmMed: 'Trung bình', hmHigh: 'Cao', hmVHigh: 'Rất cao',
    // model
    modelTitle: 'So Sánh Model (Tốt → Kém)',
    modelDRNote: 'Tỷ lệ lỗi = Số lỗi ÷ Tổng số lượng kiểm tra',
    modelDRShort: 'Tỷ lệ lỗi',
    // conclusion
    concTitle: '📋 Kết Luận Quản Lý',
    concGeneral: 'Tình Trạng Chung',
    concTop3: 'Top 3 Lỗi',
    concPriority: 'Ưu Tiên Cải Tiến',
    concLinesPass: 'dây chuyền đạt mục tiêu',
    concOnTarget: '✓ Đang đạt mục tiêu',
    concOffTarget: '⚠ Cần hành động khẩn cấp',
    concAudit: '✓ Audit quy trình làm sạch toàn line',
    concStd: '✓ Chuẩn hóa dán đế line kém',
    concBest: 'Tốt nhất',
    concWorst: 'Kém nhất',
    // data table
    dtDate: 'Ngày', dtLine: 'Line', dtModel: 'Model',
    dtQty: 'SL Kiểm Tra', dtRFT: 'RFT%', dtDefects: 'Tổng Lỗi',
    dtDR: 'Tỷ Lệ Lỗi%', dtD1: 'Lỗi 1', dtD2: 'Lỗi 2', dtD3: 'Lỗi 3', dtQtyS: 'SL',
    dtCount: 'dòng',
    dtClearAll: '🗑 Xóa tất cả',
    confirmClear: 'Xóa toàn bộ dữ liệu?',
    confirmMerge: 'dòng.\nOK = Gộp thêm   |   Cancel = Thay thế',
    noDataAlert: 'Không có dữ liệu.',
    // upload
    uploadTitle: 'Kéo thả hoặc click để upload',
    uploadSub: 'Hỗ trợ .xlsx, .xls',
    uploadStructTitle: 'Cấu trúc file Excel',
    // manual form
    formTitle: 'Thêm dữ liệu thủ công',
    formDate: 'Ngày kiểm tra',
    formLine: 'Dây chuyền (Line)',
    formLinePH: 'VD: GCD_C1',
    formModel: 'Model',
    formModelPH: 'VD: ADISTAR CONTROL 5',
    formQty: 'SL Kiểm Tra (pairs)',
    formQtyPH: '500',
    formRFT: 'RFT % (bỏ trống = tự tính)',
    formDefects: 'Top lỗi (tên — số lượng)',
    formD1PH: 'Tên lỗi 1', formD2PH: 'Tên lỗi 2', formD3PH: 'Tên lỗi 3', formDqPH: 'SL',
    formAddBtn: '➕ Thêm vào dữ liệu',
    formRequired: '⚠ Vui lòng điền Line, Model và SL Kiểm tra',
    formSuccess: '✅ Đã thêm thành công!',
    sampleLoaded: '✅ Đã tải dữ liệu mẫu',
  },
  zh: {
    subtitle: '外底加工质量绩效仪表板',
    btnUpload: '⬆ 上传 Excel',
    btnPNG: '🖼 导出 PNG',
    btnPPT: '📊 导出 PPT',
    btnAdd: '➕ 添加数据',
    tabDashboard: '📊 仪表板',
    tabData: '📋 数据',
    tabUpload: '⬆ 上传 / 录入',
    noDataTitle: '暂无数据',
    noDataSub: '请上传 Excel 文件或手动添加数据',
    noDataBtn: '加载示例数据',
    fFrom: '从:', fTo: '至:', fLine: '生产线:', fModel: '型号:',
    fSearchPlaceholder: '搜索线体、型号、缺陷...',
    fBtn: '筛选', fClearBtn: '✕ 清除',
    fAll: '全部',
    fFiltering: '正在筛选',
    fRows: '条',
    fResults: '条结果',
    kpiInspected: '检验数量',
    kpiRFT: '总体合格率 RFT',
    kpiDefects: '总缺陷数',
    kpiDR: '缺陷率（缺陷 ÷ 检验）',
    kpiLines: '生产线数',
    kpiTarget: '目标',
    kpiPass: '达标',
    kpiPairs: '双',
    kpiDefectsFound: '个缺陷',
    kpiBadgePass: '✓ 达标',
    kpiBadgeFail: '⚠ 未达标',
    barTitle: 'RFT 生产线排名',
    barMucTieu: '目标',
    barLegPass: '达标',
    barLegNear: '接近达标',
    barLegFail: '未达标',
    bestTitle: '🏆 Top 3 最佳生产线',
    worstTitle: '⚠️ Top 3 最差生产线',
    inspected: '检验量',
    defects: '缺陷',
    defectRate: '缺陷率',
    paretoTitle: '缺陷帕累托分析',
    heatmapTitle: '缺陷热力图',
    hmLow: '低', hmMed: '中', hmHigh: '高', hmVHigh: '极高',
    modelTitle: '型号对比（优→劣）',
    modelDRNote: '缺陷率 = 缺陷数 ÷ 检验总量',
    modelDRShort: '缺陷率',
    concTitle: '📋 管理结论',
    concGeneral: '总体状况',
    concTop3: '前3大缺陷',
    concPriority: '改进优先级',
    concLinesPass: '条生产线达标',
    concOnTarget: '✓ 当前达标',
    concOffTarget: '⚠ 需要紧急措施',
    concAudit: '✓ 审核全线清洁流程',
    concStd: '✓ 规范较差生产线的粘合工序',
    concBest: '最优',
    concWorst: '最差',
    dtDate: '日期', dtLine: '生产线', dtModel: '型号',
    dtQty: '检验数量', dtRFT: 'RFT%', dtDefects: '总缺陷',
    dtDR: '缺陷率%', dtD1: '缺陷1', dtD2: '缺陷2', dtD3: '缺陷3', dtQtyS: '数量',
    dtCount: '条',
    dtClearAll: '🗑 清空全部',
    confirmClear: '清空所有数据？',
    confirmMerge: '条记录。\nOK = 合并追加   |   取消 = 替换',
    noDataAlert: '暂无数据。',
    uploadTitle: '拖放或点击上传',
    uploadSub: '支持 .xlsx, .xls',
    uploadStructTitle: 'Excel 文件结构',
    formTitle: '手动添加数据',
    formDate: '检验日期',
    formLine: '生产线',
    formLinePH: '例: GCD_C1',
    formModel: '型号',
    formModelPH: '例: ADISTAR CONTROL 5',
    formQty: '检验数量 (双)',
    formQtyPH: '500',
    formRFT: 'RFT % (留空=自动计算)',
    formDefects: '主要缺陷（名称 — 数量）',
    formD1PH: '缺陷名称1', formD2PH: '缺陷名称2', formD3PH: '缺陷名称3', formDqPH: '数量',
    formAddBtn: '➕ 添加到数据',
    formRequired: '⚠ 请填写生产线、型号和检验数量',
    formSuccess: '✅ 添加成功！',
    sampleLoaded: '✅ 已加载示例数据',
  },
  en: {
    subtitle: 'Stockfitting Quality Performance Dashboard',
    btnUpload: '⬆ Upload Excel',
    btnPNG: '🖼 Export PNG',
    btnPPT: '📊 Export PPT',
    btnAdd: '➕ Add Data',
    tabDashboard: '📊 Dashboard',
    tabData: '📋 Data',
    tabUpload: '⬆ Upload / Entry',
    noDataTitle: 'No Data Available',
    noDataSub: 'Upload an Excel file or add data manually to get started',
    noDataBtn: 'Load Sample Data',
    fFrom: 'From:', fTo: 'To:', fLine: 'Line:', fModel: 'Model:',
    fSearchPlaceholder: 'Search by line, model, defect...',
    fBtn: 'Filter', fClearBtn: '✕ Clear',
    fAll: 'All',
    fFiltering: 'Filtering',
    fRows: 'rows',
    fResults: 'results',
    kpiInspected: 'Inspected Quantity',
    kpiRFT: 'Overall RFT Rate',
    kpiDefects: 'Total Defects',
    kpiDR: 'Defect Rate (Defects ÷ Inspected)',
    kpiLines: 'Production Lines',
    kpiTarget: 'Target',
    kpiPass: 'on target',
    kpiPairs: 'pairs',
    kpiDefectsFound: 'defects found',
    kpiBadgePass: '✓ ON TARGET',
    kpiBadgeFail: '⚠ BELOW TARGET',
    barTitle: 'RFT Line Ranking',
    barMucTieu: 'Target',
    barLegPass: 'On Target',
    barLegNear: 'Near Target',
    barLegFail: 'Below Target',
    bestTitle: '🏆 Top 3 Best Lines',
    worstTitle: '⚠️ Top 3 Worst Lines',
    inspected: 'Inspected',
    defects: 'Defects',
    defectRate: 'Defect Rate',
    paretoTitle: 'Defect Pareto Analysis',
    heatmapTitle: 'Defect Heat Map',
    hmLow: 'Low', hmMed: 'Medium', hmHigh: 'High', hmVHigh: 'Very High',
    modelTitle: 'Model Comparison (Best → Worst)',
    modelDRNote: 'Defect Rate = Defect Count ÷ Total Inspected',
    modelDRShort: 'Defect Rate',
    concTitle: '📋 Management Conclusion',
    concGeneral: 'Overall Status',
    concTop3: 'Top 3 Defects',
    concPriority: 'Improvement Priorities',
    concLinesPass: 'lines on target',
    concOnTarget: '✓ Currently on target',
    concOffTarget: '⚠ Urgent action required',
    concAudit: '✓ Audit cleaning process across all lines',
    concStd: '✓ Standardize sole bonding on weak lines',
    concBest: 'Best',
    concWorst: 'Worst',
    dtDate: 'Date', dtLine: 'Line', dtModel: 'Model',
    dtQty: 'Inspected Qty', dtRFT: 'RFT%', dtDefects: 'Total Defects',
    dtDR: 'Defect Rate%', dtD1: 'Defect 1', dtD2: 'Defect 2', dtD3: 'Defect 3', dtQtyS: 'Qty',
    dtCount: 'rows',
    dtClearAll: '🗑 Clear All',
    confirmClear: 'Delete all data?',
    confirmMerge: ' rows.\nOK = Merge   |   Cancel = Replace',
    noDataAlert: 'No data available.',
    uploadTitle: 'Drag & drop or click to upload',
    uploadSub: 'Supports .xlsx, .xls',
    uploadStructTitle: 'Excel File Structure',
    formTitle: 'Add Data Manually',
    formDate: 'Inspection Date',
    formLine: 'Production Line',
    formLinePH: 'e.g. GCD_C1',
    formModel: 'Model',
    formModelPH: 'e.g. ADISTAR CONTROL 5',
    formQty: 'Inspected Qty (pairs)',
    formQtyPH: '500',
    formRFT: 'RFT % (leave blank = auto)',
    formDefects: 'Top defects (name — quantity)',
    formD1PH: 'Defect name 1', formD2PH: 'Defect name 2', formD3PH: 'Defect name 3', formDqPH: 'Qty',
    formAddBtn: '➕ Add to Data',
    formRequired: '⚠ Please fill in Line, Model and Inspected Qty',
    formSuccess: '✅ Added successfully!',
    sampleLoaded: '✅ Sample data loaded',
  }
};

function t(key) { 
  return (I18N[LANG] || I18N['vi'])[key] || key; 
}

function setLang(lang) {
  LANG = lang;
  ['vi', 'zh', 'en'].forEach(function(l) {
    document.getElementById('lang-' + l).classList.toggle('active', l === lang);
  });
  applyLang();
  renderAll();
  if (document.getElementById('panel-data').classList.contains('active')) renderTable();
}

function applyLang() {
  // subtitle
  document.querySelector('.title-block small').textContent = t('subtitle');

  // buttons
  setTxt('btn-export-png', t('btnPNG'));
  setTxt('btn-export-ppt', t('btnPPT'));
  setTxt('btn-add-data', t('btnAdd'));

  // tabs
  setTxt('tab-dashboard', t('tabDashboard'));
  setTxt('tab-data', t('tabData'));
  setTxt('tab-upload', t('tabUpload'));

  // no-data
  setTxt('no-data-title', t('noDataTitle'));
  setTxt('no-data-sub', t('noDataSub'));
  setTxt('no-data-btn', t('noDataBtn'));

  // filter bar
  applyFilterBarLang();

  // data table header
  var dtHead = document.querySelector('#dt thead tr');
  if (dtHead) {
    var keys = ['dtDate', 'dtLine', 'dtModel', 'dtQty', 'dtRFT', 'dtDefects', 'dtDR', 'dtD1', 'dtQtyS', 'dtD2', 'dtQtyS', 'dtD3', 'dtQtyS'];
    var ths = dtHead.querySelectorAll('th');
    keys.forEach(function(k, i) { if (ths[i]) ths[i].textContent = t(k); });
  }

  setAttr('f-search', 'placeholder', t('fSearchPlaceholder'));
}

function applyFilterBarLang() {
  var fbar = document.querySelector('.fbar');
  if (!fbar) return;
  var labels = fbar.querySelectorAll('label:not([class])');
  var keys = ['fFrom', 'fTo', 'fLine', 'fModel'];
  labels.forEach(function(el, i) { if (keys[i]) el.textContent = t(keys[i]); });
  var fBtns = fbar.querySelectorAll('button.bx');
  if (fBtns[0]) fBtns[0].textContent = t('fBtn');
  if (fBtns[1]) fBtns[1].textContent = t('fClearBtn');

  ['f-line', 'f-model'].forEach(function(id) {
    var sel = document.getElementById(id);
    if (sel && sel.options[0] && sel.options[0].value === '') {
      sel.options[0].text = t('fAll');
    }
  });
}

function setTxt(id, txt) { 
  var el = document.getElementById(id); 
  if (el) el.textContent = txt; 
}

function setAttr(id, attr, val) { 
  var el = document.getElementById(id); 
  if (el) el.setAttribute(attr, val); 
}
