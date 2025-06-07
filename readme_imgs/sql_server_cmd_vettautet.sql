-- Tạo cơ sở dữ liệu
-- Bảng ga tàu: Lưu thông tin các ga tàu
CREATE TABLE stations (
    station_id INT IDENTITY(1,1) PRIMARY KEY,
    station_name NVARCHAR(100) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    description NTEXT,
    status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng tàu: Lưu thông tin các tàu
CREATE TABLE trains (
    train_id INT IDENTITY(1,1) PRIMARY KEY,
    train_name NVARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    description NTEXT,
    status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng địa chỉ: Lưu thông tin lộ trình từ ga A đến ga B
CREATE TABLE routes (
    route_id INT IDENTITY(1,1) PRIMARY KEY,
    departure_station_id INT NOT NULL,
    arrival_station_id INT NOT NULL,
    -- route_type NVARCHAR(20) CHECK (route_type IN ('north_south', 'east_west', 'local')) DEFAULT 'local',
    distance_km DECIMAL(10, 2),
    status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (departure_station_id) REFERENCES stations(station_id),
    FOREIGN KEY (arrival_station_id) REFERENCES stations(station_id)
);

-- Bảng lịch khởi hành: Lưu thông tin lịch khởi hành của tàu
CREATE TABLE schedules (
    schedule_id INT IDENTITY(1,1) PRIMARY KEY,
    train_id INT NOT NULL,
    route_id INT NOT NULL,
    departure_time DATETIME2 NOT NULL,
    arrival_time DATETIME2 NOT NULL,
    status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (train_id) REFERENCES trains(train_id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

-- Bảng vé tàu: Lưu thông tin vé cho mỗi lịch khởi hành (giữ nguyên cột status hiện tại)
CREATE TABLE tickets (
    ticket_id INT IDENTITY(1,1) PRIMARY KEY,
    schedule_id INT NOT NULL,
    seat_number NVARCHAR(10) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    direction NVARCHAR(20) CHECK (direction IN ('north_to_south', 'south_to_north')) NOT NULL,
    status NVARCHAR(20) CHECK (status IN ('available', 'pending', 'booked', 'cancelled')) DEFAULT 'available',
    pending_expires_at DATETIME2 NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id),
    UNIQUE (schedule_id, seat_number)
);

-- Bảng user: Lưu thông tin người dùng
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    phone NVARCHAR(20),
    status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE()
);

-- Bảng keytokens: Lưu cặp key và token cho từng người dùng
CREATE TABLE keytokens (
    user_id INT NOT NULL,
    publicKey NTEXT NOT NULL,
    privateKey NTEXT NOT NULL,
    refreshTokenUsed NVARCHAR(MAX) DEFAULT '[]',
    refreshToken NTEXT NOT NULL,
    status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bảng mua vé tàu: Lưu thông tin người dùng mua vé
CREATE TABLE ticket_purchases (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id INT NOT NULL,
    ticket_id INT NOT NULL,
    purchase_time DATETIME2 DEFAULT GETDATE(),
    status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);

-- Bảng trả vé tàu: Lưu thông tin người dùng trả vé
CREATE TABLE ticket_refunds (
    refund_id INT IDENTITY(1,1) PRIMARY KEY,
    purchase_id UNIQUEIDENTIFIER NOT NULL,
    refund_time DATETIME2 DEFAULT GETDATE(),
    reason NTEXT,
    status NVARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    FOREIGN KEY (purchase_id) REFERENCES ticket_purchases(id)
);

-- Thêm cột location vào bảng stations
ALTER TABLE stations
ADD location NVARCHAR(10) CHECK (location IN ('north', 'south')) NOT NULL;

-- Thêm cột direction vào bảng routes
ALTER TABLE routes
ADD direction NVARCHAR(20) CHECK (direction IN ('north_to_south', 'south_to_north')) NOT NULL;