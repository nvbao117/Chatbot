import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import {
  addMessage,
  setIsTyping,
  setIsLoading,
  setError,
  startNewConversation,
  loadConversation,
  deleteConversation as deleteConvAction,
  loadMessagesFromStorage,
  initializeFromStorage,
  syncConversationId,
} from "../store/slices/chatSlice"
import { chatbotService } from "../services/chatbotService"

const normalizeMessage = (message) => ({
  id: message.id || `${Date.now()}-${Math.random()}`,
  content: message.content || message.message || message.text || "",
  sender: message.sender || (message.role === "assistant" ? "bot" : "user"),
  timestamp: message.timestamp || new Date().toISOString(),
  type: message.type || "text",
})

export const useChatbot = () => {
  const dispatch = useDispatch()
  const { messages, isLoading, isTyping, error, currentConversationId, conversations } = useSelector(
    (state) => state.chat,
  )

  const sendMessage = useCallback(
    async (userMessage) => {
      const trimmedMessage = userMessage.trim()
      if (!trimmedMessage) return

      const provisionalConversationId = currentConversationId || Date.now().toString()

      if (!currentConversationId) {
        dispatch(startNewConversation({ id: provisionalConversationId, title: "New Chat" }))
      }

      dispatch(
        addMessage({
          content: trimmedMessage,
          sender: "user",
          type: "text",
        }),
      )

      dispatch(setIsTyping(true))
      dispatch(setError(null))

      try {
        const response = await chatbotService.sendMessage(trimmedMessage, provisionalConversationId)

        dispatch(
          addMessage({
            content:
              response?.message?.trim()?.length
                ? response.message
                : "I couldn't generate a response. Please try again.",
            sender: "bot",
            type: "text",
          }),
        )

        if (response?.conversationId) {
          dispatch(
            syncConversationId({
              conversationId: response.conversationId,
              previousId:
                response.conversationId !== provisionalConversationId ? provisionalConversationId : undefined,
            }),
          )
        } else if (!currentConversationId) {
          dispatch(syncConversationId({ conversationId: provisionalConversationId }))
        }
      } catch (err) {
        const errorMessage = err?.message || "Failed to send message. Please try again."
        dispatch(setError(errorMessage))
        dispatch(
          addMessage({
            content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
            sender: "bot",
            type: "text",
          }),
        )
      } finally {
        dispatch(setIsTyping(false))
      }
    },
    [dispatch, currentConversationId],
  )

  const startChat = useCallback(
    (options = {}) => {
      const conversationId = options.id || Date.now().toString()
      dispatch(
        startNewConversation({
          id: conversationId,
          title: options.title || "New Chat",
          messages: options.messages || [],
        }),
      )
      return conversationId
    },
    [dispatch],
  )

  const loadChat = useCallback(
    async (conversationId) => {
      if (!conversationId) return

      try {
        dispatch(setIsLoading(true))
        dispatch(setError(null))

        const history = await chatbotService.getHistory(conversationId)
        const normalized = (history?.messages || []).map(normalizeMessage)
        const resolvedConversationId = history?.conversationId || conversationId

        dispatch(
          loadConversation({
            id: resolvedConversationId,
            messages: normalized,
          }),
        )

        dispatch(
          syncConversationId({
            conversationId: resolvedConversationId,
          }),
        )
      } catch (err) {
        dispatch(setError(err?.message || "Failed to load conversation"))
      } finally {
        dispatch(setIsLoading(false))
      }
    },
    [dispatch],
  )

  const deleteChat = useCallback(
    async (conversationId) => {
      try {
        if (conversationId) {
          await chatbotService.clearHistory(conversationId)
        }
        dispatch(deleteConvAction(conversationId))
      } catch (err) {
        dispatch(setError(err?.message || "Failed to delete conversation"))
      }
    },
    [dispatch],
  )

  const loadMessagesFromLocalStorage = useCallback(
    (storedMessages) => {
      const normalized = (storedMessages || []).map(normalizeMessage)
      dispatch(loadMessagesFromStorage(normalized))
    },
    [dispatch],
  )

  const initializeFromLocalStorage = useCallback(
    (data) => {
      if (!data) return
      const messagesFromStorage = (data.messages || []).map(normalizeMessage)
      dispatch(
        initializeFromStorage({
          conversations: data.conversations || [],
          messages: messagesFromStorage,
          currentId: data.currentId || null,
        }),
      )
      if (data.currentId) {
        dispatch(syncConversationId({ conversationId: data.currentId }))
      }
    },
    [dispatch],
  )

  return {
    messages,
    isLoading,
    isTyping,
    error,
    currentConversationId,
    conversations,
    sendMessage,
    startChat,
    loadChat,
    deleteChat,
    loadMessagesFromLocalStorage,
    initializeFromLocalStorage,
  }
}
