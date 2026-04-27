CREATE DATABASE food_app;

USE food_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM(
        'customer',
        'admin',
        'shipper'
    ) DEFAULT 'customer',
    reward_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    owner_id INT NOT NULL,
    phone VARCHAR(50),
    description TEXT,
    status ENUM(
        'pending',
        'active',
        'blocked'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent INT DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_uses INT DEFAULT 1,
    used_count INT DEFAULT 0,
    expired_at DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ✨ NEW: Rewards Table (từ database-schema.sql)
CREATE TABLE rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    points INT DEFAULT 0,
    total_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (user_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE user_address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE shippers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    phone VARCHAR(50),
    vehicle VARCHAR(100),
    status ENUM(
        'idle',
        'delivering',
        'offline'
    ) DEFAULT 'idle',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE reward_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_id INT,
    points INT NOT NULL,
    type ENUM('earn', 'redeem') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type ENUM(
        'order',
        'promotion',
        'reward',
        'general'
    ) DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id INT,
    name VARCHAR(255),
    category_id INT,
    image TEXT,
    price DECIMAL(10, 2),
    description TEXT,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE TABLE carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    UNIQUE (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT,
    shipper_id INT,
    total_price DECIMAL(10, 2),
    status ENUM(
        'pending',
        'confirmed',
        'delivering',
        'completed',
        'cancelled'
    ) DEFAULT 'pending',
    payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
    address TEXT,
    voucher_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (voucher_id) REFERENCES vouchers (id),
    FOREIGN KEY (store_id) REFERENCES stores (id),
    FOREIGN KEY (shipper_id) REFERENCES shippers (id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (
        rating >= 1
        AND rating <= 5
    ),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL,
    UNIQUE (user_id, product_id)
);

CREATE TABLE order_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    status ENUM(
        'pending',
        'confirmed',
        'delivering',
        'completed',
        'cancelled'
    ),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNIQUE,
    method VARCHAR(50),
    status VARCHAR(50),
    paid_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE TABLE voucher_usages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    voucher_id INT,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (voucher_id) REFERENCES vouchers (id)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    rating INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE favorite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_id INT,
    content TEXT,
    status ENUM(
        'open',
        'processing',
        'resolved'
    ) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

-- 1. TẠO USER CHỦ CỬA HÀNG (Giả sử id tự động = 1)
INSERT INTO
    users (name, email, password, role)
VALUES (
        'Admin Quán',
        'admin@foodapp.com',
        '123456',
        'admin'
    );

-- 2. TẠO CỬA HÀNG (Sử dụng owner_id = 1 từ user vừa tạo)
INSERT INTO
    stores (name, address, owner_id)
VALUES ('Food App Store', 'Hà Nội', 1);

-- 3. TẠO 3 DANH MỤC (Ép luôn ID 1, 2, 3 để phía dưới dễ móc vào)
INSERT INTO
    categories (id, name)
VALUES (1, 'Snacks'),
    (2, 'Fast Food'),
    (3, 'Drinks');

-- 4. THÊM TẤT CẢ SẢN PHẨM (Gắn với store_id = 1 và category_id tương ứng)

-- =====================================================
-- BẢNG ADMIN QUẢN LÝ
-- =====================================================

-- Bảng đối tác (partners) - thay thế cho stores
CREATE TABLE partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    status ENUM(
        'pending',
        'active',
        'inactive',
        'blocked'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng cấu hình phí dịch vụ & vận chuyển
CREATE TABLE fee_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fee_type ENUM(
        'service_fee',
        'shipping_fee',
        'platform_fee',
        'other'
    ) NOT NULL,
    fee_value DECIMAL(10, 2) NOT NULL,
    fee_description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng tranh chấp
CREATE TABLE disputes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    partner_id INT,
    reason TEXT NOT NULL,
    status ENUM(
        'pending',
        'investigating',
        'resolved',
        'rejected',
        'refunded'
    ) DEFAULT 'pending',
    resolution TEXT,
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES partners (id) ON DELETE SET NULL
);

-- Bảng yêu cầu hoàn tiền
CREATE TABLE refund_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status ENUM(
        'pending',
        'approved',
        'rejected',
        'processed'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Bảng voucher hệ thống (admin tạo)
CREATE TABLE system_vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percent', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2) DEFAULT 0,
    quantity INT NOT NULL,
    used_count INT DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    status ENUM(
        'active',
        'inactive',
        'expired'
    ) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cập nhật bảng users thêm trạng thái tài khoản
ALTER TABLE users
ADD COLUMN status ENUM(
    'active',
    'inactive',
    'banned'
) DEFAULT 'active' AFTER role;

-- Cập nhật bảng categories thêm các trường cần thiết
ALTER TABLE categories ADD COLUMN description TEXT AFTER name;

ALTER TABLE categories
ADD COLUMN image VARCHAR(255) AFTER description;

ALTER TABLE categories
ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active' AFTER image;

ALTER TABLE categories ADD COLUMN parent_id INT NULL AFTER status;

ALTER TABLE categories
ADD FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL;

-- Thêm dữ liệu mẫu phí dịch vụ
INSERT INTO
    fee_settings (
        fee_type,
        fee_value,
        fee_description,
        status
    )
VALUES (
        'service_fee',
        10.00,
        'Phí dịch vụ platform (10%)',
        'active'
    ),
    (
        'shipping_fee',
        15.00,
        'Phí vận chuyển mặc định',
        'active'
    );

-- Thêm dữ liệu mẫu voucher hệ thống
INSERT INTO
    system_vouchers (
        code,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount,
        quantity,
        start_date,
        end_date,
        status
    )
VALUES (
        'WELCOME10',
        'percent',
        10.00,
        50000,
        20000,
        100,
        NOW(),
        DATE_ADD(NOW(), INTERVAL 30 DAY),
        'active'
    ),
    (
        'FREESHIP',
        'fixed',
        15000,
        100000,
        15000,
        50,
        NOW(),
        DATE_ADD(NOW(), INTERVAL 7 DAY),
        'active'
    );

INSERT INTO
    products (
        store_id,
        category_id,
        name,
        image,
        price,
        description
    )
VALUES
    -- ===== SNACKS (category_id = 1) =====
    (
        1,
        1,
        'Khoai lang kén',
        'https://cdn.tgdd.vn/Files/2020/08/26/1284970/cach-lam-khoai-lang-ken-202008261116040688.jpg',
        20000,
        'Khoai lang chiên giòn, ngọt nhẹ.'
    ),
    (
        1,
        1,
        'Bánh tráng nướng',
        'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/banh-trang-nuong-thumbnail.jpg',
        25000,
        'Bánh tráng nướng giòn, topping đầy đủ.'
    ),
    (
        1,
        1,
        'Chả cá viên chiên',
        'https://cdn.tgdd.vn/Files/2020/09/21/1295317/cach-lam-ca-vien-chien.jpg',
        22000,
        'Cá viên dai ngon, chiên vàng giòn.'
    ),
    (
        1,
        1,
        'Đậu phộng rang muối',
        'https://cdn.tgdd.vn/Files/2021/06/23/1363475/cach-rang-dau-phong.jpg',
        15000,
        'Đậu phộng rang giòn, mặn nhẹ.'
    ),
    (
        1,
        1,
        'Bắp xào bơ',
        'https://cdn.tgdd.vn/2020/07/CookRecipe/Avatar/bap-xao-thumbnail.jpg',
        25000,
        'Bắp xào bơ thơm béo, thêm hành phi.'
    ),
    (
        1,
        1,
        'Khô bò miếng',
        'https://cdn.tgdd.vn/Files/2021/12/02/1402570/kho-bo-mieng.jpg',
        40000,
        'Khô bò cay nhẹ, dai ngon.'
    ),
    (
        1,
        1,
        'Bánh flan',
        'https://cdn.tgdd.vn/2021/05/CookProductThumb/banh-flan.jpg',
        15000,
        'Flan mềm mịn, béo ngậy caramel.'
    ),
    (
        1,
        1,
        'Rong biển sấy',
        'https://cdn.tgdd.vn/Files/2021/07/12/1368428/rong-bien-say.jpg',
        20000,
        'Rong biển giòn tan, vị mặn nhẹ.'
    ),

-- ===== FAST FOOD (category_id = 2) =====
(
    1,
    2,
    'Cơm chiên dương châu',
    'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/com-chien-duong-chau.jpg',
    45000,
    'Cơm chiên đầy đủ topping, đậm đà.'
),
(
    1,
    2,
    'Hủ tiếu Nam Vang',
    'https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/hu-tieu-nam-vang.jpg',
    50000,
    'Hủ tiếu nước trong, topping phong phú.'
),
(
    1,
    2,
    'Bánh mì thịt nướng',
    'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/banh-mi-thit-nuong.jpg',
    30000,
    'Bánh mì giòn, thịt nướng thơm lừng.'
),
(
    1,
    2,
    'Bún thịt nướng',
    'https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/bun-thit-nuong.jpg',
    45000,
    'Bún tươi ăn kèm thịt nướng và rau.'
),
(
    1,
    2,
    'Cơm bò lúc lắc',
    'https://cdn.tgdd.vn/2021/10/CookRecipe/Avatar/com-bo-luc-lac.jpg',
    65000,
    'Bò mềm, xào đậm vị, ăn với cơm nóng.'
),
(
    1,
    2,
    'Mì cay Hàn Quốc',
    'https://cdn.tgdd.vn/2021/07/CookRecipe/Avatar/mi-cay.jpg',
    55000,
    'Mì cay cấp độ, topping đa dạng.'
),
(
    1,
    2,
    'Cơm gà nướng',
    'https://cdn.tgdd.vn/2021/09/CookRecipe/Avatar/com-ga-nuong.jpg',
    55000,
    'Gà nướng thơm, da giòn, cơm nóng.'
),
(
    1,
    2,
    'Bún riêu cua',
    'https://cdn.tgdd.vn/2021/08/CookRecipe/Avatar/bun-rieu.jpg',
    40000,
    'Bún riêu chua nhẹ, đậm đà.'
),

-- ===== DRINKS (category_id = 3) =====
(
    1,
    3,
    'Trà tắc',
    'https://cdn.tgdd.vn/2020/07/CookProductThumb/tra-tac.jpg',
    15000,
    'Trà tắc chua ngọt, giải khát.'
),
(
    1,
    3,
    'Sữa chua đá',
    'https://cdn.tgdd.vn/2021/05/CookProductThumb/sua-chua-da.jpg',
    20000,
    'Sữa chua mát lạnh, tốt cho tiêu hóa.'
),
(
    1,
    3,
    'Sinh tố dâu',
    'https://cdn.tgdd.vn/2020/07/CookProductThumb/sinh-to-dau.jpg',
    30000,
    'Sinh tố dâu chua ngọt, thơm ngon.'
),
(
    1,
    3,
    'Nước ép táo',
    'https://cdn.tgdd.vn/2020/07/CookProductThumb/nuoc-ep-tao.jpg',
    30000,
    'Nước ép táo tươi, giàu vitamin.'
),
(
    1,
    3,
    'Cacao đá',
    'https://cdn.tgdd.vn/2021/05/CookProductThumb/cacao-da.jpg',
    30000,
    'Cacao đá béo, đậm vị socola.'
),
(
    1,
    3,
    'Trà vải',
    'https://cdn.tgdd.vn/2020/07/CookProductThumb/tra-vai.jpg',
    30000,
    'Trà vải thơm, ngọt nhẹ.'
),
(
    1,
    3,
    'Soda chanh',
    'https://cdn.tgdd.vn/2020/07/CookProductThumb/soda-chanh.jpg',
    25000,
    'Soda chanh mát lạnh, sảng khoái.'
),
(
    1,
    3,
    'Nước ép dứa',
    'https://cdn.tgdd.vn/2020/07/CookProductThumb/nuoc-ep-dua.jpg',
    30000,
    'Nước ép dứa chua ngọt tự nhiên.'
);

INSERT INTO
    vouchers (
        code,
        discount_percent,
        discount_amount,
        min_order_amount,
        max_uses,
        expired_at
    )
VALUES (
        'WELCOME10',
        10,
        0,
        100000,
        100,
        '2024-12-31 23:59:59'
    ),
    (
        'FOODIE20',
        20,
        0,
        200000,
        50,
        '2024-12-31 23:59:59'
    ),
    (
        'SAVE50K',
        0,
        50000,
        300000,
        30,
        '2024-12-31 23:59:59'
    ),
    (
        'FREESHIP',
        0,
        30000,
        150000,
        200,
        '2024-12-31 23:59:59'
    );
-- =====================================================
-- INDEXES (từ database-schema.sql)
-- =====================================================
CREATE INDEX idx_voucher_code ON vouchers (code);

CREATE INDEX idx_reward_user ON rewards (user_id);

CREATE INDEX idx_notification_user ON notifications (user_id);

CREATE INDEX idx_notification_read ON notifications (user_id, is_read);