import { Navigate } from "react-router-dom"
import { useAuth } from "../../../hooks"
import { Loading } from "@/components/common"

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading fullScreen message="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
