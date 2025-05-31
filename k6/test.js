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
  stages: [
  { duration: '10s', target: 500 }, // tăng từ 0 - n user trong t giây 
  { duration: '40s', target: 500 }, // tăng từ n - m user trong t giây ( ở đây 100 - 100 => giữ nguyên 100 user trong 20s)
  { duration: '20s', target: 0 }, // giảm n - 0 user trong t giây
],
  thresholds: {
    'signup_time_ms': ['p(95)<2500'], // Ngưỡng cho signup
    'ticket_check_time_ms': ['p(95)<200'],
    'holding_time_ms': ['p(95)<300'],
    'payment_time_ms': ['p(95)<300'],
    'cancel_time_ms': ['p(95)<300'],
    'http_req_failed': ['rate<0.5'], // Tỷ lệ lỗi < 50%
    'success_rate': ['rate>0.5'], // Tỷ lệ thành công > 50%
  },
};

// Hàm sinh ticketId ngẫu nhiên từ 1 đến 25,000
function getRandomTicketId() {
  return Math.floor(Math.random() * 25000) + 1;
}

// Hàm sinh username/email độc nhất
function getUniqueUserData() {
  const userCounter = Math.random();
  return {
    username: `test_4_${userCounter}`,
    email: `test_4_${userCounter}@gmail.com`,
    full_name: `test_4_${userCounter}`,
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

function holdingTicket (ticket, accessToken, userId) {
  const hodlingTicketUrl = host + '/ticket/holding';
  const { ticket_id, status } = ticket;
  if(status != 'available') {
    console.log('ticket holded::::::');
    return;
  };

  const holdingRes = http.post(`${hodlingTicketUrl}/${ticket_id}`, null, createHeaders(accessToken, userId));
  if (holdingRes.status == 409) {
    conflictErrors.add(1);
    failedRequests.add(1);
    console.log('conflict ::: 77')
    return;
  }

  holdingTime.add(holdingRes.timings.duration);
  if (holdingRes.status == 200) {
    cnt++;
    successfulHoldings.add(1);
    successRate.add(true);
  }  else {
    failedRequests.add(1);
    successRate.add(false);
    console.log(accessToken, userId)
    console.log(`Holding failed: status=${holdingRes.status}, body=${holdingRes.body}`);
    return;
  }

  const random = Math.random() < 0.5;
  if(random) {
    console.log('run payment')
    payment(ticket_id, accessToken, userId)
  } else {
    console.log('run cancle')
    cancel(ticket_id, accessToken, userId)
  }
  return;
}

function payment (ticketId, accessToken, userId) {
  const paymentUrl = host + '/ticket/payment';
  const paymentRes = http.post(`${paymentUrl}/${ticketId}`, null, createHeaders(accessToken, userId));
  paymentTime.add(paymentRes.timings.duration);
  if (paymentRes.status == 200) {
    cnt++;
    successfulPayments.add(1);
    successRate.add(true);
  } else {
    failedRequests.add(1);
    successRate.add(false);
    console.log(`Payment failed: status=${paymentRes.status}, body=${paymentRes.body}`);
  }

  return;
}

function cancel (ticketId, accessToken, userId) {
  const cancelTicketUrl = host + '/ticket/cancel';
  const cancelRes = http.post(`${cancelTicketUrl}/${ticketId}`, null, createHeaders(accessToken, userId));
  cancelTime.add(cancelRes.timings.duration);
  if (cancelRes.status == 200) {
    cnt++;
    successfulCancels.add(1);
    successRate.add(true);
  } else {
    failedRequests.add(1);
    successRate.add(false);
    console.log(`Cancel failed: status=${cancelRes.status}, body=${cancelRes.body}`);
  }
}

export default function () {
  const signupUrl = host + '/user/signup';
  const getTickitUrl = host + `/ticket`
  let accessToken = null;
  let userId = null;
  let ticketId = null; // ticketId lấy từ API
  // thao tác 1: đăng kí tài khoản 
  const signupRes = http.post(signupUrl, JSON.stringify(getUniqueUserData()), createHeaders());

  if(signupRes.status == 201) {
    accessToken = signupRes.json().metadata.tokens.accessToken;
    userId = signupRes.json().metadata.data.user_id;
    successfulSignups.add(1);
    successRate.add(true);
  } else {
    failedRequests.add(1);
    successRate.add(false);
    console.log(`Signup failed: status=${signupRes.status}, body=${signupRes.body}`);
  }
  
  // thao tác 2: get ticket by id

  for(let i = 0; i <= 10; i++) {
    const getTicketRes = http.get(getTickitUrl + `/${getRandomTicketId()}`);
    const random = Math.random() < 0.5; // làm cái cờ để đổi url 

    if(getTicketRes.status == 200 && getTicketRes.json().metadata && getTicketRes.json().metadata.ticket) {
      const ticket = getTicketRes.json().metadata.ticket;
      successRate.add(true);

      // chọn giữ vé hay xem vé khác 
      if(random) {
        console.log('countinue')
        continue;
      } else {
        holdingTicket(ticket, accessToken, userId);
      }
    } else {
      failedRequests.add(1);
      successRate.add(false);
      console.log(`Ticket check failed: status=${getTicketRes.status}, body=${getTicketRes.body}`);
    }
    console.log('cnt:::::::', cnt)
  }
  return
}