import { useAuth } from "../../hooks/useAuth"
import { isAdmin, isTeacher, isStudent } from "../../utils/roles"

export const AdminTest = () => {
  const { user, isAuthenticated } = useAuth()

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🔍 Admin Test Page</h1>
      
      <div style={{
        background: '#f5f5f5',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>User Information:</h2>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'No user'}</p>
        <p><strong>Role:</strong> {user?.role || 'No role'}</p>
      </div>

      <div style={{
        background: '#e8f5e8',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>Role Checks:</h2>
        <p><strong>Is Admin:</strong> {isAdmin(user?.role) ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Is Teacher:</strong> {isTeacher(user?.role) ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Is Student:</strong> {isStudent(user?.role) ? '✅ Yes' : '❌ No'}</p>
      </div>

      <div style={{
        background: '#fff3cd',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2>Test Accounts:</h2>
        <div style={{ marginBottom: '1rem' }}>
          <h3>Admin Account:</h3>
          <p><strong>Email:</strong> admin@example.com</p>
          <p><strong>Password:</strong> password123</p>
          <p><strong>Role:</strong> admin</p>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h3>Teacher Account:</h3>
          <p><strong>Email:</strong> teacher@example.com</p>
          <p><strong>Password:</strong> password123</p>
          <p><strong>Role:</strong> teacher</p>
        </div>
        
        <div>
          <h3>Student Account:</h3>
          <p><strong>Email:</strong> user@example.com</p>
          <p><strong>Password:</strong> password123</p>
          <p><strong>Role:</strong> student</p>
        </div>
      </div>

      <div style={{
        background: '#d1ecf1',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        <h2>Instructions:</h2>
        <ol>
          <li>Logout nếu đang đăng nhập</li>
          <li>Đăng nhập với admin@example.com / password123</li>
          <li>Kiểm tra sidebar có menu "👑 Admin" không</li>
          <li>Click vào "👑 Admin" để truy cập Admin Dashboard</li>
        </ol>
      </div>
    </div>
  )
}

export default AdminTest
