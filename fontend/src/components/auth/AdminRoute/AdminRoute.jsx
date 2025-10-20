import { useAuth } from "../../../hooks/useAuth"
import { isAdmin, hasPermission } from "../../../utils/roles"
import { Navigate } from "react-router-dom"
import { Loading } from "@/components/common"

export const AdminRoute = ({ children, requiredPermission = null }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading fullScreen message="Checking permissions..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredPermission && !hasPermission(user?.role, requiredPermission)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Go Back
        </button>
      </div>
    )
  }

  return children
}

export default AdminRoute
