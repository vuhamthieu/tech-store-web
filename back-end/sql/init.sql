use sql12787720;

-- Bảng Role
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY AUTO_INCREMENT,
    RoleName VARCHAR(20) NOT NULL
) ENGINE=InnoDB;
-- Bảng User 
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20) DEFAULT NULL,
    Address VARCHAR(200) DEFAULT NULL,
    Gender VARCHAR(10) DEFAULT NULL,
    Password VARCHAR(100) NOT NULL,
    Avatar VARCHAR(500) DEFAULT NULL,
    RoleID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsDisabled TINYINT DEFAULT 0 COMMENT '0: Active, 1: Disabled',
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
) ENGINE=InnoDB;

-- Bảng User Token
CREATE TABLE UserTokens (
    TokenID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    AccessToken TEXT,
    RefreshToken TEXT,
    AccessTokenExpiresAt DATETIME,
    RefreshTokenExpiresAt DATETIME,
    DeviceInfo VARCHAR(200),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsRevoked TINYINT DEFAULT 0,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
) ENGINE=InnoDB;
-- Bảng Favorites
CREATE TABLE Favorites (
    FavoriteID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    UNIQUE KEY (UserID, ProductID)
) ENGINE=InnoDB;

-- Bảng Notifications
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    Title VARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    IsRead TINYINT DEFAULT 0,  -- 0: chưa đọc, 1: đã đọc
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
)ENGINE=InnoDB;


-- Bảng Category
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(100) NOT NULL
)ENGINE=InnoDB;

-- Bảng Products
CREATE TABLE Products (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryID INT,
    Title VARCHAR(200) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL CHECK (Price >= 0),
    Description LONGTEXT,
    Stock INT DEFAULT 0 CHECK (Stock >= 0),
    SoldCount INT DEFAULT 0 CHECK (SoldCount >= 0),
    Brand VARCHAR(100),
    Thumbnail VARCHAR(500),
    Rating DECIMAL(2, 1) DEFAULT 0 CHECK (Rating >= 0 AND Rating <= 5),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsDeleted TINYINT DEFAULT 0,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
) ENGINE=InnoDB;

-- Bảng ProductSpecifications
CREATE TABLE ProductSpecifications (
    SpecID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT NOT NULL,
    SpecKey VARCHAR(100),        -- ví dụ: CPU, Screen, Battery
    SpecValue VARCHAR(200),      -- ví dụ: Intel i5, 15.6", 5000mAh
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
)ENGINE=InnoDB;

-- Bảng ProductVariants (từng biến thể của sản phẩm)
CREATE TABLE ProductVariants (
    VariantID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT,
    SKU VARCHAR(100) UNIQUE, -- Mã (VD: XYZ-BLK64)
    Price DECIMAL(10,2) NOT NULL,
    Stock INT DEFAULT 0 CHECK (Stock >= 0),
    Thumbnail VARCHAR(500),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
) ENGINE=InnoDB;
-- Bảng VariantSpecifications (chi tiết cho các biến thể)
CREATE TABLE VariantSpecifications (
    VariantSpecID INT PRIMARY KEY AUTO_INCREMENT,
    VariantID INT,
    SpecKey VARCHAR(100), -- Mã (VD: CPU, Screen, Battery)
    SpecValue VARCHAR(100), -- Giá trị (VD: Intel i5, 15.6", 5000mAh)
    FOREIGN KEY (VariantID) REFERENCES ProductVariants(VariantID) ON DELETE CASCADE
)ENGINE=InnoDB;

-- Bảng Gallery
CREATE TABLE Gallery (
    GalleryID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT NOT NULL,
    Thumbnail VARCHAR(500) NOT NULL,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
)ENGINE=InnoDB;

-- Bảng Giỏ hàng
CREATE TABLE Cart (
    CartID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT DEFAULT 1 CHECK (Quantity > 0),
    Options VARCHAR(255) DEFAULT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cart_item (UserID, ProductID, Options),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
) ENGINE=InnoDB;


-- Bảng Orders
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    ShippingName VARCHAR(100) CHARACTER SET utf8mb4,
    ShippingPhone VARCHAR(20),
    ShippingAddress VARCHAR(200),
    ShippingNote TEXT,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(12, 2) NOT NULL,
    Status TINYINT DEFAULT 0 COMMENT '0: Pending, 1: Approved',
    PaymentStatus TINYINT DEFAULT 0 COMMENT '0: Unpaid, 1: Paid',
    PaymentMethod VARCHAR(50),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
)ENGINE=InnoDB;

-- Bảng OrderDetails
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    UnitPrice DECIMAL(10, 2) NOT NULL CHECK (UnitPrice >= 0),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
)ENGINE=InnoDB;

-- Bảng tạm  
CREATE TABLE payment_tokens (
    TokenID INT AUTO_INCREMENT PRIMARY KEY,
    Token VARCHAR(100) NOT NULL UNIQUE,
    OrderID VARCHAR(50),
    UserID INT,
    Amount DECIMAL(12,2),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;

-- Bảng đánh giá
CREATE TABLE Reviews (
    ReviewID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT NOT NULL,
    UserID INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
) ENGINE=InnoDB ;

-- Bảng Coupons
CREATE TABLE Coupons (
    CouponID INT PRIMARY KEY AUTO_INCREMENT,
    Code VARCHAR(50) UNIQUE NOT NULL,              
    DiscountType ENUM('percent','fixed') NOT NULL,  
    DiscountValue DECIMAL(10,2) NOT NULL,       
    MinOrderAmount DECIMAL(12,2) DEFAULT 0,      
    MaxDiscountAmount DECIMAL(12,2) DEFAULT NULL,     -- Giới hạn giảm tối đa (chỉ với percent)
    StartDate TIMESTAMP NOT NULL,                  
    EndDate DATETIME NOT NULL,                     
    UsageLimit INT DEFAULT NULL,                      -- NULL = không giới hạn
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;

-- Bảng CouponProducts: nếu bạn muốn chỉ áp dụng mã cho 1 số sản phẩm
CREATE TABLE CouponProducts (
    CouponProductID INT PRIMARY KEY AUTO_INCREMENT,
    CouponID INT NOT NULL,
    ProductID INT NOT NULL,
    FOREIGN KEY (CouponID) REFERENCES Coupons(CouponID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    UNIQUE (CouponID, ProductID)
)ENGINE=InnoDB;

-- Bảng OrderCoupons: lưu coupon đã áp dụng cho mỗi đơn hàng
CREATE TABLE OrderCoupons (
    OrderCouponID INT PRIMARY KEY AUTO_INCREMENT,
    OrderID INT NOT NULL,
    CouponID INT NOT NULL,
    DiscountApplied DECIMAL(12,2) NOT NULL,          
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (CouponID) REFERENCES Coupons(CouponID),
    UNIQUE (OrderID, CouponID)
)ENGINE=InnoDB;

-- Bảng CouponUsage: theo dõi mỗi lần user dùng mã
CREATE TABLE CouponUsage (
    UsageID INT PRIMARY KEY AUTO_INCREMENT,
    CouponID INT NOT NULL,
    UserID INT NOT NULL,
    OrderID INT,                                    
    UsedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CouponID) REFERENCES Coupons(CouponID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    UNIQUE (CouponID, UserID, OrderID)
)ENGINE=InnoDB;

-- 1. Dữ liệu cho bảng Categories
INSERT INTO Categories (CategoryID, CategoryName) VALUES
  (1, 'Laptop'),
  (2, 'Cameras'),
  (3, 'Accessories');

INSERT INTO Roles (RoleID, RoleName) VALUES
  (1, 'User'),
  (2, 'Admin');

-- 2. Dữ liệu cho bảng Products
INSERT INTO Products (ProductID, CategoryID, Title, Price, Description, Stock, Brand, Thumbnail) VALUES
(1, 1, 'Laptop Acer Swift Go 14 SFG14-41-R251 (Ryzen 5 7430U/ Onboard graphics/ 16GB/ 1TB/ Windows 11)', 16990000, '- CPU: AMD Ryzen™ 5 7430U (2.3 GHz - 4.3 GHz/ 16MB/ 6 nhân, 12 luồng)\n- RAM: 16GB Onbard 4800MHz LPDDR4X (Hỗ trợ tối đa 16GB)\n- VGA: Onboard graphics\n- Ổ cứng: 1TB SSD M.2 NVMe\n- Màn hình: 14\" Full HD (1920 x 1080) IPS, 60Hz, 300 nits, Acer ComfyView, 100% sRGB\n- Khác: Bàn phím thường, FHD webcam, Acer Purified Voice; Acer TrueHarmony, AMD\n- OS: Windows 11 Home', 50, 'Acer', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883783/unnamed_o0cawh.webp'),
(2, 1, 'Laptop Lenovo LOQ 15IRX9 - 83DV013PVN (i5-13450HX/ GeForce RTX™ 3050/ 12GB/ 512GB/ Windows 11)', 21490000, '- CPU: Intel® Core™ i5-13450HX (2.4 GHz - 4.6 GHz/ 20MB/ 10 nhân, 16 luồng)\n- RAM: 1 x 12GB 4800MHz DDR5 (Hỗ trợ tối đa 32GB)\n- VGA: GeForce RTX™ 3050 6GB GDDR6\n- Ổ cứng: 512GB SSD M.2 NVMe\n- Màn hình: 15.6\" Full HD (1920 x 1080) IPS, 144Hz, Màn hình chống lóa, 300 nits, 100% sRGB\n- Khác: Bàn phím thường, FHD webcam, Nahimic Audio, Non-EVO\n- OS: Windows 11 Home SL', 10, 'Lenovo', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883762/unnamed_7_viabrj.webp'),
(3, 1, 'Laptop Lenovo IdeaPad Slim 3 15ABR8 - 82XM00MDVN (Ryzen 5 5625U/ Onboard graphics/ 16GB/ 512GB/ Windows 11)', 12490000, '- CPU: AMD Ryzen™ 5 5625U (2.3 GHz - 4.3 GHz/ 16MB/ 6 nhân, 12 luồng)\n- RAM: 16GB Onboard 3200MHz DDR4 (Hỗ trợ tối đa 16GB)\n- VGA: Onboard\n- Ổ cứng: 512GB SSD M.2 NVMe\n- Màn hình: 15.6\" Full HD (1920 x 1080) IPS, 300Hz, Màn hình chống lóa, 300 nits,\n- Khác: Bàn phím thường, HD webcam, Dolby Audio, AMD\n- OS: Windows 11 Home SL, English', 20, 'Lenovo', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883764/unnamed_13_i9ylrc.webp'),
(4, 1, 'Apple MacBook Air M2 13.6\" (16GB/512GB SSD)', 27490000, '- CPU: Apple M2\n- Màn hình: 13.6\" (2560 x 1664) Liquid Retina\n- RAM: 16GB / 512GB SSD\n- Hệ điều hành: macOS', 30, 'Apple', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883772/unnamed_19_nibcdx.webp'),
(5, 1, 'Apple MacBook Pro M4 Pro 14.2\" (24GB/512GB SSD)', 48590000, '- CPU: Apple M4 Pro\n- Màn hình: 14.2\" (3024 x 1964) Liquid Retina XDR\n- RAM: 24GB / 512GB SSD\n- Hệ điều hành: macOS', 20, 'Apple', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883773/unnamed_24_tzv3va.webp'),
(6, 1, 'Laptop Dell Inspiron 15 3530 (N3530-i5U085W11SLU) (i5-1334U/ Onboard graphics/ 8GB/ 512GB/ Windows 11 + Office)', 15790000, '- CPU: Intel® Core™ i5-1334U (1.3 GHz - 4.6GHz/ 12MB/ 10 nhân, 12 luồng)\n- RAM: 1 x 8GB 2666MHz DDR4 (Hỗ trợ tối đa 16GB)\n- VGA: Onboard graphics\n- Ổ cứng: 512GB SSD M.2 NVMe\n- Màn hình: 15.6\" Full HD (1920 x 1080) WVA, 120Hz, Màn hình chống lóa, 250 nits, FreeSync,\n- Khác: Bàn phím thường, HD webcam, Non-EVO\n- OS: Windows 11 Home SL + Office Home & Student 2021', 40, 'Dell', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913265/unnamed_rskcjd.webp'),
(7, 1, 'Laptop Dell Inspiron 14 7440 2-in-1 N7440-C7U161W11IBU (Core 7 150U/ Onboard graphics/ 16GB/ 1TB/ Windows 11 + Office)', 30990000, '- CPU: Intel® Core™ 7 150U (1.8 GHz - 5.4 GHz/ 12MB/ 10 nhân, 12 luồng)\n- RAM: 2 x 8GB 5200MHz DDR5 (Hỗ trợ tối đa 16GB)\n- VGA: Onboard\n- Ổ cứng: 1TB SSD M.2 NVMe\n- Màn hình: 14\" WUXGA (1920 x 1200) WVA, 60Hz, 250 nits, ComfyView,\n- Khác: Bàn phím thường, FHD webcam, Non-EVO\n- OS: Windows 11 Home SL + Office Home & Student 2021', 25, 'Dell', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913632/unnamed_muvtkd.webp'),
(8, 1, 'Laptop Asus Vivobook X1404VA-NK394W (i3-1315U/ Onboard graphics/ 8GB/ 512GB/ Windows 11)', 9990000, '- CPU: Intel® Core™ i3-1315U (1.2 GHz - 4.5GHz/ 10MB/ 6 nhân, 8 luồng)\n- RAM: 8GB Onboard DDR4 (Hỗ trợ tối đa 8GB)\n- VGA: Onboard graphics\n- Ổ cứng: 512GB SSD M.2 NVMe\n- Màn hình: 14\" Full HD (1920 x 1080) TFT, 60Hz, Màn hình chống lóa, 250 nits, 45% NTSC\n- Khác: Bàn phím Chiclet, HD webcam, SonicMaster, Non-EVO\n- OS: Windows 11 Home', 60, 'Asus', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913991/unnamed_rpsm4f.webp'),
(9, 1, 'Laptop Asus TUF Gaming A15 FA506NCR-HN047W (Ryzen 7 7435HS/ GeForce RTX™ 3050/ 16GB/ 512GB/ Windows 11)', 19990000, '- CPU: AMD Ryzen™ 7 7435HS (3.1 GHz - 4.5 GHz/ 16MB/ 8 nhân, 16 luồng)\n- RAM: 1 x 16GB 5600MHz DDR5 (Hỗ trợ tối đa 16GB)\n- VGA: GeForce RTX™ 3050 4GB GDDR6\n- Ổ cứng: 512GB SSD M.2 NVMe\n- Màn hình: 15.6\" Full HD (1920 x 1080) IPS, 144Hz, Màn hình chống lóa, 250 nits, Adaptive Sync,\n- Khác: Bàn phím Chiclet, HD webcam, Hi-Res Audio, Non-EVO\n- OS: Windows 11 Home', 70, 'Asus', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914376/unnamed_w5hymn.webp'),
(10, 1, 'Laptop HP Pavilion 16-af0055TU - AY8C4PA (Ultra 5-125U/ Onboard graphics/ 16GB/ 512GB/ Windows 11 + Office)', 22490000, '- CPU: Intel® Core™ Ultra 5-125U (1.3 GHz - 4.3 GHz/ 12MB/ 12 nhân, 14 luồng)\n- RAM: 16GB Onboard 7467MHz LPDDR5 (Hỗ trợ tối đa 16GB)\n- VGA: Onboard graphics\n- Ổ cứng: 512GB SSD M.2 NVMe\n- Màn hình: 16\" WUXGA (1920 x 1200) IPS, Màn hình chống lóa,\n- Khác: Có phím Copilot, FHD webcam, Intel AI\n- OS: Windows 11 Home SL + Office Home & Student 2021', 35, 'HP', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914470/unnamed_oadxbz.webp'),
(11, 2, 'Máy ảnh FUJIFILM X100 VI (màu bạc, máy mới 100%)', 49490000, 'Thông số Kỹ Thuật Cơ Bản 40.2MP APS-C X-Trans CMOS 5 HR Sensor X-Processor 5 Image Processor Fujinon 23mm f/2 Lens 35mm Full-Frame Equivalent 6-Stop In-Body Image Stabilization 425-Point Intelligent Hybrid AF System Hybrid 0.66x OVF with 3.69m-Dot OLED EVF 3.0\" 1.62m-Dot Tilting Touchscreen Bluetooth and Wi-Fi Connectivity 20 Film Simulation Modes with REALA ACE', 70, 'FUJIFILM', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920121/x100_bia_2_9458e34429b64c8facc8bf66cbe0b8bd_compact_fbmqyg.webp'),
(12, 2, 'Máy ảnh Nikon Z30 kit 16-50mm VR (mới 100%)', 19190000, 'Máy ảnh dòng Z nhỏ nhất và nhẹ nhất của Nikon Cảm biến hình ảnh APS-C 20,9MP Phạm vi ISO gốc là 100-51.200, có thể mở rộng lên 204.800 Hệ thống AF hỗn hợp với 209 điểm AF Theo dõi lấy nét tự động AF phát hiện mắt Màn hình selfie lật ra Đèn kiểm đếm phía trước để cho bạn biết khi nào bạn đang ghi âm Giới hạn ghi liên tục 125 phút Micrô âm thanh nổi tích hợp, cùng với đầu vào micrô Đầu ra HDMI (micro HDMI) Cổng USB để phân phối điện qua USB với cáp USB-C to USB-C tương thích Video 4K / 30p', 20, 'Nikon', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920339/zpr-nikon-z30-front-640px_39d2f3758f7148fe812903e51a22b8ea_compact_ynmlwu.webp'),
(13, 2, 'Máy ảnh Canon EOS R5 Mark II (body, hàng chính hãng)', 104999000, 'Thông Số Cơ bản Cảm biến BSI CMOS xếp chồng toàn khung hình 45MP Xử lý máy gia tốc DIGIC AF thông minh Dual Pixel loại chéo Video 8K 60 Nguyên/4K 60 SRAW/4K 120 10-bit Lên tới 30 khung hình / giây, Chế độ chụp liên tục trước EVF 5,76m điểm với Sim OVF. Xem hỗ trợ Màn hình LCD cảm ứng có thể thay đổi góc 3,2\" Nâng cấp trong máy ảnh lên 179MP Khe cắm thẻ nhớ CFexpress & SD UHS-II Hỗ trợ Wi-Fi 6E/Wi-Fi 6', 5, 'Canon', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920520/r5_ii_1_81cee4d47b7a47f4876360a655764dc6_compact_wu4nzw.webp'),
(14, 2, 'Camera IP 360 Độ 2MP TP-Link Tapo C200C', 470000, 'Độ phân giải: 2 MP (1080p) Góc nhìn: 360 độ Góc xoay: Xoay dọc 42 độ Nhìn ngang 76.7 độ Nhìn chéo 89.7 độ Tầm nhìn xa hồng ngoại: 12 m trong tối Tiện ích: Phát hiện chuyển động Phát hiện con người Phát hiện tiếng khóc Đàm thoại 2 chiều Tích hợp Google Assistant và Amazon Alexa', 55, 'TP-Link', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920773/camera-ip-360-do-2mp-tp-link-tapo-c200c-1-1-750x500_l4evbl.jpg'),
(15, 2, 'Camera IP Ngoài Trời 3MP IMOU Cell 3C Năng Lượng Mặt Trời IPC-K9DCP-3T0WE-V2', 1500000, 'Độ phân giải: 3 MP (1296p) Góc nhìn: 360 độ Góc xoay: Cố định Góc nhìn 98 độ (H), 54 độ (V), 121 độ (D) Tầm nhìn xa hồng ngoại: 15 m trong tối Tiện ích: Chống nước, bụi IP66 Phát hiện chuyển động Năng lượng mặt trời Phát hiện con người Báo động khi có người lạ bằng đèn và âm thanh Đàm thoại 2 chiều Thiết lập khu vực cảnh báo Tích hợp pin 5000 mAh Thiết lập chế độ làm việc Phát hiện dáng người thông minh PIR Lắp đặt không cần dây Zoom kỹ thuật số 8x Đàm thoại 2 chiều: Có', 15, 'IMOU', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920949/camera-ip-ngoai-troi-3mp-imou-cell-3c-nang-luong-mat-troi-ipc-k9dcp-3t0wev2-2-638708277637819632-750x500_schnd5.jpg'),
(16, 2, 'Camera IP 360 Độ 8MP Ezviz C6C', 1390000, 'Độ phân giải: 8 MP (2160p) Góc nhìn: 360 độ Góc xoay: Góc xoay 340 độ Nhìn ngang 106 độ Nhìn dọc 90 độ Nhìn chéo 48 độ Tầm nhìn xa hồng ngoại: 10 m trong tối (đen trắng), 6 m ban đêm (có màu) Tiện ích: Phát hiện con người Phát hiện vật nuôi Chế độ riêng tư Đàm thoại 2 chiều Cuộc gọi 1 chạm Cài đặt tối đa 4 khung hình theo dõi Tích hợp Google Assistant và Amazon Alexa Phát hiện tiếng ồn lớn Theo dõi tự động thu phóng 2 màn hình Hình ảnh 4K Màu ban đêm thông minh WiFi 6 Đàm thoại 2 chiều: Có', 65, 'Ezviz', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921223/camera-ip-360-do-8mp-ezviz-c6c-1-638792244305114061-750x500_jep2mx.jpg'),
(17, 2, 'Camera IP Ngoài Trời 360 Độ 4MP BOTSLAB W312', 890000, 'Độ phân giải: 4 MP (1440p) Góc nhìn: 360 độ Góc xoay: Xoay ngang 340° Nhìn ngang 360 độ Nhìn dọc 147 độ Xoay dọc 101 độ Tầm nhìn xa hồng ngoại: 20 m ban đêm (có màu) Tiện ích: Chống nước, bụi IP66 Phát hiện chuyển động Chế độ quan sát ban đêm có màu Nhận dạng xe bằng AI và gửi thông báo khi có vật thể chạm vào xe Giám sát vị trí đỗ xe và gửi thông báo khi xe đỗ sai vị trí bằng AI Theo dõi thu phóng tự động Xử lý âm thanh đàm thoại bằng AI Báo động khi có người lạ bằng đèn và âm thanh Đàm thoại 2 chiều: Có', 45, 'BOTSLAB', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921452/camera-ip-ngoai-troi-360-do-4mp-botslab-w312-20-750x500_t6a57u.jpg'),
(18, 2, 'Thiết bị ghi hình/ Webcam Logitech C270', 449000, '- Độ phân giải hình ảnh tĩnh lên đến 3.0 megapixel.\n- Phân giải video lên đến 1280 x 720 pixel rõ nét.\n- Cảm biến hình ảnh với công nghệ RightLight cung cấp hình ảnh đạt chất lượng ngay cả trong ánh sáng yếu.\n- Micrô tích hợp với công nghệ RightSound phục vụ mọi nhu cầu về chat voice.\n- Kết nối USB 2.0.', 100, 'Logitech', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921796/unnamed_pclwfo.webp'),
(19, 2, 'Webcam Rapoo XW170', 399000, 'Thiết kế nhỏ gọn, sang trọng - Tích hợp micro kép khử tiếng ồn sẽ đem lại cho người dùng những trải nghiệm tuyệt vời. Trang bị ống kính có độ phân giải cao là 720P - hình ảnh vô cùng rõ ràng và chân thật. Tích hợp một chiếc micrô kép khử tiếng ồn, có khả năng khử tiếng ồn tốt Tốc độ khung hình lên đến 30fps và thiết bị có thể tự động lấy nét để có những hình ảnh chất lượng nhất.', 30, 'Rapoo', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921967/unnamed_ittash.webp'),
(20, 2, 'Thiết bị ghi hình/ Webcam Logitech C930e', 3990000, '- Webcam C930e có trường ngắm 90 độ, khả năng quét ngang, nghiêng và thu phóng kỹ thuật số 4 lần, cho phép bạn điều chỉnh khung hình phù hợp với môi trường của mình\n- Nâng cao chất lượng hội họp với video luôn sắc nét - ngay cả khi băng thông bị giới hạn.\n- Cảm biến hình ảnh cao cấp cho ra chất lượng HD mà không bị răng cưa hoặc mờ, ngay cả khi phóng to.\n- Tùy chọn gắn và riêng tư', 25, 'Logitech', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922197/unnamed_vzgvow.webp'),
(21, 3, 'Dây chuyển đổi HDMI sang VGA có chipset, dài 1.5m Ugreen ( 30449)', 250000, '- Chuyển đổi tín hiệu từ chuẩn HDMI sang VGA\n- Đầu vào HDMI chuẩn 1.4\n- Đầu ra cổng VGA, hỗ trợ độ phân giải 1920*1080 Max 60Hz', 200, 'Ugreen', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922341/unnamed_u63htx.webp'),
(22, 3, 'USB 128GB Sandisk SDCZ460-128G-G46', 310000, 'Dung lượng: 128GB Ổ USB 3.1 Gen 1 Tốc độ đọc 150 MB/giây Đầu nối kép USB Type-C và USB Type-A', 100, 'Sandisk', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922974/unnamed_kicwsx.webp'),
(23, 3, 'Đế tản nhiệt Laptop Coolcold F5 - 6 quạt led xanh + Led RGB', 650000, '- 10 loại hiệu ứng ánh sáng RGB, mang lại trải nghiệm chơi game mát mẻ và đắm chìm\n- Thiết kế chiều cao có thể điều chỉnh 7 mức tiện dụng, bạn có thể lựa chọn góc nhìn tốt nhất theo nhu cầu của mình.\n- Cổng USB đôi, có thể được kết nối với các thiết bị USB khác, không chiếm giao diện máy tính xách tay.\n- Được trang bị giá đỡ điện thoại có thể tháo rời, tiện lợi khi sử dụng.\n- Tương thích với laptop 15,6 inch trở xuống.', 20, 'Coolcold', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923332/unnamed_nedavv.webp'),
(24, 3, 'Bộ chia/ Hub Type C 9in1 Ugreen 40873', 1190000, '- Kết nối MacBook với cổng USB Type C ra màn hình HDMI trên tivi với độ phân giải lên đến 4K/30hz (4096x2160p) & VGA (1920x1080p/60hz)\n- Hỗ trợ cổng LAN 100/1000Mbps giúp có thể dễ dàng để kết nối máy tính\n- Hỗ trợ khe đọc thẻ SD (SDXC, SDHC) tiện lợi.\n- Tốc độ truyền tải của cổng USB 3.0 lên đến 5Gbps (gấp 10 lần so với cổng USB 2.0)\n- Bạn cũng có thể kết nối một cáp sạc với cổng USB-C để sạc MacBook của bạn.', 100, 'Ugreen', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923523/unnamed_danrrs.webp'),
(25, 3, 'Bộ chia/ Dock chuyển đổi USB-C 3.1 11 trong 1, Pass-thru 100W Belkin INC004btSGY (Xám)', 2790000, 'Kết nối với nhiều thiết bị cùng một lúc Mở rộng cổng USB-C thành cổng HDMI, DisplayPort, cổng VGA, 3 cổng USB-A, cổng Gigabit Ethernet, đầu đọc thẻ SD và MicroSD, cổng âm thanh 3,5 mm và cổng USB-C PD Hỗ trợ sạc thông qua lên đến 100W Gấp đôi như một giá đỡ máy tính xách tay Băng thông 5 Gbps để truyền dữ liệu nhanh chóng Cổng video VGA, HDMI và DisplayPort hỗ trợ độ phân giải lên đến 4K trên nhiều màn hình', 20, 'Belkin', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923715/unnamed_k2x0fa.webp'),
(26, 3, 'Đế tản nhiệt Laptop Cooler Master X Slim II', 370000, '- Cổng kết nối: USB - Phù hợp cho laptop 15.6\" trở xuống\n- Tốc độ quạt: 900 RPM ± 15%\n- Kích thước: 350 x 249 x 44 mm\n- Trọng lượng: 0,53 kg\n- Màu sắc: Đen', 30, 'Cooler Master', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923920/unnamed_x41hti.webp'),
(27, 3, 'Bộ chia/ Hub Ugreen USB-C 5 in 1 sang 2*USB-A 2.0+ USB-A 3.0+HDMI+PD hỗ trợ 4K (15495)', 350000, 'Tính năng: Hub mở rộng USB-C sang HDMI, USB, Sạc PD\nĐầu vào: USB Type-C\nĐầu ra: HDMI 4K@30Hz, USB-A x3, Sạc PD\nĐộ phân giải HDMI: 4K@30Hz\nTốc độ USB 3.0: 5Gbps\nTốc độ USB 2.0: 480Mbps\nSạc PD: 100W', 60, 'Ugreen', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924490/unnamed_yt8zrz.webp'),
(28, 3, 'Bộ chia/ Hub USB 4 cổng 3.0 Orico TWU3-4A-BK (Đen)', 230000, '- USB 3.0, tốc độ truyền dữ liệu 5Gbps\n- Đầu vào (input): 1 cáp: USB 3.0 dài 15cm\n- Đầu ra (output): 4 cổng USB 3.0', 70, 'Orico', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924649/unnamed_jncpjc.webp'),
(29, 3, 'Cáp chuyển đổi USB sang Cổng LAN Orico UTJU2', 230000, '- Input: 1 x USB 2.0\n- Output: 1 x RJ45\n- Chiều dài dây: 10cm', 50, 'Orico', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924810/unnamed_aigsl3.webp'),
(30, 3, 'Bộ Chia/ Hub USB 3.0 Ugreen 4 Port UG-20290', 250000, '- Bộ chia USB 4 cổng Ugreen 20290 giúp bạn mở rộng thêm 4 cổng USB 3.0 với máy tính của bạn,\n- Tương thích với USB 2.0 và USB 1.1;\n- Chuyển tốc độ đến 5Gbps - nhanh hơn 10 lần so với USB 2.0;', 80, 'Ugreen', 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924940/unnamed_rteiyf.webp');

INSERT INTO ProductSpecifications (ProductID, SpecKey, SpecValue) VALUES
-- Product 1
(1, 'CPU', 'Intel Core i5-1240P'),
(1, 'RAM', '16GB DDR4'),
(1, 'Storage', '512GB SSD'),
(1, 'GPU', 'Intel Iris Xe'),
(1, 'Screen', '14" FHD IPS'),
(1, 'Battery', '56Wh'),
(1, 'OS', 'Windows 11 Home'),
(1, 'Weight', '1.3kg'),
(1, 'Ports', '2x USB-C, 1x HDMI'),
(1, 'Camera', '720p HD'),

-- Product 2
(2, 'CPU', 'Intel Core i7-1260P'),
(2, 'RAM', '32GB LPDDR5'),
(2, 'Storage', '1TB SSD'),
(2, 'GPU', 'Intel Iris Xe'),
(2, 'Screen', '15.6" OLED'),
(2, 'Battery', '70Wh'),
(2, 'OS', 'Windows 11 Pro'),
(2, 'Weight', '1.6kg'),
(2, 'Ports', '2x Thunderbolt, 1x HDMI, 1x USB-A'),
(2, 'Camera', '1080p FHD'),

-- Product 3
(3, 'CPU', 'AMD Ryzen 7 6800HS'),
(3, 'RAM', '16GB DDR5'),
(3, 'Storage', '1TB SSD'),
(3, 'GPU', 'RTX 3050'),
(3, 'Screen', '15.6" 144Hz FHD'),
(3, 'Battery', '76Wh'),
(3, 'OS', 'Windows 11 Home'),
(3, 'Weight', '2.0kg'),
(3, 'Ports', 'USB-C, USB-A, HDMI, Ethernet'),
(3, 'Camera', '720p'),

-- Product 4
(4, 'CPU', 'Intel Core i9-13900H'),
(4, 'RAM', '32GB DDR5'),
(4, 'Storage', '2TB SSD'),
(4, 'GPU', 'RTX 4070'),
(4, 'Screen', '16" QHD+ 240Hz'),
(4, 'Battery', '90Wh'),
(4, 'OS', 'Windows 11 Pro'),
(4, 'Weight', '2.4kg'),
(4, 'Ports', '4x USB-C, HDMI, SD Card'),
(4, 'Camera', '1080p FHD'),

-- Product 5
(5, 'CPU', 'Apple M2'),
(5, 'RAM', '8GB Unified'),
(5, 'Storage', '256GB SSD'),
(5, 'GPU', 'Integrated 10-core'),
(5, 'Screen', '13.6" Retina'),
(5, 'Battery', '52.6Wh'),
(5, 'OS', 'macOS Ventura'),
(5, 'Weight', '1.24kg'),
(5, 'Ports', '2x Thunderbolt'),
(5, 'Camera', '1080p'),

-- Product 6
(6, 'CPU', 'Apple M3 Pro'),
(6, 'RAM', '18GB Unified'),
(6, 'Storage', '1TB SSD'),
(6, 'GPU', '18-core GPU'),
(6, 'Screen', '16.2" Liquid Retina XDR'),
(6, 'Battery', '100Wh'),
(6, 'OS', 'macOS Sonoma'),
(6, 'Weight', '2.1kg'),
(6, 'Ports', 'MagSafe, 3x Thunderbolt, HDMI'),
(6, 'Camera', '1080p'),

-- Product 7
(7, 'CPU', 'Intel Core i5-12450H'),
(7, 'RAM', '8GB DDR4'),
(7, 'Storage', '512GB SSD'),
(7, 'GPU', 'Intel UHD Graphics'),
(7, 'Screen', '14" FHD TN'),
(7, 'Battery', '45Wh'),
(7, 'OS', 'Windows 11 Home'),
(7, 'Weight', '1.5kg'),
(7, 'Ports', 'USB-A, HDMI'),
(7, 'Camera', '720p'),

-- Product 8
(8, 'CPU', 'AMD Ryzen 5 7530U'),
(8, 'RAM', '16GB DDR4'),
(8, 'Storage', '512GB SSD'),
(8, 'GPU', 'Radeon Graphics'),
(8, 'Screen', '14" FHD IPS'),
(8, 'Battery', '58Wh'),
(8, 'OS', 'Windows 11'),
(8, 'Weight', '1.4kg'),
(8, 'Ports', '2x USB-A, 1x USB-C, HDMI'),
(8, 'Camera', '720p'),

-- Product 9
(9, 'CPU', 'Intel Core i7-13700H'),
(9, 'RAM', '32GB DDR5'),
(9, 'Storage', '2TB SSD'),
(9, 'GPU', 'RTX 4080'),
(9, 'Screen', '17.3" UHD Mini-LED'),
(9, 'Battery', '99Wh'),
(9, 'OS', 'Windows 11 Pro'),
(9, 'Weight', '2.8kg'),
(9, 'Ports', 'Thunderbolt 4, HDMI 2.1, USB-C'),
(9, 'Camera', 'FHD IR'),

-- Product 10
(10, 'CPU', 'AMD Ryzen 9 7940HS'),
(10, 'RAM', '32GB LPDDR5X'),
(10, 'Storage', '1TB SSD'),
(10, 'GPU', 'Radeon 780M'),
(10, 'Screen', '14" 2.8K OLED 120Hz'),
(10, 'Battery', '75Wh'),
(10, 'OS', 'Windows 11'),
(10, 'Weight', '1.6kg'),
(10, 'Ports', '2x USB-C, USB-A, HDMI'),
(10, 'Camera', '1080p Windows Hello');


INSERT INTO ProductVariants (ProductID, SKU, Price, Stock) VALUES
(1, 'SKU-1-256-DE', 21990000, 30),
(1, 'SKU-1-256-BA', 21990000, 25),
(1, 'SKU-1-256-XA', 21990000, 20),
(1, 'SKU-1-512-DE', 23990000, 30),
(1, 'SKU-1-512-BA', 23990000, 25),
(1, 'SKU-1-512-XA', 23990000, 20),
(1, 'SKU-1-1T-DE', 26990000, 30),
(1, 'SKU-1-1T-BA', 26990000, 25),
(1, 'SKU-1-1T-XA', 26990000, 20),

(2, 'SKU-2-256-DE', 20990000, 30),
(2, 'SKU-2-256-BA', 20990000, 25),
(2, 'SKU-2-256-XA', 20990000, 20),
(2, 'SKU-2-512-DE', 22990000, 30),
(2, 'SKU-2-512-BA', 22990000, 25),
(2, 'SKU-2-512-XA', 22990000, 20),
(2, 'SKU-2-1T-DE', 25990000, 30),
(2, 'SKU-2-1T-BA', 25990000, 25),
(2, 'SKU-2-1T-XA', 25990000, 20),

(3, 'SKU-3-256-DE', 18990000, 30),
(3, 'SKU-3-256-BA', 18990000, 25),
(3, 'SKU-3-256-XA', 18990000, 20),
(3, 'SKU-3-512-DE', 20990000, 30),
(3, 'SKU-3-512-BA', 20990000, 25),
(3, 'SKU-3-512-XA', 20990000, 20),
(3, 'SKU-3-1T-DE', 23990000, 30),
(3, 'SKU-3-1T-BA', 23990000, 25),
(3, 'SKU-3-1T-XA', 23990000, 20),

(4, 'SKU-4-256-DE', 19990000, 30),
(4, 'SKU-4-256-BA', 19990000, 25),
(4, 'SKU-4-256-XA', 19990000, 20),
(4, 'SKU-4-512-DE', 21990000, 30),
(4, 'SKU-4-512-BA', 21990000, 25),
(4, 'SKU-4-512-XA', 21990000, 20),
(4, 'SKU-4-1T-DE', 24990000, 30),
(4, 'SKU-4-1T-BA', 24990000, 25),
(4, 'SKU-4-1T-XA', 24990000, 20),

(5, 'SKU-5-256-DE', 20990000, 30),
(5, 'SKU-5-256-BA', 20990000, 25),
(5, 'SKU-5-256-XA', 20990000, 20),
(5, 'SKU-5-512-DE', 22990000, 30),
(5, 'SKU-5-512-BA', 22990000, 25),
(5, 'SKU-5-512-XA', 22990000, 20),
(5, 'SKU-5-1T-DE', 25990000, 30),
(5, 'SKU-5-1T-BA', 25990000, 25),
(5, 'SKU-5-1T-XA', 25990000, 20),

(6, 'SKU-6-256-DE', 18990000, 30),
(6, 'SKU-6-256-BA', 18990000, 25),
(6, 'SKU-6-256-XA', 18990000, 20),
(6, 'SKU-6-512-DE', 20990000, 30),
(6, 'SKU-6-512-BA', 20990000, 25),
(6, 'SKU-6-512-XA', 20990000, 20),
(6, 'SKU-6-1T-DE', 23990000, 30),
(6, 'SKU-6-1T-BA', 23990000, 25),
(6, 'SKU-6-1T-XA', 23990000, 20),

(7, 'SKU-7-256-DE', 19990000, 30),
(7, 'SKU-7-256-BA', 19990000, 25),
(7, 'SKU-7-256-XA', 19990000, 20),
(7, 'SKU-7-512-DE', 21990000, 30),
(7, 'SKU-7-512-BA', 21990000, 25),
(7, 'SKU-7-512-XA', 21990000, 20),
(7, 'SKU-7-1T-DE', 24990000, 30),
(7, 'SKU-7-1T-BA', 24990000, 25),
(7, 'SKU-7-1T-XA', 24990000, 20),

(8, 'SKU-8-256-DE', 20990000, 30),
(8, 'SKU-8-256-BA', 20990000, 25),
(8, 'SKU-8-256-XA', 20990000, 20),
(8, 'SKU-8-512-DE', 22990000, 30),
(8, 'SKU-8-512-BA', 22990000, 25),
(8, 'SKU-8-512-XA', 22990000, 20),
(8, 'SKU-8-1T-DE', 25990000, 30),
(8, 'SKU-8-1T-BA', 25990000, 25),
(8, 'SKU-8-1T-XA', 25990000, 20),

(9, 'SKU-9-256-DE', 18990000, 30),
(9, 'SKU-9-256-BA', 18990000, 25),
(9, 'SKU-9-256-XA', 18990000, 20),
(9, 'SKU-9-512-DE', 20990000, 30),
(9, 'SKU-9-512-BA', 20990000, 25),
(9, 'SKU-9-512-XA', 20990000, 20),
(9, 'SKU-9-1T-DE', 23990000, 30),
(9, 'SKU-9-1T-BA', 23990000, 25),
(9, 'SKU-9-1T-XA', 23990000, 20),

(10, 'SKU-10-256-DE', 19990000, 30),
(10, 'SKU-10-256-BA', 19990000, 25),
(10, 'SKU-10-256-XA', 19990000, 20),
(10, 'SKU-10-512-DE', 21990000, 30),
(10, 'SKU-10-512-BA', 21990000, 25),
(10, 'SKU-10-512-XA', 21990000, 20),
(10, 'SKU-10-1T-DE', 24990000, 30),
(10, 'SKU-10-1T-BA', 24990000, 25),
(10, 'SKU-10-1T-XA', 24990000, 20);


INSERT INTO VariantSpecifications (VariantID, SpecKey, SpecValue) VALUES
-- Product 1
(1, 'ROM', '256GB'), (1, 'Color', 'Đen'),
(2, 'ROM', '256GB'), (2, 'Color', 'Bạc'),
(3, 'ROM', '256GB'), (3, 'Color', 'Xám'),
(4, 'ROM', '512GB'), (4, 'Color', 'Đen'),
(5, 'ROM', '512GB'), (5, 'Color', 'Bạc'),
(6, 'ROM', '512GB'), (6, 'Color', 'Xám'),
(7, 'ROM', '1TB'), (7, 'Color', 'Đen'),
(8, 'ROM', '1TB'), (8, 'Color', 'Bạc'),
(9, 'ROM', '1TB'), (9, 'Color', 'Xám'),

-- Product 2
(10, 'ROM', '256GB'), (10, 'Color', 'Đen'),
(11, 'ROM', '256GB'), (11, 'Color', 'Bạc'),
(12, 'ROM', '256GB'), (12, 'Color', 'Xám'),
(13, 'ROM', '512GB'), (13, 'Color', 'Đen'),
(14, 'ROM', '512GB'), (14, 'Color', 'Bạc'),
(15, 'ROM', '512GB'), (15, 'Color', 'Xám'),
(16, 'ROM', '1TB'), (16, 'Color', 'Đen'),
(17, 'ROM', '1TB'), (17, 'Color', 'Bạc'),
(18, 'ROM', '1TB'), (18, 'Color', 'Xám'),

-- Product 3
(19, 'ROM', '256GB'), (19, 'Color', 'Đen'),
(20, 'ROM', '256GB'), (20, 'Color', 'Bạc'),
(21, 'ROM', '256GB'), (21, 'Color', 'Xám'),
(22, 'ROM', '512GB'), (22, 'Color', 'Đen'),
(23, 'ROM', '512GB'), (23, 'Color', 'Bạc'),
(24, 'ROM', '512GB'), (24, 'Color', 'Xám'),
(25, 'ROM', '1TB'), (25, 'Color', 'Đen'),
(26, 'ROM', '1TB'), (26, 'Color', 'Bạc'),
(27, 'ROM', '1TB'), (27, 'Color', 'Xám'),

-- Product 4
(28, 'ROM', '256GB'), (28, 'Color', 'Đen'),
(29, 'ROM', '256GB'), (29, 'Color', 'Bạc'),
(30, 'ROM', '256GB'), (30, 'Color', 'Xám'),
(31, 'ROM', '512GB'), (31, 'Color', 'Đen'),
(32, 'ROM', '512GB'), (32, 'Color', 'Bạc'),
(33, 'ROM', '512GB'), (33, 'Color', 'Xám'),
(34, 'ROM', '1TB'), (34, 'Color', 'Đen'),
(35, 'ROM', '1TB'), (35, 'Color', 'Bạc'),
(36, 'ROM', '1TB'), (36, 'Color', 'Xám'),

-- Product 5
(37, 'ROM', '256GB'), (37, 'Color', 'Đen'),
(38, 'ROM', '256GB'), (38, 'Color', 'Bạc'),
(39, 'ROM', '256GB'), (39, 'Color', 'Xám'),
(40, 'ROM', '512GB'), (40, 'Color', 'Đen'),
(41, 'ROM', '512GB'), (41, 'Color', 'Bạc'),
(42, 'ROM', '512GB'), (42, 'Color', 'Xám'),
(43, 'ROM', '1TB'), (43, 'Color', 'Đen'),
(44, 'ROM', '1TB'), (44, 'Color', 'Bạc'),
(45, 'ROM', '1TB'), (45, 'Color', 'Xám'),

-- Product 6
(46, 'ROM', '256GB'), (46, 'Color', 'Đen'),
(47, 'ROM', '256GB'), (47, 'Color', 'Bạc'),
(48, 'ROM', '256GB'), (48, 'Color', 'Xám'),
(49, 'ROM', '512GB'), (49, 'Color', 'Đen'),
(50, 'ROM', '512GB'), (50, 'Color', 'Bạc'),
(51, 'ROM', '512GB'), (51, 'Color', 'Xám'),
(52, 'ROM', '1TB'), (52, 'Color', 'Đen'),
(53, 'ROM', '1TB'), (53, 'Color', 'Bạc'),
(54, 'ROM', '1TB'), (54, 'Color', 'Xám'),

-- Product 7
(55, 'ROM', '256GB'), (55, 'Color', 'Đen'),
(56, 'ROM', '256GB'), (56, 'Color', 'Bạc'),
(57, 'ROM', '256GB'), (57, 'Color', 'Xám'),
(58, 'ROM', '512GB'), (58, 'Color', 'Đen'),
(59, 'ROM', '512GB'), (59, 'Color', 'Bạc'),
(60, 'ROM', '512GB'), (60, 'Color', 'Xám'),
(61, 'ROM', '1TB'), (61, 'Color', 'Đen'),
(62, 'ROM', '1TB'), (62, 'Color', 'Bạc'),
(63, 'ROM', '1TB'), (63, 'Color', 'Xám'),

-- Product 8
(64, 'ROM', '256GB'), (64, 'Color', 'Đen'),
(65, 'ROM', '256GB'), (65, 'Color', 'Bạc'),
(66, 'ROM', '256GB'), (66, 'Color', 'Xám'),
(67, 'ROM', '512GB'), (67, 'Color', 'Đen'),
(68, 'ROM', '512GB'), (68, 'Color', 'Bạc'),
(69, 'ROM', '512GB'), (69, 'Color', 'Xám'),
(70, 'ROM', '1TB'), (70, 'Color', 'Đen'),
(71, 'ROM', '1TB'), (71, 'Color', 'Bạc'),
(72, 'ROM', '1TB'), (72, 'Color', 'Xám'),

-- Product 9
(73, 'ROM', '256GB'), (73, 'Color', 'Đen'),
(74, 'ROM', '256GB'), (74, 'Color', 'Bạc'),
(75, 'ROM', '256GB'), (75, 'Color', 'Xám'),
(76, 'ROM', '512GB'), (76, 'Color', 'Đen'),
(77, 'ROM', '512GB'), (77, 'Color', 'Bạc'),
(78, 'ROM', '512GB'), (78, 'Color', 'Xám'),
(79, 'ROM', '1TB'), (79, 'Color', 'Đen'),
(80, 'ROM', '1TB'), (80, 'Color', 'Bạc'),
(81, 'ROM', '1TB'), (81, 'Color', 'Xám'),

-- Product 10
(82, 'ROM', '256GB'), (82, 'Color', 'Đen'),
(83, 'ROM', '256GB'), (83, 'Color', 'Bạc'),
(84, 'ROM', '256GB'), (84, 'Color', 'Xám'),
(85, 'ROM', '512GB'), (85, 'Color', 'Đen'),
(86, 'ROM', '512GB'), (86, 'Color', 'Bạc'),
(87, 'ROM', '512GB'), (87, 'Color', 'Xám'),
(88, 'ROM', '1TB'), (88, 'Color', 'Đen'),
(89, 'ROM', '1TB'), (89, 'Color', 'Bạc'),
(90, 'ROM', '1TB'), (90, 'Color', 'Xám');


-- 3. Dữ liệu cho bảng Gallery
INSERT INTO Gallery (GalleryID, ProductID, Thumbnail) VALUES
  (1, 1, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883783/unnamed_aur0g6.webp'),
  (2, 1, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883762/unnamed_2_gpstrj.webp'),
  (3, 1, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883762/unnamed_1_dyfhcd.webp'),
  (4, 1, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883762/unnamed_3_yqq6ez.webp'),
  (5, 1, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883762/unnamed_4_1_swiwnf.webp'),
  (6, 2, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883764/unnamed_10_ovcukn.webp'),
  (7, 2, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883763/unnamed_9_obruyf.webp'),
  (8, 2, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883763/unnamed_8_yfnsym.webp'),
  (9, 2, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883763/unnamed_11_umjdze.webp'),
  (10, 2, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883763/unnamed_12_exq1ld.webp'),
  (11, 3, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883764/unnamed_16_d7yfbv.webp'),
  (12, 3, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883764/unnamed_15_pjkrpc.webp'),
  (13, 3, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883764/unnamed_14_iwscyv.webp'),
  (14, 3, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883764/unnamed_17_pniujp.webp'),
  (15, 3, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883765/unnamed_18_lpxcmw.webp'),
  (16, 4, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883772/unnamed_20_u04bcc.webp'),
  (17, 4, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883773/unnamed_21_nnghtr.webp'),
  (18, 4, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883773/unnamed_23_c9sjet.webp'),
  (19, 4, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883773/unnamed_22_wwyrm5.webp'),
  (20, 5, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883773/unnamed_25_m03zls.webp'),
  (21, 5, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883774/unnamed_26_fslbye.webp'),
  (22, 5, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883774/unnamed_27_szhaun.webp'),
  (23, 5, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883782/unnamed_28_ngl16l.webp'),
  (24, 5, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747883782/unnamed_29_jo3whc.webp'),
  (25, 6, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913267/unnamed_oakfgy.webp'),
  (26, 6, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913272/unnamed_wkziqo.webp'),
  (27, 6, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913276/unnamed_hqztxv.webp'),
  (28, 6, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913285/unnamed_zjvqnv.webp'),
  (29, 6, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913375/unnamed_txcw2q.webp'),
  (30, 7, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913708/unnamed_iuuxdz.webp'),
  (31, 7, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913694/unnamed_idwtll.webp'),
  (32, 7, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913674/unnamed_slpesw.webp'),
  (33, 7, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913676/unnamed_gadcnd.webp'),
  (34, 7, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913673/unnamed_z4kpgb.webp'),
  (35, 8, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747913997/unnamed_vhbuf5.webp'),
  (36, 8, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914031/unnamed_vfrwxr.webp'),
  (37, 8, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914034/unnamed_xghc9h.webp'),
  (38, 8, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914070/unnamed_i1inwd.webp'),
  (39, 8, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914004/unnamed_xwkcuz.webp'),
  (40, 9, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914380/unnamed_lgfcfh.webp'),
  (41, 9, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914389/unnamed_llgyur.webp'),
  (42, 9, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914387/unnamed_xa4uz1.webp'),
  (43, 9, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914392/unnamed_pseku8.webp'),
  (44, 9, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914394/unnamed_fd76hj.webp'),
  (45, 10, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914477/unnamed_ybyu2h.webp'),
  (46, 10, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914481/unnamed_vd8y9h.webp'),
  (47, 10, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914543/unnamed_tvdqjq.webp'),
  (48, 10, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747914546/unnamed_ffr4ux.webp'),
  (49, 11, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920140/x100_bia_chua_1_a88d28305f1047d88137c8126b91698b_compact_uunxdi.webp'),
  (50, 11, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920131/x100vi_bia_4_c2aad86659d74a808dba3552c337163d_compact_n6cz7t.webp'),
  (51, 11, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920142/x100vi_bia_6_0a7aa3cda9914561a9f8012c73f2e442_compact_y060wr.webp'),
  (52, 11, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920164/x100vi_bia_2_edee5d370739469099662f67ffb53a88_compact_otko9c.webp'),
  (53, 11, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920137/x100vi_bai_1_3925cec0ff4844a9b78f28f95a26edad_compact_vbyyog.webp'),
  (54, 12, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920344/zpr-nikon-z30-back-640px_941dc20c739843b886bfcbd0f778a840_compact_q43qtk.webp'),
  (55, 12, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920349/zpr-nikon-z30-beauty-640px_1069897ab2dd4b05b85d6a90d4884f78_compact_dfugli.webp'),
  (56, 12, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920351/zpr-nikon-z30-front-screen-out-640px_b98dd36201284fe5bd5a27cc8ba5cc62_compact_mi5tjp.webp'),
  (57, 13, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920533/r5_ii_2_662f01fed1f244a2a8dec05236e60573_compact_bdppwp.webp'),
  (58, 13, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920539/r5_ii_3_d9bcafc16dbb4919afada04a6f1d77a7_compact_ie5d1e.webp'),
  (59, 13, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920536/r5_2_5_92e821ebc116447197ce765bc7e3f1f4_compact_gjsjpy.webp'),
  (60, 13, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920543/r52_can_bien_xep_chong_d77815274d704bd2b04362d6e02a6938_compact_anvvgv.webp'),
  (61, 13, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920591/r5_2_6_ee6cbbb8fd17492f849ccf78cbbca0c4_compact_hy2uuy.webp'),
  (62, 14, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920782/camera-ip-360-do-2mp-tp-link-tapo-c200c-2-1-750x500_wn0iwu.jpg'),
  (63, 14, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920785/camera-ip-360-do-2mp-tp-link-tapo-c200c-3-1-750x500_tdilg6.jpg'),
  (64, 14, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920788/camera-ip-360-do-2mp-tp-link-tapo-c200c-5-1-750x500_kzszfs.jpg'),
  (65, 14, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920790/camera-ip-360-do-2mp-tp-link-tapo-c200c-6-750x500_dyv7zy.jpg'),
  (66, 14, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920814/camera-ip-360-do-2mp-tp-link-tapo-c200c-4-750x500_tayszu.jpg'),
  (67, 15, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920956/camera-ip-ngoai-troi-3mp-imou-cell-3c-nang-luong-mat-troi-ipc-k9dcp-3t0wev2-3-638708277631845851-750x500_xxkaw9.jpg'),
  (68, 15, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920959/camera-ip-ngoai-troi-3mp-imou-cell-3c-nang-luong-mat-troi-ipc-k9dcp-3t0wev2-4-638708277624798176-750x500_bn1gvw.jpg'),
  (69, 15, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747920967/camera-ip-ngoai-troi-3mp-imou-cell-3c-nang-luong-mat-troi-ipc-k9dcp-3t0wev2-5-638708277617839351-750x500_bnul5j.jpg'),
  (70, 15, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921011/camera-ip-ngoai-troi-3mp-imou-cell-3c-nang-luong-mat-troi-ipc-k9dcp-3t0wev2-6-638708277610944058-750x500_b8isvx.jpg'),
  (71, 15, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921021/camera-ip-ngoai-troi-3mp-imou-cell-3c-nang-luong-mat-troi-ipc-k9dcp-3t0wev2-7-638708277604613341-750x500_hij3ew.jpg'),
  (72, 16, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921228/camera-ip-360-do-8mp-ezviz-c6c-2-638792244312918584-750x500_lnwvdr.jpg'),
  (73, 16, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921233/camera-ip-360-do-8mp-ezviz-c6c-3-638792244319888313-750x500_qljoid.jpg'),
  (74, 16, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921237/camera-ip-360-do-8mp-ezviz-c6c-4-638792244325678441-750x500_lpgbcv.jpg'),
  (75, 16, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921330/camera-ip-360-do-8mp-ezviz-c6c-5-638797039345185023-750x500_ldzgrl.jpg'),
  (76, 17, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921461/camera-ip-ngoai-troi-360-do-4mp-botslab-w312-21-750x500_jxmyjc.jpg'),
  (77, 17, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921464/camera-ip-ngoai-troi-360-do-4mp-botslab-w312-22-750x500_qswkaj.jpg'),
  (78, 17, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921467/camera-ip-ngoai-troi-360-do-4mp-botslab-w312-24-750x500_sdbui8.jpg'),
  (79, 17, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921471/camera-ip-ngoai-troi-360-do-4mp-botslab-w312-25-750x500_nakyns.jpg'),
  (80, 17, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921624/camera-ip-ngoai-troi-360-do-4mp-botslab-w312-23-750x500_esjjp0.jpg'),
  (81, 18, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921801/unnamed_do61ci.webp'),
  (82, 18, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921805/unnamed_t9h5bc.webp'),
  (83, 18, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921810/unnamed_geb0qe.webp'),
  (84, 18, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921815/unnamed_kdqwbn.webp'),
  (85, 19, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921974/unnamed_jhixru.webp'),
  (86, 19, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747921997/unnamed_hhkutl.webp'),
  (87, 19, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922008/unnamed_engusc.webp'),
  (88, 19, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922013/unnamed_ji80vc.webp'),
  (89, 19, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922019/unnamed_golfqd.webp'),
  (90, 20, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922202/unnamed_xxauag.webp'),
  (91, 20, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922202/unnamed_xxauag.webp'),
  (92, 20, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922220/unnamed_oemg7t.webp'),
  (93, 22, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923073/unnamed_bmwhts.webp'),
  (94, 22, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922979/unnamed_bpovpc.webp'),
  (95, 22, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922988/unnamed_njmfqp.webp'),
  (96, 22, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747922983/unnamed_aj6wgy.webp'),
  (97, 23, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923384/unnamed_cvr9jt.webp'),
  (98, 23, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923420/unnamed_afz3e5.webp'),
  (99, 23, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923436/unnamed_z04kdh.webp'),
  (100, 24, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923528/unnamed_gsewbp.webp'),
  (101, 24, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923533/unnamed_isytdp.webp'),
  (102, 25, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923719/unnamed_okyvvs.webp'),
  (103, 25, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923725/unnamed_bggdwy.webp'),
  (104, 25, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923737/unnamed_xdsvu5.webp'),
  (105, 25, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923746/unnamed_uzuguo.webp'),
  (106, 25, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923756/unnamed_a3vicc.webp'),
  (107, 26, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923925/unnamed_pyjhrk.webp'),
  (108, 26, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747923930/unnamed_bkwxwe.webp'),
  (109, 26, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924364/unnamed_dcqsh0.webp'),
  (110, 26, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924395/unnamed_yqutqg.webp'),
  (111, 26, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924421/unnamed_lo7kyp.webp'),
  (112, 27, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924513/unnamed_me846q.webp'),
  (113, 27, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924527/unnamed_bfqzho.webp'),
  (114, 28, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924655/unnamed_l8xffc.webp'),
  (115, 28, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924683/unnamed_aacsxz.webp'),
  (116, 29, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924818/unnamed_kmxjn7.webp'),
  (117, 29, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924835/unnamed_lhw91h.webp'),
  (118, 29, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924876/unnamed_kullgd.webp'),
  (119, 30, 'https://res.cloudinary.com/dc61dgxo8/image/upload/v1747924971/unnamed_dwj6gk.webp');