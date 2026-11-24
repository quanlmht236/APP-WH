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
* **Chụp ảnh kiểm tra & Đổi ảnh quy cách**:
  - Hỗ trợ chụp ảnh chứng từ hoặc tình trạng Spool/Pallet lúc xuất/nhập (lưu trữ ảnh miễn phí qua Cloudinary).
  - Admin & Quản lý có thể chụp ảnh mới để đổi ảnh đại diện cho bất kỳ mã Thùng/Pallet/Spool nào.

---

## 🔐 3. Hệ Thống Phân Cấp & Quản Lý Tài Khoản

Giao diện đăng nhập đã được **ẩn hoàn toàn thông tin tài khoản mẫu**, chỉ hiển thị 2 ô nhập bảo mật: **Tên đăng nhập** và **Mật khẩu**.

### Cây phân cấp quyền hạn:

```
👑 ADMIN (Quản trị viên)
   ├── 🛡️ QUẢN LÝ (Thủ kho)
   │     └── 👤 NHÂN VIÊN (Nhân viên cấp phát)
   └── 👤 NHÂN VIÊN (Nhân viên cấp phát)
```

| Cấp bậc | Ai có quyền tạo? | Quyền hạn chi tiết |
| :--- | :--- | :--- |
| 👑 **ADMIN (Quản trị viên)** | Tài khoản gốc hệ thống | • Toàn quyền xem & quản lý kho Thùng/Pallet/Spool.<br>• **Quyền Xóa vĩnh viễn các mã PN Thùng/Pallet/Spool khỏi kho**.<br>• **Tạo tài khoản Quản lý (Thủ kho) & Nhân viên**.<br>• Xóa hoặc thu hồi tài khoản cấp dưới.<br>• Cấu hình kết nối Google Sheet & Cloudinary. |
| 🛡️ **QUẢN LÝ (Thủ kho)** | Do **Admin** tạo ra | • Tạo Lệnh Work Order cấp phát (WO).<br>• Thêm quy cách mới & sửa ảnh Thùng/Pallet/Spool.<br>• **Quyền tạo và quản lý tài khoản Nhân viên**.<br>• Xóa tài khoản Nhân viên trực thuộc.<br>❌ Không được tạo tài khoản Quản trị viên hay Quản lý.<br>❌ Không có quyền xóa mã PN khỏi kho.<br>❌ Không được chỉnh sửa cấu hình hệ thống. |
| 👤 **NHÂN VIÊN** | Do **Admin** hoặc **Quản lý** tạo ra | • **Xuất kho Thùng/Pallet/Spool theo WO** (bị khóa nếu WO đã đủ 100%).<br>• **Nhập kho trả về** Thùng rỗng / Pallet / Spool rỗng.<br>• Quét camera mã vạch WO hoặc mã vạch Thùng/Pallet/Spool.<br>• Tên người làm tự động khóa theo tài khoản đang đăng nhập.<br>❌ Không được tạo tài khoản hay xóa dữ liệu. |

> **Ghi chú tài khoản khởi tạo ban đầu**:
> - Admin: `admin` / `123456`
> - Quản lý: `thukho` / `123456`
> - Nhân viên: `nhanvien` / `123456`

---

## ☁️ 4. Cấu Hình Lưu Trữ Ảnh Miễn Phí (Cloudinary)

Tài khoản Cloudinary của bạn: **Cloud Name: `awimwhb3`** (đã được cấu hình sẵn trong app).

Để ảnh tải lên thành công:
1. Đăng nhập vào [Cloudinary Console](https://console.cloudinary.com/).
2. Nhấp vào biểu tượng bánh răng **Settings** (góc dưới bên trái).
3. Chọn mục **Upload** (hoặc **Upload presets**).
4. Cuộn xuống phần **Upload presets** ➔ Bấm **Add upload preset**.
5. Đặt:
   - **Upload preset name**: ví dụ `ml_default` hoặc `app_wh`.
   - **Signing Mode**: Chọn **Unsigned** (Bắt buộc để tải ảnh trực tiếp từ trình duyệt/điện thoại mà không cần lộ secret key).
6. Bấm **Save**.
7. Mở app SmartKho với quyền Admin ➔ Bấm **Cấu hình kết nối (⚙️)** ➔ Nhập tên Upload Preset vừa tạo ➔ Nhấn **Lưu & Kết nối**.

---

## 📈 5. Kết Nối Google Sheets Của Bạn

1. Mở [Google Sheets](https://sheets.google.com), tạo một Bảng tính mới (đặt tên ví dụ: `DB_Kho_Thung_Pallet_Spool`).
2. Vào Menu: **Tiện ích mở rộng (Extensions)** ➔ **Apps Script**.
3. Xóa code mặc định, copy toàn bộ nội dung file **[google-apps-script.js](file:///c:/Users/QuanL/OneDrive/Máy tính/App WH/google-apps-script.js)** dán vào đó và bấm icon **Lưu (Save)**.
4. Bấm nút **Triển khai (Deploy)** ➔ Chọn **Tùy chọn triển khai mới (New deployment)**:
   - Nhấp vào biểu tượng bánh răng, chọn **Ứng dụng web (Web app)**.
   - Mô tả: `SmartKho API v2`.
   - Thực thi dưới dạng: **Tôi (My account)**.
   - Ai có quyền truy cập: **Bất kỳ ai (Anyone)** *(Rất quan trọng để web và điện thoại kết nối được)*.
5. Bấm **Triển khai (Deploy)**, cấp quyền truy cập tài khoản Google khi được hỏi.
6. Copy dòng **URL ứng dụng web (Web App URL)** kết thúc bằng `/exec`.
7. Mở app SmartKho ➔ Đăng nhập `admin` / `123456` ➔ Bấm **Cài đặt (⚙️)** ➔ Dán URL vào ô **Google Apps Script Web App URL** ➔ Bấm **Lưu & Kết nối**.

---

## 🌐 6. Đưa Lên GitHub & Triển Khai Vercel (Miễn Phí)

Repository của bạn đã tạo tại: **`https://github.com/quanlmht236/APP-WH`**

### Cách 1: Tải file trực tiếp lên GitHub bằng trình duyệt (Không cần cài Git)
1. Truy cập vào trang repo của bạn: `https://github.com/quanlmht236/APP-WH`
2. Nhấp vào đường link **uploading an existing file** (hiển thị ở giữa màn hình) hoặc kéo thả trực tiếp:
3. Kéo toàn bộ các file trong thư mục `App WH` vào trình duyệt:
   - `index.html`
   - `app.js`
   - `google-apps-script.js`
   - `manifest.json`
   - `vercel.json`
   - `HUONG_DAN_SU_DUNG.md`
4. Cuộn xuống dưới cùng, tại ô Commit changes bấm **Commit changes**.

### Cách 2: Kết nối Vercel để nhận link web chạy trên điện thoại
1. Truy cập [Vercel](https://vercel.com/) và đăng nhập bằng tài khoản GitHub của bạn.
2. Bấm nút **Add New...** ➔ Chọn **Project**.
3. Tại danh sách repository GitHub, tìm `APP-WH` và bấm nút **Import**.
4. Ở màn hình cấu hình: Giữ nguyên mặc định (Framework Preset: *Other*), bấm nút **Deploy**.
5. Sau khoảng 30 giây, Vercel sẽ cấp cho bạn một đường link miễn phí (ví dụ: `https://app-wh-xyz.vercel.app`).
6. Mọi nhân viên chỉ cần mở đường link này trên trình duyệt điện thoại (Safari / Chrome) để quét mã và xuất nhập vật tư!
