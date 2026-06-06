// ═══════════════════════════════════════
// EXPORT PNG & PPT
// ═══════════════════════════════════════

function exportPNG() {
  const element = document.getElementById('dash-content');
  
  if (!element) {
    alert('❌ Không tìm thấy nội dung dashboard để xuất.');
    return;
  }
  
  if (element.style.display === 'none') {
    alert('❌ Dashboard chưa được tải. Vui lòng upload dữ liệu trước.');
    return;
  }
  
  // Hỏi người dùng chọn màu nền
  const bgColor = prompt('Chọn màu nền cho ảnh xuất:\n\nNhập:\n- "white" hoặc "trắng" → nền trắng (mặc định)\n- "black" hoặc "đen" → nền đen', 'white');
  
  if (bgColor === null) {
    return; // Người dùng hủy
  }
  
  let backgroundColor = '#ffffff';
  if (bgColor.toLowerCase() === 'black' || bgColor.toLowerCase() === 'đen') {
    backgroundColor = '#000000';
  }
  
  // Hiển thị thông báo đang xử lý
  const btn = document.getElementById('btn-export-png');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Đang xử lý...';
  btn.disabled = true;
  
  // Cấu hình html2canvas
  const options = {
    backgroundColor: backgroundColor,
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: true
  };
  
  html2canvas(element, options).then(canvas => {
    // Tạo link download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    
    // Đặt tên file với timestamp
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 19).replace(/[-:]/g, '');
    const bgSuffix = backgroundColor === '#000000' ? '_black' : '_white';
    link.download = `Stockfitting_Dashboard_${timestamp}${bgSuffix}.png`;
    
    // Download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Khôi phục nút
    btn.textContent = originalText;
    btn.disabled = false;
    
    // Thông báo thành công
    setTimeout(() => {
      alert('✅ Xuất PNG thành công!');
    }, 500);
  }).catch(error => {
    console.error('Lỗi khi xuất PNG:', error);
    btn.textContent = originalText;
    btn.disabled = false;
    alert('❌ Lỗi khi xuất PNG. Vui lòng thử lại.');
  });
}

function doExportPPT() {
  alert('Export PPT: Chức năng đang được phát triển...\nVui lòng sử dụng file stockfitting_quality_ver_6.html để xuất PNG/PPT đầy đủ.');
}

function buildInfographic(s) {
  // Placeholder - will implement later
  return '';
}
