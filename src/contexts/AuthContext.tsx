"use client";
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAuth } from '@/services/auth';
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
} from './types';

type Props = {
  children: ReactNode;
};

// ** Defaults
const defaultProvider: AuthValuesType = {
    user: null,
    loading: true,
    setUser: () => null,
    setLoading: () => Boolean,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    loginGoogle: () => Promise.resolve(),
    loginFacebook: () => Promise.resolve()
  }
  
  const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem('token');
      const storedUser = window.localStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);

  const handleLogin = async ( params: LoginParams, errorCallback?: ErrCallbackType) => {
    try {
      const response = await loginAuth({ email: params.email, password: params.password });

      if (response.success && response.data) {
        const { token, role } = response.data;
        console.log(token, role);
        console.log("Storing token and user data");
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('role', role);
        if(role == 'ADMIN') {
          router.push('/restaurants');
        } else {
          router.push('/');
        }
      } else {
        if (errorCallback) {
          errorCallback(new Error(response.message || 'Login failed'));
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (errorCallback) errorCallback(err);
    }
  };

  const handleLogout = async () => {
    setUser(null);
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('userData');
    window.sessionStorage.removeItem('accessToken');
    window.sessionStorage.removeItem('userData');
    router.push('/login');
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    loginGoogle: async () => {
      console.warn('loginGoogle is not implemented yet');
    },
    loginFacebook: async () => {
      console.warn('loginFacebook is not implemented yet');
    },
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
