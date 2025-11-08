"use client";
import { ReactNode, createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useRedux';
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
  // Sync with Redux state
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [user, setUser] = useState<UserDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Sync user state with Redux
  useEffect(() => {
    if (reduxUser) {
      // Convert Redux user type to AuthContext user type
      setUser({
        email: reduxUser.email,
        fullName: reduxUser.fullName,
        avatarUrl: reduxUser.avatarUrl || null,
        roles: reduxUser.roles
      });
    } else {
      setUser(null);
    }
  }, [reduxUser]);

  // Initialize from localStorage on mount
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem('token');
      const storedUser = window.localStorage.getItem('userData');

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          avatarUrl: userData.avatarUrl || null
        });
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    // This is deprecated, use Redux loginUser action instead
    console.warn('AuthContext.login is deprecated. Use Redux loginUser action instead.');
  };

  const handleLogout = async () => {
    // This is deprecated, use Redux logout action instead
    console.warn('AuthContext.logout is deprecated. Use Redux logout action instead.');
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
