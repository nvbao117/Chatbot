import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  error: null,
  isTyping: false,
}

const updateActiveConversationStats = (state, timestamp) => {
  if (!state.currentConversationId) return
  const conversation = state.conversations.find((conv) => conv.id === state.currentConversationId)
  if (!conversation) return

  conversation.messageCount = state.messages.length
  conversation.updatedAt = timestamp || new Date().toISOString()
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startNewConversation: (state, action) => {
      const conversationId = action.payload?.id || Date.now().toString()
      const title = action.payload?.title || "New Conversation"
      const initialMessages = action.payload?.messages || []
      const now = new Date().toISOString()

      state.currentConversationId = conversationId
      state.messages = initialMessages

      const existingConversation = state.conversations.find((conv) => conv.id === conversationId)

      if (existingConversation) {
        existingConversation.title = title
        existingConversation.messageCount = initialMessages.length
        existingConversation.updatedAt = now
      } else {
        state.conversations.push({
          id: conversationId,
          title,
          createdAt: action.payload?.createdAt || now,
          updatedAt: now,
          messageCount: initialMessages.length,
        })
      }
    },

    syncConversationId: (state, action) => {
      const { conversationId, previousId, title } = action.payload || {}
      if (!conversationId) return

      let conversation = null

      if (previousId) {
        conversation = state.conversations.find((conv) => conv.id === previousId)
        if (conversation) {
          conversation.id = conversationId
        }
      }

      if (!conversation) {
        conversation = state.conversations.find((conv) => conv.id === conversationId)
      }

      if (!conversation) {
        conversation = {
          id: conversationId,
          title: title || "New Conversation",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messageCount: state.messages.length,
        }
        state.conversations.push(conversation)
      }

      if (title) {
        conversation.title = title
      }

      state.currentConversationId = conversationId
      conversation.messageCount = state.messages.length
      conversation.updatedAt = new Date().toISOString()
    },

    addMessage: (state, action) => {
      const newMessage = {
        id: Date.now().toString(),
        content: action.payload.content,
        sender: action.payload.sender,
        timestamp: new Date().toISOString(),
        type: action.payload.type || "text",
      }
      state.messages.push(newMessage)
      updateActiveConversationStats(state, newMessage.timestamp)

      try {
        const messagesForStorage = state.messages.map((msg) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp,
        }))
        localStorage.setItem("chatHistory", JSON.stringify(messagesForStorage))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    },

    setIsTyping: (state, action) => {
      state.isTyping = action.payload
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },

    setError: (state, action) => {
      state.error = action.payload
    },

    loadConversation: (state, action) => {
      state.currentConversationId = action.payload.id
      state.messages = action.payload.messages || []
      updateActiveConversationStats(state)
    },

    clearConversation: (state) => {
      state.messages = []
      state.currentConversationId = null
      state.error = null
    },

    deleteConversation: (state, action) => {
      state.conversations = state.conversations.filter((conv) => conv.id !== action.payload)
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = null
        state.messages = []
      }
    },

    loadMessagesFromStorage: (state, action) => {
      state.messages = action.payload.map((msg) => ({
        id: msg.id || `${Date.now().toString()}-${Math.random()}`,
        content: msg.text || msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp || new Date().toISOString(),
        type: "text",
      }))
      updateActiveConversationStats(state)
    },

    initializeFromStorage: (state, action) => {
      const { conversations, messages, currentId } = action.payload
      state.conversations = conversations || []
      state.messages = messages || []
      state.currentConversationId = currentId || null
    },
  },
})

export const {
  startNewConversation,
  syncConversationId,
  addMessage,
  setIsTyping,
  setIsLoading,
  setError,
  loadConversation,
  clearConversation,
  deleteConversation,
  loadMessagesFromStorage,
  initializeFromStorage,
} = chatSlice.actions

export default chatSlice.reducer
