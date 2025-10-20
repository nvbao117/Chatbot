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
} from "../store/slices/chatSlice"
import { chatbotService } from "../services/chatbotService"

export const useChatbot = () => {
  const dispatch = useDispatch()
  const { messages, isLoading, isTyping, error, currentConversationId, conversations } = useSelector(
    (state) => state.chat,
  )

  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim()) return

      try {
        dispatch(
          addMessage({
            content: userMessage,
            sender: "user",
            type: "text",
          }),
        )

        dispatch(setIsTyping(true))
        dispatch(setError(null))

        const response = await chatbotService.sendMessage(userMessage, currentConversationId)

        dispatch(
          addMessage({
            content: response.message || "I couldn't generate a response. Please try again.",
            sender: "bot",
            type: "text",
          }),
        )
      } catch (err) {
        const errorMessage = err.message || "Failed to send message. Please try again."
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

  const startChat = useCallback(() => {
    dispatch(startNewConversation({ title: "New Chat" }))
  }, [dispatch])

  const loadChat = useCallback(
    async (conversationId) => {
      try {
        dispatch(setIsLoading(true))
        dispatch(loadConversation({ id: conversationId, messages: [] }))
      } catch (err) {
        dispatch(setError(err.message || "Failed to load conversation"))
      } finally {
        dispatch(setIsLoading(false))
      }
    },
    [dispatch],
  )

  const deleteChat = useCallback(
    async (conversationId) => {
      try {
        dispatch(deleteConvAction(conversationId))
      } catch (err) {
        dispatch(setError(err.message || "Failed to delete conversation"))
      }
    },
    [dispatch],
  )

  const loadMessagesFromLocalStorage = useCallback(
    (messages) => {
      dispatch(loadMessagesFromStorage(messages))
    },
    [dispatch],
  )

  const initializeFromLocalStorage = useCallback(
    (data) => {
      dispatch(initializeFromStorage(data))
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
