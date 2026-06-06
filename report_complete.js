const XLSX = require('xlsx');

// Generate final comprehensive report
const report = {
  title: 'PHÂN TÍCH CHI TIẾT FILE GT2 6.5.xlsx',
  analyzed: new Date().toISOString()
};

const filePath = 'e:\\Workspace\\OutS\\Tool\\Data\\GT\\GT2 6.5.xlsx';
const workbook = XLSX.readFile(filePath);
const ws = workbook.Sheets['CONG TY TNHH JIAZHI - SOC TRANG'];
const dataRaw = XLSX.utils.sheet_to_json(ws, { header: 1 });

// 1. CẤU TRÚC FILE
console.log('\n' + '='.repeat(80));
console.log('1. CẤU TRÚC FILE EXCEL');
console.log('='.repeat(80));
console.log('File: GT2 6.5.xlsx');
console.log('Vị trí: e:\\Workspace\\OutS\\Tool\\Data\\GT\\');
console.log('');
console.log('Sheet được sử dụng: CONG TY TNHH JIAZHI - SOC TRANG');
console.log('  - Tên công ty: Công ty TNHH Jiazhi - Sóc Trăng');
console.log('  - Loại dữ liệu: Báo cáo theo dõi chất lượng nhà cung ứng');
console.log('');
console.log('Cấu trúc hàng:');
console.log('  - Hàng 1: Tiêu đề công ty và loại báo cáo');
console.log('  - Hàng 2-3: Phần tiêu đề (BASE INFORMATION, DEFECTS)');
console.log('  - Hàng 4: Tiêu đề cột (Header - THỰC TỀ)');
console.log('  - Hàng 5-384: Dữ liệu thực tế (380 dòng)');
console.log('  - Hàng 385: Dữ liệu cuối');
console.log('');
console.log('Sheet2: Sheet1 (trống - không sử dụng)');

// 2. CỘT DỮ LIỆU
console.log('\n' + '='.repeat(80));
console.log('2. CỘT DỮ LIỆU - CHI TIẾT ĐẦY ĐỦ');
console.log('='.repeat(80));
console.log('');
console.log('Tổng số cột sử dụng: 16 (trong 27 cột của file)');
console.log('Tổng số dòng dữ liệu: 380');
console.log('');
console.log('PHẦN A: THÔNG TIN CƠ BẢN (11 cột)');
console.log('-'.repeat(80));
const baseInfoCols = [
  { col: 'A', name: 'QCDate', type: 'Number (Date)', desc: 'Ngày kiểm tra chất lượng (Excel date format)', filled: '100%' },
  { col: 'B', name: 'MatID', type: 'Text', desc: 'ID vật liệu (Material ID)', filled: '99.7%' },
  { col: 'C', name: 'MaterialName', type: 'Text', desc: 'Tên vật liệu (OUTSOLE+MIDSOLE)', filled: '99.7%' },
  { col: 'D', name: 'RY', type: 'Text', desc: 'Mã RY (ví dụ: AH2605-508)', filled: '99.7%' },
  { col: 'E', name: 'Article', type: 'Text', desc: 'Mã bài viết/sản phẩm (ví dụ: KK2502)', filled: '100%' },
  { col: 'F', name: 'Model Name', type: 'Text', desc: 'Tên model sản phẩm (ví dụ: SAMBA JANE W)', filled: '99.7%' },
  { col: 'G', name: 'ReceivedQty', type: 'Number', desc: 'Số lượng nhận được', filled: '100%' },
  { col: 'H', name: 'InspectionQty', type: 'Number', desc: 'Số lượng kiểm tra', filled: '100%' },
  { col: 'I', name: 'ReleasedQty', type: 'Number', desc: 'Số lượng phát hành', filled: '100%' },
  { col: 'J', name: 'DefectedQty', type: 'Number', desc: 'Số lượng sản phẩm lỗi', filled: '100%' },
  { col: 'K', name: '% Defected', type: 'Number', desc: 'Tỷ lệ % sản phẩm lỗi', filled: '100%' }
];
baseInfoCols.forEach(col => {
  console.log('Col ' + col.col + ': ' + col.name);
  console.log('  Kiểu: ' + col.type + '  |  Độ đầy đủ: ' + col.filled);
  console.log('  Ý nghĩa: ' + col.desc);
  console.log('');
});

console.log('PHẦN B: LOẠI LỖI KIỂM TRA (5 cột)');
console.log('-'.repeat(80));
const defectCols = [
  { col: 'L', code: '400.01', name: 'NHIEM BAN (VET DO)', desc: 'Nhiễm bạn - vết do (2.5mm)', filled: '3.4%' },
  { col: 'M', code: '400.07', name: 'LOI VE MAU SAC', desc: 'Lỗi về màu sắc (0.010mm)', filled: '5.3%' },
  { col: 'N', code: '400.09', name: 'KEM CHAT LUONG', desc: 'Kém chất lượng đế (1.5mm)', filled: '2.9%' },
  { col: 'O', code: '400.11', name: 'TACH LOP CHI TIET', desc: 'Tách lớp chi tiết >4mm (1.5mm)', filled: '16.1%' },
  { col: 'P', code: '400.12', name: 'TACH LOP CHI TIET', desc: 'Tách lớp chi tiết ≤4mm (2.5mm)', filled: '1.1%' }
];
defectCols.forEach(col => {
  console.log('Col ' + col.col + ': [' + col.code + '] ' + col.name);
  console.log('  Mô tả: ' + col.desc);
  console.log('  Độ đầy đủ (có dữ liệu): ' + col.filled);
  console.log('');
});

console.log('\nGhi chú: Các cột lỗi có độ đầy đủ thấp vì chỉ ghi nhận khi có lỗi xảy ra.');
console.log('Giá trị 0 không ghi, nên có nhiều ô trống.');

// 3. PHÂN TÍCH DỮ LIỆU
console.log('\n' + '='.repeat(80));
console.log('3. PHÂN TÍCH DỮ LIỆU');
console.log('='.repeat(80));
console.log('');

const dataRows = dataRaw.slice(5);
const dates = dataRows.map(r => r[0]).filter(v => v);
const uniqueDates = [...new Set(dates)];
const materials = dataRows.map(r => r[2]).filter(v => v);
const uniqueMaterials = [...new Set(materials)];
const models = dataRows.map(r => r[5]).filter(v => v);
const uniqueModels = [...new Set(models)];

const totalReceived = dataRows.reduce((sum, r) => sum + (r[6] || 0), 0);
const totalInspected = dataRows.reduce((sum, r) => sum + (r[7] || 0), 0);
const totalReleased = dataRows.reduce((sum, r) => sum + (r[8] || 0), 0);
const totalDefected = dataRows.reduce((sum, r) => sum + (r[9] || 0), 0);

console.log('THỐNG KÊ TỔNG QUÁT:');
console.log('  - Tổng dòng dữ liệu: ' + dataRows.length);
console.log('  - Tổng cột: 16 (có dữ liệu thực tế)');
console.log('');
console.log('SỰ ĐA DẠNG DỮ LIỆU:');
console.log('  - Ngày kiểm tra riêng biệt: ' + uniqueDates.length + ' ngày');
console.log('    Khoảng ngày: từ ' + new Date(XLSX.SSF.parse_date_code(Math.min(...dates))) + ' đến ' + new Date(XLSX.SSF.parse_date_code(Math.max(...dates))));
console.log('  - Vật liệu riêng biệt: ' + uniqueMaterials.length + ' loại');
console.log('  - Mẫu sản phẩm riêng biệt: ' + uniqueModels.length + ' model');
console.log('');
console.log('KỸ THUẬT KIỂM TRA:');
console.log('  - Tổng số lượng nhận: ' + totalReceived.toLocaleString() + ' pairs');
console.log('  - Tổng số lượng kiểm tra: ' + totalInspected.toLocaleString() + ' pairs');
console.log('  - Tỷ lệ kiểm tra: ' + ((totalInspected/totalReceived)*100).toFixed(2) + '%');
console.log('  - Tổng số phát hành: ' + totalReleased.toLocaleString() + ' pairs');
console.log('');
console.log('CHẤT LƯỢNG:');
console.log('  - Tổng số sản phẩm lỗi: ' + totalDefected.toLocaleString() + ' pairs');
console.log('  - Tỷ lệ lỗi chung: ' + ((totalDefected/totalInspected)*100).toFixed(2) + '%');
console.log('  - Sản phẩm tốt: ' + (totalInspected - totalDefected).toLocaleString() + ' pairs');
console.log('  - Tỷ lệ tốt: ' + (((totalInspected - totalDefected)/totalInspected)*100).toFixed(2) + '%');

console.log('\n' + '='.repeat(80));
