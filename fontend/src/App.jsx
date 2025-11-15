/**
 * Main App Component
 * 
 * Component chính của ứng dụng, định nghĩa routing structure:
 * - Public routes: Login, Register (không cần authentication)
 * - Protected routes: Tất cả các trang cần đăng nhập
 * - Admin routes: Chỉ admin mới truy cập được
 * - Layout wrapper: MainLayout cho các trang protected
 * 
 * Routing structure:
 * 1. Public routes - Không cần authentication
 * 2. Protected routes - Cần authentication, có MainLayout
 * 3. Admin routes - Cần admin role
 * 4. Catch-all route - Redirect về login
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

// Import các trang chính
import { Login } from "./pages/Login"                    // Trang đăng nhập
import { Register } from "./pages/Register"              // Trang đăng ký
import { Dashboard } from "./pages/Dashboard"            // Trang chủ
import { Subjects } from "./pages/Subjects"              // Trang môn học
import { Topics } from "./pages/Topics"                  // Trang chủ đề
import { Quiz } from "./pages/Quiz"                      // Trang quiz
import { Progress } from "./pages/Progress"              // Trang tiến độ
import { Achievements } from "./pages/Achievements"      // Trang thành tích
import { Profile } from "./pages/Profile"                // Trang hồ sơ
import { Chat } from "./pages/Chat"                      // Trang chat chính
import { AdminDashboard } from "./pages/Admin"           // Trang admin
import { AdminTest } from "./pages/Admin/AdminTest"      // Trang test admin

// Import các component bảo vệ route
import { ProtectedRoute } from "./components/auth/ProtectedRoute"  // Bảo vệ route cần đăng nhập
import { AdminRoute } from "./components/auth/AdminRoute"          // Bảo vệ route admin
import { MainLayout } from "./layouts/MainLayout"                 // Layout chính
import ErrorBoundary from "./components/common/ErrorBoundary"

import "./App.css"

function App() {
  return (
    <Router>
        <Routes>
          {/* Public Routes - Không cần authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Cần đăng nhập, có MainLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Subjects />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/:subjectId/topics"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Topics />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Quiz />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/topics/:topicId/quiz"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Quiz />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Progress />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Achievements />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ErrorBoundary>
                    <Chat />
                  </ErrorBoundary>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Chỉ admin mới truy cập được */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/admin-test"
            element={
              <MainLayout>
                <AdminTest />
              </MainLayout>
            }
          />

          {/* Catch all route - Redirect về login nếu không tìm thấy route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  )
}

export default App
