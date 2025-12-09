import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL, API_ENDPOINTS } from '@/configs/api';

const instanceAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flags to prevent multiple refresh attempts and infinite redirect loops
let isRefreshing = false;
let isRedirecting = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
instanceAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with refresh token logic
instanceAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    console.log('🔍 [Axios Interceptor] Error caught:', {
      status: error.response?.status,
      url: originalRequest?.url,
      _retry: originalRequest?._retry
    });

    if (error.response) {
      const status = error.response.status;

      // Handle 401 - Try to refresh token
      if (status === 401 && !originalRequest._retry) {
        console.log('🔑 [Axios Interceptor] 401 detected, will attempt token refresh');
        if (originalRequest.url?.includes('/auth/refresh-token')) {
          // Refresh token itself failed - logout
          console.error('🔴 Refresh token expired - logging out');
          if (typeof window !== 'undefined' && !isRedirecting) {
            const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
            const isPublicRoute = publicRoutes.some(route => window.location.pathname.includes(route));

            if (!isPublicRoute) {
              isRedirecting = true;
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('userData');
              console.log('🔄 Redirecting to login...');
              window.location.href = '/login';
            }
          }
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // Queue this request while refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return instanceAxios(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken) {
            // Define public routes that don't need authentication
            const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
            const isPublicRoute = publicRoutes.some(route => window.location.pathname.includes(route));

            if (!isRedirecting && !isPublicRoute) {
              isRedirecting = true;
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
              window.location.href = '/login';
            }
            return Promise.reject(error);
          }

          try {
            // Use plain axios to avoid interceptor loop
            const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
              refreshToken,
            }, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('📝 [Axios Interceptor] Refresh response:', response.data);

            // Backend returns: { data: { accessToken, refreshToken } }
            const responseData = response.data.data || response.data;
            const newToken = responseData.accessToken || responseData.token;
            const newRefreshToken = responseData.refreshToken;

            if (!newToken) {
              throw new Error('No access token in refresh response');
            }
            // Update tokens in localStorage
            localStorage.setItem('token', newToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Update Redux store if available
            try {
              const { store } = await import('@/stores');
              const { updateTokens } = await import('@/stores/auth');
              store.dispatch(updateTokens({
                token: newToken,
                refreshToken: newRefreshToken
              }));
            } catch (storeError) {
              console.warn('⚠️ Could not update Redux store:', storeError);
            }

            // Update authorization header
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            processQueue(null, newToken);
            isRefreshing = false;

            // Retry original request with new token
            return instanceAxios(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            isRefreshing = false;

            // Clear auth data and redirect to login
            if (!isRedirecting) {
              const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
              const isPublicRoute = publicRoutes.some(route => window.location.pathname.includes(route));

              if (!isPublicRoute) {
                isRedirecting = true;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userData');
                console.log('🔄 Redirecting to login (refresh failed)...');
                window.location.href = '/login';
              }
            }

            return Promise.reject(refreshError);
          }
        }
      }

      // Handle other error codes
      switch (status) {
        case 403:
          console.error('❌ Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('❌ Not found');
          break;
        case 500:
          console.error('❌ Server error');
          break;
      }
    } else if (error.request) {
      console.error('❌ No response from server:', error.request);
    } else {
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default instanceAxios;