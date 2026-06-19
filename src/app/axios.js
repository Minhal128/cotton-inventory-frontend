import axios from 'axios';
import toast from 'react-hot-toast';
import { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, clearTokens } from './tokenStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: false,
});

let isRefreshing = false;
let queue = [];

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const isAuthEndpoint = original.url?.includes('/auth/login') || original.url?.includes('/auth/refresh');

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject, config: original });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { withCredentials: false }
        );
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        isRefreshing = false;
        queue.forEach(({ resolve, config: cfg }) => {
          cfg.headers = cfg.headers || {};
          cfg.headers.Authorization = `Bearer ${data.accessToken}`;
          resolve(api(cfg));
        });
        queue = [];
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        isRefreshing = false;
        queue.forEach(({ reject }) => reject(e));
        queue = [];
        clearTokens();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(e);
      }
    }

    const msg = error.response?.data?.message || error.message;
    if (status && status !== 401) toast.error(msg);
    return Promise.reject(error);
  }
);

export default api;
