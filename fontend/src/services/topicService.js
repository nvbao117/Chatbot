import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"

export const topicService = {
  getAll: (params) => api.get(API_ENDPOINTS.TOPICS.LIST, { params }),

  getById: (id) => api.get(API_ENDPOINTS.TOPICS.DETAIL(id)),

  getContent: (id) => api.get(API_ENDPOINTS.TOPICS.CONTENT(id)),
}
