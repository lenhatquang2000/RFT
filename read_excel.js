// Script đọc file Excel và hiển thị dữ liệu
const XLSX = require('xlsx');
const path = require('path');

// Đọc file Excel
const filePath = path.join(__dirname, 'Defect Summary 4.6.xlsx');
console.log('📂 Đang đọc file:', filePath);

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  console.log('📄 Sheet name:', sheetName);
  
  // Chuyển đổi sang JSON
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
  console.log('\n📊 Tổng số dòng dữ liệu:', jsonData.length);
  console.log('\n🔍 Cấu trúc dữ liệu (3 dòng đầu tiên):\n');
  console.log(JSON.stringify(jsonData.slice(0, 3), null, 2));
  
  // Phân tích các cột
  if (jsonData.length > 0) {
    console.log('\n📋 Các cột trong file Excel:');
    Object.keys(jsonData[0]).forEach((col, idx) => {
      console.log(`  ${idx + 1}. ${col}`);
    });
  }
  
  // Thống kê cơ bản
  console.log('\n📈 Thống kê dữ liệu:');
  const lines = [...new Set(jsonData.map(r => r.LEAN))];
  const models = [...new Set(jsonData.map(r => r.Model))];
  const totalInspected = jsonData.reduce((sum, r) => sum + (r['Total inspect Qty'] || 0), 0);
  const totalDefects = jsonData.reduce((sum, r) => sum + (r['Total defect Qty'] || 0), 0);
  
  console.log(`  - Số dây chuyền (LEAN): ${lines.length}`);
  console.log(`  - Dây chuyền: ${lines.join(', ')}`);
  console.log(`  - Số model: ${models.length}`);
  console.log(`  - Tổng số lượng kiểm tra: ${totalInspected} pairs`);
  console.log(`  - Tổng số lỗi: ${totalDefects}`);
  console.log(`  - Tỷ lệ lỗi chung: ${(totalDefects / totalInspected * 100).toFixed(2)}%`);
  
  // Kiểm tra cấu trúc phù hợp với tool
  console.log('\n✅ Kiểm tra cấu trúc cho tool:');
  const requiredCols = ['LEAN', 'Model', '% RFT', 'Top 1 defect QTY', '1. DFname', 'Top 2 defect QTY', '2. DFname', 'Top 3 defect QTY', '3. DFname'];
  requiredCols.forEach(col => {
    const exists = jsonData[0].hasOwnProperty(col);
    console.log(`  ${exists ? '✓' : '✗'} ${col}`);
  });
  
} catch (error) {
  console.error('❌ Lỗi:', error.message);
}
