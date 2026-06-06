const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'RFT_Report_GCD_Stockfitting_Lean_20260604110832.xlsx');
const workbook = XLSX.readFile(filePath);
const worksheet = workbook.Sheets['RFT Report GCD'];

// Đọc raw (không dùng header mặc định) để hiểu đúng cấu trúc
const raw = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

console.log('=== TOÀN BỘ DỮ LIỆU RAW ===\n');
raw.forEach((row, i) => {
  console.log(`Row ${i}:`, JSON.stringify(row));
});

// Parse theo cột (transpose)
// Row 0: tiêu đề (bỏ qua)
// Row 1: tên các LEAN
// Row 2: Inspected Qty
// Row 3: Defect Qty
// ...

console.log('\n\n=== PHÂN TÍCH CẤU TRÚC ===\n');

const leans = raw[1].slice(2); // từ cột 2 trở đi
console.log('Danh sách LEAN:', leans.filter(l => l !== '').join(', '));

// Build bảng theo từng metric
const metrics = [];
for (let r = 2; r < raw.length; r++) {
  const label = raw[r][1] || raw[r][0] || `Row${r}`;
  const values = {};
  leans.forEach((lean, i) => {
    if (lean) values[lean] = raw[r][i + 2];
  });
  metrics.push({ label, values });
}

console.log('\n=== DỮ LIỆU THEO LEAN ===\n');
metrics.forEach(m => {
  const cleanLabel = m.label.replace(/\n/g, ' / ');
  console.log(`[${cleanLabel}]`);
  Object.entries(m.values).forEach(([lean, val]) => {
    if (val !== '' && val !== 0) {
      console.log(`  ${lean}: ${val}`);
    }
  });
  console.log();
});

// Tóm tắt bảng số liệu quan trọng
console.log('\n=== BẢNG TÓM TẮT KPI THEO LEAN ===\n');
console.log(`${'LEAN'.padEnd(15)} ${'Inspected'.padStart(10)} ${'Defects'.padStart(10)} ${'Defect%'.padStart(10)} ${'RFT%'.padStart(10)}`);
console.log('-'.repeat(60));

// row index: 1=LEAN, 2=Inspected, 3=Defect, 4=Defect%, 5=RFT%
const inspRow = raw[2];
const defRow  = raw[3];
const defPctRow = raw.length > 4 ? raw[4] : null;
const rftRow    = raw.length > 5 ? raw[5] : null;

leans.forEach((lean, i) => {
  if (!lean || lean === 'TOTAL') return;
  const ins = inspRow[i + 2];
  const def = defRow[i + 2];
  const defPct = defPctRow ? defPctRow[i + 2] : '';
  const rft    = rftRow    ? rftRow[i + 2]    : '';
  if (ins) {
    const defPctStr = typeof defPct === 'number' ? (defPct * 100).toFixed(2) + '%' : (defPct || '');
    const rftStr    = typeof rft    === 'number' ? (rft    * 100).toFixed(2) + '%' : (rft    || '');
    console.log(`${lean.padEnd(15)} ${String(ins).padStart(10)} ${String(def).padStart(10)} ${defPctStr.padStart(10)} ${rftStr.padStart(10)}`);
  }
});

// TOTAL
const totalCol = leans.indexOf('TOTAL');
if (totalCol >= 0) {
  const ins = inspRow[totalCol + 2];
  const def = defRow[totalCol + 2];
  console.log('-'.repeat(60));
  console.log(`${'TOTAL'.padEnd(15)} ${String(ins).padStart(10)} ${String(def).padStart(10)}`);
}
