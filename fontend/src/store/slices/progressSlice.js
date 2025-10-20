import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  overview: null,
  subjectProgress: {},
  topicProgress: {},
  loading: false,
  error: null,
}

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    fetchProgressStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchProgressSuccess: (state, action) => {
      state.loading = false
      state.overview = action.payload
    },
    fetchProgressFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updateSubjectProgress: (state, action) => {
      state.subjectProgress[action.payload.subjectId] = action.payload.progress
    },
    updateTopicProgress: (state, action) => {
      state.topicProgress[action.payload.topicId] = action.payload.progress
    },
  },
})

export const {
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  updateSubjectProgress,
  updateTopicProgress,
} = progressSlice.actions
export default progressSlice.reducer
