import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de Request: Inyección de Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Response: Manejo de errores global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Si es 401, el token expiró o es inválido
    if (error.response?.status === 401) {
      localStorage.clear(); // Limpia todo el storage
      
      // Evitamos un bucle infinito si ya estamos en /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 2. Logging centralizado para depuración
    const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido';
    console.error(`[API Error]: ${errorMessage}`);

    return Promise.reject(error);
  }
);

export default api;