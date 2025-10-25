// Service responsible for talking to the chatbot backend

import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"
import { mockChatbotService } from "./mockChatbotService"
import { APP_CONFIG } from "../config/app.config"

const shouldUseMock = APP_CONFIG.useMockChatbot

const normalizeSendResponse = (response, fallbackConversationId) => ({
  conversationId: response?.conversationId ?? fallbackConversationId ?? null,
  message: response?.message ?? response?.reply ?? "",
  raw: response,
})

const normalizeHistoryResponse = (response, conversationId) => {
  const messages = Array.isArray(response?.messages)
    ? response.messages
    : Array.isArray(response)
      ? response
      : response?.data || []

  return {
    conversationId: response?.conversationId ?? conversationId ?? null,
    messages,
  }
}

export const chatbotService = {
  sendMessage: async (message, conversationId) => {
    if (shouldUseMock) {
      return mockChatbotService.sendMessage(message, conversationId)
    }

    const payload = {
      message,
      timestamp: new Date().toISOString(),
    }

    if (conversationId) {
      payload.conversationId = conversationId
    }

    const response = await api.post(API_ENDPOINTS.CHATBOT.SEND, payload)
    return normalizeSendResponse(response, conversationId)
  },

  getHistory: async (conversationId) => {
    if (shouldUseMock) {
      return mockChatbotService.getHistory(conversationId)
    }

    if (!conversationId) {
      return { conversationId: null, messages: [] }
    }

    const response = await api.get(`${API_ENDPOINTS.CHATBOT.HISTORY}/${conversationId}`)
    return normalizeHistoryResponse(response, conversationId)
  },

  clearHistory: async (conversationId) => {
    if (shouldUseMock) {
      return mockChatbotService.clearHistory(conversationId)
    }

    if (!conversationId) {
      return { success: true }
    }

    return api.post(`${API_ENDPOINTS.CHATBOT.CLEAR}/${conversationId}`)
  },
}
