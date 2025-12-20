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
    REFRESH_TOKEN: '/auth/refresh-token',
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
    SEARCH_BY_DISH: '/restaurants/by-dish',
    MAP_VIEW: '/restaurants/map-view',
  },
  DISH: {
    LIST: '/dishes',
    DETAIL: (id: string) => `/dishes/${id}`,
    CREATE: '/dishes',
    UPDATE: (id: string) => `/dishes/${id}`,
    UPDATE_STATUS: (id: string) => `/dishes/${id}/status`,
    MANAGEMENT_DETAIL: (id: string) => `/dishes/${id}/management`,
  },
  ADMIN: {
    // Dashboard - Tổng quan hệ thống
    OVERVIEW: '/admin/overview', // Lấy tổng quan hệ thống (users, vendors, restaurants)
    RESTAURANT_COUNT_BY_TAG: '/admin/restaurants/count-by-tag', // Lấy số lượng quán ăn theo tag

    // User Management - Quản lý người dùng
    VENDORS_LIST: '/admin/accounts/vendors', // Get list of vendors
    USERS_LIST: '/admin/accounts/users', // Get list of users
    UPDATE_ACCOUNT_STATUS: (id: string) => `/admin/accounts/${id}/status`, // Update account status
    SEND_EMAIL_TO_ACCOUNT: (id: string) => `/admin/accounts/${id}/send-email`, // Send email to account
    GET_ACCOUNT_DETAIL: (id: string) => `/admin/accounts/${id}`, // Get account detail

    // Restaurant Management - Quản lý và kiểm duyệt quán ăn
    RESTAURANTS_LIST: '/admin/restaurants', // Danh sách quán ăn (any STATUS: ALL, PENDING, APPROVED, REJECTED)
    RESTAURANT_DETAIL: (id: string) => `/restaurants/${id}`, // Chi tiết quán ăn 
    RESTAURANT_DELETE: (id: string) => `/restaurants/${id}`, // Xóa quán ăn
    RESTAURANT_UPDATE: (id: string) => `/restaurants/${id}`, // Cập nhật thông tin quán ăn - PATCH
    RESTAURANT_APPROVE: (id: string) => `/admin/restaurants/${id}/approval`, // Duyệt quán ăn
    RESTAURANT_BY_VENDOR_ID: (vendorId: string) => `/vendors/${vendorId}/restaurants`, // Lấy quán ăn theo vendorId

    // Dish Management - Quản lý và kiểm duyệt món ăn
    DISHES_LIST: '/admin/dishes', // Danh sách món ăn (có filter theo status, search)
    DISH_DETAIL: (id: string) => `/admin/dishes/${id}`, // Chi tiết món ăn
    DISH_APPROVE: (id: string) => `/admin/dishes/${id}/approve`, // Duyệt món ăn
    DISH_REJECT: (id: string) => `/admin/dishes/${id}/reject`, // Từ chối món ăn
    DISHES_BULK_APPROVE: '/admin/dishes/bulk-approve', // Duyệt nhiều món ăn cùng lúc -> note
    DISH_APPROVAL: (id: string) => `/admin/dishes/${id}/approval`, // Approve or reject dish
    DISHES_REJECTED: '/admin/dishes/rejected', // Get all rejected dishes
    DISHES_PENDING: '/admin/dishes/pending', // Get all pending dishes
    RESTAURANT_VENDOR_DISHES: (restaurantId: string) => `/restaurants/${restaurantId}/vendor-dishes`, // Get all dishes of a restaurant for vendor 

    // Review Moderation - Kiểm duyệt đánh giá
    REVIEWS_LIST: '/reports/admin', // Danh sách đánh giá (có filter theo status)
    REVIEW_DETAIL: (id: string) => `/admin/reviews/${id}`, // Chi tiết đánh giá
    REVIEW_APPROVE: (id: string) => `/admin/reviews/${id}/approve`, // Duyệt đánh giá
    REVIEW_REJECT: (id: string) => `/admin/reviews/${id}/reject`, // Từ chối đánh giá

    // Report Handling - Xử lý báo cáo vi phạm
    REPORTS_LIST: '/admin/reports', // Danh sách báo cáo (bao gồm lý do, status, timestamps)
    REPORTS_STATISTICS: '/admin/reports/statistics', // Thống kê báo cáo
    REPORT_UPDATE_STATUS: (reportId: string) => `/admin/reports/${reportId}/status`, // Cập nhật trạng thái báo cáo
    REPORT_CREATE: '/reports', // Tạo báo cáo mới


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

    // Permission Management - Quản trị phân quyền
    PERMISSIONS_LIST: '/admin/permissions/roles', // Get all roles (basic info)
    ROLES_WITH_PERMISSIONS: '/admin/permissions/roles-with-permissions', // Get all roles with their permissions (detailed)
    PERMISSIONS_UPDATE: '/admin/permissions/roles/permissions', // Update roles permissions
    ROLES_LIST: '/admin/permissions/roles', // Get all roles
    PERMISSIONS_FOR_ROLE: (roleId: string) => `/admin/permissions/roles/${roleId}/permissions`, // Get permissions for a specific role
    ACTIONS_LIST: '/admin/permissions/actions', // Get all available actions

    REVIEW: {
      CREATE: '/reviews',
      UPDATE: (id: string) => `/reviews/${id}`,
      DELETE: (id: string) => `/reviews/${id}`,
    },
  },
  REVIEW: {
    BY_RATING_RANGE: '/reviews/rating-range',
    DETAIL: (id: string) => `/reviews/${id}`,
    DELETE: (id: string) => `/reviews/${id}`,
  },
  VENDOR: {
    // Overview - Tổng quan vendor
    OVERVIEW: '/profile/vendor/overview', // Lấy thông tin tổng quan vendor

    // Restaurant Management - Quản lý quán ăn của vendor
    RESTAURANTS_LIST: (vendorId: string) => `/vendors/${vendorId}/restaurants`, // Lấy danh sách quán ăn của vendor
    RESTAURANT_CREATE: '/restaurants', // Tạo quán ăn mới
    RESTAURANT_UPDATE: (restaurantId: string) => `/restaurants/${restaurantId}`, // Cập nhật quán ăn
    RESTAURANT_DELETE: (restaurantId: string) => `/restaurants/${restaurantId}`, // Xóa quán ăn
    RESTAURANT_TAGS: (restaurantId: string) => `/tags/restaurant/${restaurantId}`, // Lấy tags của quán ăn

    // Dish Management - Quản lý món ăn của vendor
    RESTAURANT_VENDOR_DISHES: (restaurantId: string) => `/restaurants/${restaurantId}/vendor-dishes`, // Get all dishes (including pending/rejected)
    RESTAURANT_DISHES: (restaurantId: string) => `/restaurants/${restaurantId}/dishes`, // Get approved dishes only
  },
  LICENSE: {
    CREATE: '/licenses', // Tạo giấy phép mới
    UPDATE: (licenseId: string) => `/licenses/${licenseId}`, // Cập nhật giấy phép
    DELETE: (licenseId: string) => `/licenses/${licenseId}`, // Xóa giấy phép
    MY_LICENSES: '/licenses/me', // Lấy danh sách giấy phép của vendor
    ADMIN_LIST: '/admin/licenses', // Lấy danh sách giấy phép (admin)
    ADMIN_UPDATE_STATUS: (licenseId: string) => `/admin/licenses/${licenseId}/status`, // Cập nhật trạng thái giấy phép (approve/reject)
  },
};