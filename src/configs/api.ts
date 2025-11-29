export const BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL || 'http://178.128.208.78:8081/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  PROFILE: {
    USER: '/profile/user',
    VENDOR: '/profile/vendor',
    ADMIN: '/profile/admin',
    UPDATE_USER: '/profile/user',
    UPDATE_VENDOR: '/profile/vendor',
    UPDATE_ADMIN: '/profile/admin',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  RESTAURANT: {
    LIST: '/restaurants',
    DETAIL: (id: string) => `/restaurants/${id}`,
    SEARCH: '/restaurants/search',
    SEARCH_BY_NAME: '/restaurants/name',
    MAP_VIEW: '/restaurants/map-view',
  },
  REVIEW: {
    CREATE: '/reviews',
    UPDATE: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
  },
} as const;