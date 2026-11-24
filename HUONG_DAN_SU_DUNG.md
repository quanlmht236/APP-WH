# 📦 HƯỚNG DẪN SMARTKHO - THEO DÕI THÙNG (BOX), PALLET & SPOOL QUẤN CÁP

Ứng dụng web được **thiết kế chuyên biệt chỉ để theo dõi 3 thứ**:
1. 📦 **Thùng (Box)**: Thùng carton đóng cáp (305m, 500m...), thùng nhựa chứa phụ kiện.
2. 🪵 **Pallet**: Pallet gỗ (1100x1100, 1200x1000...), pallet nhựa kê hàng.
3. 🧶 **Spool quấn cáp**: Rulo gỗ, cuộn nhựa, rulo thép quấn dây cáp điện/viễn thông.

---

## 🎯 1. Nghiệp Vụ Cấp Phát Theo Lệnh Work Order (WO)

Mỗi lệnh sản xuất (WO) yêu cầu xuất một số lượng cụ thể Thùng (Box), Pallet hoặc Spool:

* **Ví dụ thực tế**:
  * `WO-CABLE-001`: Cần cấp **30 Spool gỗ Ø800mm** cho Chuyền bọc cáp.
    - Đợt 1: Cấp phát 10 cuộn ➔ Hệ thống cập nhật: `Đã phát: 10/30` | `Còn thiếu: 20` (Tiến độ: 33%).
    - Đợt 2: Cấp tiếp 20 cuộn ➔ `Đã phát: 30/30` ➔ **Hoàn thành 100%**.
* **⛔ Tự Động Chặn Khi Đã Nhận Đủ (Tránh phát thừa)**:
  - Khi nhân viên chọn hoặc dùng camera quét mã của lệnh `WO-CABLE-002` (Đã nhận đủ 100/100 Thùng carton):
    * Màn hình **bật cảnh báo đỏ**:  
      `⛔ LỆNH NÀY ĐÃ NHẬN ĐỦ ĐỊNH MỨC! KHÔNG ĐƯỢC PHÁT THÊM NỮA.`
    * Nút **"Xác nhận Xuất kho" bị vô hiệu hóa (chuyển xám)** ➔ Nhân viên không thể nhấn xuất thêm, chống phát thừa vật tư gây thất thoát.
* **Cảnh báo quá định mức**:
  - Nếu lệnh WO chỉ còn thiếu 15 Pallet mà nhân viên gõ xuất 20 cái, app cảnh báo ngay và không cho phép thực hiện.

---

## 📊 2. Giao Diện Tập Trung 3 Nhóm Vật Tư

* **Dashboard (Tổng quan)**:
  - 📦 **Tồn kho Thùng (Box)**: Tổng số thùng carton, thùng nhựa hiện còn.
  - 🪵 **Tồn kho Pallet**: Tổng số pallet gỗ, pallet nhựa ở các bãi.
  - 🧶 **Tồn kho Spool Quấn Cáp**: Tổng số rulo gỗ, nhựa, thép có sẵn.
  - 📋 **Lệnh WO Đang Phát**: Số lệnh sản xuất đang cần cấp phát.
* **Bộ lọc nhanh 1-chạm**:
  - `Tất cả` | `📦 Thùng (Box)` | `🪵 Pallet` | `🧶 Spool quấn cáp`.
* **Chụp ảnh kiểm tra**:
  - Hỗ trợ chụp ảnh chứng từ hoặc tình trạng Spool/Pallet lúc xuất/nhập (miễn phí qua Cloudinary).

---

## 🔐 3. Phân Quyền Người Dùng

| Tài khoản | Mật khẩu | Họ và Tên | Vai trò | Quyền hạn chi tiết |
| :--- | :--- | :--- | :--- | :--- |
| `admin` | `123456` | Quản Lý Kho | 👑 **ADMIN** | • Toàn quyền xem & quản lý kho Thùng/Pallet/Spool.<br>• **Quyền Xóa vĩnh viễn các mã PN Thùng/Pallet/Spool khỏi kho**.<br>• Tạo Lệnh Work Order mới.<br>• Thêm quy cách Thùng/Pallet/Spool mới.<br>• Cấu hình kết nối Google Sheet / Cloudinary. |
| `thukho` | `123456` | Thủ Kho Vật Tư | 🛡️ **THU_KHO** | • Tạo Lệnh Work Order cấp phát.<br>• Thêm và sửa ảnh mã Thùng/Pallet/Spool mới.<br>• Nhập/Xuất kho.<br>❌ Không có quyền xóa mã PN khỏi kho.<br>❌ Không được sửa cấu hình hệ thống. |
| `nhanvien` | `123456` | Nhân Viên Cấp Phát | 👤 **NHAN_VIEN** | • **Xuất kho Thùng/Pallet/Spool theo WO** và Nhập kho trả về.<br>• Quét camera mã vạch WO hoặc mã vạch vật tư.<br>• Tên người làm tự động khóa theo tài khoản (chống gian lận). |

---

## 🚀 4. Thử Nghiệm Ngay Nghiệp Vụ

1. Mở file **[index.html](file:///c:/Users/QuanL/OneDrive/Máy tính/App WH/index.html)** bằng trình duyệt.
2. Bấm nút **👤 Nhân viên** để đăng nhập nhanh.
3. Xem thử 3 nhóm vật tư trên Dashboard (Thùng, Pallet, Spool).
4. Vào tab **"Lệnh WO"** hoặc form **"Xuất/Nhập"**:
   - Thử chọn `WO-CABLE-001` (Cần 30 Spool gỗ, đã phát 10): Hệ thống cho phép phát thêm tối đa 20 cuộn.
   - Thử chọn `WO-CABLE-002` (Cần 100 Thùng carton, đã phát 100): **Hệ thống lập tức báo đỏ và khóa nút bấm**, không thể phát thêm!
5. Dùng camera điện thoại hoặc webcam để thử nghiệm nút **Quét mã Barcode / QR**.

---

## 📈 5. Kết Nối Google Sheets Của Bạn

1. Mở [Google Sheets](https://sheets.google.com), tạo một Bảng tính mới.
2. Menu: **Tiện ích mở rộng (Extensions)** ➔ **Apps Script**.
3. Copy toàn bộ nội dung file **[google-apps-script.js](file:///c:/Users/QuanL/OneDrive/Máy tính/App WH/google-apps-script.js)** dán vào đó và Lưu lại.
4. Bấm **Triển khai (Deploy)** ➔ **Tùy chọn triển khai mới (New deployment)**:
   - Loại: **Ứng dụng web (Web app)**.
   - Ai có quyền truy cập: **Bất kỳ ai (Anyone)**.
5. Copy **Web App URL** dán vào mục **Cài đặt (⚙️)** trong app (đăng nhập bằng `admin`) ➔ Nhấn **Lưu & Kết nối**.
