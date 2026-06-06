# Stockfitting Quality Dashboard v7 - Modular Structure

## Cấu trúc thư mục

```
Tool/
├── index_v7.html              # File HTML chính (gọn gàng)
├── stockfitting_quality_ver_6.html  # File gốc (backup)
├── css/
│   └── style.css              # Tất cả CSS (đã tách từ file gốc)
├── js/
│   ├── config.js              # Constants & config (TARGET, DMAP...)
│   ├── i18n.js                # Hệ thống đa ngôn ngữ (VI/ZH/EN)
│   ├── data.js                # Data management (compute, filter, search...)
│   ├── upload.js              # File upload & Excel reading
│   ├── render.js              # Dashboard rendering (KPI, charts, tables...)
│   ├── export.js              # Export PNG & PPT functions
│   └── main.js                # Init & event handlers
└── README_v7.md               # File này
```

## Tính năng chính

### 1. **Modular** - Dễ bảo trì
- Mỗi module đảm nhận 1 chức năng riêng
- Dễ tìm kiếm và sửa lỗi
- Có thể thêm feature mới mà không ảnh hưởng code cũ

### 2. **Formulas mới (theo định nghĩa QA/QC chuẩn)**
```javascript
Released = Inspected - Defect
RFT% = (Released / Inspected) × 100
% Defect = (Defect / Inspected) × 100
% Top lỗi = (qty_lỗi / Tổng_Defect_Line) × 100
```

### 3. **Import file Excel (File 2 format)**
Hỗ trợ đọc file raw data với cấu trúc:
- `LEAN` (GCD_C1, GCD_C2...)
- `Model` (tên sản phẩm)
- `Total inspect Qty` (số lượng kiểm tra)
- `Total released Qty` (số lượng đạt)
- `Total defect Qty` (số lượng lỗi)
- `% RFT`
- `Top 1/2/3 defect QTY` + tên lỗi
- `% Defect 1/2/3`

### 4. **Aggregate theo LEAN**
Tự động tổng hợp tất cả records có cùng LEAN → hiển thị như File 1

## File JS chính cần tạo tiếp

### `config.js`
```javascript
const TARGET = 85;
const TITLE = 'STOCKFITTING QUALITY STATUS';
const DMAP = {
  'Soiling': {vi:'Bẩn bề mặt', zh:'表面污染'},
  'Bottom part bonding': {vi:'Lỗi dán đế', zh:'底部粘合'},
  // ...
};
```

### `data.js`
- `allRows`, `filteredRows` (state)
- `calcRow()` - tính inspected/released từ RFT
- `compute()` - aggregate theo line/model
- `applyFilter()`, `clearFilter()` - search & filter

### `upload.js`
- `setupFile()` - drag & drop handlers
- `readXLSX()` - parse Excel
- `addRow()` - manual form submission

### `render.js`
- `renderKPI()` - 5 KPI cards
- `renderBar()` - RFT ranking chart
- `renderBestWorst()` - Top 3 best/worst lines
- `renderPareto()` - Defect pareto
- `renderHeatmap()` - Defect heatmap
- `renderModel()` - Model comparison
- `renderConc()` - Management conclusion
- `renderTable()` - Data table

### `export.js`
- `buildInfographic()` - Generate PNG-ready HTML
- `exportPNG()` - html2canvas
- `doExportPPT()` - PptxGenJS (3 slides)

### `main.js`
```javascript
// Init
setupFile();
applyLang();
loadSample();

// Event handlers
function showTab(id) { ... }
function setLang(lang) { ... }
```

## Cách sử dụng

1. Mở `index_v7.html` trong browser
2. Upload file Excel (hoặc dùng "Tải dữ liệu mẫu")
3. View dashboard → Xuất PNG / PPT

## So sánh với v6

| Aspect | v6 (single file) | v7 (modular) |
|---|---|---|
| **Lines of code per file** | ~1593 | <300 mỗi file |
| **Maintainability** | ⚠️ Khó | ✅ Dễ |
| **Load time** | Fast | Fast (parallel load) |
| **Debugging** | ⚠️ Scroll hell | ✅ Clear modules |
| **Team collaboration** | ⚠️ Conflict prone | ✅ Separate files |

## Tiếp theo

Bạn cần tôi:
1. ✅ Tạo các file JS còn lại (config, data, upload, render, export, main)?
2. Test với file Excel thật?
3. Deploy lên server?
