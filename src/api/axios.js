import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// pulls the message our server sends back, falls back to something readable
export const getErrorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.request) return 'Cannot reach the server, check your connection';
  return err.message || 'Something went wrong';
};

export default api;
