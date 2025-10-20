import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  error: null,
  isTyping: false,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startNewConversation: (state, action) => {
      const conversationId = Date.now().toString()
      state.currentConversationId = conversationId
      state.messages = []
      state.conversations.push({
        id: conversationId,
        title: action.payload?.title || "New Conversation",
        createdAt: new Date().toISOString(),
        messageCount: 0,
      })
    },

    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        content: action.payload.content,
        sender: action.payload.sender,
        timestamp: new Date().toISOString(),
        type: action.payload.type || "text",
      })
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
  },
})

export const {
  startNewConversation,
  addMessage,
  setIsTyping,
  setIsLoading,
  setError,
  loadConversation,
  clearConversation,
  deleteConversation,
} = chatSlice.actions

export default chatSlice.reducer
