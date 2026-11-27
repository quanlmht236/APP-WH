/**
 * ====================================================================
 * SMARTKHO - CLIENT JAVASCRIPT LOGIC (CHUYÊN BIỆT: THÙNG, PALLET & SPOOL)
 * ====================================================================
 */

// ====================================================================
// CẤU HÌNH MẶC ĐỊNH HỆ THỐNG CHO MỌI THIẾT BỊ MỚI
// (Link Google Apps Script dán vào đây sẽ tự động chạy cho TẤT CẢ các máy và điện thoại mới)
// ====================================================================
const DEFAULT_CONFIG = {
  // Đường link Web App Google Apps Script chính thức của hệ thống:
  gasUrl: "https://script.google.com/macros/s/AKfycbz3jQAR1DSAe64ksRYQnxW6WRziRtgAan-gCjwqLoCRrr5X6qdb1ikayEcCFr5QFUUj/exec",
  cloudName: "awimwhb3",
  uploadPreset: "ml_default"
};

// Hàm fetch có Timeout để tránh treo màn hình "Đang xác thực..." vô tận
async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`Quá thời gian chờ phản hồi (${timeoutMs / 1000}s). Máy chủ Google Sheet phản hồi quá lâu hoặc link Web App chưa chọn quyền "Bất kỳ ai (Anyone)".`);
    }
    throw err;
  }
}

// Danh sách tài khoản thử nghiệm
const DEMO_USERS = {
  admin: {
    TenDangNhap: "admin",
    MatKhau: "123456",
    HoTen: "Quản Lý Kho",
    VaiTro: "ADMIN"
  },
  thukho: {
    TenDangNhap: "thukho",
    MatKhau: "123456",
    HoTen: "Thủ Kho Vật Tư",
    VaiTro: "THU_KHO"
  },
  nhanvien: {
    TenDangNhap: "nhanvien",
    MatKhau: "123456",
    HoTen: "Nhân Viên Cấp Phát",
    VaiTro: "NHAN_VIEN"
  }
};

// Dữ liệu mẫu chuyên biệt: Thùng (Box), Pallet, Spool quấn cáp
const DEMO_PRODUCTS = [
  // 1. Thùng (Box)
  {
    MaSP: "BOX-305M",
    TenSP: "Thùng carton đóng cáp 305m (5 lớp)",
    DanhMuc: "Thùng (Box)",
    DonViTinh: "Thùng",
    SoLuongTon: 250,
    TonToiThieu: 50,
    HinhAnh: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80",
    GhiChu: "Kho Thùng Carton B1"
  },
  {
    MaSP: "BOX-PLASTIC",
    TenSP: "Thùng nhựa rỗng chứa phụ kiện cáp",
    DanhMuc: "Thùng (Box)",
    DonViTinh: "Cái",
    SoLuongTon: 120,
    TonToiThieu: 20,
    HinhAnh: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=80",
    GhiChu: "Thùng nhựa đặc màu xanh"
  },
  // 2. Pallet
  {
    MaSP: "PAL-WO-1111",
    TenSP: "Pallet gỗ 1100x1100mm đóng hàng",
    DanhMuc: "Pallet",
    DonViTinh: "Cái",
    SoLuongTon: 85,
    TonToiThieu: 15,
    HinhAnh: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80",
    GhiChu: "Đã hun trùng ISPM-15, bãi Pallet 2"
  },
  {
    MaSP: "PAL-PL-1210",
    TenSP: "Pallet nhựa 1200x1000mm tải nặng",
    DanhMuc: "Pallet",
    DonViTinh: "Cái",
    SoLuongTon: 40,
    TonToiThieu: 10,
    HinhAnh: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=500&auto=format&fit=crop&q=80",
    GhiChu: "Pallet nhựa 4 hướng nâng"
  },
  // 3. Spool quấn cáp (Rulo / Bobbin)
  {
    MaSP: "SPL-WOOD-800",
    TenSP: "Spool gỗ Ø800mm quấn cáp điện lực",
    DanhMuc: "Spool quấn cáp",
    DonViTinh: "Cuộn",
    SoLuongTon: 60,
    TonToiThieu: 15,
    HinhAnh: "https://images.unsplash.com/photo-1590735213920-68192a487dc2?w=500&auto=format&fit=crop&q=80",
    GhiChu: "Spool gỗ chịu lực bãi ngoài trời"
  },
  {
    MaSP: "SPL-PLAS-400",
    TenSP: "Spool nhựa Ø400mm quấn cáp viễn thông",
    DanhMuc: "Spool quấn cáp",
    DonViTinh: "Cuộn",
    SoLuongTon: 150,
    TonToiThieu: 30,
    HinhAnh: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
    GhiChu: "Rulo nhựa ABS tái sử dụng"
  },
  {
    MaSP: "SPL-STEEL-1200",
    TenSP: "Spool thép Ø1200mm quấn cáp ngầm tải nặng",
    DanhMuc: "Spool quấn cáp",
    DonViTinh: "Cuộn",
    SoLuongTon: 25,
    TonToiThieu: 5,
    HinhAnh: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=80",
    GhiChu: "Spool thép mạ kẽm chuyên dụng"
  }
];

// Dữ liệu mẫu Work Orders (1 WO có thể đồng thời gồm Thùng, Spool, Pallet)
const DEMO_WORK_ORDERS = [
  {
    MaWO: "WO-CABLE-001",
    NgayTao: "2026-11-24 08:30:00",
    GhiChu: "Cấp cho Chuyền bọc vỏ cáp số 1 (Đủ bộ Spool + Thùng + Pallet)",
    items: [
      {
        MaSP: "SPL-WOOD-800",
        TenSP: "Spool gỗ Ø800mm quấn cáp điện lực",
        SoLuongYeuCau: 30,
        SoLuongDaPhat: 10,
        SoLuongConLai: 20,
        TrangThai: "Đang cấp phát"
      },
      {
        MaSP: "BOX-305M",
        TenSP: "Thùng carton đóng cáp 305m (5 lớp)",
        SoLuongYeuCau: 50,
        SoLuongDaPhat: 20,
        SoLuongConLai: 30,
        TrangThai: "Đang cấp phát"
      },
      {
        MaSP: "PAL-WO-1111",
        TenSP: "Pallet gỗ 1100x1100mm đóng hàng",
        SoLuongYeuCau: 10,
        SoLuongDaPhat: 0,
        SoLuongConLai: 10,
        TrangThai: "Chưa cấp phát"
      }
    ],
    SoLuongYeuCau: 90,
    SoLuongDaPhat: 30,
    SoLuongConLai: 60,
    TrangThai: "Đang cấp phát"
  },
  {
    MaWO: "WO-CABLE-002",
    NgayTao: "2026-11-23 10:00:00",
    GhiChu: "Cấp đóng gói đơn hàng dự án (ĐÃ ĐỦ 100/100 - CHẶN PHÁT THÊM)",
    items: [
      {
        MaSP: "BOX-305M",
        TenSP: "Thùng carton đóng cáp 305m (5 lớp)",
        SoLuongYeuCau: 100,
        SoLuongDaPhat: 100,
        SoLuongConLai: 0,
        TrangThai: "Đã đủ"
      }
    ],
    SoLuongYeuCau: 100,
    SoLuongDaPhat: 100,
    SoLuongConLai: 0,
    TrangThai: "Đã đủ"
  },
  {
    MaWO: "WO-CABLE-003",
    NgayTao: "2026-11-24 13:15:00",
    GhiChu: "Cấp cho tổ đóng pallet xuất cảng",
    items: [
      {
        MaSP: "PAL-WO-1111",
        TenSP: "Pallet gỗ 1100x1100mm đóng hàng",
        SoLuongYeuCau: 20,
        SoLuongDaPhat: 0,
        SoLuongConLai: 20,
        TrangThai: "Chưa cấp phát"
      }
    ],
    SoLuongYeuCau: 20,
    SoLuongDaPhat: 0,
    SoLuongConLai: 20,
    TrangThai: "Chưa cấp phát"
  }
];

// Dữ liệu mẫu Lịch sử giao dịch
const DEMO_HISTORY = [
  {
    MaGiaoDich: "XK-20261124-143000",
    NgayGio: "2026-11-24 14:30:00",
    LoaiGiaoDich: "Xuất kho",
    MaSP: "SPL-WOOD-800",
    TenSP: "Spool gỗ Ø800mm quấn cáp điện lực",
    SoLuong: 10,
    MaWO: "WO-CABLE-001",
    NguoiThucHien: "Nhân Viên Cấp Phát",
    HinhAnh: "https://images.unsplash.com/photo-1590735213920-68192a487dc2?w=300",
    GhiChu: "Xuất 10 Spool cho Chuyền 1 theo WO-CABLE-001"
  },
  {
    MaGiaoDich: "XK-20261123-110000",
    NgayGio: "2026-11-23 11:00:00",
    LoaiGiaoDich: "Xuất kho",
    MaSP: "BOX-305M",
    TenSP: "Thùng carton đóng cáp 305m (5 lớp)",
    SoLuong: 100,
    MaWO: "WO-CABLE-002",
    NguoiThucHien: "Thủ Kho Vật Tư",
    HinhAnh: "",
    GhiChu: "Đã xuất đủ 100 thùng carton cho WO-CABLE-002"
  }
];

// App State
let state = {
  currentUser: JSON.parse(localStorage.getItem('smartkho_user')) || null,
  sanPham: [],
  workOrders: [],
  lichSu: [],
  users: [], // Danh sách tài khoản người dùng
  currentTab: 'dashboard',
  selectedCategory: 'ALL', // 'ALL', 'Thùng (Box)', 'Pallet', 'Spool quấn cáp'
  selectedWOFilter: 'ALL', // 'ALL', 'CHUA_PHAT', 'CHUA_DU', 'DA_DU'
  editingWOTarget: null, // null = tạo WO mới, string MaWO = thêm vật tư vào WO đã có
  transType: 'XUAT',
  gasUrl: localStorage.getItem('smartkho_gas_url') || DEFAULT_CONFIG.gasUrl || '',
  cloudName: localStorage.getItem('smartkho_cloud_name') || DEFAULT_CONFIG.cloudName || 'awimwhb3',
  uploadPreset: localStorage.getItem('smartkho_upload_preset') || DEFAULT_CONFIG.uploadPreset || '',
  scannerInstance: null,
  scannerTarget: 'general'
};

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  
  document.getElementById('config-gas-url').value = state.gasUrl;
  document.getElementById('config-cloud-name').value = state.cloudName;
  document.getElementById('config-upload-preset').value = state.uploadPreset;

  updateConnectionStatus();

  if (!state.currentUser) {
    showLoginModal();
  } else {
    hideLoginModal();
    applyRolePermissions();
    if (state.gasUrl) {
      loadDataFromSheets();
    } else {
      loadDemoData();
    }
  }
});

// ==================== AUTHENTICATION & PHÂN QUYỀN ====================

function showLoginModal() {
  document.getElementById('modal-login').classList.remove('hidden');
  lucide.createIcons();
}

function hideLoginModal() {
  document.getElementById('modal-login').classList.add('hidden');
}

function quickLogin(roleKey) {
  const user = DEMO_USERS[roleKey];
  if (user) {
    state.currentUser = {
      TenDangNhap: user.TenDangNhap,
      HoTen: user.HoTen,
      VaiTro: user.VaiTro
    };
    localStorage.setItem('smartkho_user', JSON.stringify(state.currentUser));
    hideLoginModal();
    applyRolePermissions();
    
    if (state.gasUrl) {
      loadDataFromSheets();
    } else {
      loadDemoData();
    }

    Swal.fire({
      toast: true,
      position: 'top',
      icon: 'success',
      title: `Đăng nhập thành công: ${user.HoTen}`,
      timer: 2000,
      showConfirmButton: false
    });
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim().toLowerCase();
  const p = document.getElementById('login-password').value.trim();

  if (!u || !p) {
    Swal.fire('Lỗi', 'Vui lòng nhập đầy đủ thông tin đăng nhập!', 'warning');
    return;
  }

  // Kiểm tra nếu người dùng vô tình dán link Thư viện (Library)
  if (state.gasUrl && state.gasUrl.includes('/macros/library')) {
    Swal.fire({
      icon: 'error',
      title: 'Sai đường link Google Apps Script',
      html: `Đường link hiện tại là link <b>Thư viện (Library)</b>:<br><code class="text-xs text-rose-600 break-all">${state.gasUrl}</code><br><br>Link này không thể nhận dữ liệu từ web. Link đúng phải có đuôi <b>/exec</b>.<br>Vui lòng bấm <b>"Cấu hình kết nối"</b> bên dưới để cập nhật lại link Web App!`,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Đã hiểu'
    });
    return;
  }

  Swal.fire({
    title: 'Đang xác thực tài khoản...',
    text: state.gasUrl ? 'Đang kết nối tới Google Sheets...' : 'Đang kiểm tra tài khoản...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    if (state.gasUrl) {
      const res = await fetchWithTimeout(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'login',
          username: u,
          password: p
        })
      }, 10000);
      const data = await res.json();
      Swal.close();

      if (data.success && data.user) {
        state.currentUser = data.user;
        localStorage.setItem('smartkho_user', JSON.stringify(state.currentUser));
        hideLoginModal();
        applyRolePermissions();
        loadDataFromSheets();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          text: data.message || 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'Thử lại'
        });
      }
    } else {
      Swal.close();
      const matchedUser = DEMO_USERS[u];
      if (matchedUser && matchedUser.MatKhau === p) {
        state.currentUser = {
          TenDangNhap: matchedUser.TenDangNhap,
          HoTen: matchedUser.HoTen,
          VaiTro: matchedUser.VaiTro
        };
        localStorage.setItem('smartkho_user', JSON.stringify(state.currentUser));
        hideLoginModal();
        applyRolePermissions();
        loadDemoData();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại',
          html: 'Tên đăng nhập hoặc mật khẩu không chính xác.<br><br><small class="text-slate-500">Thiết bị này chưa có kết nối Google Sheets. Bạn có thể bấm <b>"Cấu hình kết nối"</b> bên dưới để dán link Web App.</small>',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'Thử lại'
        });
      }
    }
  } catch (err) {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Lỗi kết nối máy chủ',
      html: `Không thể kết nối đến Google Sheets:<br><span class="text-rose-600 font-medium text-xs">${err.message}</span>`,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Đóng'
    });
  }
}

function logout() {
  Swal.fire({
    title: 'Đăng xuất?',
    text: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đăng xuất',
    cancelButtonText: 'Hủy'
  }).then(res => {
    if (res.isConfirmed) {
      state.currentUser = null;
      localStorage.removeItem('smartkho_user');
      document.getElementById('form-login').reset();
      showLoginModal();
    }
  });
}

function applyRolePermissions() {
  if (!state.currentUser) return;

  const role = (state.currentUser.VaiTro || 'NHAN_VIEN').toUpperCase();
  const hoTen = state.currentUser.HoTen || state.currentUser.TenDangNhap;

  document.getElementById('desktop-user-name').textContent = hoTen;
  document.getElementById('desktop-user-avatar').textContent = hoTen.charAt(0).toUpperCase();

  const roleBadgeDesktop = document.getElementById('desktop-user-role-badge');
  const roleColors = {
    ADMIN: 'bg-purple-900/60 text-purple-300 border border-purple-700/60',
    THU_KHO: 'bg-blue-900/60 text-blue-300 border border-blue-700/60',
    NHAN_VIEN: 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
  };
  const roleNames = {
    ADMIN: '👑 Quản trị viên',
    THU_KHO: '🛡️ Thủ kho',
    NHAN_VIEN: '👤 Nhân viên'
  };

  roleBadgeDesktop.className = `inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleColors[role] || ''}`;
  roleBadgeDesktop.textContent = roleNames[role] || role;

  const mobileTag = document.getElementById('mobile-user-tag');
  if (mobileTag) {
    mobileTag.textContent = `${hoTen} (${roleNames[role] || role})`;
  }

  const transUserEl = document.getElementById('trans-user');
  if (transUserEl) {
    transUserEl.value = hoTen;
  }

  const welcomeText = document.getElementById('role-welcome-text');
  const descText = document.getElementById('role-desc-text');
  const statusPill = document.getElementById('role-status-pill');

  if (welcomeText) welcomeText.textContent = `Xin chào, ${hoTen}!`;
  if (statusPill) statusPill.textContent = roleNames[role] || role;

  if (role === 'NHAN_VIEN') {
    if (descText) descText.textContent = 'Bạn có quyền: Cấp phát Thùng/Pallet/Spool theo WO, nhập kho trả về và quét mã.';
  } else if (role === 'THU_KHO') {
    if (descText) descText.textContent = 'Bạn có quyền: Tạo Lệnh WO cấp phát, thêm quy cách mới Thùng/Pallet/Spool và quản lý kho.';
  } else {
    if (descText) descText.textContent = 'Toàn quyền Quản trị viên: Quản lý vật tư, tạo WO, tài khoản và cấu hình hệ thống.';
  }

  const adminElements = document.querySelectorAll('.role-admin-only');
  adminElements.forEach(el => {
    if (role === 'ADMIN') {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  const managerElements = document.querySelectorAll('.role-manager-only');
  managerElements.forEach(el => {
    if (role === 'ADMIN' || role === 'THU_KHO') {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  // Đổi chữ trên nút Menu Quản lý người dùng
  const navUsersText = document.getElementById('nav-users-text');
  if (navUsersText) {
    if (role === 'ADMIN') {
      navUsersText.textContent = 'Quản lý tài khoản (Admin)';
    } else if (role === 'THU_KHO') {
      navUsersText.textContent = 'Quản lý nhân viên';
    }
  }

  renderInventory();
  lucide.createIcons();
}

// ==================== ĐỒNG BỘ VÀ HIỂN THỊ DỮ LIỆU ====================

function updateConnectionStatus() {
  const isConnected = !!state.gasUrl;
  const desktopBadge = document.getElementById('connection-badge-desktop');
  const mobileBadge = document.getElementById('connection-badge-mobile');
  const syncStatus = document.getElementById('sync-status-desktop');
  const loginDot = document.getElementById('login-gas-dot');
  const loginText = document.getElementById('login-gas-text');

  if (isConnected) {
    if (desktopBadge) {
      desktopBadge.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse';
      desktopBadge.title = 'Đã kết nối Google Sheet Cloud';
    }
    if (mobileBadge) mobileBadge.className = 'absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500';
    if (syncStatus) syncStatus.textContent = 'Google Sheet Cloud';
    if (loginDot) loginDot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse';
    if (loginText) {
      loginText.className = 'text-emerald-700 font-bold';
      loginText.textContent = 'Đã kết nối Google Sheet';
    }
  } else {
    if (desktopBadge) {
      desktopBadge.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
      desktopBadge.title = 'Đang dùng dữ liệu Demo';
    }
    if (mobileBadge) mobileBadge.className = 'absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400';
    if (syncStatus) syncStatus.textContent = 'Dữ liệu Demo';
    if (loginDot) loginDot.className = 'w-2 h-2 rounded-full bg-amber-400';
    if (loginText) {
      loginText.className = 'text-amber-700 font-semibold';
      loginText.textContent = 'Chưa kết nối Google Sheet';
    }
  }
}

// Cấu hình nhanh link Google Apps Script ngay từ màn hình đăng nhập
function openQuickConfigPrompt() {
  Swal.fire({
    title: 'Cấu hình Google Apps Script',
    html: `
      <p class="text-xs text-slate-500 mb-3 text-left">
        Dán đường link <b>Web App URL</b> (kết thúc bằng <code>/exec</code>) để kết nối Google Sheet cho thiết bị này:
      </p>
      <input id="swal-input-gas-url" class="swal2-input !m-0 !w-full !text-xs font-mono" placeholder="https://script.google.com/macros/s/.../exec" value="${state.gasUrl || DEFAULT_CONFIG.gasUrl || ''}">
      <p class="text-[11px] text-slate-400 mt-2 text-left">
        💡 <b>Mẹo:</b> Để TẤT CẢ các máy mới tự động có link này mà không cần nhập, bạn chỉ cần dán link vào biến <code>DEFAULT_CONFIG.gasUrl</code> trong file <code>app.js</code> rồi đẩy lên GitHub!
      </p>
    `,
    showCancelButton: true,
    confirmButtonText: 'Lưu & Kiểm tra kết nối',
    cancelButtonText: 'Đóng',
    confirmButtonColor: '#3b82f6',
    preConfirm: () => {
      const inputEl = document.getElementById('swal-input-gas-url');
      const val = (inputEl ? inputEl.value : '').trim();
      if (!val) {
        Swal.showValidationMessage('Vui lòng nhập đường link Web App!');
        return false;
      }
      if (val.includes('/macros/library')) {
        Swal.showValidationMessage('⚠️ Đây là link Thư viện (Library)! Link chuẩn phải là Web App và có đuôi /exec');
        return false;
      }
      if (!val.includes('/macros/s/') || !val.endsWith('/exec')) {
        Swal.showValidationMessage('⚠️ Link Web App chuẩn phải có dạng: https://script.google.com/macros/s/.../exec');
        return false;
      }
      return val;
    }
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      const newUrl = result.value;
      state.gasUrl = newUrl;
      localStorage.setItem('smartkho_gas_url', newUrl);
      const configInput = document.getElementById('config-gas-url');
      if (configInput) configInput.value = newUrl;
      updateConnectionStatus();

      Swal.fire({
        title: 'Đang kiểm tra kết nối...',
        text: 'Đang gửi tín hiệu kiểm tra tới Google Sheets...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        const res = await fetchWithTimeout(`${newUrl}?action=get_all&role=GUEST`, {}, 8000);
        const data = await res.json();
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Kết nối thành công!',
            text: 'Thiết bị này đã được kết nối trực tiếp với Google Sheets của bạn.',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Tuyệt vời'
          });
        } else {
          Swal.fire('Phản hồi từ Google Sheet', data.message || 'Đã kết nối được tới script!', 'info');
        }
      } catch (err) {
        Swal.fire({
          icon: 'warning',
          title: 'Đã lưu nhưng chưa thể tải dữ liệu',
          html: `Link đã được lưu vào máy này, nhưng khi gọi thử bị lỗi:<br><span class="text-xs text-rose-600">${err.message}</span><br><br><small class="text-slate-500">Hãy kiểm tra xem khi Triển khai trên Apps Script bạn đã chọn <b>"Ai có quyền truy cập: Bất kỳ ai (Anyone)"</b> chưa.</small>`,
          confirmButtonColor: '#3b82f6'
        });
      }
    }
  });
}

function switchTab(tabId) {
  state.currentTab = tabId;

  document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));

  const activeTabEl = document.getElementById(`tab-${tabId}`);
  if (activeTabEl) activeTabEl.classList.remove('hidden');

  const titles = {
    dashboard: 'Tổng quan kho Thùng • Pallet • Spool',
    workorder: 'Tiến độ cấp phát Lệnh Work Order (WO)',
    inventory: 'Kho Thùng (Box), Pallet & Spool Quấn Cáp',
    transaction: 'Cấp phát theo Lệnh WO / Nhập kho',
    history: 'Nhật ký giao dịch'
  };
  document.getElementById('page-title').textContent = titles[tabId] || 'Quản lý kho';

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.className = 'nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-slate-800/60';
  });
  const activeNavDesktop = document.getElementById(`nav-desktop-${tabId}`);
  if (activeNavDesktop) {
    activeNavDesktop.className = 'nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all bg-blue-600 text-white shadow-sm';
  }

  ['dashboard', 'workorder', 'inventory', 'history'].forEach(id => {
    const mobileBtn = document.getElementById(`nav-mobile-${id}`);
    if (mobileBtn) {
      if (id === tabId) {
        mobileBtn.classList.remove('text-slate-400');
        mobileBtn.classList.add('text-blue-600');
      } else {
        mobileBtn.classList.remove('text-blue-600');
        mobileBtn.classList.add('text-slate-400');
      }
    }
  });

  lucide.createIcons();
}

function loadDemoData() {
  state.sanPham = JSON.parse(JSON.stringify(DEMO_PRODUCTS));
  state.workOrders = JSON.parse(JSON.stringify(DEMO_WORK_ORDERS));
  state.lichSu = JSON.parse(JSON.stringify(DEMO_HISTORY));
  state.users = Object.values(DEMO_USERS).map(u => ({
    TenDangNhap: u.TenDangNhap,
    HoTen: u.HoTen,
    VaiTro: u.VaiTro,
    TrangThai: 'HoatDong'
  }));
  renderAllViews();
}

async function loadDataFromSheets() {
  if (!state.gasUrl) {
    Swal.fire({
      icon: 'info',
      title: 'Chưa cấu hình Google Sheet',
      text: 'Vui lòng dán Web App URL của Google Apps Script vào phần Cài đặt!',
      confirmButtonText: 'Mở Cài đặt'
    }).then(() => openSettingsModal());
    return;
  }

  Swal.fire({
    title: 'Đang tải dữ liệu từ Google Sheet...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    const roleParam = state.currentUser ? state.currentUser.VaiTro : 'NHAN_VIEN';
    const res = await fetchWithTimeout(`${state.gasUrl}?action=get_all&role=${encodeURIComponent(roleParam)}`, {}, 15000);
    const data = await res.json();

    Swal.close();

    if (data.success) {
      state.sanPham = data.sanPham || [];
      state.workOrders = normalizeWorkOrders(data.workOrders || []);
      state.lichSu = data.lichSu || [];
      state.users = data.users || [];
      renderAllViews();
      
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      Toast.fire({ icon: 'success', title: 'Đã đồng bộ Google Sheet' });
    } else {
      Swal.fire('Lỗi đồng bộ', data.error || data.message || 'Không thể lấy dữ liệu', 'error');
    }
  } catch (err) {
    Swal.close();
    Swal.fire('Lỗi kết nối', 'Không thể kết nối đến Web App URL. Hãy kiểm tra quyền "Bất kỳ ai" (Anyone) khi Deploy!', 'error');
  }
}

function renderAllViews() {
  renderDashboard();
  renderWorkOrders();
  renderInventory();
  renderTransactionSelects();
  renderHistory();
  lucide.createIcons();
}

// 1. DASHBOARD CHUYÊN BIỆT CHO 3 THỨ: THÙNG, PALLET, SPOOL
function renderDashboard() {
  // Tính tổng tồn kho theo từng nhóm
  const boxStock = state.sanPham
    .filter(i => (i.DanhMuc || '').includes('Thùng'))
    .reduce((sum, item) => sum + (Number(item.SoLuongTon) || 0), 0);

  const palletStock = state.sanPham
    .filter(i => (i.DanhMuc || '').includes('Pallet'))
    .reduce((sum, item) => sum + (Number(item.SoLuongTon) || 0), 0);

  const spoolStock = state.sanPham
    .filter(i => (i.DanhMuc || '').includes('Spool'))
    .reduce((sum, item) => sum + (Number(item.SoLuongTon) || 0), 0);

  const activeWOCount = state.workOrders.filter(w => (Number(w.SoLuongConLai) || 0) > 0).length;

  document.getElementById('stat-stock-box').textContent = boxStock.toLocaleString('vi-VN');
  document.getElementById('stat-stock-pallet').textContent = palletStock.toLocaleString('vi-VN');
  document.getElementById('stat-stock-spool').textContent = spoolStock.toLocaleString('vi-VN');
  document.getElementById('stat-active-wo').textContent = activeWOCount.toLocaleString('vi-VN');

  // Danh sách sắp hết
  const lowStockItems = state.sanPham.filter(item => (Number(item.SoLuongTon) || 0) <= (Number(item.TonToiThieu) || 0));
  const dashboardList = document.getElementById('dashboard-items-list');
  dashboardList.innerHTML = '';

  const displayList = lowStockItems.length > 0 ? lowStockItems.slice(0, 6) : state.sanPham.slice(0, 6);
  if (displayList.length === 0) {
    dashboardList.innerHTML = '<p class="col-span-full text-xs text-slate-400 py-4 text-center">Chưa có vật tư nào.</p>';
    return;
  }

  displayList.forEach(item => {
    const isLow = (Number(item.SoLuongTon) || 0) <= (Number(item.TonToiThieu) || 0);
    const card = document.createElement('div');
    card.className = `p-3 rounded-xl border ${isLow ? 'border-rose-200 bg-rose-50/40' : 'border-slate-100 bg-slate-50'} flex items-center gap-3`;
    card.innerHTML = `
      <img src="${item.HinhAnh || 'https://placehold.co/100x100?text=SP'}" class="w-12 h-12 rounded-lg object-cover bg-white shrink-0 shadow-sm" onerror="this.src='https://placehold.co/100x100?text=SP'">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">${item.DanhMuc}</span>
          <p class="text-[11px] text-slate-500 font-mono">${item.MaSP}</p>
        </div>
        <h5 class="text-xs font-bold text-slate-800 truncate mt-0.5">${item.TenSP}</h5>
        <div class="flex items-center justify-between mt-1">
          <span class="text-xs font-bold ${isLow ? 'text-rose-600' : 'text-emerald-600'}">Tồn: ${item.SoLuongTon} ${item.DonViTinh}</span>
          ${isLow ? '<span class="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">Cần bổ sung</span>' : ''}
        </div>
      </div>
    `;
    dashboardList.appendChild(card);
  });
}

function filterByCategoryQuick(cat) {
  switchTab('inventory');
  setCategoryFilter(cat);
}

// 2. KHO HÀNG & BỘ LỌC 3 NHÓM (THÙNG, PALLET, SPOOL)
function setCategoryFilter(category) {
  state.selectedCategory = category;

  // Cập nhật giao diện nút lọc
  document.querySelectorAll('.category-pill').forEach(btn => {
    btn.className = 'category-pill px-3 py-2 rounded-xl text-xs font-semibold transition bg-slate-100 text-slate-700 hover:bg-slate-200';
  });

  const activeId = category === 'ALL' ? 'filter-btn-ALL' : (category.includes('Thùng') ? 'filter-btn-box' : (category.includes('Pallet') ? 'filter-btn-pallet' : 'filter-btn-spool'));
  const activeBtn = document.getElementById(activeId);
  if (activeBtn) {
    activeBtn.className = 'category-pill px-3 py-2 rounded-xl text-xs font-bold transition bg-blue-600 text-white shadow-sm';
  }

  filterInventory();
}

function filterInventory() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const cat = state.selectedCategory;

  const filtered = state.sanPham.filter(item => {
    const matchText = (item.TenSP || '').toLowerCase().includes(query) || (item.MaSP || '').toLowerCase().includes(query);
    const matchCat = cat === 'ALL' || item.DanhMuc === cat;
    return matchText && matchCat;
  });

  renderInventory(filtered);
}

function renderInventory(items = state.sanPham) {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400">
        <i data-lucide="package-open" class="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2"></i>
        <p class="text-sm">Không tìm thấy vật tư nào trong danh mục này</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  const isAdmin = role === 'ADMIN';

  items.forEach(item => {
    const isLow = (Number(item.SoLuongTon) || 0) <= (Number(item.TonToiThieu) || 0);
    const card = document.createElement('div');
    card.className = "bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md";
    card.innerHTML = `
      <div>
        <div class="h-40 bg-slate-100 relative overflow-hidden group">
          <img src="${item.HinhAnh || 'https://placehold.co/300x200?text=Kho'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://placehold.co/300x200?text=Kho'">
          <div class="absolute top-2.5 left-2.5">
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm bg-slate-900/85 text-white">${item.DanhMuc}</span>
          </div>
          <div class="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            <span class="px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm ${isLow ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}">
              ${isLow ? 'Sắp hết' : 'Đủ hàng'}
            </span>
            <!-- Nút chỉnh sửa & đổi ảnh (Admin & Thủ kho) -->
            <button onclick="openEditProductModal('${item.MaSP}')" title="Đổi hình ảnh & Sửa quy cách" class="w-7 h-7 rounded-lg bg-white/95 hover:bg-white text-slate-700 hover:text-indigo-600 shadow-md flex items-center justify-center transition">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <!-- Nút xóa mã PN dành riêng cho ADMIN -->
            ${isAdmin ? `
              <button onclick="deleteProduct('${item.MaSP}', '${item.TenSP.replace(/'/g, "\\'")}')" title="Xóa mã PN này khỏi kho (Admin)" class="w-7 h-7 rounded-lg bg-white/95 hover:bg-rose-50 text-slate-400 hover:text-rose-600 shadow-md flex items-center justify-center transition">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="p-4 space-y-2">
          <span class="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold">${item.MaSP}</span>
          <h4 class="font-bold text-slate-800 text-sm line-clamp-2" title="${item.TenSP}">${item.TenSP}</h4>
          ${item.GhiChu ? `<p class="text-xs text-slate-400 line-clamp-1">${item.GhiChu}</p>` : ''}
        </div>
      </div>
      <div class="p-4 pt-0">
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p class="text-[10px] text-slate-400">Tồn kho hiện tại</p>
            <p class="text-base font-extrabold ${isLow ? 'text-rose-600' : 'text-slate-800'}">${Number(item.SoLuongTon).toLocaleString('vi-VN')} <span class="text-xs font-normal text-slate-500">${item.DonViTinh}</span></p>
          </div>
          <button onclick="quickAction('${item.MaSP}')" class="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white transition text-xs font-bold flex items-center gap-1 shadow-sm">
            <i data-lucide="arrow-left-right" class="w-3.5 h-3.5"></i>
            <span>Xuất/Nhập</span>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  lucide.createIcons();
}

// 3. WORK ORDER (WO) RENDERING & LOGIC (Hỗ trợ 1 WO nhiều vật tư: Thùng, Spool, Pallet)
function normalizeWorkOrders(rawList) {
  if (!Array.isArray(rawList)) return [];
  const map = new Map();

  rawList.forEach(entry => {
    if (!entry || !entry.MaWO) return;
    const key = String(entry.MaWO).trim().toUpperCase();

    // Nếu backend đã trả về dạng grouped có mảng items
    if (Array.isArray(entry.items)) {
      const items = entry.items.map(it => {
        const req = Number(it.SoLuongYeuCau) || 0;
        const iss = Number(it.SoLuongDaPhat) || 0;
        const rem = Math.max(0, req - iss);
        return {
          MaSP: String(it.MaSP || '').trim(),
          TenSP: String(it.TenSP || ''),
          SoLuongYeuCau: req,
          SoLuongDaPhat: iss,
          SoLuongConLai: rem,
          TrangThai: rem === 0 ? 'Đã đủ' : (iss > 0 ? 'Đang cấp phát' : 'Chưa cấp phát')
        };
      });
      const totalReq = items.reduce((s, i) => s + i.SoLuongYeuCau, 0);
      const totalIss = items.reduce((s, i) => s + i.SoLuongDaPhat, 0);
      const totalRem = items.reduce((s, i) => s + i.SoLuongConLai, 0);
      map.set(key, {
        MaWO: String(entry.MaWO).trim(),
        NgayTao: entry.NgayTao || '',
        GhiChu: entry.GhiChu || '',
        items,
        SoLuongYeuCau: totalReq,
        SoLuongDaPhat: totalIss,
        SoLuongConLai: totalRem,
        TrangThai: totalRem === 0 && items.length > 0 ? 'Đã đủ' : (totalIss > 0 ? 'Đang cấp phát' : 'Chưa cấp phát')
      });
      return;
    }

    // Fallback nếu backend cũ trả về từng dòng phẳng
    const req = Number(entry.SoLuongYeuCau) || 0;
    const iss = Number(entry.SoLuongDaPhat) || 0;
    const rem = Math.max(0, req - iss);
    if (!map.has(key)) {
      map.set(key, {
        MaWO: String(entry.MaWO).trim(),
        NgayTao: entry.NgayTao || '',
        GhiChu: entry.GhiChu || '',
        items: [],
        SoLuongYeuCau: 0,
        SoLuongDaPhat: 0,
        SoLuongConLai: 0,
        TrangThai: 'Chưa cấp phát'
      });
    }
    const wo = map.get(key);
    wo.items.push({
      MaSP: String(entry.MaSP || '').trim(),
      TenSP: String(entry.TenSP || ''),
      SoLuongYeuCau: req,
      SoLuongDaPhat: iss,
      SoLuongConLai: rem,
      TrangThai: rem === 0 ? 'Đã đủ' : (iss > 0 ? 'Đang cấp phát' : 'Chưa cấp phát')
    });
    wo.SoLuongYeuCau += req;
    wo.SoLuongDaPhat += iss;
    wo.SoLuongConLai += rem;
    wo.TrangThai = wo.SoLuongConLai === 0 ? 'Đã đủ' : (wo.SoLuongDaPhat > 0 ? 'Đang cấp phát' : 'Chưa cấp phát');
  });

  return Array.from(map.values());
}

function getWOItemCategoryLabel(maSP) {
  const sp = state.sanPham.find(i => i.MaSP.toUpperCase() === String(maSP || '').toUpperCase());
  return sp ? sp.DanhMuc : '';
}

function getWOStatusKey(wo) {
  const items = Array.isArray(wo.items) ? wo.items : [];
  const iss = Number(wo.SoLuongDaPhat) || 0;
  const rem = Number(wo.SoLuongConLai) || 0;
  if (rem <= 0 && items.length > 0) return 'DA_DU';
  if (iss > 0) return 'CHUA_DU';
  return 'CHUA_PHAT';
}

function setWOFilter(status) {
  state.selectedWOFilter = status;
  document.querySelectorAll('.wo-filter-pill').forEach(btn => {
    btn.className = 'wo-filter-pill px-3 py-2 rounded-xl text-xs font-semibold transition bg-slate-100 text-slate-700 hover:bg-slate-200 whitespace-nowrap';
  });
  const activeBtn = document.getElementById(`wo-filter-${status}`);
  if (activeBtn) {
    activeBtn.className = 'wo-filter-pill px-3 py-2 rounded-xl text-xs font-bold transition bg-amber-500 text-white shadow-sm whitespace-nowrap';
  }
  renderWorkOrders();
}

function renderWorkOrders() {
  const container = document.getElementById('wo-cards-grid');
  container.innerHTML = '';

  // Cập nhật số lượng trên các nút lọc trạng thái
  const counts = { ALL: state.workOrders.length, CHUA_PHAT: 0, CHUA_DU: 0, DA_DU: 0 };
  state.workOrders.forEach(wo => {
    counts[getWOStatusKey(wo)]++;
  });
  Object.keys(counts).forEach(k => {
    const el = document.getElementById(`wo-count-${k}`);
    if (el) el.textContent = counts[k];
  });

  if (state.workOrders.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center py-10 text-slate-400 text-sm">Chưa có Lệnh Work Order nào</p>';
    return;
  }

  const searchInput = document.getElementById('wo-search-input');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filterKey = state.selectedWOFilter || 'ALL';

  const filtered = state.workOrders.filter(wo => {
    const statusKey = getWOStatusKey(wo);
    if (filterKey !== 'ALL' && statusKey !== filterKey) return false;
    if (!query) return true;

    const items = Array.isArray(wo.items) ? wo.items : [];
    const matchHeader = (wo.MaWO || '').toLowerCase().includes(query) ||
                        (wo.GhiChu || '').toLowerCase().includes(query);
    const matchItems = items.some(it =>
      (it.MaSP || '').toLowerCase().includes(query) ||
      (it.TenSP || '').toLowerCase().includes(query)
    );
    return matchHeader || matchItems;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center py-10 text-slate-400 text-sm">Không tìm thấy Lệnh Work Order phù hợp</p>';
    return;
  }

  // Sắp xếp: WO chưa nhận đủ lên trước, WO đã nhận đủ ra sau
  const sorted = [...filtered].sort((a, b) => {
    const aDone = getWOStatusKey(a) === 'DA_DU' ? 1 : 0;
    const bDone = getWOStatusKey(b) === 'DA_DU' ? 1 : 0;
    return aDone - bDone;
  });

  const userRole = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  const canEditWO = Boolean(state.currentUser);
  const isAdmin = userRole === 'ADMIN';

  sorted.forEach(wo => {
    const items = Array.isArray(wo.items) ? wo.items : [];
    const req = Number(wo.SoLuongYeuCau) || 0;
    const iss = Number(wo.SoLuongDaPhat) || 0;
    const rem = Math.max(0, req - iss);
    const pct = req > 0 ? Math.min(100, Math.round((iss / req) * 100)) : 0;
    const isCompleted = rem === 0 && items.length > 0;

    const itemsHtml = items.map(it => {
      const iReq = Number(it.SoLuongYeuCau) || 0;
      const iIss = Number(it.SoLuongDaPhat) || 0;
      const iRem = Math.max(0, iReq - iIss);
      const iPct = iReq > 0 ? Math.min(100, Math.round((iIss / iReq) * 100)) : 0;
      const iDone = iRem === 0;
      const cat = getWOItemCategoryLabel(it.MaSP);

      return `
        <div class="p-2.5 rounded-xl border ${iDone ? 'bg-emerald-50/40 border-emerald-200/70' : 'bg-slate-50 border-slate-200/70'} space-y-1.5">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                ${cat ? `<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">${cat}</span>` : ''}
                <span class="text-[11px] font-mono font-bold text-slate-600">${it.MaSP}</span>
              </div>
              <p class="text-xs font-bold text-slate-800 truncate mt-0.5" title="${it.TenSP}">${it.TenSP || it.MaSP}</p>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${iDone ? 'bg-emerald-100 text-emerald-700' : (iIss > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600')}">
              ${iDone ? 'Đủ' : `Thiếu ${iRem}`}
            </span>
          </div>
          <div class="flex items-center justify-between text-[11px] font-semibold">
            <span class="text-slate-500">Định mức: <b class="text-slate-800">${iReq}</b></span>
            <span class="text-blue-600">Đã phát: <b>${iIss}</b></span>
            <span class="${iDone ? 'text-emerald-600' : 'text-rose-600'}">Còn: <b>${iRem}</b></span>
          </div>
          <div class="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
            <div class="h-full ${iDone ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full transition-all duration-300" style="width: ${iPct}%"></div>
          </div>
        </div>
      `;
    }).join('');

    const card = document.createElement('div');
    card.className = `p-5 rounded-2xl border transition-all flex flex-col justify-between ${isCompleted ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-amber-200 shadow-sm hover:shadow-md'}`;
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg ${isCompleted ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-900'}">${wo.MaWO}</span>
            <span class="text-[11px] font-semibold text-slate-500">${items.length} vật tư</span>
          </div>
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-800' : (iss > 0 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800')}">
            ${isCompleted ? '✓ Đã nhận đủ' : (iss > 0 ? `Chưa đủ (${pct}%)` : 'Chưa phát')}
          </span>
        </div>

        ${wo.GhiChu ? `<p class="text-xs text-slate-500 mb-3 truncate" title="${wo.GhiChu}">${wo.GhiChu}</p>` : '<div class="mb-2"></div>'}

        <div class="space-y-2 mb-4 max-h-64 overflow-y-auto pr-0.5">
          ${itemsHtml}
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span class="text-[11px] text-slate-400 font-mono">${wo.NgayTao ? wo.NgayTao.split(' ')[0] : ''}</span>
        <div class="flex items-center gap-1.5">
          ${isAdmin ? `
            <button onclick="deleteWorkOrder('${wo.MaWO}')" title="Xóa Work Order (Chỉ Admin)" class="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition flex items-center justify-center">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          ` : ''}
          ${canEditWO ? `
            <button onclick="openAddWOItemModal('${wo.MaWO}')" title="Thêm vật tư vào WO này" class="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-xs font-bold transition flex items-center gap-1">
              <i data-lucide="plus" class="w-3.5 h-3.5"></i> Thêm VT
            </button>
          ` : ''}
          ${isCompleted ? `
            <button disabled class="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed">
              Đã đủ định mức
            </button>
          ` : `
            <button onclick="dispatchToWO('${wo.MaWO}')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm">
              <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i> Cấp phát
            </button>
          `}
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function dispatchToWO(maWO) {
  switchTab('transaction');
  selectTransactionType('XUAT');
  const woSelect = document.getElementById('trans-wo-select');
  woSelect.value = maWO;
  onSelectWorkOrder();
  document.getElementById('trans-quantity').focus();
}

function formatShortOptionText(danhMuc, tenSP, maSP, extraText) {
  const shortCat = (danhMuc || '').includes('Thùng') ? 'Thùng' : ((danhMuc || '').includes('Pallet') ? 'Pallet' : ((danhMuc || '').includes('Spool') ? 'Spool' : danhMuc));
  const rawName = String(tenSP || maSP || '');
  const shortName = rawName.length > 15 ? rawName.slice(0, 15) + '…' : rawName;
  const prefix = shortCat ? `[${shortCat}] ` : '';
  return `${prefix}${maSP} - ${shortName}${extraText ? ' • ' + extraText : ''}`;
}

function populateTransProductSelect(woItems = null) {
  const spSelect = document.getElementById('trans-product-select');
  const prevValue = spSelect.value;
  spSelect.innerHTML = '<option value="">-- Chọn Thùng / Pallet / Spool --</option>';

  if (Array.isArray(woItems) && woItems.length > 0) {
    woItems.forEach(wItem => {
      const sp = state.sanPham.find(i => i.MaSP.toUpperCase() === wItem.MaSP.toUpperCase());
      const tonText = sp ? `Tồn:${sp.SoLuongTon}` : 'Tồn:0';
      const statusText = wItem.SoLuongConLai <= 0 ? 'ĐỦ' : `Thiếu:${wItem.SoLuongConLai}`;
      const opt = document.createElement('option');
      opt.value = sp ? sp.MaSP : wItem.MaSP;
      opt.textContent = formatShortOptionText(sp ? sp.DanhMuc : '', wItem.TenSP || wItem.MaSP, wItem.MaSP, `${tonText} | ${statusText}`);
      spSelect.appendChild(opt);
    });
  } else {
    state.sanPham.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.MaSP;
      opt.textContent = formatShortOptionText(item.DanhMuc, item.TenSP, item.MaSP, `Còn: ${item.SoLuongTon}`);
      spSelect.appendChild(opt);
    });
  }

  if (prevValue && Array.from(spSelect.options).some(o => o.value === prevValue)) {
    spSelect.value = prevValue;
  }
}

function renderTransactionSelects() {
  populateTransProductSelect();

  const woSelect = document.getElementById('trans-wo-select');
  const prevWO = woSelect.value;
  woSelect.innerHTML = '<option value="">-- Xuất lẻ tự do (Không theo WO) --</option>';

  state.workOrders.forEach(w => {
    const items = Array.isArray(w.items) ? w.items : [];
    const isCompleted = w.SoLuongConLai <= 0 && items.length > 0;
    if (isCompleted) return; // Ẩn các WO đã phát đủ hết khỏi danh sách xuất kho

    const opt = document.createElement('option');
    opt.value = w.MaWO;
    opt.textContent = `${w.MaWO} (${items.length} VT • ${w.SoLuongDaPhat}/${w.SoLuongYeuCau})`;
    woSelect.appendChild(opt);
  });

  if (prevWO && Array.from(woSelect.options).some(o => o.value === prevWO)) {
    woSelect.value = prevWO;
  }
}

function selectWOItemInTrans(maSP) {
  const spSelect = document.getElementById('trans-product-select');
  spSelect.value = maSP;
  onSelectTransProduct();
  document.getElementById('trans-quantity').focus();
}

function renderWOStatusCard(wo, selectedMaSP) {
  const itemsListEl = document.getElementById('wo-card-items-list');
  const noteEl = document.getElementById('wo-card-note');
  if (wo.GhiChu) {
    noteEl.textContent = wo.GhiChu;
    noteEl.classList.remove('hidden');
  } else {
    noteEl.classList.add('hidden');
  }

  const items = Array.isArray(wo.items) ? wo.items : [];
  itemsListEl.innerHTML = items.map(it => {
    const isSelected = selectedMaSP && it.MaSP.toUpperCase() === selectedMaSP.toUpperCase();
    const isDone = it.SoLuongConLai <= 0;
    const pct = it.SoLuongYeuCau > 0 ? Math.min(100, Math.round((it.SoLuongDaPhat / it.SoLuongYeuCau) * 100)) : 0;
    const cat = getWOItemCategoryLabel(it.MaSP);

    return `
      <div onclick="selectWOItemInTrans('${it.MaSP}')" class="cursor-pointer p-2 rounded-lg border transition ${isSelected ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-400' : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'}">
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <span class="text-[10px] font-mono font-bold text-slate-600">${cat ? `[${cat}] ` : ''}${it.MaSP}</span>
            <p class="text-[11px] font-bold text-slate-800 truncate">${it.TenSP || it.MaSP}</p>
          </div>
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
            ${isDone ? 'ĐÃ ĐỦ' : `Thiếu ${it.SoLuongConLai}`}
          </span>
        </div>
        <div class="flex items-center justify-between text-[10px] font-semibold mt-1 text-slate-500">
          <span>Định mức: <b class="text-slate-800">${it.SoLuongYeuCau}</b></span>
          <span class="text-blue-600">Đã phát: <b>${it.SoLuongDaPhat}</b></span>
          <span>${pct}%</span>
        </div>
        <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
          <div class="h-full ${isDone ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function updateSelectedWOItemConstraints() {
  const maWO = document.getElementById('trans-wo-select').value;
  if (!maWO || state.transType !== 'XUAT') return;

  const wo = state.workOrders.find(w => w.MaWO.toUpperCase() === maWO.toUpperCase());
  if (!wo) return;

  const warning = document.getElementById('wo-card-full-warning');
  const submitBtn = document.getElementById('btn-submit-trans');
  const submitText = document.getElementById('trans-submit-text');
  const qtyLimitHint = document.getElementById('trans-qty-limit-hint');
  const qtyInput = document.getElementById('trans-quantity');
  const selectedMaSP = document.getElementById('trans-product-select').value;

  renderWOStatusCard(wo, selectedMaSP);

  if (wo.SoLuongConLai <= 0) {
    warning.classList.remove('hidden');
    document.getElementById('wo-card-badge').className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
    document.getElementById('wo-card-badge').textContent = 'ĐÃ NHẬN ĐỦ';
    qtyLimitHint.textContent = '⛔ WO đã nhận đủ toàn bộ định mức, không được phát thêm!';
    qtyInput.value = '';
    qtyInput.disabled = true;
    submitBtn.disabled = true;
    submitBtn.className = 'w-full py-3 rounded-xl bg-slate-300 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2';
    submitText.textContent = '⛔ Đã nhận đủ định mức (Chặn phát thêm)';
    return;
  }

  document.getElementById('wo-card-badge').className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
  document.getElementById('wo-card-badge').textContent = `Còn thiếu ${wo.SoLuongConLai}`;

  const woItem = (wo.items || []).find(i => i.MaSP.toUpperCase() === selectedMaSP.toUpperCase());
  if (!woItem) {
    warning.classList.add('hidden');
    qtyInput.disabled = false;
    qtyInput.removeAttribute('max');
    qtyLimitHint.textContent = 'Chọn vật tư trong danh sách WO để kiểm tra định mức.';
    submitBtn.disabled = false;
    submitBtn.className = 'w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2';
    submitText.textContent = `Xác nhận Xuất kho cho ${wo.MaWO} (-)`;
    return;
  }

  if (woItem.SoLuongConLai <= 0) {
    warning.classList.remove('hidden');
    qtyLimitHint.textContent = `⛔ Vật tư [${woItem.MaSP}] đã nhận đủ (${woItem.SoLuongDaPhat}/${woItem.SoLuongYeuCau}), hãy chọn vật tư khác trong WO!`;
    qtyInput.value = '';
    qtyInput.disabled = true;
    submitBtn.disabled = true;
    submitBtn.className = 'w-full py-3 rounded-xl bg-slate-300 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2';
    submitText.textContent = `⛔ [${woItem.MaSP}] đã đủ định mức`;
  } else {
    warning.classList.add('hidden');
    qtyInput.disabled = false;
    qtyInput.max = woItem.SoLuongConLai;
    qtyLimitHint.textContent = `(Tối đa được phát thêm cho ${woItem.MaSP}: ${woItem.SoLuongConLai})`;
    submitBtn.disabled = false;
    submitBtn.className = 'w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2';
    submitText.textContent = `Xác nhận Xuất kho cho ${wo.MaWO} (-)`;
    validateTransactionQuantity();
  }
}

function onSelectWorkOrder() {
  const maWO = document.getElementById('trans-wo-select').value;
  const card = document.getElementById('wo-status-card');
  const warning = document.getElementById('wo-card-full-warning');
  const submitBtn = document.getElementById('btn-submit-trans');
  const submitText = document.getElementById('trans-submit-text');
  const spSelect = document.getElementById('trans-product-select');
  const qtyLimitHint = document.getElementById('trans-qty-limit-hint');
  const qtyInput = document.getElementById('trans-quantity');

  if (!maWO) {
    card.classList.add('hidden');
    warning.classList.add('hidden');
    populateTransProductSelect(null);
    qtyLimitHint.textContent = '';
    qtyInput.disabled = false;
    qtyInput.removeAttribute('max');
    submitBtn.disabled = false;
    submitBtn.className = 'w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2';
    submitText.textContent = 'Xác nhận Xuất kho (-)';
    onSelectTransProduct();
    return;
  }

  const wo = state.workOrders.find(w => w.MaWO.toUpperCase() === maWO.toUpperCase());
  if (!wo) return;

  card.classList.remove('hidden');
  document.getElementById('wo-card-id').textContent = wo.MaWO;

  const items = Array.isArray(wo.items) ? wo.items : [];
  populateTransProductSelect(items);

  // Giữ vật tư đang chọn nếu thuộc WO, ngược lại tự chọn vật tư còn thiếu đầu tiên
  const currentInWO = items.find(i => i.MaSP.toUpperCase() === spSelect.value.toUpperCase());
  if (!currentInWO) {
    const firstPending = items.find(i => i.SoLuongConLai > 0) || items[0];
    if (firstPending) {
      spSelect.value = firstPending.MaSP;
    }
  }

  onSelectTransProduct();
}

function validateTransactionQuantity() {
  const maWO = document.getElementById('trans-wo-select').value;
  if (!maWO || state.transType !== 'XUAT') return;

  const wo = state.workOrders.find(w => w.MaWO.toUpperCase() === maWO.toUpperCase());
  if (!wo) return;

  const maSP = document.getElementById('trans-product-select').value;
  const woItem = (wo.items || []).find(i => i.MaSP.toUpperCase() === maSP.toUpperCase());
  if (!woItem) return;

  const qty = Number(document.getElementById('trans-quantity').value);
  const hint = document.getElementById('trans-qty-limit-hint');
  const submitBtn = document.getElementById('btn-submit-trans');

  if (qty > woItem.SoLuongConLai) {
    hint.textContent = `⚠️ Quá định mức! [${woItem.MaSP}] chỉ còn thiếu tối đa ${woItem.SoLuongConLai}`;
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50');
  } else {
    hint.textContent = `(Hợp lệ. [${woItem.MaSP}] còn thiếu: ${woItem.SoLuongConLai})`;
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50');
  }
}

// 4. TẠO WORK ORDER MỚI & THÊM VẬT TƯ VÀO WO ĐÃ CÓ
function addNewWOItemRow(presetMaSP = '', presetQty = '') {
  const container = document.getElementById('new-wo-items-container');
  const row = document.createElement('div');
  row.className = 'new-wo-item-row flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200';

  let existingSPSet = new Set();
  if (state.editingWOTarget) {
    const existingWO = state.workOrders.find(w => w.MaWO.toUpperCase() === state.editingWOTarget.toUpperCase());
    if (existingWO && Array.isArray(existingWO.items)) {
      existingWO.items.forEach(it => existingSPSet.add(String(it.MaSP || '').toUpperCase()));
    }
  }

  const optionsHtml = ['<option value="">-- Chọn Thùng / Pallet / Spool --</option>']
    .concat(state.sanPham.map(item => {
      const alreadyInWO = existingSPSet.has(item.MaSP.toUpperCase());
      const label = formatShortOptionText(item.DanhMuc, item.TenSP, item.MaSP, alreadyInWO ? 'Đã có' : '');
      return `<option value="${item.MaSP}" ${item.MaSP === presetMaSP ? 'selected' : ''} ${alreadyInWO ? 'disabled' : ''}>${label}</option>`;
    })).join('');

  row.innerHTML = `
    <div class="flex-1 min-w-0">
      <select required class="new-wo-item-select w-full truncate px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500">
        ${optionsHtml}
      </select>
    </div>
    <input type="number" min="1" required value="${presetQty}" placeholder="SL" class="new-wo-item-qty w-16 sm:w-20 shrink-0 px-2 py-2 rounded-lg border border-slate-200 text-xs font-bold text-center focus:ring-2 focus:ring-amber-500 bg-white">
    <button type="button" onclick="removeNewWOItemRow(this)" title="Xóa dòng" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0">
      <i data-lucide="trash-2" class="w-4 h-4"></i>
    </button>
  `;
  container.appendChild(row);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function removeNewWOItemRow(btn) {
  const container = document.getElementById('new-wo-items-container');
  if (container.querySelectorAll('.new-wo-item-row').length <= 1) {
    Swal.fire({ toast: true, icon: 'info', title: 'Phải có ít nhất 1 vật tư', timer: 1800, position: 'top' });
    return;
  }
  btn.closest('.new-wo-item-row').remove();
}

function openAddWOModal() {
  if (!state.currentUser) {
    Swal.fire('Chưa đăng nhập', 'Vui lòng đăng nhập để tạo Lệnh Work Order mới!', 'info');
    return;
  }
  state.editingWOTarget = null;
  document.getElementById('form-add-wo').reset();
  document.getElementById('modal-add-wo-title').innerHTML = '<i data-lucide="clipboard-plus" class="w-5 h-5 text-amber-600"></i> Tạo Lệnh Work Order (WO) Mới';
  const woIdInput = document.getElementById('new-wo-id');
  woIdInput.readOnly = false;
  woIdInput.classList.remove('bg-slate-100', 'text-slate-600', 'cursor-not-allowed');
  document.getElementById('new-wo-note-group').classList.remove('hidden');
  document.getElementById('btn-submit-wo').textContent = 'Lưu Lệnh WO';

  const container = document.getElementById('new-wo-items-container');
  container.innerHTML = '';
  addNewWOItemRow();
  document.getElementById('modal-add-wo').classList.remove('hidden');
  lucide.createIcons();
}

function openAddWOItemModal(maWO) {
  if (!state.currentUser) {
    Swal.fire('Chưa đăng nhập', 'Vui lòng đăng nhập để thêm vật tư vào WO!', 'info');
    return;
  }
  state.editingWOTarget = maWO;
  document.getElementById('form-add-wo').reset();
  document.getElementById('modal-add-wo-title').innerHTML = `<i data-lucide="package-plus" class="w-5 h-5 text-amber-600"></i> Thêm vật tư vào ${maWO}`;
  const woIdInput = document.getElementById('new-wo-id');
  woIdInput.value = maWO;
  woIdInput.readOnly = true;
  woIdInput.classList.add('bg-slate-100', 'text-slate-600', 'cursor-not-allowed');
  document.getElementById('new-wo-note-group').classList.add('hidden');
  document.getElementById('btn-submit-wo').textContent = 'Thêm vào WO';

  const container = document.getElementById('new-wo-items-container');
  container.innerHTML = '';
  addNewWOItemRow();
  document.getElementById('modal-add-wo').classList.remove('hidden');
  lucide.createIcons();
}

function closeAddWOModal() {
  state.editingWOTarget = null;
  document.getElementById('modal-add-wo').classList.add('hidden');
}

async function deleteWorkOrder(maWO) {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : '';
  if (role !== 'ADMIN') {
    Swal.fire('Hạn chế quyền', '⛔ Chỉ tài khoản Quản trị viên (ADMIN) mới có quyền xóa Work Order!', 'error');
    return;
  }

  const confirm = await Swal.fire({
    title: `Xóa Work Order [${maWO}]?`,
    text: 'Toàn bộ vật tư và tiến độ thuộc lệnh WO này sẽ bị xóa vĩnh viễn khỏi Google Sheet!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Xóa vĩnh viễn',
    cancelButtonText: 'Hủy'
  });

  if (!confirm.isConfirmed) return;

  Swal.fire({
    title: `Đang xóa ${maWO}...`,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    if (state.gasUrl) {
      const res = await fetchWithTimeout(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'xoa_work_order',
          userRole: 'ADMIN',
          MaWO: maWO
        })
      });
      const data = await res.json();
      if (!data.success) {
        Swal.fire('Lỗi', data.message || 'Không thể xóa Work Order', 'error');
        return;
      }
      await loadDataFromSheets();
    } else {
      state.workOrders = state.workOrders.filter(w => w.MaWO.toUpperCase() !== String(maWO).toUpperCase());
      renderAllViews();
    }

    Swal.fire('Đã xóa!', `Work Order [${maWO}] đã được xóa khỏi hệ thống.`, 'success');
  } catch (err) {
    Swal.fire('Lỗi', err.message, 'error');
  }
}

async function submitNewWorkOrder(e) {
  e.preventDefault();

  const isAddingToExisting = Boolean(state.editingWOTarget);
  const maWO = (state.editingWOTarget || document.getElementById('new-wo-id').value).trim().toUpperCase();
  const note = document.getElementById('new-wo-note').value.trim();
  const rows = Array.from(document.querySelectorAll('#new-wo-items-container .new-wo-item-row'));

  const items = [];
  const seen = new Set();
  for (const row of rows) {
    const maSP = row.querySelector('.new-wo-item-select').value;
    const qty = Number(row.querySelector('.new-wo-item-qty').value);
    if (!maSP || isNaN(qty) || qty <= 0) {
      Swal.fire('Lỗi', 'Vui lòng chọn đầy đủ vật tư và nhập số lượng > 0 cho từng dòng!', 'warning');
      return;
    }
    if (seen.has(maSP.toUpperCase())) {
      Swal.fire('Trùng vật tư', `Mã [${maSP}] đang bị chọn lặp lại!`, 'warning');
      return;
    }
    seen.add(maSP.toUpperCase());
    items.push({ MaSP: maSP, SoLuongYeuCau: qty });
  }

  if (!maWO || items.length === 0) {
    Swal.fire('Lỗi', 'Vui lòng nhập Mã WO và ít nhất 1 vật tư!', 'warning');
    return;
  }

  Swal.fire({
    title: isAddingToExisting ? `Đang thêm vật tư vào ${maWO}...` : 'Đang tạo Lệnh Work Order...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    if (state.gasUrl) {
      const userRole = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : '';
      const res = await fetchWithTimeout(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(
          isAddingToExisting
            ? { action: 'them_item_work_order', userRole, MaWO: maWO, Items: items }
            : { action: 'them_work_order', userRole, MaWO: maWO, Items: items, GhiChu: note }
        )
      });
      const data = await res.json();
      if (!data.success) {
        Swal.fire('Lỗi', data.message || 'Không thể lưu WO', 'error');
        return;
      }
      await loadDataFromSheets();
    } else {
      if (isAddingToExisting) {
        const existingWO = state.workOrders.find(w => w.MaWO.toUpperCase() === maWO);
        if (!existingWO) {
          Swal.fire('Lỗi', `Không tìm thấy Work Order ${maWO}!`, 'error');
          return;
        }
        for (const it of items) {
          if ((existingWO.items || []).some(eItem => eItem.MaSP.toUpperCase() === it.MaSP.toUpperCase())) {
            Swal.fire('Trùng vật tư', `Vật tư [${it.MaSP}] đã có trong lệnh ${maWO}!`, 'warning');
            return;
          }
        }
        items.forEach(it => {
          const sp = state.sanPham.find(i => i.MaSP === it.MaSP);
          existingWO.items.push({
            MaSP: it.MaSP,
            TenSP: sp ? sp.TenSP : it.MaSP,
            SoLuongYeuCau: it.SoLuongYeuCau,
            SoLuongDaPhat: 0,
            SoLuongConLai: it.SoLuongYeuCau,
            TrangThai: 'Chưa cấp phát'
          });
        });
        existingWO.SoLuongYeuCau = existingWO.items.reduce((s, i) => s + i.SoLuongYeuCau, 0);
        existingWO.SoLuongDaPhat = existingWO.items.reduce((s, i) => s + i.SoLuongDaPhat, 0);
        existingWO.SoLuongConLai = existingWO.items.reduce((s, i) => s + i.SoLuongConLai, 0);
        existingWO.TrangThai = existingWO.SoLuongConLai === 0 ? 'Đã đủ' : (existingWO.SoLuongDaPhat > 0 ? 'Đang cấp phát' : 'Chưa cấp phát');
        renderAllViews();
      } else {
        if (state.workOrders.some(w => w.MaWO.toUpperCase() === maWO)) {
          Swal.fire('Lỗi', `Mã Work Order ${maWO} đã tồn tại!`, 'error');
          return;
        }
        const woItems = items.map(it => {
          const sp = state.sanPham.find(i => i.MaSP === it.MaSP);
          return {
            MaSP: it.MaSP,
            TenSP: sp ? sp.TenSP : it.MaSP,
            SoLuongYeuCau: it.SoLuongYeuCau,
            SoLuongDaPhat: 0,
            SoLuongConLai: it.SoLuongYeuCau,
            TrangThai: 'Chưa cấp phát'
          };
        });
        const totalReq = woItems.reduce((s, i) => s + i.SoLuongYeuCau, 0);
        state.workOrders.unshift({
          MaWO: maWO,
          NgayTao: new Date().toLocaleString('vi-VN'),
          GhiChu: note,
          items: woItems,
          SoLuongYeuCau: totalReq,
          SoLuongDaPhat: 0,
          SoLuongConLai: totalReq,
          TrangThai: 'Chưa cấp phát'
        });
        renderAllViews();
      }
    }

    Swal.fire(
      'Thành công',
      isAddingToExisting
        ? `Đã thêm ${items.length} vật tư vào lệnh [${maWO}]!`
        : `Đã tạo Lệnh Work Order [${maWO}] gồm ${items.length} loại vật tư!`,
      'success'
    );
    closeAddWOModal();
    document.getElementById('form-add-wo').reset();
    switchTab('workorder');
  } catch (err) {
    Swal.fire('Lỗi', err.message, 'error');
  }
}

// 5. GIAO DỊCH NHẬP KHO / XUẤT KHO
function selectTransactionType(type) {
  state.transType = type;
  const btnNhap = document.getElementById('btn-type-nhap');
  const btnXuat = document.getElementById('btn-type-xuat');
  const btnSubmit = document.getElementById('btn-submit-trans');
  const submitText = document.getElementById('trans-submit-text');
  const woBox = document.getElementById('wo-selection-box');
  const qtyInput = document.getElementById('trans-quantity');

  qtyInput.disabled = false;

  if (type === 'NHAP') {
    btnNhap.className = 'py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-sm whitespace-nowrap';
    btnXuat.className = 'py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 whitespace-nowrap';
    btnSubmit.className = 'w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2';
    submitText.textContent = 'Xác nhận Nhập kho trả về (+)';
    woBox.classList.add('hidden');
    document.getElementById('trans-qty-limit-hint').textContent = '';
  } else {
    btnXuat.className = 'py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 bg-rose-600 text-white shadow-sm whitespace-nowrap';
    btnNhap.className = 'py-2.5 px-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 text-slate-600 hover:text-slate-900 whitespace-nowrap';
    btnSubmit.className = 'w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2';
    submitText.textContent = 'Xác nhận Xuất cấp theo WO (-)';
    woBox.classList.remove('hidden');
    onSelectWorkOrder();
  }
}

function onSelectTransProduct() {
  const select = document.getElementById('trans-product-select');
  const infoEl = document.getElementById('trans-current-stock-info');
  const sp = state.sanPham.find(i => i.MaSP === select.value);

  if (sp) {
    infoEl.textContent = `Tồn kho hiện tại: ${sp.SoLuongTon} ${sp.DonViTinh} (Mức tối thiểu: ${sp.TonToiThieu})`;
  } else {
    infoEl.textContent = '';
  }

  updateSelectedWOItemConstraints();
}

function quickAction(maSP) {
  switchTab('transaction');
  selectTransactionType('XUAT');
  const select = document.getElementById('trans-product-select');
  select.value = maSP;
  onSelectTransProduct();
  document.getElementById('trans-quantity').focus();
}

async function submitTransaction(e) {
  e.preventDefault();

  const maSP = document.getElementById('trans-product-select').value;
  const soLuong = Number(document.getElementById('trans-quantity').value);
  const maWO = document.getElementById('trans-wo-select').value.trim().toUpperCase();
  const nguoi = state.currentUser ? state.currentUser.HoTen : 'Nhân viên';
  const ghiChu = document.getElementById('trans-note').value.trim();
  const fileInput = document.getElementById('trans-image-file');

  if (!maSP || isNaN(soLuong) || soLuong <= 0) {
    Swal.fire('Lỗi', 'Vui lòng chọn Thùng/Pallet/Spool và nhập số lượng hợp lệ!', 'warning');
    return;
  }

  const sp = state.sanPham.find(i => i.MaSP === maSP);

  // KIỂM TRA ĐỊNH MỨC NẾU XUẤT THEO WORK ORDER:
  if (state.transType === 'XUAT' && maWO) {
    const wo = state.workOrders.find(w => w.MaWO.toUpperCase() === maWO);
    if (wo) {
      if (wo.SoLuongConLai <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Chặn phát hàng',
          text: `⛔ Lệnh ${wo.MaWO} đã nhận ĐỦ toàn bộ định mức! Không được phép phát thêm!`
        });
        return;
      }
      const woItem = (wo.items || []).find(i => i.MaSP.toUpperCase() === maSP.toUpperCase());
      if (!woItem) {
        Swal.fire({
          icon: 'warning',
          title: 'Sai vật tư',
          text: `Vật tư [${maSP}] không nằm trong danh sách định mức của lệnh ${wo.MaWO}!`
        });
        return;
      }
      if (woItem.SoLuongConLai <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Chặn phát hàng',
          text: `⛔ Vật tư [${maSP}] trong lệnh ${wo.MaWO} đã nhận ĐỦ định mức (${woItem.SoLuongDaPhat}/${woItem.SoLuongYeuCau})!`
        });
        return;
      }
      if (soLuong > woItem.SoLuongConLai) {
        Swal.fire({
          icon: 'warning',
          title: 'Vượt định mức',
          text: `Số lượng xuất (${soLuong}) vượt quá số lượng còn thiếu của [${maSP}] trong ${wo.MaWO}! Chỉ được phát tối đa: ${woItem.SoLuongConLai}`
        });
        return;
      }
    }
  }

  if (state.transType === 'XUAT' && sp && sp.SoLuongTon < soLuong) {
    Swal.fire('Kho không đủ hàng', `Vật tư hiện chỉ còn tồn ${sp.SoLuongTon} ${sp.DonViTinh}, không thể xuất ${soLuong}!`, 'error');
    return;
  }

  Swal.fire({
    title: 'Đang xử lý giao dịch...',
    text: 'Đang đối soát WO & cập nhật tồn kho...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    let imageUrl = '';
    if (fileInput && fileInput.files && fileInput.files[0]) {
      imageUrl = await uploadImageToCloudinary(fileInput.files[0]);
    }

    if (state.gasUrl) {
      const payload = {
        action: 'giao_dich',
        MaSP: maSP,
        LoaiGiaoDich: state.transType,
        SoLuong: soLuong,
        MaWO: maWO,
        NguoiThucHien: nguoi,
        HinhAnh: imageUrl,
        GhiChu: ghiChu
      };

      const res = await fetchWithTimeout(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.success) {
        Swal.fire('Thất bại', data.message || 'Không thể cập nhật Google Sheet', 'error');
        return;
      }

      await loadDataFromSheets();
    } else {
      if (state.transType === 'NHAP') {
        sp.SoLuongTon += soLuong;
      } else {
        sp.SoLuongTon -= soLuong;
        if (maWO) {
          const wo = state.workOrders.find(w => w.MaWO.toUpperCase() === maWO);
          if (wo) {
            const woItem = (wo.items || []).find(i => i.MaSP.toUpperCase() === maSP.toUpperCase());
            if (woItem) {
              woItem.SoLuongDaPhat += soLuong;
              woItem.SoLuongConLai = Math.max(0, woItem.SoLuongYeuCau - woItem.SoLuongDaPhat);
              woItem.TrangThai = woItem.SoLuongConLai === 0 ? "Đã đủ" : "Đang cấp phát";
            }
            wo.SoLuongDaPhat = (wo.items || []).reduce((s, i) => s + i.SoLuongDaPhat, 0);
            wo.SoLuongConLai = (wo.items || []).reduce((s, i) => s + i.SoLuongConLai, 0);
            wo.TrangThai = wo.SoLuongConLai === 0 ? "Đã đủ" : "Đang cấp phát";
          }
        }
      }

      const now = new Date();
      const maGD = (state.transType === 'NHAP' ? 'NK-' : 'XK-') + Math.floor(Math.random() * 100000);
      state.lichSu.unshift({
        MaGiaoDich: maGD,
        NgayGio: now.toLocaleString('vi-VN'),
        LoaiGiaoDich: state.transType === 'NHAP' ? 'Nhập kho' : 'Xuất kho',
        MaSP: sp.MaSP,
        TenSP: sp.TenSP,
        SoLuong: soLuong,
        MaWO: maWO,
        NguoiThucHien: nguoi,
        HinhAnh: imageUrl || (fileInput.files[0] ? URL.createObjectURL(fileInput.files[0]) : ''),
        GhiChu: ghiChu
      });

      renderAllViews();
    }

    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: `${state.transType === 'NHAP' ? 'Nhập kho' : 'Xuất kho ' + (maWO ? 'cho ' + maWO : '')} ${soLuong} ${sp ? sp.DonViTinh : ''} thành công!`,
      timer: 2000,
      showConfirmButton: false
    });

    document.getElementById('form-transaction').reset();
    document.getElementById('trans-user').value = nguoi;
    document.getElementById('trans-image-preview').classList.add('hidden');
    document.getElementById('trans-current-stock-info').textContent = '';
    onSelectWorkOrder();

  } catch (err) {
    Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra khi thực hiện giao dịch', 'error');
  }
}

// 6. LỊCH SỬ GIAO DỊCH
function renderHistory() {
  const tbody = document.getElementById('history-table-body');
  tbody.innerHTML = '';

  if (state.lichSu.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-xs text-slate-400">Chưa có giao dịch nào</td></tr>';
    return;
  }

  state.lichSu.forEach(row => {
    const isNhap = (row.LoaiGiaoDich || '').includes('Nhập');
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/70 transition";
    tr.innerHTML = `
      <td class="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">${row.NgayGio}</td>
      <td class="px-4 py-3 whitespace-nowrap">
        <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${isNhap ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
          ${row.LoaiGiaoDich}
        </span>
      </td>
      <td class="px-4 py-3 whitespace-nowrap">
        ${row.MaWO ? `<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[11px] font-bold">${row.MaWO}</span>` : '<span class="text-slate-400 text-xs">Xuất lẻ</span>'}
      </td>
      <td class="px-4 py-3">
        <p class="font-bold text-slate-800 text-xs">${row.TenSP || ''}</p>
        <p class="text-[11px] font-mono text-slate-400">${row.MaSP}</p>
      </td>
      <td class="px-4 py-3 text-right font-extrabold text-sm ${isNhap ? 'text-emerald-600' : 'text-rose-600'}">
        ${isNhap ? '+' : '-'}${Number(row.SoLuong).toLocaleString('vi-VN')}
      </td>
      <td class="px-4 py-3 text-xs text-slate-600 whitespace-nowrap font-medium">${row.NguoiThucHien || 'N/A'}</td>
      <td class="px-4 py-3 text-center">
        ${row.HinhAnh ? `<a href="${row.HinhAnh}" target="_blank" class="inline-block"><img src="${row.HinhAnh}" class="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-sm mx-auto"></a>` : '<span class="text-slate-300 text-xs">-</span>'}
      </td>
      <td class="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">${row.GhiChu || ''}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 7. THÊM MÃ MỚI (CHỌN 1 TRONG 3 NHÓM)
function openAddProductModal() {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  if (role !== 'ADMIN' && role !== 'THU_KHO') {
    Swal.fire('Hạn chế quyền', 'Chỉ Quản trị viên và Thủ kho mới có quyền thêm mã vật tư mới!', 'info');
    return;
  }
  document.getElementById('modal-add-product').classList.remove('hidden');
  lucide.createIcons();
}

function closeAddProductModal() {
  document.getElementById('modal-add-product').classList.add('hidden');
}

// ==================== CHỈNH SỬA & THAY ĐỔI HÌNH ẢNH ====================
function openEditProductModal(maSP) {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  if (role !== 'ADMIN' && role !== 'THU_KHO') {
    Swal.fire('Hạn chế quyền', 'Chỉ Quản trị viên hoặc Thủ kho mới có quyền đổi ảnh và chỉnh sửa vật tư!', 'info');
    return;
  }

  const item = state.sanPham.find(i => i.MaSP.toUpperCase() === maSP.toUpperCase());
  if (!item) {
    Swal.fire('Lỗi', 'Không tìm thấy vật tư có mã: ' + maSP, 'error');
    return;
  }

  // Điền dữ liệu hiện tại vào form
  document.getElementById('edit-ma-sp').value = item.MaSP;
  document.getElementById('edit-ten-sp').value = item.TenSP;
  document.getElementById('edit-danh-muc').value = item.DanhMuc || 'Thùng (Box)';
  document.getElementById('edit-dvt').value = item.DonViTinh || 'Cái';
  document.getElementById('edit-ton-min').value = item.TonToiThieu || 10;
  document.getElementById('edit-ghi-chu').value = item.GhiChu || '';
  
  // Hiển thị ảnh hiện tại
  const preview = document.getElementById('edit-image-current-preview');
  preview.src = item.HinhAnh || 'https://placehold.co/300x200?text=Chua+co+anh';
  preview.dataset.currentSrc = item.HinhAnh || '';
  
  // Reset input ảnh mới
  document.getElementById('edit-image-file').value = '';
  document.getElementById('edit-image-url').value = '';
  document.getElementById('edit-image-new-preview-box').classList.add('hidden');

  document.getElementById('modal-edit-product').classList.remove('hidden');
  lucide.createIcons();
}

function closeEditProductModal() {
  document.getElementById('modal-edit-product').classList.add('hidden');
}

async function submitEditProduct(e) {
  e.preventDefault();

  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  const maSP = document.getElementById('edit-ma-sp').value.trim();
  const tenSP = document.getElementById('edit-ten-sp').value.trim();
  const danhMuc = document.getElementById('edit-danh-muc').value;
  const dvt = document.getElementById('edit-dvt').value.trim() || 'Cái';
  const tonMin = Number(document.getElementById('edit-ton-min').value) || 5;
  const ghiChu = document.getElementById('edit-ghi-chu').value.trim();
  const fileInput = document.getElementById('edit-image-file');
  let urlInput = document.getElementById('edit-image-url').value.trim();
  const currentImg = document.getElementById('edit-image-current-preview').dataset.currentSrc || '';

  Swal.fire({
    title: 'Đang cập nhật hình ảnh & thông tin...',
    text: 'Đang tải ảnh lên Cloudinary nếu có ảnh mới...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    let finalImageUrl = currentImg; // Mặc định giữ ảnh cũ

    // Nếu người dùng chọn ảnh mới từ máy / camera
    if (fileInput && fileInput.files && fileInput.files[0]) {
      finalImageUrl = await uploadImageToCloudinary(fileInput.files[0]);
    } else if (urlInput) {
      finalImageUrl = urlInput;
    }

    if (state.gasUrl) {
      const payload = {
        action: 'sua_san_pham',
        userRole: role,
        MaSP: maSP,
        TenSP: tenSP,
        DanhMuc: danhMuc,
        DonViTinh: dvt,
        TonToiThieu: tonMin,
        HinhAnh: finalImageUrl,
        GhiChu: ghiChu
      };

      const res = await fetchWithTimeout(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.success) {
        Swal.fire('Lỗi', data.message || 'Không thể cập nhật Google Sheet', 'error');
        return;
      }

      await loadDataFromSheets();
    } else {
      // Demo mode
      const item = state.sanPham.find(i => i.MaSP.toUpperCase() === maSP.toUpperCase());
      if (item) {
        item.TenSP = tenSP;
        item.DanhMuc = danhMuc;
        item.DonViTinh = dvt;
        item.TonToiThieu = tonMin;
        item.HinhAnh = finalImageUrl;
        item.GhiChu = ghiChu;
      }
      renderAllViews();
    }

    Swal.fire({
      icon: 'success',
      title: 'Đã cập nhật!',
      text: `Đã thay đổi hình ảnh & thông tin của [${maSP}] thành công!`,
      timer: 2000,
      showConfirmButton: false
    });

    closeEditProductModal();
  } catch (err) {
    Swal.fire('Lỗi', err.message || 'Không thể cập nhật hình ảnh', 'error');
  }
}

// ==================== XÓA MÃ PN VẬT TƯ (CHỈ ADMIN) ====================
function deleteProductFromModal() {
  const maSP = document.getElementById('edit-ma-sp').value.trim();
  const tenSP = document.getElementById('edit-ten-sp').value.trim();
  if (maSP) {
    deleteProduct(maSP, tenSP);
  }
}

function deleteProduct(maSP, tenSP = '') {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  if (role !== 'ADMIN') {
    Swal.fire('Từ chối quyền', '⛔ Chỉ tài khoản Quản trị viên (ADMIN) mới có quyền xóa mã PN vật tư!', 'error');
    return;
  }

  Swal.fire({
    title: `Xác nhận xóa mã PN: [${maSP}]?`,
    html: `Bạn có chắc chắn muốn xóa <b>${tenSP || maSP}</b> khỏi danh mục kho?<br><small class="text-rose-600 font-semibold">Dòng dữ liệu này sẽ bị xóa vĩnh viễn trên Google Sheet!</small>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Đồng ý xóa',
    cancelButtonText: 'Hủy'
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Đang xóa mã PN khỏi Google Sheet...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        if (state.gasUrl) {
          const res = await fetchWithTimeout(state.gasUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'xoa_san_pham',
              userRole: 'ADMIN',
              MaSP: maSP
            })
          });
          const data = await res.json();

          if (!data.success) {
            Swal.fire('Lỗi', data.message || 'Không thể xóa mã khỏi Google Sheet', 'error');
            return;
          }

          await loadDataFromSheets();
        } else {
          // Demo mode
          state.sanPham = state.sanPham.filter(i => i.MaSP.toUpperCase() !== maSP.toUpperCase());
          renderAllViews();
        }

        closeEditProductModal();

        Swal.fire({
          icon: 'success',
          title: 'Đã xóa thành công!',
          text: `Mã PN [${maSP}] đã được xóa hoàn toàn khỏi kho.`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra khi xóa', 'error');
      }
    }
  });
}

async function submitNewProduct(e) {
  e.preventDefault();

  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  const maSP = document.getElementById('new-ma-sp').value.trim();
  const tenSP = document.getElementById('new-ten-sp').value.trim();
  const danhMuc = document.getElementById('new-danh-muc').value; // Thùng (Box), Pallet, hoặc Spool quấn cáp
  const dvt = document.getElementById('new-dvt').value.trim() || 'Cái';
  const ton = Number(document.getElementById('new-ton').value) || 0;
  const tonMin = Number(document.getElementById('new-ton-min').value) || 5;
  const ghiChu = document.getElementById('new-ghi-chu').value.trim();
  const fileInput = document.getElementById('new-image-file');
  let urlInput = document.getElementById('new-image-url').value.trim();

  Swal.fire({
    title: 'Đang lưu vào kho...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    let finalImageUrl = urlInput;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      finalImageUrl = await uploadImageToCloudinary(fileInput.files[0]);
    }

    if (state.gasUrl) {
      const payload = {
        action: 'them_san_pham',
        userRole: role,
        MaSP: maSP,
        TenSP: tenSP,
        DanhMuc: danhMuc,
        DonViTinh: dvt,
        SoLuongTon: ton,
        TonToiThieu: tonMin,
        HinhAnh: finalImageUrl,
        GhiChu: ghiChu
      };

      const res = await fetchWithTimeout(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.success) {
        Swal.fire('Lỗi', data.message || 'Không thể thêm mã mới', 'error');
        return;
      }

      await loadDataFromSheets();
    } else {
      state.sanPham.push({
        MaSP: maSP,
        TenSP: tenSP,
        DanhMuc: danhMuc,
        DonViTinh: dvt,
        SoLuongTon: ton,
        TonToiThieu: tonMin,
        HinhAnh: finalImageUrl || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
        GhiChu: ghiChu
      });
      renderAllViews();
    }

    Swal.fire('Thành công', `Đã thêm vào kho ${danhMuc}!`, 'success');
    closeAddProductModal();
    document.getElementById('form-add-product').reset();
    document.getElementById('new-image-preview').classList.add('hidden');
  } catch (err) {
    Swal.fire('Lỗi', err.message, 'error');
  }
}

// 8. CAMERA SCANNER
function openScannerModal() {
  state.scannerTarget = 'general';
  startScanner();
}

function openScannerForTransaction() {
  state.scannerTarget = 'transaction_product';
  startScanner();
}

function openScannerForWO() {
  state.scannerTarget = 'transaction_wo';
  startScanner();
}

function scanBarcodeForNewProduct() {
  state.scannerTarget = 'new_product';
  startScanner();
}

function startScanner() {
  const modal = document.getElementById('modal-scanner');
  modal.classList.remove('hidden');

  if (state.scannerInstance) {
    state.scannerInstance.clear();
  }

  const html5QrCode = new Html5Qrcode("qr-reader");
  state.scannerInstance = html5QrCode;
  const config = { fps: 10, qrbox: { width: 250, height: 250 } };

  html5QrCode.start(
    { facingMode: "environment" },
    config,
    (decodedText) => onScanSuccess(decodedText),
    () => {}
  ).catch(err => {
    console.error("Không thể bật camera", err);
    Swal.fire('Lỗi Camera', 'Vui lòng cấp quyền truy cập camera để quét mã!', 'warning');
    closeScannerModal();
  });
}

function closeScannerModal() {
  const modal = document.getElementById('modal-scanner');
  modal.classList.add('hidden');

  if (state.scannerInstance) {
    state.scannerInstance.stop().then(() => {
      state.scannerInstance.clear();
      state.scannerInstance = null;
    }).catch(() => {
      state.scannerInstance = null;
    });
  }
}

function onScanSuccess(code) {
  closeScannerModal();
  const cleanCode = code.trim();

  if (state.scannerTarget === 'transaction_wo') {
    const woSelect = document.getElementById('trans-wo-select');
    const matchedWO = state.workOrders.find(w => w.MaWO.toUpperCase() === cleanCode.toUpperCase());
    if (matchedWO) {
      const items = Array.isArray(matchedWO.items) ? matchedWO.items : [];
      if (matchedWO.SoLuongConLai <= 0 && items.length > 0) {
        Swal.fire('Đã đủ định mức', `⛔ Lệnh Work Order [${matchedWO.MaWO}] đã nhận đủ hết vật tư, không thể xuất thêm!`, 'info');
        return;
      }
      woSelect.value = matchedWO.MaWO;
      onSelectWorkOrder();
      Swal.fire({ toast: true, icon: 'success', title: `Đã chọn WO: ${matchedWO.MaWO}`, timer: 2000, position: 'top' });
    } else {
      Swal.fire('Không tìm thấy', `Không tìm thấy Lệnh Work Order có mã: [${cleanCode}]`, 'warning');
    }
    return;
  }

  if (state.scannerTarget === 'transaction_product') {
    const select = document.getElementById('trans-product-select');
    const matched = state.sanPham.find(i => i.MaSP.toUpperCase() === cleanCode.toUpperCase());
    if (matched) {
      select.value = matched.MaSP;
      onSelectTransProduct();
      document.getElementById('trans-quantity').focus();
      Swal.fire({ toast: true, icon: 'success', title: `Đã tìm thấy: ${matched.TenSP}`, timer: 2000, position: 'top' });
    } else {
      Swal.fire('Không tìm thấy', `Mã vạch [${cleanCode}] chưa có trong danh mục kho!`, 'info');
    }
    return;
  }

  if (state.scannerTarget === 'new_product') {
    document.getElementById('new-ma-sp').value = cleanCode;
    document.getElementById('new-ten-sp').focus();
    Swal.fire({ toast: true, icon: 'success', title: `Đã điền mã: ${cleanCode}`, timer: 2000, position: 'top' });
    return;
  }

  const matchedWO = state.workOrders.find(w => w.MaWO.toUpperCase() === cleanCode.toUpperCase());
  if (matchedWO) {
    dispatchToWO(matchedWO.MaWO);
    Swal.fire({ toast: true, icon: 'success', title: `Đã mở cấp phát cho WO: ${matchedWO.MaWO}`, timer: 2000, position: 'top' });
    return;
  }

  const matchedSP = state.sanPham.find(i => i.MaSP.toUpperCase() === cleanCode.toUpperCase());
  if (matchedSP) {
    quickAction(matchedSP.MaSP);
    Swal.fire({ toast: true, icon: 'success', title: `Đã chọn: ${matchedSP.TenSP}`, timer: 2000, position: 'top' });
    return;
  }

  Swal.fire('Không nhận diện được', `Mã [${cleanCode}] không khớp với Thùng/Pallet/Spool hoặc WO nào!`, 'info');
}

// 9. CLOUDINARY UPLOAD
async function uploadImageToCloudinary(file) {
  if (!state.cloudName || !state.uploadPreset) {
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', state.uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${state.cloudName}/image/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Lỗi khi tải ảnh lên Cloudinary. Kiểm tra Cloud Name & Upload Preset!');
  }

  const result = await response.json();
  return result.secure_url;
}

function previewUploadImage(e, previewId) {
  const file = e.target.files[0];
  const previewContainer = document.getElementById(previewId);
  if (file && previewContainer) {
    const img = previewContainer.querySelector('img');
    img.src = URL.createObjectURL(file);
    previewContainer.classList.remove('hidden');
  }
}

// 10. CÀI ĐẶT
function openSettingsModal() {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  if (role !== 'ADMIN') {
    Swal.fire('Không có quyền', 'Chỉ tài khoản Quản trị viên (ADMIN) mới có quyền truy cập Cài đặt!', 'warning');
    return;
  }
  document.getElementById('modal-settings').classList.remove('hidden');
  lucide.createIcons();
}

function closeSettingsModal() {
  document.getElementById('modal-settings').classList.add('hidden');
}

function saveSettings() {
  const gasUrl = document.getElementById('config-gas-url').value.trim();
  const cloudName = document.getElementById('config-cloud-name').value.trim();
  const uploadPreset = document.getElementById('config-upload-preset').value.trim();

  if (gasUrl && gasUrl.includes('/macros/library')) {
    Swal.fire({
      icon: 'error',
      title: 'Link không hợp lệ',
      html: 'Đây là link <b>Thư viện (Library)</b>, không phải link <b>Ứng dụng web (Web App)</b>!<br><br>Link đúng phải có dạng: <code>https://script.google.com/macros/s/.../exec</code>',
      confirmButtonColor: '#3b82f6'
    });
    return;
  }

  state.gasUrl = gasUrl;
  state.cloudName = cloudName;
  state.uploadPreset = uploadPreset;

  localStorage.setItem('smartkho_gas_url', gasUrl);
  localStorage.setItem('smartkho_cloud_name', cloudName);
  localStorage.setItem('smartkho_upload_preset', uploadPreset);

  updateConnectionStatus();
  closeSettingsModal();

  if (gasUrl) {
    loadDataFromSheets();
  } else {
    loadDemoData();
    Swal.fire('Đã lưu', 'Đang sử dụng dữ liệu mẫu (Demo)', 'info');
  }
}

// ==================== 11. QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN (ADMIN & QUẢN LÝ) ====================

function openUserManagerModal() {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  if (role !== 'ADMIN' && role !== 'THU_KHO') {
    Swal.fire('Hạn chế quyền', 'Chỉ Quản trị viên hoặc Quản lý mới có quyền quản lý tài khoản nhân sự!', 'warning');
    return;
  }

  const titleEl = document.getElementById('user-manager-title');
  const subtitleEl = document.getElementById('user-manager-subtitle');

  if (role === 'ADMIN') {
    if (titleEl) titleEl.innerHTML = '<i data-lucide="shield-check" class="w-5 h-5 text-purple-600"></i> Quản Lý Tài Khoản Hệ Thống (Admin)';
    if (subtitleEl) subtitleEl.textContent = 'Quản trị viên có toàn quyền: Tạo Quản lý (Thủ kho) và Nhân viên cấp phát';
  } else {
    if (titleEl) titleEl.innerHTML = '<i data-lucide="users" class="w-5 h-5 text-indigo-600"></i> Quản Lý Tài Khoản Nhân Viên (Quản lý)';
    if (subtitleEl) subtitleEl.textContent = 'Bạn có quyền tạo và quản lý danh sách tài khoản Nhân viên cấp phát';
  }

  renderUserManagerTable();
  document.getElementById('modal-manage-users').classList.remove('hidden');
  lucide.createIcons();
}

function closeUserManagerModal() {
  document.getElementById('modal-manage-users').classList.add('hidden');
}

function renderUserManagerTable() {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  const tbody = document.getElementById('user-manager-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  let list = state.users || [];
  // Nếu là Thủ kho (Quản lý), chỉ hiển thị nhân viên
  if (role === 'THU_KHO') {
    list = list.filter(u => (u.VaiTro || '').toUpperCase() === 'NHAN_VIEN');
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-8 text-center text-slate-400">
          Chưa có tài khoản nào được tạo. Hãy nhấn "Tạo tài khoản mới" ở trên.
        </td>
      </tr>
    `;
    return;
  }

  const roleBadges = {
    ADMIN: '<span class="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px]">👑 Quản trị viên</span>',
    THU_KHO: '<span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">🛡️ Quản lý (Thủ kho)</span>',
    NHAN_VIEN: '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">👤 Nhân viên</span>'
  };

  list.forEach(u => {
    const uRole = (u.VaiTro || 'NHAN_VIEN').toUpperCase();
    const isSelf = state.currentUser && state.currentUser.TenDangNhap.toLowerCase() === u.TenDangNhap.toLowerCase();
    const isAdmin = uRole === 'ADMIN';
    const canDelete = !isSelf && !isAdmin && (role === 'ADMIN' || (role === 'THU_KHO' && uRole === 'NHAN_VIEN'));

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50/80 transition';
    tr.innerHTML = `
      <td class="px-4 py-3 font-mono font-bold text-slate-800">${u.TenDangNhap}</td>
      <td class="px-4 py-3 font-semibold text-slate-700">${u.HoTen || u.TenDangNhap}</td>
      <td class="px-4 py-3">${roleBadges[uRole] || uRole}</td>
      <td class="px-4 py-3">
        <span class="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hoạt động
        </span>
      </td>
      <td class="px-4 py-3 text-right">
        <div class="flex items-center justify-end gap-1">
          ${(canDelete || isSelf) ? `
            <button onclick="openChangePasswordModal('${u.TenDangNhap}')" class="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 hover:text-amber-700 transition" title="Đổi / Đặt lại mật khẩu">
              <i data-lucide="key" class="w-4 h-4"></i>
            </button>
          ` : ''}
          ${canDelete ? `
            <button onclick="deleteUser('${u.TenDangNhap}', '${uRole}')" class="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition" title="Xóa tài khoản này">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          ` : (isSelf ? `<span class="text-[10px] text-slate-400 italic">(Bạn)</span>` : (isAdmin ? `<span class="text-[10px] text-slate-400 italic">Bảo vệ</span>` : ''))}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  lucide.createIcons();
}

function openAddUserModal() {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  if (role !== 'ADMIN' && role !== 'THU_KHO') {
    Swal.fire('Hạn chế quyền', 'Bạn không có quyền tạo tài khoản người dùng!', 'warning');
    return;
  }

  const roleSelect = document.getElementById('new-user-role-select');
  const roleHint = document.getElementById('new-user-role-hint');

  if (role === 'ADMIN') {
    roleSelect.innerHTML = `
      <option value="THU_KHO">🛡️ Quản lý (Thủ kho)</option>
      <option value="NHAN_VIEN" selected>👤 Nhân viên cấp phát</option>
    `;
    if (roleHint) roleHint.textContent = 'Quản trị viên có thể tạo Quản lý (Thủ kho) hoặc Nhân viên cấp phát.';
  } else {
    // Quản lý (Thủ kho) chỉ được tạo Nhân viên
    roleSelect.innerHTML = `
      <option value="NHAN_VIEN" selected>👤 Nhân viên cấp phát</option>
    `;
    if (roleHint) roleHint.textContent = 'Quản lý (Thủ kho) có quyền tạo tài khoản Nhân viên cấp phát.';
  }

  document.getElementById('form-add-user').reset();
  document.getElementById('modal-add-user').classList.remove('hidden');
  lucide.createIcons();
}

function closeAddUserModal() {
  document.getElementById('modal-add-user').classList.add('hidden');
}

async function submitAddUser(e) {
  e.preventDefault();

  const callerRole = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  if (callerRole !== 'ADMIN' && callerRole !== 'THU_KHO') {
    Swal.fire('Hạn chế quyền', 'Bạn không có quyền tạo tài khoản!', 'error');
    return;
  }

  const username = document.getElementById('new-user-username').value.trim().toLowerCase();
  const password = document.getElementById('new-user-password').value.trim();
  const fullName = document.getElementById('new-user-fullname').value.trim();
  const targetRole = document.getElementById('new-user-role-select').value;

  if (!username || !password || !fullName) {
    Swal.fire('Thiếu thông tin', 'Vui lòng nhập đầy đủ Tên đăng nhập, Mật khẩu và Họ tên!', 'warning');
    return;
  }

  // Quản lý chỉ được tạo nhân viên
  if (callerRole === 'THU_KHO' && targetRole !== 'NHAN_VIEN') {
    Swal.fire('Từ chối quyền', 'Quản lý chỉ có quyền tạo tài khoản Nhân viên cấp phát!', 'error');
    return;
  }

  Swal.fire({
    title: 'Đang tạo tài khoản...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    if (state.gasUrl) {
      const res = await fetchWithTimeout(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'tao_tai_khoan',
          callerRole: callerRole,
          username: username,
          password: password,
          hoTen: fullName,
          role: targetRole
        })
      });
      const data = await res.json();

      if (!data.success) {
        Swal.fire('Không thể tạo tài khoản', data.message || 'Lỗi khi lưu lên Google Sheet', 'error');
        return;
      }

      await loadDataFromSheets();
    } else {
      // Demo mode
      if (DEMO_USERS[username] || state.users.some(u => u.TenDangNhap.toLowerCase() === username)) {
        Swal.fire('Đã tồn tại', `Tên đăng nhập [${username}] đã tồn tại trong danh sách!`, 'warning');
        return;
      }

      const newUserObj = {
        TenDangNhap: username,
        MatKhau: password,
        HoTen: fullName,
        VaiTro: targetRole,
        TrangThai: 'HoatDong'
      };
      DEMO_USERS[username] = newUserObj;
      state.users.push(newUserObj);
    }

    closeAddUserModal();
    renderUserManagerTable();

    Swal.fire({
      icon: 'success',
      title: 'Tạo tài khoản thành công!',
      text: `Tài khoản [${username}] (${fullName}) đã được kích hoạt.`,
      timer: 2000,
      showConfirmButton: false
    });
  } catch (err) {
    Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra khi tạo tài khoản', 'error');
  }
}

function deleteUser(targetUsername, targetRole) {
  const callerRole = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  
  if (callerRole !== 'ADMIN' && callerRole !== 'THU_KHO') {
    Swal.fire('Hạn chế quyền', 'Bạn không có quyền xóa tài khoản!', 'error');
    return;
  }

  if (targetRole === 'ADMIN') {
    Swal.fire('Từ chối', 'Không thể xóa tài khoản Quản trị viên tối cao!', 'error');
    return;
  }

  if (callerRole === 'THU_KHO' && targetRole !== 'NHAN_VIEN') {
    Swal.fire('Từ chối quyền', 'Quản lý chỉ có quyền xóa tài khoản Nhân viên!', 'error');
    return;
  }

  if (state.currentUser && state.currentUser.TenDangNhap.toLowerCase() === targetUsername.toLowerCase()) {
    Swal.fire('Từ chối', 'Bạn không thể tự xóa tài khoản của chính mình!', 'warning');
    return;
  }

  Swal.fire({
    title: `Xác nhận xóa tài khoản [${targetUsername}]?`,
    text: 'Tài khoản này sẽ bị thu hồi quyền truy cập hệ thống ngay lập tức.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Đồng ý xóa',
    cancelButtonText: 'Hủy'
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Đang xóa tài khoản...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      try {
        if (state.gasUrl) {
          const res = await fetchWithTimeout(state.gasUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              action: 'xoa_tai_khoan',
              callerRole: callerRole,
              targetUsername: targetUsername
            })
          });
          const data = await res.json();

          if (!data.success) {
            Swal.fire('Lỗi', data.message || 'Không thể xóa tài khoản trên Google Sheet', 'error');
            return;
          }

          await loadDataFromSheets();
        } else {
          // Demo mode
          delete DEMO_USERS[targetUsername];
          state.users = state.users.filter(u => u.TenDangNhap.toLowerCase() !== targetUsername.toLowerCase());
        }

        renderUserManagerTable();

        Swal.fire({
          icon: 'success',
          title: 'Đã xóa!',
          text: `Đã xóa tài khoản [${targetUsername}] khỏi hệ thống.`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra khi xóa tài khoản', 'error');
      }
    }
  });
}

// ==================== 12. ĐỔI MẬT KHẨU / ĐẶT LẠI MẬT KHẨU ====================

function openChangePasswordModal(targetUsername = null) {
  if (!state.currentUser) {
    Swal.fire('Chưa đăng nhập', 'Vui lòng đăng nhập để thực hiện đổi mật khẩu!', 'warning');
    return;
  }

  const myUsername = state.currentUser.TenDangNhap;
  const usernameToChange = targetUsername || myUsername;
  const isResetByAdmin = !!(targetUsername && targetUsername.toLowerCase() !== myUsername.toLowerCase());

  document.getElementById('change-pass-target-user').value = usernameToChange;
  document.getElementById('change-pass-is-admin-reset').value = isResetByAdmin ? 'true' : 'false';
  document.getElementById('change-pass-username-display').textContent = usernameToChange;

  const oldGroup = document.getElementById('change-pass-old-group');
  const titleEl = document.getElementById('change-pass-title');

  if (isResetByAdmin) {
    oldGroup.classList.add('hidden');
    document.getElementById('change-pass-old').value = '';
    document.getElementById('change-pass-old').removeAttribute('required');
    if (titleEl) {
      titleEl.innerHTML = `<i data-lucide="key-round" class="w-5 h-5 text-amber-500"></i> Đặt Lại Mật Khẩu Cho [${usernameToChange}]`;
    }
  } else {
    oldGroup.classList.remove('hidden');
    document.getElementById('change-pass-old').setAttribute('required', 'required');
    document.getElementById('change-pass-old').value = '';
    if (titleEl) {
      titleEl.innerHTML = `<i data-lucide="key-round" class="w-5 h-5 text-amber-500"></i> Đổi Mật Khẩu Cá Nhân`;
    }
  }

  document.getElementById('change-pass-new').value = '';
  document.getElementById('change-pass-confirm').value = '';
  document.getElementById('modal-change-password').classList.remove('hidden');
  lucide.createIcons();
}

function closeChangePasswordModal() {
  document.getElementById('modal-change-password').classList.add('hidden');
  document.getElementById('form-change-password').reset();
}

async function submitChangePassword(e) {
  e.preventDefault();

  const targetUsername = document.getElementById('change-pass-target-user').value.trim();
  const isResetByAdmin = document.getElementById('change-pass-is-admin-reset').value === 'true';
  const oldPassword = document.getElementById('change-pass-old').value.trim();
  const newPassword = document.getElementById('change-pass-new').value.trim();
  const confirmPassword = document.getElementById('change-pass-confirm').value.trim();
  const callerRole = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';

  if (!isResetByAdmin && !oldPassword) {
    Swal.fire('Thiếu thông tin', 'Vui lòng nhập mật khẩu hiện tại!', 'warning');
    return;
  }

  if (!newPassword || newPassword.length < 4) {
    Swal.fire('Mật khẩu quá ngắn', 'Mật khẩu mới phải có ít nhất 4 ký tự!', 'warning');
    return;
  }

  if (newPassword !== confirmPassword) {
    Swal.fire('Mật khẩu không khớp', 'Mật khẩu mới và mật khẩu xác nhận không trùng khớp!', 'warning');
    return;
  }

  Swal.fire({
    title: 'Đang cập nhật mật khẩu...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    if (state.gasUrl) {
      const res = await fetchWithTimeout(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'doi_mat_khau',
          username: targetUsername,
          oldPassword: oldPassword,
          newPassword: newPassword,
          callerRole: callerRole,
          isResetByAdmin: isResetByAdmin
        })
      });
      const data = await res.json();

      if (!data.success) {
        Swal.fire('Không thành công', data.message || 'Lỗi khi cập nhật mật khẩu', 'error');
        return;
      }

      await loadDataFromSheets();
    } else {
      // Demo mode
      const userKey = targetUsername.toLowerCase();
      if (!DEMO_USERS[userKey]) {
        Swal.fire('Lỗi', 'Không tìm thấy tài khoản trong dữ liệu!', 'error');
        return;
      }

      if (!isResetByAdmin && DEMO_USERS[userKey].MatKhau !== oldPassword) {
        Swal.fire('Sai mật khẩu', 'Mật khẩu hiện tại không chính xác!', 'error');
        return;
      }

      DEMO_USERS[userKey].MatKhau = newPassword;
      const stateUser = (state.users || []).find(u => u.TenDangNhap.toLowerCase() === userKey);
      if (stateUser) stateUser.MatKhau = newPassword;
    }

    closeChangePasswordModal();

    Swal.fire({
      icon: 'success',
      title: 'Đổi mật khẩu thành công!',
      text: `Mật khẩu mới của tài khoản [${targetUsername}] đã được lưu thành công. Vui lòng ghi nhớ mật khẩu này!`,
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'Đã hiểu'
    });
  } catch (err) {
    Swal.fire('Lỗi', err.message || 'Có lỗi xảy ra khi đổi mật khẩu', 'error');
  }
}
