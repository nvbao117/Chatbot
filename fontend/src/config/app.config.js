/**
 * Application Configuration
 * 
 * File này chứa cấu hình chung của ứng dụng:
 * - Thông tin ứng dụng (tên, version)
 * - API configuration và environment settings
 * - Mock data cho subjects, quiz difficulty, achievement types
 * - Constants được sử dụng trong toàn bộ ứng dụng
 * 
 * Environment Variables:
 * - VITE_API_BASE_URL: Base URL của API server
 * - MODE: Environment mode (development/production)
 */

// Cấu hình chung của ứng dụng
export const APP_CONFIG = {
  appName: "EduLearn",                                        // Tên ứng dụng
  appVersion: "1.0.0",                                       // Phiên bản
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1", // Base URL API
  environment: import.meta.env.MODE,                         // Môi trường (dev/prod)
  debug: import.meta.env.DEV,                                // Debug mode
}

// Danh sách môn học mặc định với icon và màu sắc
export const SUBJECTS = [
  { id: 1, name: "Toán học", icon: "📐", color: "#FF6B6B" },    // Toán học - màu đỏ
  { id: 2, name: "Vật lý", icon: "⚛️", color: "#4ECDC4" },      // Vật lý - màu xanh lá
  { id: 3, name: "Hóa học", icon: "🧪", color: "#45B7D1" },     // Hóa học - màu xanh dương
  { id: 4, name: "Sinh học", icon: "🧬", color: "#96CEB4" },    // Sinh học - màu xanh nhạt
  { id: 5, name: "Tiếng Anh", icon: "🌍", color: "#FFEAA7" },   // Tiếng Anh - màu vàng
  { id: 6, name: "Lịch sử", icon: "📚", color: "#DDA15E" },     // Lịch sử - màu cam
]

// Các mức độ khó của quiz
export const QUIZ_DIFFICULTY = {
  EASY: "easy",       // Dễ
  MEDIUM: "medium",   // Trung bình
  HARD: "hard",       // Khó
}

// Các loại thành tích có thể đạt được
export const ACHIEVEMENT_TYPES = {
  QUIZ_MASTER: "quiz_master",         // Bậc thầy quiz
  STREAK: "streak",                   // Chuỗi ngày học liên tiếp
  SUBJECT_EXPERT: "subject_expert",   // Chuyên gia môn học
  SPEED_DEMON: "speed_demon",         // Tốc độ làm bài nhanh
}
