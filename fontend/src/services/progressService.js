import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"
import { mockProgressService } from "./mockProgressService"
import { APP_CONFIG } from "../config/app.config"

// Use mock service in development, real API in production
const isDevelopment = APP_CONFIG.environment === 'development'

export const progressService = {
  getOverview: () => 
    isDevelopment 
      ? mockProgressService.getOverview()
      : api.get(API_ENDPOINTS.PROGRESS.OVERVIEW),

  getSubjectProgress: (subjectId) => 
    isDevelopment 
      ? mockProgressService.getSubjectProgress(subjectId)
      : api.get(API_ENDPOINTS.PROGRESS.SUBJECT(subjectId)),

  getTopicProgress: (topicId) => 
    isDevelopment 
      ? mockProgressService.getTopicProgress(topicId)
      : api.get(API_ENDPOINTS.PROGRESS.TOPIC(topicId)),
}
