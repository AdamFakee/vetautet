# 🚆 Project: VeTauTet

> **Sử dụng Kafka để xử lý đồng thời và nâng cao hiệu suất đáp ứng dịch vụ Website bán vé tàu**

## 📋 Mục lục

- [Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Kiến trúc Database](#️-kiến-trúc-database)
- [Công nghệ xử lý hiệu suất cao](#-công-nghệ-xử-lý-hiệu-suất-cao)
- [Sơ đồ hệ thống](#-sơ-đồ-hệ-thống)
- [Liên hệ & Hỗ trợ](#-liên-hệ--hỗ-trợ)

---

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mô tả |
|-----------|-------|
| **ExpressJS** | Framework cho Node.js |
| **Sequelize** | ORM cho SQL SERVER |
| **Redis** | Cache database |
| **KafkaJS** | Kafka client cho Node.js |
| **jsonwebtoken** | Xác thực API |

---

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone project
```bash
git clone https://github.com/AdamFakee/vetautet.git
```

### Bước 2: Tạo database master
Chạy file SQL để tạo database:
```sql
./figure/sql_cmd_vettautet.sql
```

### Bước 3: Cấu hình database slave
Tạo database slave bao gồm các bảng:
```
ticket_purchases
users
keytokens
```

### Bước 4: Cài đặt Docker Desktop
```
Tải và cài đặt Docker Desktop từ [docker.com](https://www.docker.com/products/docker-desktop/)
```
### Bước 5: Chạy các container Docker

#### Redis
```bash
docker run -d --name redis -p 6379:6379 redis:latest
```

#### Kafka
```bash
docker run -p 9092:9092 apache/kafka:4.0.0
```

#### K6 (Load Testing)
```bash
docker pull grafana/k6
```

### Bước 6: Cấu hình database
Chỉnh sửa file cấu hình database:
```
./src/configs/database.config
```

### Bước 7: Cài đặt dependencies
```bash
npm install
```

### Bước 8: Khởi chạy server
```bash
npm start
```

### Bước 9: Tạo dữ liệu mẫu
Gọi các API endpoints để tạo dữ liệu:

```http
POST /admin/station/create/list
POST /admin/train/create/list
POST /admin/route/create/list
POST /admin/schedule/create/list
POST /admin/tickets/create/list
```

### Bước 10: Chạy test hiệu năng
```bash
# Chạy file test K6
./k6/script.js
```

---

## 🗄️ Kiến trúc Database

### Database Sharding
- **Mục đích**: Phân mảnh để giảm tải cho database gốc
- **Tách biệt Authentication**: Do phần mã hóa có thời gian phản hồi lâu, chiếm connection lâu và dễ gây timeout
- **Tách biệt Purchases**: Phần này được truy vấn nhiều khi người dùng xem lại hóa đơn hoặc kiểm tra trạng thái mua vé

### Database Slave
Bao gồm các bảng:
- `users`
- `ticket_purchases` 
- `keyTokens`

### Đồng bộ hóa dữ liệu
- **Tự động**: Đồng bộ từ database slave về database master
- **Lịch trình**: Hàng ngày vào 5h sáng (thời điểm ít người dùng)
- **Tính toàn vẹn**: Việc thêm/sửa ở database master không ảnh hưởng đến tính toàn vẹn dữ liệu

---

## ⚡ Công nghệ xử lý hiệu suất cao

### Redis
- **Single Thread**: Đảm bảo tính đồng nhất dữ liệu
- **Giảm tải**: Giảm áp lực cho database gốc
- **Cache**: Tăng tốc độ truy vấn

### Kafka
- **Message Queue**: Xử lý hiệu suất cao
- **Use Cases**: 
  - Giữ vé (holding ticket)
  - Hủy giữ vé (release ticket) 
  - Thanh toán (payment)
- **Message Key**: `ticket_id` để đảm bảo thứ tự xử lý
- **Single Thread**: Đảm bảo thứ tự message cùng ticket_id

#### ⚠️ Vấn đề hiện tại
- Kafka đảm bảo hiệu suất API nhưng chưa xử lý hoàn toàn trường hợp handle message bị lỗi

---

## 📊 Sơ đồ hệ thống

### 🔹 Truy vấn cơ bản với Redis
![Sơ đồ truy vấn cơ bản](./imgs/query%20cơ%20bản.png)

### 🔹 Xử lý Messages với Kafka + Redis  
![Sơ đồ handle với kafka](./imgs/handle%20với%20kafka.png)
*Cấu trúc tổng quan trong việc xử lý lượng lớn requests mua, giữ, hủy giữ vé*

### 🔹 Database Sharding
![Sơ đồ database sharding](./imgs/databaseSharding.png)

### 🔹 Use Case cơ bản
![Sơ đồ useCase cơ bản](./imgs/user.png)
*Các tương tác cơ bản giữa người dùng và hệ thống bán vé tàu*

---

## 📞 Liên hệ & Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt hoặc sử dụng, vui lòng tạo issue trên GitHub repository.

---

<div align="center">
  <strong>🎯 Mục tiêu: Xây dựng hệ thống bán vé tàu hiệu suất cao với khả năng xử lý đồng thời tối ưu</strong>
</div>
