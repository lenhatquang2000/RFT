// Script đọc file RFT Report
const XLSX = require('xlsx');
const path = require('path');

// Đọc file Excel
const filePath = path.join(__dirname, 'RFT_Report_GCD_Stockfitting_Lean_20260604110832.xlsx');
console.log('📂 Đang đọc file:', filePath);

try {
  const workbook = XLSX.readFile(filePath);
  
  console.log('\n📄 Danh sách các Sheet:');
  workbook.SheetNames.forEach((name, idx) => {
    console.log(`  ${idx + 1}. ${name}`);
  });
  
  // Đọc tất cả các sheet
  workbook.SheetNames.forEach((sheetName, idx) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 SHEET ${idx + 1}: "${sheetName}"`);
    console.log('='.repeat(60));
    
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    
    console.log(`Số dòng dữ liệu: ${jsonData.length}`);
    
    if (jsonData.length > 0) {
      console.log('\n📋 Các cột:');
      Object.keys(jsonData[0]).forEach((col, i) => {
        console.log(`  ${i + 1}. ${col}`);
      });
      
      console.log('\n🔍 Dữ liệu mẫu (3 dòng đầu):');
      console.log(JSON.stringify(jsonData.slice(0, 3), null, 2));
      
      // Phân tích dữ liệu cụ thể
      if (sheetName.includes('Summary') || sheetName.includes('Data') || idx === 0) {
        console.log('\n📈 Thống kê:');
        
        // Tìm các cột số quan trọng
        const firstRow = jsonData[0];
        Object.keys(firstRow).forEach(col => {
          if (col.includes('RFT') || col.includes('Defect') || col.includes('Qty') || col.includes('%')) {
            const values = jsonData.map(r => r[col]).filter(v => typeof v === 'number' || !isNaN(parseFloat(v)));
            if (values.length > 0) {
              const numValues = values.map(v => typeof v === 'number' ? v : parseFloat(v));
              const sum = numValues.reduce((a, b) => a + b, 0);
              const avg = sum / numValues.length;
              const min = Math.min(...numValues);
              const max = Math.max(...numValues);
              console.log(`  ${col}:`);
              console.log(`    - Trung bình: ${avg.toFixed(2)}`);
              console.log(`    - Min: ${min.toFixed(2)}, Max: ${max.toFixed(2)}`);
            }
          }
        });
      }
    } else {
      console.log('⚠️ Sheet này không có dữ liệu');
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Đọc file hoàn tất');
  
} catch (error) {
  console.error('❌ Lỗi:', error.message);
  console.error(error.stack);
}
