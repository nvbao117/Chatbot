import { createBrowserRouter } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { ProtectedRoute } from "../components/auth"

// Pages
import { Login } from "../pages/Login"
import { Register } from "../pages/Register"
import { Dashboard } from "../pages/Dashboard"
import { SubjectsPage } from "../pages/Subjects"
import { TopicsPage } from "../pages/Topics"
import { QuizPage } from "../pages/Quiz"
import { ProgressPage } from "../pages/Progress"
import { AchievementsPage } from "../pages/Achievements"
import { ProfilePage } from "../pages/Profile"
import { Chat } from "../pages/Chat"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "subjects",
        element: <SubjectsPage />,
      },
      {
        path: "subjects/:subjectId/topics",
        element: <TopicsPage />,
      },
      {
        path: "quiz/:quizId",
        element: <QuizPage />,
      },
      {
        path: "progress",
        element: <ProgressPage />,
      },
      {
        path: "achievements",
        element: <AchievementsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
])
