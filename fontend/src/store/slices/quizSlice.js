import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  quizzes: [],
  currentQuiz: null,
  currentSession: null,
  results: null,
  history: [],
  loading: false,
  error: null,
}

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    fetchQuizzesStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchQuizzesSuccess: (state, action) => {
      state.loading = false
      state.quizzes = action.payload
    },
    fetchQuizzesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    startQuiz: (state, action) => {
      state.currentQuiz = action.payload
      state.currentSession = {
        quizId: action.payload.id,
        answers: {},
        startTime: Date.now(),
      }
    },
    answerQuestion: (state, action) => {
      if (state.currentSession) {
        state.currentSession.answers[action.payload.questionId] = action.payload.answer
      }
    },
    submitQuizSuccess: (state, action) => {
      state.results = action.payload
      state.currentSession = null
      state.currentQuiz = null
    },
    fetchHistorySuccess: (state, action) => {
      state.history = action.payload
    },
    clearQuiz: (state) => {
      state.currentQuiz = null
      state.currentSession = null
      state.results = null
    },
  },
})

export const {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  startQuiz,
  answerQuestion,
  submitQuizSuccess,
  fetchHistorySuccess,
  clearQuiz,
} = quizSlice.actions
export default quizSlice.reducer
