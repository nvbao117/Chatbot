"use client"

import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import {
  fetchTopicsStart,
  fetchTopicsSuccess,
  fetchTopicsFailure,
  selectTopic,
  setTopicContent,
  clearSelectedTopic,
} from "../store/slices/topicSlice"
import { topicService } from "../services/topicService"

export const useTopics = () => {
  const dispatch = useDispatch()
  const { topics, selectedTopic, topicContent, loading, error } = useSelector((state) => state.topic)

  const fetchTopics = useCallback(
    async (params) => {
      dispatch(fetchTopicsStart())
      try {
        const response = await topicService.getAll(params)
        dispatch(fetchTopicsSuccess(response))
        return response
      } catch (err) {
        dispatch(fetchTopicsFailure(err.message))
        throw err
      }
    },
    [dispatch],
  )

  const getTopicById = useCallback(
    async (id) => {
      try {
        const response = await topicService.getById(id)
        dispatch(selectTopic(response))
        return response
      } catch (err) {
        console.error("Error fetching topic:", err)
        throw err
      }
    },
    [dispatch],
  )

  const getTopicContent = useCallback(
    async (id) => {
      try {
        const response = await topicService.getContent(id)
        dispatch(setTopicContent(response))
        return response
      } catch (err) {
        console.error("Error fetching topic content:", err)
        throw err
      }
    },
    [dispatch],
  )

  const handleSelectTopic = useCallback(
    (topic) => {
      dispatch(selectTopic(topic))
    },
    [dispatch],
  )

  const handleClearSelection = useCallback(() => {
    dispatch(clearSelectedTopic())
  }, [dispatch])

  return {
    topics,
    selectedTopic,
    topicContent,
    loading,
    error,
    fetchTopics,
    getTopicById,
    getTopicContent,
    selectTopic: handleSelectTopic,
    clearSelection: handleClearSelection,
  }
}
