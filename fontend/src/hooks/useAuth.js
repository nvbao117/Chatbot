/**
 * useAuth Hook
 * 
 * Custom hook để quản lý authentication state và actions:
 * - Lấy authentication state từ Redux store
 * - Cung cấp các functions: login, register, logout, updateUser
 * - Tự động dispatch Redux actions khi thực hiện auth operations
 * - Error handling và loading states
 * 
 * Returns:
 * - user: Thông tin user hiện tại
 * - token: JWT token
 * - isAuthenticated: Trạng thái đăng nhập
 * - loading: Loading state
 * - error: Error message
 * - login: Function đăng nhập
 * - register: Function đăng ký
 * - logout: Function đăng xuất
 * - updateUser: Function cập nhật thông tin user
 */

import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import { loginStart, loginSuccess, loginFailure, logout, updateUser } from "../store/slices/authSlice"
import { authService } from "../services/authService"

export const useAuth = () => {
  // Redux dispatch và selector
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth)

  // Function đăng nhập - gọi API và dispatch Redux actions
  const login = useCallback(
    async (email, password) => {
      dispatch(loginStart())  // Bắt đầu loading
      try {
        const response = await authService.login(email, password)
        dispatch(loginSuccess(response))  // Đăng nhập thành công
        return response
      } catch (err) {
        dispatch(loginFailure(err.message))  // Đăng nhập thất bại
        throw err
      }
    },
    [dispatch],
  )

  // Function đăng ký - gọi API và dispatch Redux actions
  const register = useCallback(
    async (userData) => {
      dispatch(loginStart())  // Bắt đầu loading
      try {
        const response = await authService.register(userData)
        dispatch(loginSuccess(response))  // Đăng ký thành công
        return response
      } catch (err) {
        dispatch(loginFailure(err.message))  // Đăng ký thất bại
        throw err
      }
    },
    [dispatch],
  )

  // Function đăng xuất - clear state và localStorage
  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  // Function cập nhật thông tin user
  const updateUserData = useCallback(
    (data) => {
      dispatch(updateUser(data))
    },
    [dispatch],
  )

  // Return tất cả state và functions để components sử dụng
  return {
    user,                    // Thông tin user
    token,                   // JWT token
    isAuthenticated,         // Trạng thái đăng nhập
    loading,                 // Loading state
    error,                   // Error message
    login,                   // Function đăng nhập
    register,                // Function đăng ký
    logout: handleLogout,    // Function đăng xuất
    updateUser: updateUserData, // Function cập nhật user
  }
}
