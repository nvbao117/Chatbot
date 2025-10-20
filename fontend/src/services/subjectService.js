import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"
import { mockSubjectService } from "./mockSubjectService"
import { APP_CONFIG } from "../config/app.config"

// Use mock service in development, real API in production
const isDevelopment = APP_CONFIG.environment === 'development'

export const subjectService = {
  getAll: (params) => 
    isDevelopment 
      ? mockSubjectService.getAll(params)
      : api.get(API_ENDPOINTS.SUBJECTS.LIST, { params }),

  getById: (id) => 
    isDevelopment 
      ? mockSubjectService.getById(id)
      : api.get(API_ENDPOINTS.SUBJECTS.DETAIL(id)),

  getTopics: (subjectId, params) => 
    isDevelopment 
      ? mockSubjectService.getTopics(subjectId, params)
      : api.get(API_ENDPOINTS.SUBJECTS.TOPICS(subjectId), { params }),
}
