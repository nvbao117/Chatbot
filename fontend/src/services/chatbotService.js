// Service responsible for talking to the chatbot backend

import api from "./api"
import { API_ENDPOINTS } from "../config/api.config"
import { mockChatbotService } from "./mockChatbotService"
import { APP_CONFIG } from "../config/app.config"
import { storage } from "../utils/storage"
import { STORAGE_KEYS } from "../utils/constants"

const shouldUseMock = APP_CONFIG.useMockChatbot

const normalizeSendResponse = (response, fallbackConversationId) => {
  // Backend returns: { conversationid, messages: [{ sender, content, ... }], totaltokensused }
  const conversationId = response?.conversationid ?? response?.conversationId ?? fallbackConversationId ?? null
  let message = ""
  if (Array.isArray(response?.messages)) {
    const assistantMsgs = response.messages.filter((m) => m?.sender === "assistant")
    const last = (assistantMsgs.length ? assistantMsgs : response.messages).slice(-1)[0]
    message = last?.content ?? ""
  } else {
    message = response?.message ?? response?.reply ?? ""
  }
  return { conversationId, message, raw: response }
}

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

    const user = storage.get(STORAGE_KEYS.USER_DATA)
    // Only send conversationid if it's a valid UUID; otherwise let backend create one
    const isUuid = typeof conversationId === "string" && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(conversationId)
    const payload = {
      message,
      conversationid: isUuid ? conversationId : null,
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
