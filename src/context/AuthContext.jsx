import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // 👈 Estado explícito para admin

  // Verificación de sesión persistida y validación contra backend
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    
    console.log('🔍 Verificando autenticación...', { token: !!token });
    
    if (!token) {
      console.log('❌ No hay token, usuario no autenticado');
      setUser(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      // Validamos el token con el backend
      const response = await api.get('/auth/me');
      const userData = response.data;
      
      console.log('✅ Usuario autenticado:', { 
        nombre: userData.nombre, 
        role: userData.role,
        isAdmin: userData.role === 'admin' 
      });
      
      setUser(userData);
      setIsAdmin(userData.role === 'admin');
    } catch (err) {
      console.error('❌ Error de autenticación:', err);
      // Si el token es inválido o expiró, limpiamos sesión
      localStorage.removeItem('access_token');
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams({ username: email, password });
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const { access_token, role, nombre } = response.data;
      const userData = { email, role, nombre };
      
      localStorage.setItem('access_token', access_token);
      setUser(userData);
      setIsAdmin(role === 'admin');
      
      console.log('✅ Login exitoso:', { nombre, role, isAdmin: role === 'admin' });
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Credenciales inválidas',
      };
    }
  };

  const logout = useCallback(() => {
    console.log('🚪 Cerrando sesión...');
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAdmin(false);
  }, []);

  const value = {
    user,
    loading,
    isAdmin, // 👈 Usamos el estado explícito
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};