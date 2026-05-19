import api from "../../../services/api";

/**
 * Servicio de Autenticación centralizado.
 * * Cada función retorna directamente la respuesta procesada (data).
 * * Se utiliza URLSearchParams para cumplir con el estándar OAuth2 de FastAPI.
 */

export const login = async (email, password) => {
  const formData = new URLSearchParams({
    username: email,
    password: password,
  });
  
  const { data } = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const requestPasswordRecovery = async (email) => {
  const { data } = await api.post('/auth/recovery', { email });
  return data;
};

export const resetPassword = async (token, newPassword) => {
  const { data } = await api.post('/auth/reset-password', { 
    token, 
    new_password: newPassword 
  });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};