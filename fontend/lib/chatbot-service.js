export const chatbotService = {
  async sendMessage(message, conversationId) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationId,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || "Failed to send message")
      }

      const data = await response.json()
      return {
        message: data.reply || data.message,
        conversationId: data.conversationId,
      }
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  },

  async getConversationHistory(conversationId) {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch conversation")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching conversation:", error)
      throw error
    }
  },

  async getAllConversations() {
    try {
      const response = await fetch("/api/chat/conversations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch conversations")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching conversations:", error)
      throw error
    }
  },

  async deleteConversation(conversationId) {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete conversation")
      }

      return await response.json()
    } catch (error) {
      console.error("Error deleting conversation:", error)
      throw error
    }
  },
}
