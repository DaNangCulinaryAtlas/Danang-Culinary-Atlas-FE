export const BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL || 'http://178.128.208.78:8081/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  RESTAURANT: {
    LIST: '/restaurants',
    DETAIL: (id: string) => `/restaurants/${id}`,
    search: '/restaurants/search',
  },
} as const;