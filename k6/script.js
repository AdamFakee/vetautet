import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Khởi tạo custom metrics
const signupTime = new Trend('signup_time_ms');
const ticketCheckTime = new Trend('ticket_check_time_ms');
const holdingTime = new Trend('holding_time_ms');
const paymentTime = new Trend('payment_time_ms');
const cancelTime = new Trend('cancel_time_ms');
const successfulSignups = new Counter('successful_signups');
const successfulChecks = new Counter('successful_checks');
const successfulHoldings = new Counter('successful_holdings');
const successfulPayments = new Counter('successful_payments');
const successfulCancels = new Counter('successful_cancels');
const failedRequests = new Counter('failed_requests');
const conflictErrors = new Counter('conflict_errors');
const successRate = new Rate('success_rate');

const host = 'http://localhost:3001'


export const options = {
  scenarios: {
    api_1_group: {
      executor: 'constant-arrival-rate', // Sử dụng executor constant-vus để giữ số lượng VUs cố định
      maxVUs: 500, // 10 người dùng cho API A
      rate: 700,
      preAllocatedVUs: 1,
      duration: '4s', // Chạy trong 30 giây
      exec: 'kichBan_1', // Gọi hàm apiA
      tags: { group: 'api_a' }, // Thêm tag để phân biệt nhóm
    },
    api_2_group: {
      executor: 'constant-arrival-rate',
      maxVUs: 1000, // 15 người dùng cho API B
      duration: '10s',
      preAllocatedVUs: 0,
      rate: 500,
      exec: 'kichBan_2', // Gọi hàm apiB
      startTime: '10s', // Bắt đầu sau 5 giây để tránh xung đột ban đầu
      tags: { group: 'api_b' },
    },
    api_3_group: {
      executor: 'constant-arrival-rate',
      rate: 500,
      preAllocatedVUs: 0,
      maxVUs: 1000, // 15 người dùng cho API B
      duration: '30s',
      exec: 'kichBan_3', // Gọi hàm apiB
      startTime: '5s', // Bắt đầu sau 5 giây để tránh xung đột ban đầu
      tags: { group: 'api_b' },
    },
  },
  thresholds: {
    // Timing thresholds
    'signup_time_ms': ['p(95)<2500'],
    'ticket_check_time_ms': ['p(95)<200'],
    'holding_time_ms': ['p(95)<300'],
    'payment_time_ms': ['p(95)<300'],
    'cancel_time_ms': ['p(95)<300'],
    
    // Success counters - thêm để hiển thị metrics
    'successful_signups': ['count>=0'],
    'successful_checks': ['count>=0'],
    'successful_holdings': ['count>=0'],
    'successful_payments': ['count>=0'],
    'successful_cancels': ['count>=0'],
    
    // Error counters
    'failed_requests': ['count<100'], // Tùy chỉnh threshold theo nhu cầu
    'conflict_errors': ['count<50'],
    
    // Rates
    'success_rate': ['rate>0.5'],
    'http_req_failed': ['rate<0.5'],
  },
};

// Hàm sinh ngẫu nhiên từ 1 đến n
function getRandom(limit) {
  return Math.floor(Math.random() * limit) + 1;
}

// Hàm sinh username/email độc nhất
function getUniqueUserData() {
  const userCounter = Math.random();
  return {
    username: `teccccdt_9xx_${userCounter}`,
    email: `test_xxcccccxdcx9_${userCounter}@gmail.com`,
    full_name: `txesdt_8_${userCounter}`,
    password: '1',
  };
}

function createHeaders(token = null, userId=null) {
  return { 
    headers: { 
      'Content-Type': 'application/json',
       "authorization": token,
      "x-user-id": userId
     },
  };
}

let cnt = 0;


function getAllTicketByScheduleId() {
  const url = host + `/ticket/schedule/${getRandom(500)}`;
  const res = http.get(url);
  
  if(!res) {
    ticketCheckTime.add(res.timings.duration);
  }
  // Kiểm tra lỗi server hoặc connection failed
  if (!res || res.status >= 500) {
    failedRequests.add(1);
    successRate.add(false);
    return -1;
  }
  
  if (res.status == 200) {
    const tickets = res.json().metadata.tickets;
    successfulChecks.add(1);
    successRate.add(true);
    const length = tickets.length;
    return tickets[Number(getRandom(length) - 1)]; // trả về ticket để sử dụng
  } else {
    // Lỗi client (4xx) - không tính vào failedRequests
    successRate.add(false);
    return -1;
  }
}


function holdingTicket(ticket, accessToken, userId) {
  const { ticket_id, direction, } = ticket;
  const url = host + `/ticket/holding/${direction}/${ticket_id}`; // sửa typo "hodling"

  const holdingRes = http.post(url, null, createHeaders(accessToken, userId));
  
  // Track timing cho tất cả response
  if (holdingRes) {
    holdingTime.add(holdingRes.timings.duration);
  }
  
  // Kiểm tra lỗi server hoặc connection failed
  if (!holdingRes || holdingRes.status >= 500) {
    console.log('holding::err::::', holdingRes.body)
    successRate.add(false);
    failedRequests.add(1);
    return;
  }

  // Kiểm tra success case
  if (holdingRes.status === 200 || holdingRes.status === 201) {
    successfulHoldings.add(1);
    successRate.add(true);
    
    // Random action sau khi holding thành công
    const random = Math.random() < 0.5;
    if (random) {
      console.log('run payment');
      payment(ticket_id, accessToken, userId);
    } else {
      console.log('run cancel');
      cancel(ticket_id, accessToken, userId);
    }
  } else {
    // Lỗi client (4xx) - không tính vào failedRequests
    console.log('Holding failed with status:', holdingRes.body);
    successRate.add(false);
    return;
  }
}

function payment(ticketId, accessToken, userId) {
  const paymentUrl = host + '/ticket/payment';
  const paymentRes = http.post(`${paymentUrl}/${ticketId}`, null, createHeaders(accessToken, userId));
  
  // Track timing cho tất cả response
  if (paymentRes) {
    paymentTime.add(paymentRes.timings.duration);
  }
  
  // Kiểm tra lỗi server hoặc connection failed
  if (!paymentRes || paymentRes.status >= 500) {
    console.log('payment::err::::', paymentRes.body)
    failedRequests.add(1);
    successRate.add(false);
    return;
  }
  
  if (paymentRes.status === 200) {
    successfulPayments.add(1);
    successRate.add(true);
  } else {
    // Lỗi client (4xx) - không tính vào failedRequests
    console.log(`Payment failed: status=${paymentRes.status}, body=${paymentRes.body}`);
    successRate.add(false);
  }
  return;
}

function cancel(ticketId, accessToken, userId) {
  const url = host + '/ticket/cancel';
  const cancelRes = http.post(`${url}/${ticketId}`, null, createHeaders(accessToken, userId));
  
  // Track timing cho tất cả response
  if (cancelRes) {
    cancelTime.add(cancelRes.timings.duration);
  }
  
  // Kiểm tra lỗi server hoặc connection failed
  if (!cancelRes || cancelRes.status >= 500) {
    console.log('cancel::err::::', cancelRes.body)
    failedRequests.add(1);
    successRate.add(false);
    return;
  }
  
  if (cancelRes.status === 200) {
    successfulCancels.add(1);
    successRate.add(true);
  } else {
    // Lỗi client (4xx) - không tính vào failedRequests
    console.log(`Cancel failed: status=${cancelRes.status}, body=${cancelRes.body}`);
    successRate.add(false);
  }
  return;
}


// đăng ký => kiếm vé => giữ vé => (có thể kiếm vé tiếp) .... => chọn thanh toán hoặc hủy vé 
export function kichBan_1() {
  const signupUrl = host + '/user/signup';
  const getTickitUrl = host + `/ticket`
  let accessToken = null;
  let userId = null;
  let ticketId = null; // ticketId lấy từ API

  // thao tác 1: đăng kí tài khoản
  const signupRes = http.post(signupUrl, JSON.stringify(getUniqueUserData()), createHeaders());

  // Chỉ track timing nếu có response
  if (signupRes) {
    signupTime.add(signupRes.timings.duration);
  }

  // Kiểm tra lỗi server (5xx) hoặc không có response (connection refused/timeout)
  if (!signupRes || signupRes.status >= 500) {
    successRate.add(false);
    failedRequests.add(1);
    return;
  }

  // Xử lý các trường hợp khác
  if (signupRes.status === 201) {
    accessToken = signupRes.json().metadata.tokens.accessToken;
    userId = signupRes.json().metadata.data.user_id;
    successfulSignups.add(1);
    successRate.add(true);
  } else {
    // Các lỗi client (4xx) - không tính vào failedRequests
    // vì đây là lỗi logic/validation, không phải lỗi hệ thống
    successRate.add(false);
  }

  // call đến api gọi get all schedule
  const ticket = getAllTicketByScheduleId();

  if(ticket != -1) {
    holdingTicket(ticket, accessToken, userId)
  }

}

// lấy route 
export function kichBan_2() {
  const url = host + '/route?limit=10&page=' + getRandom(30);
  const res = http.get(url);
  
  // Track timing cho tất cả response
  if (res) {
    ticketCheckTime.add(res.timings.duration);
  }
  
  // Kiểm tra lỗi server hoặc connection failed
  if (!res || res.status >= 500) {
    failedRequests.add(1);
    successRate.add(false);
    return;
  }
  
  if (res.status == 200) {
    successfulChecks.add(1);
    successRate.add(true);
  } else {
    // Lỗi client (4xx) - không tính vào failedRequests
    console.log('Route API client error:', res.body);
    successRate.add(false);
  }
}

function random_url() {
  const random = Math.random();
  if (random >= 0.5) {
    return 'north_to_south' + getRandom(12300);
  } else {
    return 'south_to_north' + getRandom(12300);
  }
}

// kiếm lịch  
export function kichBan_3() {
  const url = host + '/ticket/' + random_url();
  const res = http.get(url);
  
  // Track timing cho tất cả response
  if (res) {
    ticketCheckTime.add(res.timings.duration);
  }
  
  // Kiểm tra lỗi server hoặc connection failed
  if (!res || res.status >= 500) {
    failedRequests.add(1);
    successRate.add(false);
    return;
  }
  
  if (res.status == 200) {
    successfulChecks.add(1);
    successRate.add(true);
  } else {
    // Lỗi client (4xx) - không tính vào failedRequests
    console.log('Ticket search client error:', res.body);
    successRate.add(false);
  }
}
