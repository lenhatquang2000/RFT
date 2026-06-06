const XLSX = require('xlsx');
const filePath = 'e:\\Workspace\\OutS\\Tool\\Data\\GT\\GT2 6.5.xlsx';

const workbook = XLSX.readFile(filePath);
const ws = workbook.Sheets['CONG TY TNHH JIAZHI - SOC TRANG'];

const dataRaw = XLSX.utils.sheet_to_json(ws, { header: 1 });
const range = XLSX.utils.decode_range(ws['!ref']);

console.log('\n========== CHI TIẾT ĐẦY ĐỦ VỀ CỘT DỮ LIỆU ==========\n');
console.log('Cell Range: ' + ws['!ref']);
console.log('Số cột tối đa: ' + (range.e.c + 1));

const headers = dataRaw[4] || [];
const allCols = [];
for (let i = 0; i <= range.e.c; i++) {
  allCols.push({
    idx: i + 1,
    colLetter: XLSX.utils.encode_col(i),
    name: headers[i] || '[empty]',
    hasData: dataRaw.slice(5, 50).some(row => row[i])
  });
}

console.log('\nTẤT CẢ CỘT (27 cột):');
allCols.forEach(col => {
  const hasData = col.hasData ? '✓' : '-';
  const name = col.name.toString().substring(0, 70);
  console.log(col.idx + '. [' + col.colLetter + '] ' + hasData + ' ' + name);
});

// Identify defect columns
console.log('\n========== PHÂN LOẠI CỘT ==========\n');
const baseInfo = ['QCDate', 'MatID', 'MaterialName', 'RY', 'Article', 'Model Name', 'ReceivedQty', 'InspectionQty', 'ReleasedQty', 'DefectedQty', '% Defected'];
const defectTypes = [];

headers.forEach((h, i) => {
  if (h && h.toString().match(/^400\\.\\d+/)) {
    const codeMatch = h.toString().match(/^(400\\.\\d+):/);
    const code = codeMatch ? codeMatch[1] : 'unknown';
    const name = h.toString().substring(0, 60);
    defectTypes.push({ code: code, colIdx: i+1, name: name });
  }
});

console.log('Base Info Columns (' + baseInfo.length + '):');
baseInfo.forEach(b => console.log('  - ' + b));

console.log('\nDefect Type Columns (' + defectTypes.length + '):');
defectTypes.forEach(d => console.log('  - ' + d.code + ' (Col ' + d.colIdx + '): ' + d.name));

console.log('\nOther Columns:');
const otherCols = headers.filter((h, i) => 
  h && !baseInfo.includes(h) && !h.toString().match(/^400\\.\\d+/)
);
otherCols.forEach(o => console.log('  - ' + o.toString().substring(0, 60)));

// Data completeness
console.log('\n========== TÍNH ĐẦY ĐỦ DỮ LIỆU ==========\n');
const dataRows = dataRaw.slice(5);
let nullCount = 0;
headers.forEach((h, i) => {
  if (!h) return;
  const colName = h.toString().substring(0, 40);
  const filled = dataRows.filter(r => r[i] !== null && r[i] !== undefined && r[i] !== '').length;
  const fillRate = ((filled / dataRows.length) * 100).toFixed(1);
  const nulls = dataRows.length - filled;
  console.log('Col ' + (i+1) + ' (' + colName.padEnd(40) + '): ' + filled + '/' + dataRows.length + ' (' + fillRate + '%) - Null: ' + nulls);
});
