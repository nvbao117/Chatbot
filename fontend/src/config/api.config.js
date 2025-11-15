/**
 * API Endpoints Configuration
 * 
 * File này định nghĩa tất cả API endpoints được sử dụng trong ứng dụng:
 * - Cấu trúc endpoints theo từng module chức năng
 * - Sử dụng function để tạo dynamic endpoints với parameters
 * - Centralized configuration để dễ maintain và update
 * 
 * Cấu trúc:
 * - Static endpoints: String constants
 * - Dynamic endpoints: Functions nhận parameters
 */

// Định nghĩa tất cả API endpoints theo module chức năng
export const API_ENDPOINTS = {
  // Authentication endpoints - Xác thực người dùng
  AUTH: {
    LOGIN: "/auth/login",           // Đăng nhập
    REGISTER: "/auth/register",     // Đăng ký
    LOGOUT: "/auth/logout",         // Đăng xuất
    REFRESH: "/auth/refresh",       // Làm mới token
    VERIFY: "/auth/verify",         // Xác thực token
  },

  // User management endpoints - Quản lý người dùng
  USERS: {
    PROFILE: "/users/profile",      // Lấy/cập nhật thông tin profile
    UPDATE: "/users/profile",       // Cập nhật profile
    STATS: "/users/stats",          // Lấy thống kê người dùng
  },

  // Subject endpoints - Quản lý môn học
  SUBJECTS: {
    LIST: "/subjects",                                    // Lấy danh sách môn học
    DETAIL: (id) => `/subjects/${id}`,                    // Lấy chi tiết môn học
    TOPICS: (id) => `/subjects/${id}/topics`,             // Lấy chủ đề của môn học
  },

  // Topic endpoints - Quản lý chủ đề
  TOPICS: {
    LIST: "/topics",                                      // Lấy danh sách chủ đề
    DETAIL: (id) => `/topics/${id}`,                      // Lấy chi tiết chủ đề
    CONTENT: (id) => `/topics/${id}/content`,             // Lấy nội dung chủ đề
  },

  // Quiz endpoints - Quản lý quiz
  QUIZ: {
    LIST: "/quiz",                                        // Lấy danh sách quiz
    DETAIL: (id) => `/quiz/${id}`,                        // Lấy chi tiết quiz
    START: (id) => `/quiz/${id}/start`,                   // Bắt đầu làm quiz
    SUBMIT: (id) => `/quiz/${id}/submit`,                 // Nộp bài quiz
    HISTORY: "/quiz/history",                             // Lấy lịch sử quiz
  },

  // Progress endpoints - Quản lý tiến độ học tập
  PROGRESS: {
    OVERVIEW: "/progress",                                // Tổng quan tiến độ
    SUBJECT: (id) => `/progress/subject/${id}`,           // Tiến độ theo môn học
    TOPIC: (id) => `/progress/topic/${id}`,               // Tiến độ theo chủ đề
  },

  // Achievement endpoints - Quản lý thành tích
  ACHIEVEMENTS: {
    LIST: "/achievements",                                // Lấy danh sách thành tích
    UNLOCK: "/achievements/unlock",                       // Mở khóa thành tích
  },

  // Chatbot endpoints - Quản lý chat với AI
  CHATBOT: {
    SEND: "/chatbot/chat",                                // Gửi tin nhắn đến chatbot (khớp backend)
    HISTORY: "/chatbot/history",                          // Lấy lịch sử chat (chưa dùng)
    CLEAR: "/chatbot/clear",                              // Xóa lịch sử chat (chưa dùng)
  },
}
