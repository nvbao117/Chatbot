// This service handles communication with the AI backend

import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"
import { mockChatbotService } from "./mockChatbotService"
import { APP_CONFIG } from "../config/app.config"

const isDevelopment = APP_CONFIG.environment === 'development'

export const chatbotService = {
  sendMessage: (message, conversationId) =>
    isDevelopment
      ? mockChatbotService.sendMessage(message, conversationId)
      : api.post(API_ENDPOINTS.CHATBOT.SEND, {
          message,
          conversationId,
          timestamp: new Date().toISOString(),
        }),

  getHistory: (conversationId) =>
    isDevelopment
      ? mockChatbotService.getHistory(conversationId)
      : api.get(`${API_ENDPOINTS.CHATBOT.HISTORY}/${conversationId}`),

  clearHistory: (conversationId) =>
    isDevelopment
      ? mockChatbotService.clearHistory(conversationId)
      : api.post(`${API_ENDPOINTS.CHATBOT.CLEAR}/${conversationId}`),
}
