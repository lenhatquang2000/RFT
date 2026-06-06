const XLSX = require('xlsx');
const filePath = 'e:\\Workspace\\OutS\\Tool\\Data\\GT\\GT2 6.5.xlsx';

const workbook = XLSX.readFile(filePath, { cellFormula: false, cellStyles: true });
const ws = workbook.Sheets['CONG TY TNHH JIAZHI - SOC TRANG'];

const cellRange = XLSX.utils.decode_range(ws['!ref']);
console.log('\n========== PHÂN TÍCH FILE GT2 6.5.xlsx ==========\n');
console.log('Cell Range:', ws['!ref']);
console.log('Rows:', cellRange.e.r + 1, 'Columns:', cellRange.e.c + 1);

// Read as array format
const dataRaw = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Find actual header row by looking for QCDate, MatID, etc
let headerRowIdx = 3; // Default to row 4 (0-indexed row 3)
for (let i = 0; i < Math.min(15, dataRaw.length); i++) {
  const row = dataRaw[i] || [];
  if (row.some(cell => cell && cell.toString().toLowerCase().includes('qcdate'))) {
    headerRowIdx = i;
    break;
  }
}

console.log('\nHeader row index:', headerRowIdx);
console.log('\nTotal rows in sheet:', dataRaw.length);
console.log('Data rows (excluding header):', dataRaw.length - headerRowIdx - 1);

const headers = dataRaw[headerRowIdx] || [];
console.log('\nCỘT HEADERS (' + headers.filter(h => h).length + ' columns):');
headers.forEach((h, i) => {
  if (h) {
    const colName = h.toString().substring(0, 50);
    console.log('  ' + (i+1) + '. ' + colName);
  }
});

console.log('\nDỮ LIỆU MẪU (3 dòng đầu tiên):');
for (let i = headerRowIdx + 1; i < Math.min(headerRowIdx + 4, dataRaw.length); i++) {
  const row = dataRaw[i];
  console.log('Row ' + (i - headerRowIdx) + ':', row.slice(0, 15));
}

console.log('\n✅ Phân tích hoàn tất!');
