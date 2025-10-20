"use client"

import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  startQuiz,
  answerQuestion,
  submitQuizSuccess,
  fetchHistorySuccess,
  clearQuiz,
} from "../store/slices/quizSlice"
import { quizService } from "../services/quizService"

export const useQuiz = () => {
  const dispatch = useDispatch()
  const { quizzes, currentQuiz, currentSession, results, history, loading, error } = useSelector((state) => state.quiz)

  const fetchQuizzes = useCallback(
    async (params) => {
      dispatch(fetchQuizzesStart())
      try {
        const response = await quizService.getAll(params)
        dispatch(fetchQuizzesSuccess(response))
        return response
      } catch (err) {
        dispatch(fetchQuizzesFailure(err.message))
        throw err
      }
    },
    [dispatch],
  )

  const getQuizById = useCallback(async (id) => {
    try {
      const response = await quizService.getById(id)
      return response
    } catch (err) {
      console.error("Error fetching quiz:", err)
      throw err
    }
  }, [])

  const handleStartQuiz = useCallback(
    async (id) => {
      try {
        const response = await quizService.startQuiz(id)
        dispatch(startQuiz(response))
        return response
      } catch (err) {
        console.error("Error starting quiz:", err)
        throw err
      }
    },
    [dispatch],
  )

  const handleAnswerQuestion = useCallback(
    (questionId, answer) => {
      dispatch(answerQuestion({ questionId, answer }))
    },
    [dispatch],
  )

  const submitQuiz = useCallback(
    async (quizId) => {
      try {
        const response = await quizService.submitQuiz(quizId, currentSession.answers)
        dispatch(submitQuizSuccess(response))
        return response
      } catch (err) {
        console.error("Error submitting quiz:", err)
        throw err
      }
    },
    [dispatch, currentSession],
  )

  const fetchHistory = useCallback(
    async (params) => {
      try {
        const response = await quizService.getHistory(params)
        dispatch(fetchHistorySuccess(response))
        return response
      } catch (err) {
        console.error("Error fetching history:", err)
        throw err
      }
    },
    [dispatch],
  )

  const handleClearQuiz = useCallback(() => {
    dispatch(clearQuiz())
  }, [dispatch])

  return {
    quizzes,
    currentQuiz,
    currentSession,
    results,
    history,
    loading,
    error,
    fetchQuizzes,
    getQuizById,
    startQuiz: handleStartQuiz,
    answerQuestion: handleAnswerQuestion,
    submitQuiz,
    fetchHistory,
    clearQuiz: handleClearQuiz,
  }
}
