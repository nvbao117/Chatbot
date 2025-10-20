import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import {
  fetchSubjectsStart,
  fetchSubjectsSuccess,
  fetchSubjectsFailure,
  selectSubject,
  clearSelectedSubject,
} from "../store/slices/subjectSlice"
import { subjectService } from "../services/subjectService"

export const useSubjects = () => {
  const dispatch = useDispatch()
  const { subjects, selectedSubject, loading, error } = useSelector((state) => state.subject)

  const fetchSubjects = useCallback(
    async (params) => {
      dispatch(fetchSubjectsStart())
      try {
        const response = await subjectService.getAll(params)
        dispatch(fetchSubjectsSuccess(response))
        return response
      } catch (err) {
        dispatch(fetchSubjectsFailure(err.message))
        throw err
      }
    },
    [dispatch],
  )

  const getSubjectById = useCallback(
    async (id) => {
      try {
        const response = await subjectService.getById(id)
        dispatch(selectSubject(response))
        return response
      } catch (err) {
        console.error("Error fetching subject:", err)
        throw err
      }
    },
    [dispatch],
  )

  const getTopics = useCallback(async (subjectId, params) => {
    try {
      const response = await subjectService.getTopics(subjectId, params)
      return response
    } catch (err) {
      console.error("Error fetching topics:", err)
      throw err
    }
  }, [])

  const handleSelectSubject = useCallback(
    (subject) => {
      dispatch(selectSubject(subject))
    },
    [dispatch],
  )

  const handleClearSelection = useCallback(() => {
    dispatch(clearSelectedSubject())
  }, [dispatch])

  return {
    subjects,
    selectedSubject,
    loading,
    error,
    fetchSubjects,
    getSubjectById,
    getTopics,
    selectSubject: handleSelectSubject,
    clearSelection: handleClearSelection,
  }
}
