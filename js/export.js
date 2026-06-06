// ═══════════════════════════════════════
// EXPORT PNG & PPT
// ═══════════════════════════════════════

function exportPNG() {
  const element = document.getElementById('dash-content');
  
  if (!element) {
    Swal.fire('❌ Lỗi', 'Không tìm thấy nội dung dashboard để xuất.', 'error');
    return;
  }
  
  if (element.style.display === 'none') {
    Swal.fire('❌ Lỗi', 'Dashboard chưa được tải. Vui lòng upload dữ liệu trước.', 'error');
    return;
  }
  
  // Hiển thị thông báo đang xử lý
  const btn = document.getElementById('btn-export-png');
  const originalText = btn.textContent;
  btn.textContent = '⏳ Đang xử lý...';
  btn.disabled = true;
  
  // Cấu hình html2canvas với nền đen
  const options = {
    backgroundColor: '#000000',
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
    link.download = `Stockfitting_Dashboard_${timestamp}.png`;
    
    // Download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Khôi phục nút
    btn.textContent = originalText;
    btn.disabled = false;
    
    // Thông báo thành công
    setTimeout(() => {
      Swal.fire('✅ Thành công', 'Xuất PNG thành công!', 'success');
    }, 500);
  }).catch(error => {
    console.error('Lỗi khi xuất PNG:', error);
    btn.textContent = originalText;
    btn.disabled = false;
    Swal.fire('❌ Lỗi', 'Lỗi khi xuất PNG. Vui lòng thử lại.', 'error');
  });
}

function doExportPPT() {
  Swal.fire('⏳ Phát triển', 'Export PPT: Chức năng đang được phát triển...\nVui lòng sử dụng file stockfitting_quality_ver_6.html để xuất PNG/PPT đầy đủ.', 'info');
}

function buildInfographic(s) {
  // Placeholder - will implement later
  return '';
}
