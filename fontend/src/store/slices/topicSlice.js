import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  topics: [],
  selectedTopic: null,
  topicContent: null,
  loading: false,
  error: null,
}

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    fetchTopicsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchTopicsSuccess: (state, action) => {
      state.loading = false
      state.topics = action.payload
    },
    fetchTopicsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    selectTopic: (state, action) => {
      state.selectedTopic = action.payload
    },
    setTopicContent: (state, action) => {
      state.topicContent = action.payload
    },
    clearSelectedTopic: (state) => {
      state.selectedTopic = null
      state.topicContent = null
    },
  },
})

export const {
  fetchTopicsStart,
  fetchTopicsSuccess,
  fetchTopicsFailure,
  selectTopic,
  setTopicContent,
  clearSelectedTopic,
} = topicSlice.actions
export default topicSlice.reducer
