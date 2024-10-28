
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode'; // Импортируем jwt-decode

interface DecodedToken {
  sub: number; // Предполагаемая структура декодированного токена
}

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>; // Добавляем метод resetPassword
  role: string | null;
  error: string | null;
  userId: number | null;
  setUserId: (id: number | null) => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const tokenFromCookie = Cookies.get('access_token'); // Изменил имя переменной для ясности
    if (tokenFromCookie) {
      setToken(tokenFromCookie); 
      setIsAuthenticated(true);
      const decodedToken: DecodedToken = jwtDecode(tokenFromCookie); // Используйте интерфейс DecodedToken
      setUserId(decodedToken.sub); 
    }
  }, []);

  const host = process.env.NEXT_PUBLIC_SERVER;

  if (!host) {
    throw new Error('NEXT_PUBLIC_SERVER is not defined');
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${host}/auth/login`, { email, password });
      const { access_token, role: userRole } = response.data; // Извлекаем роль из ответа
      setRole(userRole);
      Cookies.set('access_token', access_token, { expires: 7 });
      setToken(access_token);
      setIsAuthenticated(true);

      const decodedToken: DecodedToken = jwtDecode(access_token);
      setUserId(decodedToken.sub);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Ошибка при входе');
      } else {
        setError('Неизвестная ошибка');
      }
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await axios.post(`${host}/auth/reset-password`, { email });
      setError(null); // Предполагается, что после успешного сброса ошибки не будет
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Ошибка при сбросе пароля');
      } else {
        setError('Неизвестная ошибка');
      }
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    setToken(null); // Убираем токен из состояния
    setIsAuthenticated(false);
    setUserId(null);
    setRole(null); // Сбрасываем роль при выходе из системы
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, resetPassword, role, error, userId, setUserId, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
