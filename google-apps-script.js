/**
 * ====================================================================
 * GOOGLE APPS SCRIPT - API QUẢN LÝ THÙNG, PALLET & SPOOL QUẤN CÁP
 * (HỆ THỐNG PHÂN CẤP TẠO TÀI KHOẢN: ADMIN TẠO QL+NV, QL TẠO NV)
 * ====================================================================
 */

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet 1: SanPham
  var sheetSP = ss.getSheetByName("SanPham");
  if (!sheetSP) {
    sheetSP = ss.insertSheet("SanPham");
    sheetSP.appendRow(["MaSP", "TenSP", "DanhMuc", "DonViTinh", "SoLuongTon", "TonToiThieu", "HinhAnh", "GhiChu"]);
    sheetSP.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#3b82f6").setFontColor("#ffffff");
    
    sheetSP.appendRow(["BOX-305M", "Thùng carton đóng cáp 305m", "Thùng (Box)", "Thùng", 250, 50, "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300", "In logo công ty, loại 5 lớp"]);
    sheetSP.appendRow(["BOX-PLASTIC", "Thùng nhựa rỗng chứa phụ kiện cáp", "Thùng (Box)", "Cái", 120, 20, "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300", "Thùng nhựa đặc màu xanh"]);
    sheetSP.appendRow(["PAL-WO-1111", "Pallet gỗ 1100x1100mm", "Pallet", "Cái", 85, 15, "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300", "Pallet 2 hướng nâng đã khử trùng ISPM 15"]);
    sheetSP.appendRow(["PAL-PL-1210", "Pallet nhựa 1200x1000mm tải nặng", "Pallet", "Cái", 40, 10, "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=300", "Chống tĩnh điện, dùng trong kho sạch"]);
    sheetSP.appendRow(["SPL-WOOD-800", "Spool gỗ Ø800mm quấn cáp điện lực", "Spool quấn cáp", "Cuộn", 60, 15, "https://images.unsplash.com/photo-1590735213920-68192a487dc2?w=300", "Spool gỗ nguyên khối chịu lực"]);
    sheetSP.appendRow(["SPL-PLAS-400", "Spool nhựa Ø400mm quấn cáp viễn thông", "Spool quấn cáp", "Cuộn", 150, 30, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300", "Spool nhựa ABS tái sử dụng"]);
    sheetSP.appendRow(["SPL-STEEL-1200", "Spool thép Ø1200mm quấn cáp ngầm tải nặng", "Spool quấn cáp", "Cuộn", 25, 5, "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=300", "Rulo thép mạ kẽm"]);
  }
  
  // Sheet 2: LichSu
  var sheetLS = ss.getSheetByName("LichSu");
  if (!sheetLS) {
    sheetLS = ss.insertSheet("LichSu");
    sheetLS.appendRow(["MaGiaoDich", "NgayGio", "LoaiGiaoDich", "MaSP", "TenSP", "SoLuong", "MaWO", "NguoiThucHien", "HinhAnh", "GhiChu"]);
    sheetLS.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#10b981").setFontColor("#ffffff");
  }

  // Sheet 3: NguoiDung
  var sheetND = ss.getSheetByName("NguoiDung");
  if (!sheetND) {
    sheetND = ss.insertSheet("NguoiDung");
    sheetND.appendRow(["TenDangNhap", "MatKhau", "HoTen", "VaiTro", "TrangThai", "GhiChu"]);
    sheetND.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#6366f1").setFontColor("#ffffff");
    
    sheetND.appendRow(["admin", "123456", "Quản Lý Kho", "ADMIN", "HoatDong", "Toàn quyền quản trị"]);
    sheetND.appendRow(["thukho", "123456", "Thủ Kho Vật Tư", "THU_KHO", "HoatDong", "Quản lý tồn Thùng/Pallet/Spool"]);
    sheetND.appendRow(["nhanvien", "123456", "Nhân Viên Cấp Phát", "NHAN_VIEN", "HoatDong", "Xuất/Nhập Thùng/Pallet/Spool"]);
  }

  // Sheet 4: WorkOrder
  var sheetWO = ss.getSheetByName("WorkOrder");
  if (!sheetWO) {
    sheetWO = ss.insertSheet("WorkOrder");
    sheetWO.appendRow(["MaWO", "MaSP", "TenSP", "SoLuongYeuCau", "SoLuongDaPhat", "TrangThai", "NgayTao", "GhiChu"]);
    sheetWO.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f59e0b").setFontColor("#ffffff");
    
    sheetWO.appendRow(["WO-CABLE-001", "SPL-WOOD-800", "Spool gỗ Ø800mm quấn cáp điện lực", 30, 10, "Đang cấp phát", new Date(), "Cấp cho Chuyền bọc vỏ cáp số 1"]);
    sheetWO.appendRow(["WO-CABLE-002", "BOX-305M", "Thùng carton đóng cáp 305m", 100, 100, "Đã đủ", new Date(), "Cấp đóng gói đơn hàng dự án (ĐÃ ĐỦ 100/100)"]);
    sheetWO.appendRow(["WO-CABLE-003", "PAL-WO-1111", "Pallet gỗ 1100x1100mm", 20, 0, "Chưa cấp phát", new Date(), "Cấp cho tổ đóng pallet xuất cảng"]);
  }
}

// Xử lý GET
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = e.parameter.action || "get_all";
    var userRole = (e.parameter.role || "").toUpperCase();
    
    var sheetSP = ss.getSheetByName("SanPham");
    var sheetLS = ss.getSheetByName("LichSu");
    var sheetND = ss.getSheetByName("NguoiDung");
    var sheetWO = ss.getSheetByName("WorkOrder");
    
    if (!sheetSP || !sheetLS || !sheetND || !sheetWO) {
      setupDatabase();
      sheetSP = ss.getSheetByName("SanPham");
      sheetLS = ss.getSheetByName("LichSu");
      sheetND = ss.getSheetByName("NguoiDung");
      sheetWO = ss.getSheetByName("WorkOrder");
    }
    
    if (action === "get_all") {
      var spData = sheetSP.getDataRange().getValues();
      var lsData = sheetLS ? sheetLS.getDataRange().getValues() : [];
      var woData = sheetWO ? sheetWO.getDataRange().getValues() : [];
      var ndData = sheetND ? sheetND.getDataRange().getValues() : [];
      
      var sanPham = [];
      if (spData.length > 1) {
        for (var i = 1; i < spData.length; i++) {
          var row = spData[i];
          if (!row[0]) continue;
          sanPham.push({
            MaSP: String(row[0]),
            TenSP: String(row[1] || ""),
            DanhMuc: String(row[2] || ""),
            DonViTinh: String(row[3] || ""),
            SoLuongTon: Number(row[4] || 0),
            TonToiThieu: Number(row[5] || 0),
            HinhAnh: String(row[6] || ""),
            GhiChu: String(row[7] || "")
          });
        }
      }
      
      var workOrders = [];
      if (woData && woData.length > 1) {
        for (var k = 1; k < woData.length; k++) {
          var w = woData[k];
          if (!w[0]) continue;
          var yeuCau = Number(w[3] || 0);
          var daPhat = Number(w[4] || 0);
          var trangThai = daPhat >= yeuCau ? "Đã đủ" : (daPhat > 0 ? "Đang cấp phát" : "Chưa cấp phát");
          
          workOrders.push({
            MaWO: String(w[0]),
            MaSP: String(w[1] || ""),
            TenSP: String(w[2] || ""),
            SoLuongYeuCau: yeuCau,
            SoLuongDaPhat: daPhat,
            SoLuongConLai: Math.max(0, yeuCau - daPhat),
            TrangThai: trangThai,
            NgayTao: Utilities.formatDate(new Date(w[6]), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
            GhiChu: String(w[7] || "")
          });
        }
      }
      
      var lichSu = [];
      if (lsData && lsData.length > 1) {
        for (var j = lsData.length - 1; j >= 1; j--) {
          var r = lsData[j];
          if (!r[0]) continue;
          lichSu.push({
            MaGiaoDich: String(r[0]),
            NgayGio: Utilities.formatDate(new Date(r[1]), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
            LoaiGiaoDich: String(r[2] || ""),
            MaSP: String(r[3] || ""),
            TenSP: String(r[4] || ""),
            SoLuong: Number(r[5] || 0),
            MaWO: String(r[6] || ""),
            NguoiThucHien: String(r[7] || ""),
            HinhAnh: String(r[8] || ""),
            GhiChu: String(r[9] || "")
          });
        }
      }

      // Danh sách người dùng (Chỉ trả về cho Admin hoặc Thủ kho)
      var usersList = [];
      if ((userRole === "ADMIN" || userRole === "THU_KHO") && ndData.length > 1) {
        for (var u = 1; u < ndData.length; u++) {
          var uRow = ndData[u];
          if (!uRow[0]) continue;
          var vtro = String(uRow[3] || "NHAN_VIEN").toUpperCase();
          // Quản lý (Thủ kho) chỉ được xem danh sách Nhân viên
          if (userRole === "THU_KHO" && vtro !== "NHAN_VIEN") continue;
          
          usersList.push({
            TenDangNhap: String(uRow[0]),
            HoTen: String(uRow[2] || uRow[0]),
            VaiTro: vtro,
            TrangThai: String(uRow[4] || "HoatDong")
          });
        }
      }
      
      return responseJSON({
        success: true,
        sanPham: sanPham,
        workOrders: workOrders,
        lichSu: lichSu,
        users: usersList
      });
    }
    
    return responseJSON({ success: false, message: "Action không hợp lệ" });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

// Xử lý POST
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  
  try {
    var raw = e.postData.contents;
    var data = JSON.parse(raw);
    var action = data.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    var sheetSP = ss.getSheetByName("SanPham");
    var sheetLS = ss.getSheetByName("LichSu");
    var sheetND = ss.getSheetByName("NguoiDung");
    var sheetWO = ss.getSheetByName("WorkOrder");
    
    if (!sheetSP || !sheetLS || !sheetND || !sheetWO) {
      setupDatabase();
      sheetSP = ss.getSheetByName("SanPham");
      sheetLS = ss.getSheetByName("LichSu");
      sheetND = ss.getSheetByName("NguoiDung");
      sheetWO = ss.getSheetByName("WorkOrder");
    }
    
    // 1. ACTION: ĐĂNG NHẬP
    if (action === "login") {
      var username = String(data.username || "").trim().toLowerCase();
      var password = String(data.password || "").trim();
      
      if (!username || !password) {
        return responseJSON({ success: false, message: "Vui lòng nhập Tên đăng nhập và Mật khẩu!" });
      }
      
      var ndValues = sheetND.getDataRange().getValues();
      for (var i = 1; i < ndValues.length; i++) {
        var u = String(ndValues[i][0]).trim().toLowerCase();
        var p = String(ndValues[i][1]).trim();
        var hoten = String(ndValues[i][2] || u);
        var vaitro = String(ndValues[i][3] || "NHAN_VIEN").toUpperCase();
        var trangthai = String(ndValues[i][4] || "HoatDong");
        
        if (u === username && p === password) {
          if (trangthai.toLowerCase() === "khoa" || trangthai.toLowerCase() === "bi_khoa") {
            return responseJSON({ success: false, message: "Tài khoản của bạn đã bị khóa! Liên hệ Quản trị viên." });
          }
          
          return responseJSON({
            success: true,
            user: {
              TenDangNhap: u,
              HoTen: hoten,
              VaiTro: vaitro
            }
          });
        }
      }
      
      return responseJSON({ success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" });
    }

    // 2. ACTION: TẠO TÀI KHOẢN MỚI (PHÂN QUYỀN: ADMIN TẠO QL+NV, QL TẠO NV)
    if (action === "tao_tai_khoan") {
      var callerRole = String(data.callerRole || "").toUpperCase();
      var newUsername = String(data.username || "").trim().toLowerCase();
      var newPassword = String(data.password || "").trim();
      var newHoTen = String(data.hoTen || "").trim();
      var newRole = String(data.role || "NHAN_VIEN").toUpperCase();

      if (!newUsername || !newPassword || !newHoTen) {
        return responseJSON({ success: false, message: "Vui lòng điền đầy đủ Tên đăng nhập, Mật khẩu và Họ tên!" });
      }

      // KIỂM SOÁT PHÂN QUYỀN TẠO TÀI KHOẢN:
      if (callerRole === "ADMIN") {
        // Admin được tạo Quản lý (THU_KHO) và Nhân viên (NHAN_VIEN)
        if (newRole !== "THU_KHO" && newRole !== "NHAN_VIEN") {
          return responseJSON({ success: false, message: "Vai trò không hợp lệ!" });
        }
      } else if (callerRole === "THU_KHO") {
        // Quản lý (Thủ kho) CHỈ ĐƯỢC PHÉP tạo Nhân viên (NHAN_VIEN)
        if (newRole !== "NHAN_VIEN") {
          return responseJSON({ success: false, message: "⛔ Quản lý chỉ có quyền tạo tài khoản Nhân viên!" });
        }
      } else {
        return responseJSON({ success: false, message: "⛔ Bạn không có quyền tạo tài khoản người dùng!" });
      }

      // Kiểm tra trùng username
      var ndValues = sheetND.getDataRange().getValues();
      for (var n = 1; n < ndValues.length; n++) {
        if (String(ndValues[n][0]).trim().toLowerCase() === newUsername) {
          return responseJSON({ success: false, message: "Tên đăng nhập [" + newUsername + "] đã tồn tại trên hệ thống!" });
        }
      }

      // Thêm vào sheet NguoiDung
      sheetND.appendRow([newUsername, newPassword, newHoTen, newRole, "HoatDong", "Tạo bởi " + callerRole]);

      return responseJSON({
        success: true,
        message: "Tạo tài khoản [" + newUsername + "] thành công!"
      });
    }

    // 3. ACTION: XÓA / KHÓA TÀI KHOẢN
    if (action === "xoa_tai_khoan") {
      var callerRole = String(data.callerRole || "").toUpperCase();
      var targetUsername = String(data.targetUsername || "").trim().toLowerCase();

      var ndValues = sheetND.getDataRange().getValues();
      var targetIndex = -1;
      var targetRole = "";

      for (var t = 1; t < ndValues.length; t++) {
        if (String(ndValues[t][0]).trim().toLowerCase() === targetUsername) {
          targetIndex = t + 1;
          targetRole = String(ndValues[t][3] || "").toUpperCase();
          break;
        }
      }

      if (targetIndex === -1) {
        return responseJSON({ success: false, message: "Không tìm thấy tài khoản: " + targetUsername });
      }

      if (targetRole === "ADMIN") {
        return responseJSON({ success: false, message: "Không thể xóa tài khoản Quản trị viên tối cao!" });
      }

      if (callerRole === "THU_KHO" && targetRole !== "NHAN_VIEN") {
        return responseJSON({ success: false, message: "Quản lý chỉ có quyền xóa tài khoản Nhân viên!" });
      }

      sheetND.deleteRow(targetIndex);
      return responseJSON({ success: true, message: "Đã xóa tài khoản [" + targetUsername + "] thành công!" });
    }

    // 4. ACTION: ĐỔI MẬT KHẨU
    if (action === "doi_mat_khau") {
      var username = String(data.username || "").trim().toLowerCase();
      var oldPassword = String(data.oldPassword || "").trim();
      var newPassword = String(data.newPassword || "").trim();
      var callerRole = String(data.callerRole || "").toUpperCase();
      var isResetByAdmin = Boolean(data.isResetByAdmin);

      if (!username || !newPassword) {
        return responseJSON({ success: false, message: "Vui lòng nhập đầy đủ mật khẩu mới!" });
      }

      var ndValues = sheetND.getDataRange().getValues();
      var targetIndex = -1;
      var currentPass = "";
      var targetRole = "";

      for (var pIdx = 1; pIdx < ndValues.length; pIdx++) {
        if (String(ndValues[pIdx][0]).trim().toLowerCase() === username) {
          targetIndex = pIdx + 1; // 1-indexed trong Google Sheet
          currentPass = String(ndValues[pIdx][1]).trim();
          targetRole = String(ndValues[pIdx][3] || "").toUpperCase();
          break;
        }
      }

      if (targetIndex === -1) {
        return responseJSON({ success: false, message: "Không tìm thấy tài khoản: " + username });
      }

      // Nếu người dùng tự đổi mật khẩu, bắt buộc kiểm tra mật khẩu hiện tại
      if (!isResetByAdmin) {
        if (currentPass !== oldPassword) {
          return responseJSON({ success: false, message: "Mật khẩu hiện tại không chính xác!" });
        }
      } else {
        // Quản lý hoặc Admin đặt lại mật khẩu cho cấp dưới
        if (callerRole === "THU_KHO" && targetRole !== "NHAN_VIEN") {
          return responseJSON({ success: false, message: "Quản lý chỉ có quyền đổi mật khẩu cho Nhân viên!" });
        }
        if (targetRole === "ADMIN" && callerRole !== "ADMIN") {
          return responseJSON({ success: false, message: "Không có quyền đổi mật khẩu tài khoản Quản trị viên!" });
        }
      }

      // Cập nhật cột MatKhau (cột B, index 2)
      sheetND.getRange(targetIndex, 2).setValue(newPassword);

      return responseJSON({
        success: true,
        message: "Đã đổi mật khẩu cho tài khoản [" + username + "] thành công!"
      });
    }
    
    // 5. ACTION: GIAO DỊCH NHẬP KHO / XUẤT KHO THEO WORK ORDER
    if (action === "giao_dich") {
      var maSP = String(data.MaSP).trim();
      var loai = data.LoaiGiaoDich;
      var soLuong = Number(data.SoLuong);
      var maWO = String(data.MaWO || "").trim().toUpperCase();
      var nguoi = data.NguoiThucHien || "Nhân viên";
      var hinhAnh = data.HinhAnh || "";
      var ghiChu = data.GhiChu || "";
      
      if (!maSP || isNaN(soLuong) || soLuong <= 0) {
        return responseJSON({ success: false, message: "Mã vật tư hoặc số lượng không hợp lệ" });
      }
      
      var spValues = sheetSP.getDataRange().getValues();
      var spRowIndex = -1;
      var tenSP = "";
      var tonHienTai = 0;
      
      for (var i = 1; i < spValues.length; i++) {
        if (String(spValues[i][0]).trim().toUpperCase() === maSP.toUpperCase()) {
          spRowIndex = i + 1;
          tenSP = spValues[i][1];
          tonHienTai = Number(spValues[i][4]) || 0;
          break;
        }
      }
      
      if (spRowIndex === -1) {
        return responseJSON({ success: false, message: "Không tìm thấy Thùng/Pallet/Spool có mã: " + maSP });
      }
      
      if (loai === "XUAT") {
        if (tonHienTai < soLuong) {
          return responseJSON({ success: false, message: "Tồn kho không đủ! Hiện chỉ còn: " + tonHienTai });
        }
        
        if (maWO) {
          var woValues = sheetWO.getDataRange().getValues();
          var woRowIndex = -1;
          var soLuongYeuCau = 0;
          var soLuongDaPhat = 0;
          var woMaSP = "";
          
          for (var w = 1; w < woValues.length; w++) {
            if (String(woValues[w][0]).trim().toUpperCase() === maWO) {
              woRowIndex = w + 1;
              woMaSP = String(woValues[w][1]).trim().toUpperCase();
              soLuongYeuCau = Number(woValues[w][3]) || 0;
              soLuongDaPhat = Number(woValues[w][4]) || 0;
              break;
            }
          }
          
          if (woRowIndex === -1) {
            return responseJSON({ success: false, message: "Không tìm thấy Work Order có mã: " + maWO });
          }
          
          if (woMaSP !== maSP.toUpperCase()) {
            return responseJSON({ success: false, message: "Sai vật tư! Lệnh " + maWO + " yêu cầu mã " + woMaSP + ", không phải " + maSP });
          }
          
          var conThieu = soLuongYeuCau - soLuongDaPhat;
          if (conThieu <= 0) {
            return responseJSON({
              success: false,
              message: "⛔ Lệnh " + maWO + " đã nhận ĐỦ định mức (" + soLuongDaPhat + "/" + soLuongYeuCau + ")! Không được phát thêm."
            });
          }
          
          if (soLuong > conThieu) {
            return responseJSON({
              success: false,
              message: "Số lượng xuất (" + soLuong + ") vượt định mức còn lại của lệnh " + maWO + "! Chỉ được phát tối đa: " + conThieu
            });
          }
          
          var soLuongDaPhatMoi = soLuongDaPhat + soLuong;
          var trangThaiMoi = soLuongDaPhatMoi >= soLuongYeuCau ? "Đã đủ" : "Đang cấp phát";
          sheetWO.getRange(woRowIndex, 5).setValue(soLuongDaPhatMoi);
          sheetWO.getRange(woRowIndex, 6).setValue(trangThaiMoi);
        }
      }
      
      var tonMoi = (loai === "NHAP") ? (tonHienTai + soLuong) : (tonHienTai - soLuong);
      sheetSP.getRange(spRowIndex, 5).setValue(tonMoi);
      
      var maGD = (loai === "NHAP" ? "NK-" : "XK-") + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss");
      sheetLS.appendRow([maGD, new Date(), loai === "NHAP" ? "Nhập kho" : "Xuất kho", maSP, tenSP, soLuong, maWO, nguoi, hinhAnh, ghiChu]);
      
      return responseJSON({
        success: true,
        message: (loai === "NHAP" ? "Nhập kho" : "Xuất kho theo " + (maWO ? maWO : "lẻ")) + " thành công!",
        tonMoi: tonMoi,
        maGD: maGD
      });
    }
    
    // 5. ACTION: THAY ĐỔI HÌNH ẢNH & THÔNG TIN SẢN PHẨM
    if (action === "sua_san_pham") {
      var userRole = String(data.userRole || "").toUpperCase();
      if (userRole !== "ADMIN" && userRole !== "THU_KHO") {
        return responseJSON({ success: false, message: "Chỉ Quản trị viên hoặc Thủ kho mới có quyền sửa thông tin/hình ảnh!" });
      }

      var maSP = String(data.MaSP).trim();
      var hinhAnhMoi = String(data.HinhAnh || "");
      var tenSPMoi = data.TenSP ? String(data.TenSP).trim() : "";
      var danhMucMoi = data.DanhMuc || "";
      var donViTinhMoi = data.DonViTinh || "";
      var tonToiThieuMoi = data.TonToiThieu !== undefined ? Number(data.TonToiThieu) : null;
      var ghiChuMoi = data.GhiChu !== undefined ? String(data.GhiChu).trim() : null;

      var spValues = sheetSP.getDataRange().getValues();
      var rowIndex = -1;

      for (var i = 1; i < spValues.length; i++) {
        if (String(spValues[i][0]).trim().toUpperCase() === maSP.toUpperCase()) {
          rowIndex = i + 1;
          break;
        }
      }

      if (rowIndex === -1) {
        return responseJSON({ success: false, message: "Không tìm thấy vật tư có mã: " + maSP });
      }

      if (tenSPMoi) sheetSP.getRange(rowIndex, 2).setValue(tenSPMoi);
      if (danhMucMoi) sheetSP.getRange(rowIndex, 3).setValue(danhMucMoi);
      if (donViTinhMoi) sheetSP.getRange(rowIndex, 4).setValue(donViTinhMoi);
      if (tonToiThieuMoi !== null) sheetSP.getRange(rowIndex, 6).setValue(tonToiThieuMoi);
      if (hinhAnhMoi) sheetSP.getRange(rowIndex, 7).setValue(hinhAnhMoi);
      if (ghiChuMoi !== null) sheetSP.getRange(rowIndex, 8).setValue(ghiChuMoi);

      return responseJSON({
        success: true,
        message: "Cập nhật hình ảnh & thông tin của [" + maSP + "] thành công!"
      });
    }

    // 6. ACTION: XÓA MÃ PN VẬT TƯ KHỎI KHO (CHỈ DÀNH CHO ADMIN)
    if (action === "xoa_san_pham") {
      var userRole = String(data.userRole || "").toUpperCase();
      if (userRole !== "ADMIN") {
        return responseJSON({ success: false, message: "⛔ Chỉ tài khoản Quản trị viên (ADMIN) mới có quyền xóa mã PN vật tư!" });
      }

      var maSP = String(data.MaSP || "").trim();
      if (!maSP) {
        return responseJSON({ success: false, message: "Mã vật tư không hợp lệ!" });
      }

      var spValues = sheetSP.getDataRange().getValues();
      var rowIndex = -1;

      for (var i = 1; i < spValues.length; i++) {
        if (String(spValues[i][0]).trim().toUpperCase() === maSP.toUpperCase()) {
          rowIndex = i + 1;
          break;
        }
      }

      if (rowIndex === -1) {
        return responseJSON({ success: false, message: "Không tìm thấy mã PN " + maSP + " trong bảng tính!" });
      }

      sheetSP.deleteRow(rowIndex);
      return responseJSON({ success: true, message: "Đã xóa vĩnh viễn mã PN [" + maSP + "] khỏi kho!" });
    }

    // 7. ACTION: THÊM WORK ORDER MỚI
    if (action === "them_work_order") {
      var maWO = String(data.MaWO || "").trim().toUpperCase();
      var maSP = String(data.MaSP || "").trim().toUpperCase();
      var soLuong = Number(data.SoLuongYeuCau);
      var ghiChu = data.GhiChu || "";
      
      if (!maWO || !maSP || isNaN(soLuong) || soLuong <= 0) {
        return responseJSON({ success: false, message: "Vui lòng nhập đầy đủ Mã WO, Mã vật tư và Số lượng yêu cầu!" });
      }
      
      var woValues = sheetWO.getDataRange().getValues();
      for (var w = 1; w < woValues.length; w++) {
        if (String(woValues[w][0]).trim().toUpperCase() === maWO) {
          return responseJSON({ success: false, message: "Mã Work Order " + maWO + " đã tồn tại!" });
        }
      }
      
      var tenSP = "";
      var spValues = sheetSP.getDataRange().getValues();
      for (var s = 1; s < spValues.length; s++) {
        if (String(spValues[s][0]).trim().toUpperCase() === maSP) {
          tenSP = spValues[s][1];
          break;
        }
      }
      
      sheetWO.appendRow([maWO, maSP, tenSP, soLuong, 0, "Chưa cấp phát", new Date(), ghiChu]);
      return responseJSON({ success: true, message: "Tạo Lệnh Work Order " + maWO + " thành công!" });
    }
    
    // 8. ACTION: THÊM THÙNG / PALLET / SPOOL MỚI
    if (action === "them_san_pham") {
      var userRole = String(data.userRole || "").toUpperCase();
      if (userRole !== "ADMIN" && userRole !== "THU_KHO") {
        return responseJSON({ success: false, message: "Chỉ Quản trị viên hoặc Thủ kho mới có quyền thêm mã mới!" });
      }
      
      var maSP = String(data.MaSP).trim();
      var tenSP = String(data.TenSP).trim();
      var danhMuc = data.DanhMuc || "Thùng (Box)";
      
      if (!maSP || !tenSP) {
        return responseJSON({ success: false, message: "Vui lòng nhập Mã và Tên quy cách!" });
      }
      
      var spValues = sheetSP.getDataRange().getValues();
      for (var i = 1; i < spValues.length; i++) {
        if (String(spValues[i][0]).trim().toUpperCase() === maSP.toUpperCase()) {
          return responseJSON({ success: false, message: "Mã vật tư này đã tồn tại!" });
        }
      }
      
      sheetSP.appendRow([
        maSP,
        tenSP,
        danhMuc,
        data.DonViTinh || "Cái",
        Number(data.SoLuongTon) || 0,
        Number(data.TonToiThieu) || 5,
        data.HinhAnh || "",
        data.GhiChu || ""
      ]);
      
      return responseJSON({ success: true, message: "Thêm thành công vào kho " + danhMuc + "!" });
    }
    
    return responseJSON({ success: false, message: "Action không xác định" });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
