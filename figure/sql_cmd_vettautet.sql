-- Tạo cơ sở dữ liệu
CREATE DATABASE train_system;
USE train_system;
-- Bảng ga tàu: Lưu thông tin các ga tàu
CREATE TABLE stations (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng tàu: Lưu thông tin các tàu
CREATE TABLE trains (
    train_id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng địa chỉ: Lưu thông tin lộ trình từ ga A đến ga B
CREATE TABLE routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    departure_station_id INT NOT NULL,
    arrival_station_id INT NOT NULL,
    -- route_type ENUM('north_south', 'east_west', 'local') DEFAULT 'local',
    distance_km DECIMAL(10, 2),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departure_station_id) REFERENCES stations(station_id),
    FOREIGN KEY (arrival_station_id) REFERENCES stations(station_id)
);

-- Bảng lịch khởi hành: Lưu thông tin lịch khởi hành của tàu
CREATE TABLE schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    train_id INT NOT NULL,
    route_id INT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (train_id) REFERENCES trains(train_id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

-- Bảng vé tàu: Lưu thông tin vé cho mỗi lịch khởi hành (giữ nguyên cột status hiện tại)
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('available', 'pending', 'booked', 'cancelled') DEFAULT 'available',
    pending_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id),
    UNIQUE (schedule_id, seat_number)
);

-- Bảng user: Lưu thông tin người dùng
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng keytokens: Lưu cặp key và token cho từng người dùng
CREATE TABLE keytokens (
    user_id INT NOT NULL,
    publicKey TEXT NOT NULL,
    privateKey TEXT NOT NULL,
    refreshTokenUsed JSON DEFAULT ('[]'),
    refreshToken TEXT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng mua vé tàu: Lưu thông tin người dùng mua vé
CREATE TABLE ticket_purchases (
    purchase_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    purchase_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id),
    UNIQUE (ticket_id)
);

-- Bảng trả vé tàu: Lưu thông tin người dùng trả vé
CREATE TABLE ticket_refunds (
    refund_id INT AUTO_INCREMENT PRIMARY KEY,
    purchase_id INT NOT NULL,
    refund_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (purchase_id) REFERENCES ticket_purchases(purchase_id)
);

-- Alter bảng mua vé tàu: xóa ràng buộc unique của ticket_id
ALTER TABLE ticket_purchases DROP FOREIGN KEY ticket_purchases_ibfk_2;
ALTER TABLE ticket_purchases DROP INDEX ticket_id;
ALTER TABLE ticket_purchases ADD FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id);

ALTER TABLE stations
ADD COLUMN location ENUM('north', 'south') NOT NULL;

ALTER TABLE routes
ADD COLUMN direction ENUM('north_to_south', 'south_to_north') NOT NULL;


