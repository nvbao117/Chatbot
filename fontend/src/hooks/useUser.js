import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  fetchStatsSuccess,
  updateProfileSuccess,
} from "../store/slices/userSlice"
import { userService } from "../services/userService"

export const useUser = () => {
  const dispatch = useDispatch()
  const { profile, stats, loading, error } = useSelector((state) => state.user)

  const fetchProfile = useCallback(async () => {
    dispatch(fetchUserStart())
    try {
      const response = await userService.getProfile()
      dispatch(fetchUserSuccess(response))
      return response
    } catch (err) {
      dispatch(fetchUserFailure(err.message))
      throw err
    }
  }, [dispatch])

  const fetchStats = useCallback(async () => {
    try {
      const response = await userService.getStats()
      dispatch(fetchStatsSuccess(response))
      return response
    } catch (err) {
      console.error("Error fetching stats:", err)
      throw err
    }
  }, [dispatch])

  const updateProfile = useCallback(
    async (userData) => {
      try {
        const response = await userService.updateProfile(userData)
        dispatch(updateProfileSuccess(response))
        return response
      } catch (err) {
        console.error("Error updating profile:", err)
        throw err
      }
    },
    [dispatch],
  )

  return {
    profile,
    stats,
    loading,
    error,
    fetchProfile,
    fetchStats,
    updateProfile,
  }
}
