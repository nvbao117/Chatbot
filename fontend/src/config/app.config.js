/**
 * Application Configuration
 *
 * Centralises shared application settings, API endpoints, and mock data
 * used across the frontend. Environment variables are read through Vite's
 * `import.meta.env` helper.
 *
 * Environment Variables:
 * - VITE_API_BASE_URL: Base URL of the backend API server
 * - MODE: Build mode (development/production)
 * - VITE_USE_MOCK_CHATBOT: Optional flag to force the chatbot to use mock responses
 */

// Decide whether to use the mock chatbot service based on environment variables.
const RAW_USE_MOCK_CHATBOT = import.meta.env.VITE_USE_MOCK_CHATBOT
const SHOULD_USE_MOCK_CHATBOT =
  RAW_USE_MOCK_CHATBOT === undefined
    ? import.meta.env.MODE === "development"
    : RAW_USE_MOCK_CHATBOT === "true"

// Global application configuration
export const APP_CONFIG = {
  appName: "EduLearn",
  appVersion: "1.0.0",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  environment: import.meta.env.MODE,
  debug: import.meta.env.DEV,
  useMockChatbot: SHOULD_USE_MOCK_CHATBOT,
}

// Danh sách môn học mặc định với icon và màu sắc
export const SUBJECTS = [
  { id: 1, name: "Toán học", icon: "📐", color: "#FF6B6B" },
  { id: 2, name: "Vật lý", icon: "⚛️", color: "#4ECDC4" },
  { id: 3, name: "Hóa học", icon: "🧪", color: "#45B7D1" },
  { id: 4, name: "Sinh học", icon: "🧬", color: "#96CEB4" },
  { id: 5, name: "Tiếng Anh", icon: "🌍", color: "#FFEAA7" },
  { id: 6, name: "Lịch sử", icon: "📚", color: "#DDA15E" },
]

// Các mức độ khó của quiz
export const QUIZ_DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
}

// Các loại thành tích có thể đạt được
export const ACHIEVEMENT_TYPES = {
  QUIZ_MASTER: "quiz_master",
  STREAK: "streak",
  SUBJECT_EXPERT: "subject_expert",
  SPEED_DEMON: "speed_demon",
}
