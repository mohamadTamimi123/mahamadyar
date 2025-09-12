import axios from 'axios';

// تنظیم base URL از متغیر محیطی
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5002';

// ایجاد instance از axios با تنظیمات پیش‌فرض
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// اضافه کردن interceptor برای مدیریت خطاها
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
