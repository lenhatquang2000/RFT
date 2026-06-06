const XLSX = require('xlsx');

console.log('========== PHÂN TÍCH FILE GT2 6.5.xlsx ==========\n');

const filePath = 'e:\\Workspace\\OutS\\Tool\\Data\\GT\\GT2 6.5.xlsx';

try {
  // Đọc file Excel
  const workbook = XLSX.readFile(filePath);
  
  console.log('📊 THÔNG TIN CƠBẢN:');
  console.log(`Tổng số Sheet: ${workbook.SheetNames.length}`);
  console.log(`Tên các Sheet: ${workbook.SheetNames.join(', ')}`);
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Phân tích từng sheet
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`📄 SHEET ${index + 1}: "${sheetName}"`);
    console.log('-'.repeat(50));
    
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const rows = range.e.r + 1;
    const cols = range.e.c + 1;
    
    console.log(`Kích thước: ${rows} dòng × ${cols} cột`);
    
    // Đọc dữ liệu thành array
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Hiển thị header (dòng đầu tiên)
    if (data.length > 0) {
      console.log(`\nCột (Header):`);
      data[0].forEach((col, i) => {
        if (col !== undefined && col !== null) {
          console.log(`  ${i + 1}. ${col}`);
        }
      });
    }
    
    // Hiển thị vài dòng đầu tiên
    console.log(`\nDữ liệu mẫu (${Math.min(5, data.length - 1)} dòng đầu):`);
    for (let i = 1; i < Math.min(6, data.length); i++) {
      console.log(`  Dòng ${i}: ${JSON.stringify(data[i])}`);
    }
    
    if (data.length > 6) {
      console.log(`  ... (${data.length - 6} dòng nữa)`);
    }
    
    console.log('\n');
  });
  
  console.log('='.repeat(50));
  console.log('\n✅ Phân tích hoàn tất!');
  
} catch (error) {
  console.error('❌ Lỗi:', error.message);
  process.exit(1);
}
