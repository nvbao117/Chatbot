import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  subjects: [],
  selectedSubject: null,
  loading: false,
  error: null,
}

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    fetchSubjectsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchSubjectsSuccess: (state, action) => {
      state.loading = false
      state.subjects = action.payload
    },
    fetchSubjectsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    selectSubject: (state, action) => {
      state.selectedSubject = action.payload
    },
    clearSelectedSubject: (state) => {
      state.selectedSubject = null
    },
  },
})

export const { fetchSubjectsStart, fetchSubjectsSuccess, fetchSubjectsFailure, selectSubject, clearSelectedSubject } =
  subjectSlice.actions
export default subjectSlice.reducer
