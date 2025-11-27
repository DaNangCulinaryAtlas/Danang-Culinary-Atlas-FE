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
    USERS_LIST: '/admin/users', // Danh sách tất cả users (có filter, search, pagination)
    USER_DETAIL: (id: string) => `/admin/users/${id}`, // Chi tiết user theo ID
    USER_UPDATE: (id: string) => `/admin/users/${id}`, // Cập nhật thông tin user
    USER_BAN: (id: string) => `/admin/users/${id}/ban`, // Khóa tài khoản user
    USER_UNBAN: (id: string) => `/admin/users/${id}/unban`, // Mở khóa tài khoản user
    USER_CHANGE_ROLE: (id: string) => `/admin/users/${id}/role`, // Thay đổi vai trò (phân quyền)

    // Restaurant Management - Quản lý và kiểm duyệt quán ăn
    RESTAURANTS_PENDING: '/admin/restaurants/pending', // Danh sách quán ăn chờ duyệt
    RESTAURANTS_ACTIVE: '/admin/restaurants/active', // Danh sách quán ăn đang hoạt động
    RESTAURANT_DETAIL: (id: string) => `/admin/restaurants/${id}`, // Chi tiết quán ăn (bao gồm business license)
    RESTAURANT_APPROVE: (id: string) => `/admin/restaurants/${id}/approve`, // Duyệt quán ăn
    RESTAURANT_REJECT: (id: string) => `/admin/restaurants/${id}/reject`, // Từ chối quán ăn (có lý do)
    RESTAURANT_UPDATE: (id: string) => `/admin/restaurants/${id}`, // Cập nhật thông tin quán ăn

    // Dish Management - Quản lý và kiểm duyệt món ăn
    DISHES_LIST: '/admin/dishes', // Danh sách món ăn (có filter theo status, search)
    DISH_DETAIL: (id: string) => `/admin/dishes/${id}`, // Chi tiết món ăn
    DISH_APPROVE: (id: string) => `/admin/dishes/${id}/approve`, // Duyệt món ăn
    DISH_REJECT: (id: string) => `/admin/dishes/${id}/reject`, // Từ chối món ăn
    DISHES_BULK_APPROVE: '/admin/dishes/bulk-approve', // Duyệt nhiều món ăn cùng lúc -> note 

    // Review Moderation - Kiểm duyệt đánh giá
    REVIEWS_LIST: '/admin/reviews', // Danh sách đánh giá (có filter theo status)
    REVIEW_DETAIL: (id: string) => `/admin/reviews/${id}`, // Chi tiết đánh giá
    REVIEW_APPROVE: (id: string) => `/admin/reviews/${id}/approve`, // Duyệt đánh giá
    REVIEW_REJECT: (id: string) => `/admin/reviews/${id}/reject`, // Từ chối đánh giá

    // Report Handling - Xử lý báo cáo vi phạm
    REPORTS_LIST: '/admin/reports', // Danh sách báo cáo (có filter theo status, priority)
    REPORT_DETAIL: (id: string) => `/admin/reports/${id}`, // Chi tiết báo cáo
    REPORT_DISMISS: (id: string) => `/admin/reports/${id}/dismiss`, // Bỏ qua báo cáo (giữ nguyên nội dung)
    REPORT_DELETE_CONTENT: (id: string) => `/admin/reports/${id}/delete-content`, // Xóa nội dung bị báo cáo
    REPORT_BAN_USER: (id: string) => `/admin/reports/${id}/ban-user`, // Khóa tài khoản người dùng vi phạm

    // System Settings - Cài đặt hệ thống
    // Location Management - Quản lý địa chính
    PROVINCES_LIST: '/admin/settings/provinces', // Danh sách tỉnh/thành phố
    PROVINCE_CREATE: '/admin/settings/provinces', // Tạo tỉnh/thành phố mới
    PROVINCE_UPDATE: (id: string) => `/admin/settings/provinces/${id}`, // Cập nhật tỉnh/thành phố
    PROVINCE_DELETE: (id: string) => `/admin/settings/provinces/${id}`, // Xóa tỉnh/thành phố

    DISTRICTS_LIST: '/admin/settings/districts', // Danh sách quận/huyện
    DISTRICTS_BY_PROVINCE: (provinceId: string) => `/admin/settings/districts/province/${provinceId}`, // Quận/huyện theo tỉnh
    DISTRICT_CREATE: '/admin/settings/districts', // Tạo quận/huyện mới
    DISTRICT_UPDATE: (id: string) => `/admin/settings/districts/${id}`, // Cập nhật quận/huyện
    DISTRICT_DELETE: (id: string) => `/admin/settings/districts/${id}`, // Xóa quận/huyện

    WARDS_LIST: '/admin/settings/wards', // Danh sách phường/xã
    WARDS_BY_DISTRICT: (districtId: string) => `/admin/settings/wards/district/${districtId}`, // Phường/xã theo quận
    WARD_CREATE: '/admin/settings/wards', // Tạo phường/xã mới
    WARD_UPDATE: (id: string) => `/admin/settings/wards/${id}`, // Cập nhật phường/xã
    WARD_DELETE: (id: string) => `/admin/settings/wards/${id}`, // Xóa phường/xã

    // Tag Management - Quản lý nhãn
    RESTAURANT_TAGS_LIST: '/admin/settings/restaurant-tags', // Danh sách RestaurantTag
    RESTAURANT_TAG_CREATE: '/admin/settings/restaurant-tags', // Tạo RestaurantTag mới
    RESTAURANT_TAG_UPDATE: (id: string) => `/admin/settings/restaurant-tags/${id}`, // Cập nhật RestaurantTag
    RESTAURANT_TAG_DELETE: (id: string) => `/admin/settings/restaurant-tags/${id}`, // Xóa RestaurantTag

    DISH_TAGS_LIST: '/admin/settings/dish-tags', // Danh sách DishTag
    DISH_TAG_CREATE: '/admin/settings/dish-tags', // Tạo DishTag mới
    DISH_TAG_UPDATE: (id: string) => `/admin/settings/dish-tags/${id}`, // Cập nhật DishTag
    DISH_TAG_DELETE: (id: string) => `/admin/settings/dish-tags/${id}`, // Xóa DishTag

    // Notifications - Thông báo hệ thống
    NOTIFICATIONS_LIST: '/admin/notifications', // Danh sách thông báo (quán chờ duyệt, báo cáo mới)
    NOTIFICATION_READ: (id: string) => `/admin/notifications/${id}/read`, // Đánh dấu đã đọc
    NOTIFICATIONS_MARK_ALL_READ: '/admin/notifications/read-all', // Đánh dấu tất cả đã đọc

    // Permission Management - Quản trị phân quyền - dùng BASE_URL_2
    PERMISSIONS_LIST: '/admin/permissions/roles/permissions', // Get all roles with their permissions
    PERMISSIONS_UPDATE: '/admin/permissions/roles/permissions', // Update roles permissions
    ROLES_LIST: '/admin/permissions/roles', // Get all roles
    PERMISSIONS_FOR_ROLE: (roleId: string) => `/admin/permissions/roles/${roleId}/permissions`, // Get permissions for a specific role
    ACTIONS_LIST: '/admin/permissions/actions', // Get all available actions
  },
} as const;