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
      const newMessage = {
        id: Date.now().toString(),
        content: action.payload.content,
        sender: action.payload.sender, // 'user' or 'bot'
        timestamp: new Date().toISOString(),
        type: action.payload.type || "text", // 'text', 'suggestion', 'code'
      }
      state.messages.push(newMessage)
      
      // Sync with localStorage for ChatPage compatibility
      try {
        const messagesForStorage = state.messages.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp
        }))
        localStorage.setItem('chatHistory', JSON.stringify(messagesForStorage))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
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
      state.messages = action.payload.map(msg => ({
        id: msg.id || Date.now().toString() + Math.random(),
        content: msg.text || msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp || new Date().toISOString(),
        type: "text"
      }))
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
