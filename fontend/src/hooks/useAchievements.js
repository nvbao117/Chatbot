"use client"

import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import {
  fetchAchievementsStart,
  fetchAchievementsSuccess,
  fetchAchievementsFailure,
  unlockAchievement,
  setUnlockedAchievements,
} from "../store/slices/achievementSlice"
import { achievementService } from "../services/achievementService"

export const useAchievements = () => {
  const dispatch = useDispatch()
  const { achievements, unlockedAchievements, loading, error } = useSelector((state) => state.achievement)

  const fetchAchievements = useCallback(async () => {
    dispatch(fetchAchievementsStart())
    try {
      const response = await achievementService.getAll()
      dispatch(fetchAchievementsSuccess(response))
      return response
    } catch (err) {
      dispatch(fetchAchievementsFailure(err.message))
      throw err
    }
  }, [dispatch])

  const handleUnlockAchievement = useCallback(
    async (achievementId) => {
      try {
        const response = await achievementService.unlock(achievementId)
        dispatch(unlockAchievement(response))
        return response
      } catch (err) {
        console.error("Error unlocking achievement:", err)
        throw err
      }
    },
    [dispatch],
  )

  const handleSetUnlockedAchievements = useCallback(
    (achievements) => {
      dispatch(setUnlockedAchievements(achievements))
    },
    [dispatch],
  )

  return {
    achievements,
    unlockedAchievements,
    loading,
    error,
    fetchAchievements,
    unlockAchievement: handleUnlockAchievement,
    setUnlockedAchievements: handleSetUnlockedAchievements,
  }
}
