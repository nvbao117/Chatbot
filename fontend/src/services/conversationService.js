import api from "./api"

export const conversationService = {
  getAllConversations: () => api.get("/conversations"),

  getConversation: (id) => api.get(`/conversations/${id}`),

  createConversation: (data) => api.post("/conversations", data),

  updateConversation: (id, data) => api.put(`/conversations/${id}`, data),

  deleteConversation: (id) => api.delete(`/conversations/${id}`),
}
