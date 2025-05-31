import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10000 }, // ramp up to 1000 VUs
    { duration: '10s', target: 10000 }, // stay at 1000 VUs
    { duration: '5s', target: 0 },     // ramp down
  ],
  rps: 20000, // giới hạn số request mỗi giây (tùy hệ thống có hỗ trợ hoặc không)
};

const routeCount = 160;

export default function () {
  // Random routeId từ 1 tới 160
  const routeId = Math.floor(Math.random() * routeCount) + 1;
  const res = http.get(`http://localhost:3001/route/detail/${routeId}`);

  sleep(1); // để tránh bị spam quá nhanh nếu không cần
}
