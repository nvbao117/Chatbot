/**
 * Service Xác Thực
 * 
 * Service này xử lý tất cả các API liên quan đến xác thực:
 * - Đăng nhập (login)
 * - Đăng ký (register) 
 * - Đăng xuất (logout)
 * - Refresh token
 * - Verify token
 * 
 * Trong development sử dụng mock data, production sử dụng real API
 */

import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"
import { mockAuthService } from "./mockAuthService"
import { APP_CONFIG } from "../config/app.config"

// Sử dụng mock service trong development, real API trong production
const isDevelopment = APP_CONFIG.environment === 'development'

export const authService = {
  // API đăng nhập - xác thực email và password
  login: (email, password) => 
    isDevelopment 
      ? mockAuthService.login(email, password)
      : api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password }),

  // API đăng ký - tạo tài khoản mới
  register: (userData) => 
    isDevelopment 
      ? mockAuthService.register(userData)
      : api.post(API_ENDPOINTS.AUTH.REGISTER, userData),

  // API đăng xuất - xóa session
  logout: () => 
    isDevelopment 
      ? mockAuthService.logout()
      : api.post(API_ENDPOINTS.AUTH.LOGOUT),

  // API refresh token - làm mới access token
  refreshToken: () => 
    isDevelopment 
      ? mockAuthService.refreshToken()
      : api.post(API_ENDPOINTS.AUTH.REFRESH),

  // API verify token - kiểm tra token có hợp lệ không
  verifyToken: () => 
    isDevelopment 
      ? mockAuthService.verifyToken()
      : api.get(API_ENDPOINTS.AUTH.VERIFY),
}
