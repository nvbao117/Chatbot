import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"
import { mockAchievementService } from "./mockAchievementService"
import { APP_CONFIG } from "../config/app.config"

// Use mock service in development, real API in production
const isDevelopment = APP_CONFIG.environment === 'development'

export const achievementService = {
  getAll: () => 
    isDevelopment 
      ? mockAchievementService.getAll()
      : api.get(API_ENDPOINTS.ACHIEVEMENTS.LIST),

  unlock: (achievementId) => 
    isDevelopment 
      ? mockAchievementService.unlock(achievementId)
      : api.post(API_ENDPOINTS.ACHIEVEMENTS.UNLOCK, { achievementId }),
}
