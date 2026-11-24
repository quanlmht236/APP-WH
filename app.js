/**
 * ====================================================================
 * SMARTKHO - CLIENT JAVASCRIPT LOGIC (CHUYÊN BIỆT: THÙNG, PALLET & SPOOL)
 * ====================================================================
 */

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

// Dữ liệu mẫu Work Orders (Lệnh cấp phát Thùng/Pallet/Spool)
const DEMO_WORK_ORDERS = [
  {
    MaWO: "WO-CABLE-001",
    MaSP: "SPL-WOOD-800",
    TenSP: "Spool gỗ Ø800mm quấn cáp điện lực",
    SoLuongYeuCau: 30,
    SoLuongDaPhat: 10,
    SoLuongConLai: 20,
    TrangThai: "Đang cấp phát",
    NgayTao: "2026-11-24 08:30:00",
    GhiChu: "Cấp cho Chuyền bọc vỏ cáp số 1 (Còn thiếu 20)"
  },
  {
    MaWO: "WO-CABLE-002",
    MaSP: "BOX-305M",
    TenSP: "Thùng carton đóng cáp 305m (5 lớp)",
    SoLuongYeuCau: 100,
    SoLuongDaPhat: 100,
    SoLuongConLai: 0,
    TrangThai: "Đã đủ",
    NgayTao: "2026-11-23 10:00:00",
    GhiChu: "Cấp đóng gói đơn hàng dự án (ĐÃ ĐỦ 100/100 - CHẶN PHÁT THÊM)"
  },
  {
    MaWO: "WO-CABLE-003",
    MaSP: "PAL-WO-1111",
    TenSP: "Pallet gỗ 1100x1100mm đóng hàng",
    SoLuongYeuCau: 20,
    SoLuongDaPhat: 0,
    SoLuongConLai: 20,
    TrangThai: "Chưa cấp phát",
    NgayTao: "2026-11-24 13:15:00",
    GhiChu: "Cấp cho tổ đóng pallet xuất cảng"
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
  transType: 'XUAT',
  gasUrl: localStorage.getItem('smartkho_gas_url') || '',
  cloudName: localStorage.getItem('smartkho_cloud_name') || 'awimwhb3',
  uploadPreset: localStorage.getItem('smartkho_upload_preset') || '',
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

  Swal.fire({
    title: 'Đang xác thực tài khoản...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    if (state.gasUrl) {
      const res = await fetch(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'login',
          username: u,
          password: p
        })
      });
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
          text: 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!',
          confirmButtonColor: '#3b82f6',
          confirmButtonText: 'Thử lại'
        });
      }
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi kết nối',
      text: 'Không thể kết nối đến máy chủ đăng nhập: ' + err.message,
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

  if (isConnected) {
    if (desktopBadge) {
      desktopBadge.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse';
      desktopBadge.title = 'Đã kết nối Google Sheet Cloud';
    }
    if (mobileBadge) mobileBadge.className = 'absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500';
    if (syncStatus) syncStatus.textContent = 'Google Sheet Cloud';
  } else {
    if (desktopBadge) {
      desktopBadge.className = 'w-2.5 h-2.5 rounded-full bg-amber-400';
      desktopBadge.title = 'Đang dùng dữ liệu Demo';
    }
    if (mobileBadge) mobileBadge.className = 'absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400';
    if (syncStatus) syncStatus.textContent = 'Dữ liệu Demo';
  }
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
    const res = await fetch(`${state.gasUrl}?action=get_all&role=${encodeURIComponent(roleParam)}`);
    const data = await res.json();

    Swal.close();

    if (data.success) {
      state.sanPham = data.sanPham || [];
      state.workOrders = data.workOrders || [];
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

  const activeWOCount = state.workOrders.filter(w => (w.SoLuongDaPhat < w.SoLuongYeuCau)).length;

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

// 3. WORK ORDER (WO) RENDERING & LOGIC
function renderWorkOrders() {
  const container = document.getElementById('wo-cards-grid');
  container.innerHTML = '';

  if (state.workOrders.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center py-10 text-slate-400 text-sm">Chưa có Lệnh Work Order nào</p>';
    return;
  }

  state.workOrders.forEach(wo => {
    const req = Number(wo.SoLuongYeuCau) || 0;
    const iss = Number(wo.SoLuongDaPhat) || 0;
    const rem = Math.max(0, req - iss);
    const pct = req > 0 ? Math.min(100, Math.round((iss / req) * 100)) : 0;
    const isCompleted = rem === 0;

    const card = document.createElement('div');
    card.className = `p-5 rounded-2xl border transition-all ${isCompleted ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-amber-200 shadow-sm hover:shadow-md'}`;
    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg ${isCompleted ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-900'}">${wo.MaWO}</span>
        <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-800' : (iss > 0 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800')}">
          ${isCompleted ? '✓ Đã nhận đủ' : (iss > 0 ? `Đang phát (${pct}%)` : 'Chưa phát')}
        </span>
      </div>

      <div class="space-y-1 mb-3">
        <h4 class="font-bold text-slate-800 text-sm truncate" title="${wo.TenSP}">${wo.TenSP}</h4>
        <p class="text-xs text-slate-500 font-mono">Mã vật tư: ${wo.MaSP}</p>
        ${wo.GhiChu ? `<p class="text-xs text-slate-400 truncate">${wo.GhiChu}</p>` : ''}
      </div>

      <div class="space-y-1.5 mb-4">
        <div class="flex items-center justify-between text-xs font-semibold">
          <span class="text-slate-500">Định mức: <b class="text-slate-800">${req}</b></span>
          <span class="text-blue-600">Đã phát: <b>${iss}</b></span>
          <span class="${isCompleted ? 'text-emerald-600' : 'text-rose-600'}">Còn thiếu: <b>${rem}</b></span>
        </div>
        <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full transition-all duration-300" style="width: ${pct}%"></div>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span class="text-[11px] text-slate-400 font-mono">${wo.NgayTao ? wo.NgayTao.split(' ')[0] : ''}</span>
        ${isCompleted ? `
          <button disabled class="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed">
            Đã đủ định mức
          </button>
        ` : `
          <button onclick="dispatchToWO('${wo.MaWO}')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm">
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i> Cấp phát ngay
          </button>
        `}
      </div>
    `;
    container.appendChild(card);
  });
}

function dispatchToWO(maWO) {
  switchTab('transaction');
  selectTransactionType('XUAT');
  const woSelect = document.getElementById('trans-wo-select');
  woSelect.value = maWO;
  onSelectWorkOrder();
  document.getElementById('trans-quantity').focus();
}

function renderTransactionSelects() {
  const spSelect = document.getElementById('trans-product-select');
  const newWoSpSelect = document.getElementById('new-wo-product-select');
  spSelect.innerHTML = '<option value="">-- Chọn Thùng / Pallet / Spool --</option>';
  newWoSpSelect.innerHTML = '<option value="">-- Chọn Thùng / Pallet / Spool --</option>';

  state.sanPham.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.MaSP;
    opt.textContent = `[${item.DanhMuc}] ${item.TenSP} (${item.MaSP}) - Còn: ${item.SoLuongTon}`;
    spSelect.appendChild(opt);

    const opt2 = document.createElement('option');
    opt2.value = item.MaSP;
    opt2.textContent = `[${item.DanhMuc}] ${item.TenSP} (${item.MaSP})`;
    newWoSpSelect.appendChild(opt2);
  });

  const woSelect = document.getElementById('trans-wo-select');
  woSelect.innerHTML = '<option value="">-- Xuất lẻ tự do (Không theo WO) --</option>';

  state.workOrders.forEach(w => {
    const isCompleted = w.SoLuongConLai <= 0;
    const opt = document.createElement('option');
    opt.value = w.MaWO;
    opt.textContent = `${w.MaWO} - ${w.TenSP} (Đã phát: ${w.SoLuongDaPhat}/${w.SoLuongYeuCau}${isCompleted ? ' - ĐÃ ĐỦ' : ''})`;
    woSelect.appendChild(opt);
  });
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
    qtyLimitHint.textContent = '';
    qtyInput.removeAttribute('max');
    submitBtn.disabled = false;
    submitBtn.className = 'w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2';
    submitText.textContent = 'Xác nhận Xuất kho (-)';
    return;
  }

  const wo = state.workOrders.find(w => w.MaWO.toUpperCase() === maWO.toUpperCase());
  if (!wo) return;

  card.classList.remove('hidden');
  document.getElementById('wo-card-id').textContent = wo.MaWO;
  document.getElementById('wo-card-product').textContent = `Vật tư cấp: [${wo.MaSP}] ${wo.TenSP}`;
  document.getElementById('wo-card-required').textContent = wo.SoLuongYeuCau;
  document.getElementById('wo-card-issued').textContent = wo.SoLuongDaPhat;
  document.getElementById('wo-card-remaining').textContent = wo.SoLuongConLai;

  const pct = wo.SoLuongYeuCau > 0 ? Math.min(100, Math.round((wo.SoLuongDaPhat / wo.SoLuongYeuCau) * 100)) : 0;
  document.getElementById('wo-card-progress').style.width = `${pct}%`;

  spSelect.value = wo.MaSP;
  onSelectTransProduct();

  // CHẶN PHÁT THÊM NẾU ĐÃ NHẬN ĐỦ SỐ LƯỢNG (100%)
  if (wo.SoLuongConLai <= 0) {
    warning.classList.remove('hidden');
    document.getElementById('wo-card-badge').className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
    document.getElementById('wo-card-badge').textContent = 'ĐÃ NHẬN ĐỦ';
    
    qtyLimitHint.textContent = '⛔ WO đã nhận đủ số lượng, không được phát thêm!';
    qtyInput.value = '';
    qtyInput.disabled = true;

    submitBtn.disabled = true;
    submitBtn.className = 'w-full py-3 rounded-xl bg-slate-300 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2';
    submitText.textContent = '⛔ Đã nhận đủ định mức (Chặn phát thêm)';
  } else {
    warning.classList.add('hidden');
    document.getElementById('wo-card-badge').className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
    document.getElementById('wo-card-badge').textContent = `Còn thiếu ${wo.SoLuongConLai}`;

    qtyInput.disabled = false;
    qtyInput.max = wo.SoLuongConLai;
    qtyLimitHint.textContent = `(Tối đa được phát thêm: ${wo.SoLuongConLai})`;

    submitBtn.disabled = false;
    submitBtn.className = 'w-full py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2';
    submitText.textContent = `Xác nhận Xuất kho cho ${wo.MaWO} (-)`;
  }
}

function validateTransactionQuantity() {
  const maWO = document.getElementById('trans-wo-select').value;
  if (!maWO || state.transType !== 'XUAT') return;

  const wo = state.workOrders.find(w => w.MaWO.toUpperCase() === maWO.toUpperCase());
  if (!wo) return;

  const qty = Number(document.getElementById('trans-quantity').value);
  const hint = document.getElementById('trans-qty-limit-hint');
  const submitBtn = document.getElementById('btn-submit-trans');

  if (qty > wo.SoLuongConLai) {
    hint.textContent = `⚠️ Quá định mức! WO này chỉ còn thiếu tối đa ${wo.SoLuongConLai}`;
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-50');
  } else {
    hint.textContent = `(Hợp lệ. Tối đa còn thiếu: ${wo.SoLuongConLai})`;
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-50');
  }
}

// 4. TẠO WORK ORDER MỚI
function openAddWOModal() {
  const role = state.currentUser ? (state.currentUser.VaiTro || '').toUpperCase() : 'NHAN_VIEN';
  if (role !== 'ADMIN' && role !== 'THU_KHO') {
    Swal.fire('Hạn chế quyền', 'Chỉ Quản trị viên và Thủ kho mới có quyền tạo Lệnh Work Order mới!', 'info');
    return;
  }
  document.getElementById('modal-add-wo').classList.remove('hidden');
  lucide.createIcons();
}

function closeAddWOModal() {
  document.getElementById('modal-add-wo').classList.add('hidden');
}

async function submitNewWorkOrder(e) {
  e.preventDefault();

  const maWO = document.getElementById('new-wo-id').value.trim().toUpperCase();
  const maSP = document.getElementById('new-wo-product-select').value;
  const qty = Number(document.getElementById('new-wo-qty').value);
  const note = document.getElementById('new-wo-note').value.trim();

  if (!maWO || !maSP || isNaN(qty) || qty <= 0) {
    Swal.fire('Lỗi', 'Vui lòng điền đầy đủ Mã WO, Vật tư và Định mức hợp lệ!', 'warning');
    return;
  }

  Swal.fire({
    title: 'Đang tạo Lệnh Work Order...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  try {
    if (state.gasUrl) {
      const res = await fetch(state.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'them_work_order',
          MaWO: maWO,
          MaSP: maSP,
          SoLuongYeuCau: qty,
          GhiChu: note
        })
      });
      const data = await res.json();
      if (!data.success) {
        Swal.fire('Lỗi', data.message || 'Không thể tạo WO', 'error');
        return;
      }
      await loadDataFromSheets();
    } else {
      const sp = state.sanPham.find(i => i.MaSP === maSP);
      state.workOrders.unshift({
        MaWO: maWO,
        MaSP: maSP,
        TenSP: sp ? sp.TenSP : maSP,
        SoLuongYeuCau: qty,
        SoLuongDaPhat: 0,
        SoLuongConLai: qty,
        TrangThai: 'Chưa cấp phát',
        NgayTao: new Date().toLocaleString('vi-VN'),
        GhiChu: note
      });
      renderAllViews();
    }

    Swal.fire('Thành công', `Đã tạo Lệnh Work Order [${maWO}] định mức ${qty}!`, 'success');
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
    btnNhap.className = 'py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 bg-emerald-600 text-white shadow-sm';
    btnXuat.className = 'py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900';
    btnSubmit.className = 'w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2';
    submitText.textContent = 'Xác nhận Nhập kho trả về (+)';
    woBox.classList.add('hidden');
    document.getElementById('trans-qty-limit-hint').textContent = '';
  } else {
    btnXuat.className = 'py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 bg-rose-600 text-white shadow-sm';
    btnNhap.className = 'py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900';
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
          text: `⛔ Lệnh ${wo.MaWO} đã nhận ĐỦ định mức (${wo.SoLuongDaPhat}/${wo.SoLuongYeuCau})! Không được phép phát thêm!`
        });
        return;
      }
      if (soLuong > wo.SoLuongConLai) {
        Swal.fire({
          icon: 'warning',
          title: 'Vượt định mức',
          text: `Số lượng xuất (${soLuong}) vượt quá số lượng còn thiếu của ${wo.MaWO}! Chỉ được phát tối đa: ${wo.SoLuongConLai}`
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

      const res = await fetch(state.gasUrl, {
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
            wo.SoLuongDaPhat += soLuong;
            wo.SoLuongConLai = Math.max(0, wo.SoLuongYeuCau - wo.SoLuongDaPhat);
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

      const res = await fetch(state.gasUrl, {
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
          const res = await fetch(state.gasUrl, {
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

      const res = await fetch(state.gasUrl, {
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
      const res = await fetch(state.gasUrl, {
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
          const res = await fetch(state.gasUrl, {
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
      const res = await fetch(state.gasUrl, {
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
