import axios from 'axios';
import { LocalUrl } from './const';

const axiosInstance = axios.create({
  baseURL: LocalUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // We only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
