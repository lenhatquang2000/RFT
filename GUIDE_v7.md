# Hướng dẫn sử dụng Stockfitting Quality Dashboard v7

## ✅ Đã hoàn thành

### Cấu trúc file
```
Tool/
├── index_v7.html         ✅ File HTML chính
├── css/
│   └── style.css         ✅ Toàn bộ CSS
└── js/
    ├── config.js         ✅ Constants (TARGET, DMAP...)
    ├── i18n.js           ✅ Đa ngôn ngữ (VI/ZH/EN)
    ├── data.js           ✅ Data logic (compute theo LEAN)
    ├── upload.js         ✅ Upload Excel + Manual form
    ├── render.js         ⚠️  Basic render (KPI, Bar, Table) - cần complete
    ├── export.js         ⚠️  Placeholder - cần implement
    └── main.js           ✅ Init
```

## 🎯 Công thức mới (QA/QC chuẩn)

**Đã implement trong `data.js`:**
```javascript
Released = Inspected - Defect
RFT% = (Released / Inspected) × 100
% Defect = (Defect / Inspected) × 100
% Top lỗi (per line) = (qty_lỗi / Tổng_Defect_Line) × 100
```

## 📊 File Excel hỗ trợ (File 2 format)

**Cột cần có:**
- `LEAN` (GCD_C1, GCD_C2...)
- `Model` hoặc `Article`
- `Total inspect Qty` (số lượng kiểm tra)
- `Total released Qty` (số lượng đạt)
- `Total defect Qty` (số lượng lỗi)
- `% RFT` (tỷ lệ RFT)
- `Top 1/2/3 defect QTY` (số lượng lỗi top 1/2/3)
- `1./2./3. DFname` (tên lỗi)
- `QcDate` hoặc `Date` (ngày kiểm tra)

**Tự động tổng hợp:**
- File 2 (raw data) → aggregate theo LEAN → hiển thị như File 1
- Ví dụ: nhiều dòng có `LEAN = GCD_C1` → tự động gộp thành 1 line trong dashboard

## 🚀 Cách sử dụng

### 1. Mở file
```bash
# Windows: double-click
index_v7.html

# Hoặc chạy local server (recommended)
python -m http.server 8000
# Sau đó mở: http://localhost:8000/index_v7.html
```

### 2. Upload data
- Click "Upload Excel" → chọn file Excel (format File 2)
- Hoặc click "Tải dữ liệu mẫu" để xem demo
- Hoặc thêm thủ công qua tab "⬆ Upload / Nhập liệu"

### 3. View dashboard
- Tab **📊 Dashboard**: KPI + charts + analysis
- Tab **📋 Dữ liệu**: Bảng raw data
- Tab **⬆ Upload**: Upload/manual entry

### 4. Filter & Search
- Lọc theo ngày (Từ → Đến)
- Lọc theo Line
- Lọc theo Model
- Search text (tìm theo line, model, lỗi...)

### 5. Export (⚠️ chưa hoàn thiện)
- PNG: placeholder
- PPT: placeholder
- → Dùng file `stockfitting_quality_ver_6.html` nếu cần xuất ngay

## 🔄 So sánh v6 vs v7

| Feature | v6 (single file) | v7 (modular) |
|---|---|---|
| **File size** | 1 file × 1593 lines | 8 files × <300 lines/file |
| **Logic** | Old (ước tính inspected) | ✅ New (Released = Inspected - Defect) |
| **Aggregate** | Manual | ✅ Auto (theo LEAN) |
| **Maintainability** | ⚠️ Hard | ✅ Easy |
| **Export PNG/PPT** | ✅ Full | ⚠️ Placeholder |
| **Dashboard** | ✅ Full | ⚠️ Basic (KPI, Bar, Table OK) |

## 📝 TODO - Cần hoàn thiện

### Render.js (ưu tiên cao)
- [ ] `renderBestWorst()` - Top 3 best/worst lines với topD
- [ ] `renderPareto()` - Defect pareto chart
- [ ] `renderHeatmap()` - Defect heatmap
- [ ] `renderModel()` - Model comparison
- [ ] `renderConc()` - Management conclusion

### Export.js (ưu tiên trung bình)
- [ ] `buildInfographic()` - Generate infographic HTML
- [ ] `exportPNG()` - html2canvas implementation
- [ ] `doExportPPT()` - PptxGenJS implementation

### Upload.js (hoàn thiện hơn)
- [ ] Hỗ trợ thêm các biến thể column name
- [ ] Validation mạnh hơn
- [ ] Preview trước khi import

## 🐛 Known Issues

1. **Export PNG/PPT chưa hoạt động** → Dùng v6 tạm thời
2. **Một số charts chưa render** → Đang là placeholder
3. **Sample data ít** → Cần add thêm data mẫu đầy đủ

## 💡 Tips

### Để test nhanh:
```javascript
// Mở Console (F12) và chạy:
loadSample();  // Tải dữ liệu mẫu
renderAll();   // Render lại dashboard
```

### Để debug:
```javascript
console.log(allRows);        // Xem raw data
console.log(filteredRows);   // Xem filtered data
console.log(compute(filteredRows)); // Xem computed aggregation
```

### Để thêm defect mapping:
```javascript
// Sửa trong js/config.js
const DMAP = {
  'Your Defect Name': {vi:'Tên tiếng Việt', zh:'中文名称'},
  // ...
};
```

## 📞 Support

Nếu có vấn đề:
1. Check Console (F12) xem có lỗi JS không
2. Verify file Excel đúng format
3. Thử dùng sample data trước
4. Tham khảo `stockfitting_quality_ver_6.html` (backup đầy đủ)

## 🎉 Next Steps

Bạn muốn tôi:
1. **Hoàn thiện render.js** (implement đầy đủ các charts)?
2. **Implement export PNG/PPT**?
3. **Add more sample data**?
4. **Fix/improve specific function**?
