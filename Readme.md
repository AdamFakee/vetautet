<h1 style="font-size: 28px; font-weight: bold; color: #007acc; margin-bottom: 8px;">🚆 Project: vetautet</h1>
<div style="width: 100%; height: 2px; background-color: #222; margin-bottom: 16px;"></div>

<h2 style="font-size: 20px; color: #2c3e50; margin-bottom: 8px;">
  📌 Đề tài: <span style="font-weight: normal;">
    Sử dụng Kafka để xử lý đồng thời và nâng cao hiệu suất đáp ứng dịch vụ Website bán vé tàu.
  </span>
</h2>

<div style="width: 100%; height: 2px; background-color: #222; margin-bottom: 24px;"></div>


<h2 style="font-size: 20px; color: #2c3e50; margin-bottom: 8px;">📌 Công nghệ:</h2>
<ul style="list-style: none; padding: 0; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <li style="background: #f4f6f8; margin-bottom: 8px; padding: 12px 16px; border-left: 6px solid #007acc; border-radius: 6px;">
    <span style="font-weight: bold; color: #2c3e50;">ExpressJS</span> – Framework cho Node.js
  </li>
  <li style="background: #f4f6f8; margin-bottom: 8px; padding: 12px 16px; border-left: 6px solid #007acc; border-radius: 6px;">
    <span style="font-weight: bold; color: #2c3e50;">Sequelize</span> – ORM cho SQL SERVER
  </li>
  <li style="background: #f4f6f8; margin-bottom: 8px; padding: 12px 16px; border-left: 6px solid #007acc; border-radius: 6px;">
    <span style="font-weight: bold; color: #2c3e50;">Redis</span> – Cache 
  </li>
  <li style="background: #f4f6f8; margin-bottom: 8px; padding: 12px 16px; border-left: 6px solid #007acc; border-radius: 6px;">
    <span style="font-weight: bold; color: #2c3e50;">KafkaJS</span> – Kafka client cho Node.js
  </li>
  <li style="background: #f4f6f8; margin-bottom: 8px; padding: 12px 16px; border-left: 6px solid #007acc; border-radius: 6px;">
    <span style="font-weight: bold; color: #2c3e50;">jsonwebtoken</span> – Xác thực API
  </li>
</ul>



<div style="width: 100%; height: 2px; background-color: #222; margin-bottom: 24px; margin-top: 16px"></div>


<!-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -->
<h2 style="font-size: 20px; color: #2c3e50; margin-bottom: 8px;">📌 Hướng giải quyết:</h2>

<style>
  details {
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #fafafa;
    padding: 12px 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }
  summary {
    font-weight: 600;
    font-size: 18px;
    cursor: pointer;
    color: #007acc;
    outline: none;
    user-select: none;
  }
  details[open] summary::after {
    content: "▲";
    float: right;
    font-size: 14px;
  }
  summary::after {
    content: "▼";
    float: right;
    font-size: 14px;
  }
  details p, details ul, details li {
    margin: 8px 0;
    line-height: 1.5;
    color: #333;
    font-size: 15px;
  }
  details ul {
    padding-left: 20px;
  }
  details ul ul {
    padding-left: 20px;
  }
</style>

<details open style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: #fdfdfd; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
  <summary style="font-weight: 600; font-size: 18px; cursor: pointer; color: #007acc;">
    🚀 Cài đặt project
  </summary>

  <ol style="padding-left: 20px; margin-top: 16px; font-family: 'Segoe UI', sans-serif; line-height: 1.6;">
    <li><b>Bước 1:</b> Clone project:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; margin-top: 6px; font-family: monospace;">
        git clone https://github.com/AdamFakee/vetautet.git <span style="float: right;">📋</span>
      </div>
    </li>
    <li><b>Bước 2:</b> Chạy file SQL để tạo database master:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; margin-top: 6px; font-family: monospace;">
        ./figure/sql_cmd_vettautet.sql <span style="float: right;">📋</span>
      </div>
    </li>
    <li><b>Bước 3:</b> Cấu hình database slave gồm các bảng:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; margin-top: 6px; font-family: monospace;">
        ticket_purchases, users, keytokens <span style="float: right;">📋</span>
      </div>
    </li>
    <li><b>Bước 4:</b> Cài đặt Docker Desktop.</li>
    <li><b>Bước 5:</b> Chạy các lệnh Docker:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 6px;">
        docker run -d --name redis -p 6379:6379 redis:latest <span style="float: right;">📋</span>
      </div>
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 6px;">
        docker run -p 9092:9092 apache/kafka:4.0.0 <span style="float: right;">📋</span>
      </div>
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 6px;">
        docker pull grafana/k6 <span style="float: right;">📋</span>
      </div>
    </li>
    <li><b>Bước 6:</b> Cấu hình file database:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 6px;">
        ./src/configs/database.config <span style="float: right;">📋</span>
      </div>
    </li>
    <li><b>Bước 7:</b> Cài đặt package:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 6px;">
        npm i <span style="float: right;">📋</span>
      </div>
    </li>
    <li><b>Bước 8:</b> Chạy server:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 6px;">
        npm start <span style="float: right;">📋</span>
      </div>
    </li>
    <li><b>Bước 9:</b> Gọi các route để tạo dữ liệu:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 6px;">
        /admin/station/create/list <span style="float: right;">📋</span>
      </div>
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 4px;">
        /admin/train/create/list <span style="float: right;">📋</span>
      </div>
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 4px;">
        /admin/route/create/list <span style="float: right;">📋</span>
      </div>
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 4px;">
        /admin/schedule/create/list <span style="float: right;">📋</span>
      </div>
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 4px;">
        /admin/tickets/create/list <span style="float: right;">📋</span>
      </div>
    </li>
    <li><b>Bước 10:</b> Chạy file test hiệu năng:
      <div style="background: #111; color: #eee; padding: 8px 12px; border-radius: 6px; font-family: monospace; margin-top: 6px;">
        chạy file ./k6/script.js <span style="float: right;">📋</span>
      </div>
    </li>
  </ol>
</details>


<details style="border: 1px solid #ccc; border-radius: 8px; background: #fafafa; padding: 12px 16px; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
  <summary style="font-weight: 600; font-size: 18px; cursor: pointer; color: #007acc; outline: none; user-select: none;">
    Về database
  </summary>

  <ul style="margin-top: 12px; color: #333; font-size: 15px; line-height: 1.5;">
    <li>Sử dụng database sharding</li>
    <li>Tăng connection pooling.</li>
    <li>Yêu cầu sharding chi tiết:
      <ul>
        <li>phân mảnh giảm tải cho database gốc</li>
        <li>tách biệt phần authentication <b>(do phần này mã hóa nên thời gian phản hồi khá lâu, thành ra chiếm connection lâu hơn và dễ khiến các reqs khác bị timeout)</b></li>
        <li>tách biệt phần purchases <b>(do phần này cũng thường được truy vấn nhiều khi mà người dùng thường có nhu cầu xem lại hóa đơn hay việc mua vé đã thành công hay chưa)</b></li>
        <li>tạo database slave gồm các bảng: <b>users, ticket_purchases, keyTokens</b></li>
      </ul>
    </li>
    <li>Yêu cầu cho việc đồng bộ hóa dữ liệu:
      <ul>
        <li>Đồng bộ dữ liệu từ database slave về database master</li>
        <li>Việc đồng bộ sẽ được thiết lập tự động theo lịch hàng ngày vào 5h sáng <b>(đây là thời điểm gần như ít ai vào web)</b></li>
      </ul>
    </li>
    <li>Yêu cầu cho việc cập nhật dữ liệu:
      <ul>
        <li>do 2 thành phần database tách biệt nhau nên trong thực tế việc có thêm-sửa gì ở database master cũng gần như không ảnh hưởng đến việc toàn vẹn dữ liệu <b>(Trừ trường hợp xóa hoàn toàn 1 trường nào đó - ví dụ như xóa vé ở bảng tickets)</b></li>
      </ul>
    </li>
  </ul>
</details>

<details style="border: 1px solid #ccc; border-radius: 8px; background: #fafafa; padding: 12px 16px; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
  <summary style="font-weight: 600; font-size: 18px; cursor: pointer; color: #007acc; outline: none; user-select: none;">
    Về công nghệ chính cho việc xử lí hiệu suất và tính đồng thời cao của project
  </summary>

  <ul style="margin-top: 12px; color: #333; font-size: 15px; line-height: 1.5;">
    <li>Sử dụng database redis
      <ul>
        <li>Redis là cơ sở dữ liệu với cơ chế <b>'single thread'</b> nên có thể đảm bảo việc đồng nhất dữ liệu.</li>
        <li>Việc sử dụng redis sẽ giúp giảm tải cho database gốc.</li>
      </ul>
    </li>
    <li>Sử dụng kafka:
      <ul>
        <li>Kafka là một message queue thường được sử dụng trong các vấn đề về hiệu suất xử lí.</li>
        <li>Kafka được sử dụng trong phần giữ vé (holding ticket)<b>(holding ticket)</b>, hủy giữ vé <b>(release ticket)</b>, thanh toán <b>(payment)</b> với message-key = ticket_id <b>'single thread'</b> nhằm đảm bảo thứ tự xử lí của các message cùng ticket_id.</li>
        <li><b>Vấn đề gặp phải:</b>
          <ul>
            <li>Việc sử dụng kafka giúp đảm bảo hiệu suất của API, tuy nhiên vẫn chưa xử lí hoàn toàn được trong trường hợp nếu kafka handle message bị lỗi.</li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</details>



<!-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -->


<div style="width: 100%; height: 2px; background-color: #222; margin-bottom: 24px; margin-top: 16px"></div>

<h2 style="font-size: 20px; color: #2c3e50; margin-bottom: 8px;">📌 Sơ đồ tổng quan về cấu trúc hệ thống api bán vé tàu:</h2>
<div align="center">
  <h4>🔹 Tác vụ truy vấn cơ bản kết hợp redis</h4>
  <img src="./imgs/query cơ bản.png" alt="Sơ đồ truy vấn cơ bản"/>
</div>

<br/>

<div align="center">
  <h4>🔹 Xử lí messages với kafka + redis</h4>
  <img src="./imgs/handle với kafka.png" alt="Sơ đồ useCase cơ bản"/>
  <p style="margin-top: 4px; font-size: 14px; color: #555;">Cấu trúc tổng quan trong việc xử lí lượng lớn reqs trong việc mua, giữ, hủy giữ vé.</p>
</div>


<!-- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -->


<div style="width: 100%; height: 2px; background-color: #222; margin-bottom: 24px; margin-top: 16px"></div>

<h2 style="font-size: 20px; color: #2c3e50; margin-bottom: 8px;">📌 Sơ đồ tổng quan của hệ thống:</h2>
<div align="center">
  <h4>🔹 Cấu trúc database sharding</h4>
  <img src="./imgs/databaseSharding.png" alt="Sơ đồ database sharding"/>
</div>

<br/>

<div align="center">
  <h4>🔹 Use Case Cơ Bản</h4>
  <img src="./imgs/user.png" alt="Sơ đồ useCase cơ bản"/>
  <p style="margin-top: 4px; font-size: 14px; color: #555;">Các tương tác cơ bản giữa người dùng và hệ thống bán vé tàu.</p>
</div>







