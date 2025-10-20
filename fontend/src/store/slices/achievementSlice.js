import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  achievements: [],
  unlockedAchievements: [],
  loading: false,
  error: null,
}

const achievementSlice = createSlice({
  name: "achievement",
  initialState,
  reducers: {
    fetchAchievementsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchAchievementsSuccess: (state, action) => {
      state.loading = false
      state.achievements = action.payload
    },
    fetchAchievementsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    unlockAchievement: (state, action) => {
      state.unlockedAchievements.push(action.payload)
    },
    setUnlockedAchievements: (state, action) => {
      state.unlockedAchievements = action.payload
    },
  },
})

export const {
  fetchAchievementsStart,
  fetchAchievementsSuccess,
  fetchAchievementsFailure,
  unlockAchievement,
  setUnlockedAchievements,
} = achievementSlice.actions
export default achievementSlice.reducer
