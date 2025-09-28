import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    // Crear AxiosHeaders si es undefined
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (token) {
      // setea la cabecera Authorization de forma compatible
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
