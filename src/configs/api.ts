export const BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL || 'http://178.128.208.78:8081/api/v1';
export const BASE_URL_2 = BASE_URL.replace('/v1', '');

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
  ADMIN: {
    // Dashboard - Tổng quan hệ thống
    // DASHBOARD_METRICS: '/admin/dashboard/metrics', // Lấy các chỉ số tổng quan (users, restaurants, pending, reports)
    // DASHBOARD_CHARTS: '/admin/dashboard/charts', // Lấy dữ liệu cho biểu đồ (truy cập, đăng ký, phân bố quán ăn)
    // DASHBOARD_ACTIVITIES: '/admin/dashboard/activities', // Lấy danh sách hoạt động gần đây

    // User Management - Quản lý người dùng
    VENDORS_LIST: '/admin/accounts/vendors', // Get list of vendors
    USERS_LIST: '/admin/accounts/users', // Get list of users
    UPDATE_ACCOUNT_STATUS: (id: string) => `/admin/accounts/${id}/status`, // Update account status
    SEND_EMAIL_TO_ACCOUNT: (id: string) => `/admin/accounts/${id}/send-email`, // Send email to account
    GET_ACCOUNT_DETAIL: (id: string) => `/admin/accounts/${id}`, // Get account detail

    // Restaurant Management - Quản lý và kiểm duyệt quán ăn
    RESTAURANTS_LIST: '/restaurants/admin', // Danh sách quán ăn (any STATUS: ALL, PENDING, APPROVED, REJECTED)
    RESTAURANT_DETAIL: (id: string) => `/restaurants/${id}`, // Chi tiết quán ăn 
    RESTAURANT_DELETE: (id: string) => `/restaurants/${id}`, // Xóa quán ăn
    RESTAURANT_UPDATE: (id: string) => `/restaurants/${id}`, // Cập nhật thông tin quán ăn - PATCH
    RESTAURANT_APPROVE: (id: string) => `/restaurants/admin/${id}/approval`, // Duyệt quán ăn
    RESTAURANT_BY_VENDOR_ID: (vendorId: string) => `/vendors/${vendorId}/restaurants`, // Lấy quán ăn theo vendorId

    // Dish Management - Quản lý và kiểm duyệt món ăn
    DISHES_LIST: '/admin/dishes', // Danh sách món ăn (có filter theo status, search)
    DISH_DETAIL: (id: string) => `/admin/dishes/${id}`, // Chi tiết món ăn
    DISH_APPROVE: (id: string) => `/admin/dishes/${id}/approve`, // Duyệt món ăn
    DISH_REJECT: (id: string) => `/admin/dishes/${id}/reject`, // Từ chối món ăn
    DISHES_BULK_APPROVE: '/admin/dishes/bulk-approve', // Duyệt nhiều món ăn cùng lúc -> note 

    // Review Moderation - Kiểm duyệt đánh giá
    REVIEWS_LIST: '/reports/admin', // Danh sách đánh giá (có filter theo status)
    REVIEW_DETAIL: (id: string) => `/admin/reviews/${id}`, // Chi tiết đánh giá
    REVIEW_APPROVE: (id: string) => `/admin/reviews/${id}/approve`, // Duyệt đánh giá
    REVIEW_REJECT: (id: string) => `/admin/reviews/${id}/reject`, // Từ chối đánh giá

    // Report Handling - Xử lý báo cáo vi phạm
    REPORTS_LIST: '/reports/admin', // Danh sách báo cáo (bao gồm lý do, status, timestamps)
    

    // System Settings - Cài đặt hệ thống
    // Location Management - Quản lý địa chính
    PROVINCES_LIST: '/locations/provinces', // Get all provinces
    DISTRICTS_BY_PROVINCE: (provinceId: string) => `/locations/provinces/${provinceId}/districts`, // Get all districts by province
    WARDS_BY_DISTRICT: (districtId: string) => `/locations/districts/${districtId}/wards`, // Get all wards by district

    // Tag Management - Quản lý nhãn
    RESTAURANT_TAGS_LIST: '/tags/restaurant', // Get all restaurants tags
    // RESTAURANT_TAG_CREATE: '/tags/restaurant', // Create a new restaurant tag

    DISH_TAGS_LIST: '/tags/dish', // Get all dishes tags
    // DISH_TAG_CREATE: '/tags/dish', // Create a new dish tag

    // Permission Management - Quản trị phân quyền - dùng BASE_URL_2
    PERMISSIONS_LIST: '/admin/permissions/roles/permissions', // Get all roles with their permissions
    PERMISSIONS_UPDATE: '/admin/permissions/roles/permissions', // Update roles permissions
    ROLES_LIST: '/admin/permissions/roles', // Get all roles
    PERMISSIONS_FOR_ROLE: (roleId: string) => `/admin/permissions/roles/${roleId}/permissions`, // Get permissions for a specific role
    ACTIONS_LIST: '/admin/permissions/actions', // Get all available actions
  },
} as const;