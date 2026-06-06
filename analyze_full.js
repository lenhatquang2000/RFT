const XLSX = require('xlsx');
const filePath = 'e:\\Workspace\\OutS\\Tool\\Data\\GT\\GT2 6.5.xlsx';

const workbook = XLSX.readFile(filePath);
const ws = workbook.Sheets['CONG TY TNHH JIAZHI - SOC TRANG'];

const dataRaw = XLSX.utils.sheet_to_json(ws, { header: 1 });
const headers = dataRaw[4] || []; // Row 4 contains headers (0-indexed)
const allColumns = headers.map((h, i) => ({ idx: i+1, name: h }));

console.log('\n========== ĐẦY ĐỦ THÔNG TIN CỘT ==========\n');
console.log('TỔNG SỐ CỘT: ' + allColumns.length);
console.log('\nCHI TIẾT CÁC CỘT:');
allColumns.forEach((col, idx) => {
  if (col.name) {
    const fullName = col.name.toString().substring(0, 80);
    console.log(col.idx + '. ' + fullName);
  }
});

// Analyze data types
console.log('\n========== PHÂN TÍCH KIỂU DỮ LIỆU ==========\n');
const sampleDataRows = dataRaw.slice(5, 85); // Get 80 sample rows

const columnTypes = {};
headers.forEach((h, i) => {
  if (!h) return;
  
  const colName = h.toString();
  const values = sampleDataRows.map(row => row[i]).filter(v => v !== null && v !== undefined && v !== '');
  
  let type = 'mixed';
  const hasNumbers = values.some(v => typeof v === 'number' || !isNaN(v));
  const hasStrings = values.some(v => typeof v === 'string' && isNaN(v));
  const hasText = values.some(v => typeof v === 'string' && v.length > 10);
  
  if (hasNumbers && !hasStrings && !hasText) type = 'number';
  else if (hasStrings && !hasNumbers) type = 'text';
  else if (hasText) type = 'long_text';
  
  columnTypes[i] = { name: colName.substring(0, 50), type: type, sampleValues: values.slice(0, 2) };
});

console.log('CỘT                                  | KIỂU       | GIÁ TRỊ MẪU');
console.log('-'.repeat(90));
Object.entries(columnTypes).forEach(([idx, info]) => {
  const name = info.name.padEnd(35);
  const type = info.type.padEnd(10);
  const sample = info.sampleValues.toString().substring(0, 40);
  console.log(name + ' | ' + type + ' | ' + sample);
});

// Data statistics
console.log('\n========== THỐNG KÊ DỮ LIỆU ==========\n');
const dataRows = dataRaw.slice(5); // Skip header
console.log('Tổng số dòng dữ liệu: ' + dataRows.length);
console.log('Tổng số cột: ' + headers.length);

// Analyze specific fields
const dates = dataRows.map(r => r[0]).filter(v => v);
const materials = dataRows.map(r => r[2]).filter(v => v);
const models = dataRows.map(r => r[5]).filter(v => v);
const totalInspected = dataRows.reduce((sum, r) => sum + (r[7] || 0), 0);
const totalDefected = dataRows.reduce((sum, r) => sum + (r[9] || 0), 0);

console.log('\nPhân tích nhanh:');
console.log('- Số ngày kiểm tra riêng biệt: ' + [...new Set(dates)].length);
console.log('- Số vật liệu (Material) riêng biệt: ' + [...new Set(materials)].length);
console.log('- Số mẫu sản phẩm (Model) riêng biệt: ' + [...new Set(models)].length);
console.log('- Tổng số lượng kiểm tra: ' + totalInspected);
console.log('- Tổng số sản phẩm lỗi: ' + totalDefected);
console.log('- Tỷ lệ lỗi chung: ' + ((totalDefected / totalInspected * 100).toFixed(2)) + '%');
