import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"
import { mockUserService } from "./mockUserService"
import { APP_CONFIG } from "../config/app.config"

// Use mock service in development, real API in production
const isDevelopment = APP_CONFIG.environment === 'development'

export const userService = {
  getProfile: () => 
    isDevelopment 
      ? mockUserService.getProfile()
      : api.get(API_ENDPOINTS.USERS.PROFILE),

  updateProfile: (userData) => 
    isDevelopment 
      ? mockUserService.updateProfile(userData)
      : api.put(API_ENDPOINTS.USERS.UPDATE, userData),

  getStats: () => 
    isDevelopment 
      ? mockUserService.getStats()
      : api.get(API_ENDPOINTS.USERS.STATS),
}
