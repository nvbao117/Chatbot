/**
 * Redux Store Configuration
 * 
 * File này cấu hình Redux store chính của ứng dụng:
 * - Import tất cả reducers từ các slices
 * - Combine các reducers thành một store duy nhất
 * - Cấu hình Redux Toolkit với các middleware mặc định
 * 
 * Store structure:
 * - chat: Quản lý state của chatbot
 * - auth: Quản lý authentication state
 * - user: Quản lý thông tin user
 * - subject: Quản lý môn học
 * - topic: Quản lý chủ đề
 * - quiz: Quản lý quiz
 * - progress: Quản lý tiến độ học tập
 * - achievement: Quản lý thành tích
 * - ui: Quản lý UI state (sidebar, theme, etc.)
 */

import { configureStore } from "@reduxjs/toolkit"

// Import tất cả reducers từ các slices
import chatReducer from "./slices/chatSlice"           // Chat state management
import authReducer from "./slices/authSlice"           // Authentication state
import userReducer from "./slices/userSlice"           // User profile state
import subjectReducer from "./slices/subjectSlice"     // Subjects state
import topicReducer from "./slices/topicSlice"         // Topics state
import quizReducer from "./slices/quizSlice"           // Quiz state
import progressReducer from "./slices/progressSlice"   // Progress tracking state
import achievementReducer from "./slices/achievementSlice" // Achievements state
import uiReducer from "./slices/uiSlice"               // UI state (sidebar, theme, etc.)

// Cấu hình Redux store với tất cả reducers
const store = configureStore({
  reducer: {
    chat: chatReducer,           // Chatbot conversations và messages
    auth: authReducer,           // Login/logout state và user info
    user: userReducer,           // User profile và settings
    subject: subjectReducer,     // Danh sách môn học
    topic: topicReducer,         // Danh sách chủ đề
    quiz: quizReducer,           // Quiz questions và results
    progress: progressReducer,   // Tiến độ học tập
    achievement: achievementReducer, // Thành tích đã đạt được
    ui: uiReducer,               // UI state (sidebar, theme, loading)
  },
})

export default store
