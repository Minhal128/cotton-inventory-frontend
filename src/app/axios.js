import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

let isRefreshing = false;
let queue = [];

api.interceptors.request.use((config) => {
  // We use httpOnly cookies, so no Authorization header needed.
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && original.url !== '/auth/login' && original.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            original._retry = true;
            resolve(api(original));
          });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        await api.post('/auth/refresh');
        isRefreshing = false;
        queue.forEach((cb) => cb());
        queue = [];
        return api(original);
      } catch (e) {
        isRefreshing = false;
        queue = [];
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(e);
      }
    }
    const msg = error.response?.data?.message || error.message;
    if (error.response?.status !== 401) toast.error(msg);
    return Promise.reject(error);
  }
);

export default api;