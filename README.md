# Tech Store Web

## Giới thiệu

**Tech Store Web** là website thương mại điện tử dành cho một **shop thương hiệu chuyên bán các sản phẩm công nghệ** như **laptop, camera, thiết bị,...**  
Website có giao diện hiện đại với trang chủ giới thiệu thương hiệu, trang danh mục sản phẩm, giỏ hàng, đăng nhập người dùng và khu vực quản trị.  

Dự án được xây dựng bằng **HTML, CSS, JavaScript** cho giao diện, **PHP** để xử lý phía server, và **MySQL** để lưu trữ dữ liệu.  
Hệ thống được triển khai và chạy thử nghiệm trên môi trường local sử dụng **XAMPP**.

---

## Chức năng chính

- Trang chủ giới thiệu về thương hiệu và sản phẩm nổi bật  
- Danh mục sản phẩm theo loại  
- Xem chi tiết sản phẩm  
- Giỏ hàng  
- Đăng ký / Đăng nhập người dùng  
- Đặt hàng  
- Khu vực quản trị cho admin:
  - Quản lý sản phẩm
  - Quản lý đơn hàng
  - Quản lý người dùng

---

## Công nghệ sử dụng

- HTML, CSS, JavaScript  
- PHP  
- MySQL  
- XAMPP (Apache + MySQL)  
- phpMyAdmin
- Composer (quản lý thư viện PHP)

---

## Hướng dẫn cài đặt trên localhost

1. **Cài đặt XAMPP**
   - Tải và cài đặt XAMPP tại: https://www.apachefriends.org  
   - Mở XAMPP Control Panel, bật **Apache** và **MySQL**

2. **Giải nén hoặc clone mã nguồn**
   - Đổi tên thư mục dự án thành `tech-store-web`  
   - Di chuyển vào thư mục:  
     ```
     C:\xampp\htdocs\webproject
     ```

3. **Tạo cơ sở dữ liệu**
   - Truy cập: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)  
   - Tạo database mới với tên: `db_tech_store_web`  
   - Import file `init.sql` nằm trong thư mục:
     ```
     backend\sql\init.sql
     ```

4. **Thêm thư viện hỗ trợ**
- Bước 1: Cài Composer (nếu chưa có)
   - Tải và cài từ: [https://getcomposer.org/](https://getcomposer.org/)
   - Kiểm tra cài đặt (mở cmd): composer -V

- Bước 2: Khởi tạo Composer cho dự án
   - cd C:\xampp\htdocs\webproject\tech-store-web
   - composer init

- Bước 3: Cài đặt thư viện cần thiết
   - composer require phpmailer/phpmailer
   - composer require twilio/sdk

5. **Truy cập website**
   - Mở trình duyệt và nhập đường dẫn:
     ```
     http://localhost/webproject/tech-store-web/pages/index.html
     ```

---

## Tài khoản mẫu

- **Admin**
  - Email: `admin@techstore.com`  
  - Mật khẩu: `admin`

---

## Thành viên nhóm

**Vũ Hạm Thiều - CT070154** *(Nhóm trưởng)*  
- Công việc: Xây dựng và xử lý giao diện cho các chức năng:
  - Đăng nhập  
  - Đăng ký  
  - Trang chủ  
  - Giỏ hàng  
  - Đặt hàng  
  - Dashboard Admin

**Phạm Khắc Tú - CT070159**  
- Công việc: Xây dựng và xử lý giao diện cho các chức năng:
  - Quên mật khẩu  
  - Trang cá nhân (Profile User)  
  - Danh sách sản phẩm  
  - Chi tiết sản phẩm

**Nguyễn Hữu Xuân - CT070266**  
- Công việc:
  - Xây dựng cơ sở dữ liệu  
  - Thiết kế và triển khai API  
  - Xử lý phía server (PHP + MySQL)

---

