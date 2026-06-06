// ═══════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════
const TARGET = 85;
const TITLE = 'STOCKFITTING QUALITY STATUS';

const DMAP = {
  'Soiling': {vi:'Bẩn bề mặt', zh:'表面污染'},
  'Bottom part bonding': {vi:'Lỗi dán đế', zh:'底部粘合'},
  'Symmetry / Alignment': {vi:'Lệch đối xứng', zh:'对称偏差'},
  'Wrong part / component': {vi:'Sai chi tiết', zh:'零件错误'},
  'Color Migration / Bleeding': {vi:'Lem màu', zh:'颜色渗色'},
  'BONDING GAP': {vi:'Hở keo', zh:'粘合间隙'},
  'HO KEO': {vi:'Hở keo', zh:'粘合间隙'},
  'CEMENT STAIN': {vi:'Vết keo', zh:'水泥污渍'},
  'VET KEO': {vi:'Vết keo', zh:'胶水痕迹'},
  'PRIMER STAIN': {vi:'Vết xử lý primer', zh:'底漆污渍'},
  'VET XU LY (PRIMER)': {vi:'Vết xử lý primer', zh:'底漆处理痕迹'},
  'DIRTY': {vi:'Bẩn', zh:'脏污'},
  'DO / BAN': {vi:'Bẩn', zh:'脏污'},
  'CEMENT STAIN / STAGNANT': {vi:'Vết keo/Đọng keo', zh:'胶渍/积胶'},
  'BET KEO, DONG KEO': {vi:'Bết keo, đọng keo', zh:'胶渍，积胶'},
  'OFF CENTERED': {vi:'Lệch vị trí', zh:'偏心'},
  'LECH VI TRI': {vi:'Lệch vị trí', zh:'位置偏移'}
};

function dn(n) { 
  return DMAP[n] ? DMAP[n].vi + ' / ' + DMAP[n].zh : (n || ''); 
}

function dns(n) { 
  return DMAP[n] ? DMAP[n].vi : (n || ''); 
}
