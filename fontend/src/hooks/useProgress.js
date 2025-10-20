"use client"

import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import {
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  updateSubjectProgress,
  updateTopicProgress,
} from "../store/slices/progressSlice"
import { progressService } from "../services/progressService"

export const useProgress = () => {
  const dispatch = useDispatch()
  const { overview, subjectProgress, topicProgress, loading, error } = useSelector((state) => state.progress)

  const fetchProgress = useCallback(async () => {
    dispatch(fetchProgressStart())
    try {
      const response = await progressService.getOverview()
      dispatch(fetchProgressSuccess(response))
      return response
    } catch (err) {
      dispatch(fetchProgressFailure(err.message))
      throw err
    }
  }, [dispatch])

  const getSubjectProgress = useCallback(
    async (subjectId) => {
      try {
        const response = await progressService.getSubjectProgress(subjectId)
        dispatch(updateSubjectProgress({ subjectId, progress: response }))
        return response
      } catch (err) {
        console.error("Error fetching subject progress:", err)
        throw err
      }
    },
    [dispatch],
  )

  const getTopicProgress = useCallback(
    async (topicId) => {
      try {
        const response = await progressService.getTopicProgress(topicId)
        dispatch(updateTopicProgress({ topicId, progress: response }))
        return response
      } catch (err) {
        console.error("Error fetching topic progress:", err)
        throw err
      }
    },
    [dispatch],
  )

  return {
    overview,
    subjectProgress,
    topicProgress,
    loading,
    error,
    fetchProgress,
    getSubjectProgress,
    getTopicProgress,
  }
}
