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

// Sử dụng mock service trong development, real API trong production

export const authService = {
  // API đăng nhập - xác thực email và password
  login: async (identifier, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { identifier, password })
      return {
        user: response.user,
        token: response.access_token,
        expiresIn: response.expires_in,
      }
    } catch (error) {
      const message = error?.detail || error?.message || "Login failed"
      throw new Error(message)
    }
  },
  // API đăng ký - tạo tài khoản mới
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData)
      return {
        user: response,
        token: null,
      }
    } catch (error) {
      const message = error?.detail || error?.message || "Register failed"
      throw new Error(message)
    }
  },

  // API đăng xuất - xóa session
  logout: () =>api.post(API_ENDPOINTS.AUTH.LOGOUT),

  // API refresh token - làm mới access token
  refreshToken: () =>api.post(API_ENDPOINTS.AUTH.REFRESH),

  // API verify token - kiểm tra token có hợp lệ không
  verifyToken: () =>api.get(API_ENDPOINTS.AUTH.VERIFY),
}
