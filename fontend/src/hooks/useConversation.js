"use client"

import { useCallback } from "react"
import { conversationService } from "../services/conversationService"

export const useConversation = () => {
  const getAllConversations = useCallback(async () => {
    try {
      const response = await conversationService.getAllConversations()
      return response
    } catch (err) {
      console.error("Error fetching conversations:", err)
      throw err
    }
  }, [])

  const getConversation = useCallback(async (id) => {
    try {
      const response = await conversationService.getConversation(id)
      return response
    } catch (err) {
      console.error("Error fetching conversation:", err)
      throw err
    }
  }, [])

  const createConversation = useCallback(async (data) => {
    try {
      const response = await conversationService.createConversation(data)
      return response
    } catch (err) {
      console.error("Error creating conversation:", err)
      throw err
    }
  }, [])

  const updateConversation = useCallback(async (id, data) => {
    try {
      const response = await conversationService.updateConversation(id, data)
      return response
    } catch (err) {
      console.error("Error updating conversation:", err)
      throw err
    }
  }, [])

  const deleteConversation = useCallback(async (id) => {
    try {
      const response = await conversationService.deleteConversation(id)
      return response
    } catch (err) {
      console.error("Error deleting conversation:", err)
      throw err
    }
  }, [])

  return {
    getAllConversations,
    getConversation,
    createConversation,
    updateConversation,
    deleteConversation,
  }
}
