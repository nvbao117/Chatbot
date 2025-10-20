import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"

export const quizService = {
  getAll: (params) => api.get(API_ENDPOINTS.QUIZ.LIST, { params }),

  getById: (id) => api.get(API_ENDPOINTS.QUIZ.DETAIL(id)),

  startQuiz: (id) => api.post(API_ENDPOINTS.QUIZ.START(id)),

  submitQuiz: (id, answers) => api.post(API_ENDPOINTS.QUIZ.SUBMIT(id), { answers }),

  getHistory: (params) => api.get(API_ENDPOINTS.QUIZ.HISTORY, { params }),
}
