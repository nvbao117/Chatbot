/**
 * Redux Slice cho Authentication
 * 
 * Slice này quản lý state và actions liên quan đến xác thực:
 * - User info, token, loading states
 * - Login, logout, register actions
 * - Auto-save/load từ localStorage
 * - Role-based permissions
 */

import { createSlice } from "@reduxjs/toolkit"
import { storage } from "../../utils/storage"
import { STORAGE_KEYS } from "../../utils/constants"

// Initial state - load từ localStorage nếu có
const initialState = {
  user: storage.get(STORAGE_KEYS.USER_DATA) || null,           // Thông tin user
  token: storage.get(STORAGE_KEYS.AUTH_TOKEN) || null,         // JWT token
  isAuthenticated: !!storage.get(STORAGE_KEYS.AUTH_TOKEN),     // Trạng thái đăng nhập
  loading: false,                                              // Loading state
  error: null,                                                 // Error message
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Bắt đầu quá trình đăng nhập - set loading và clear error
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    
    // Đăng nhập thành công - lưu user data và token vào state + localStorage
    loginSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      storage.set(STORAGE_KEYS.USER_DATA, action.payload.user)
      storage.set(STORAGE_KEYS.AUTH_TOKEN, action.payload.token)
    },
    
    // Đăng nhập thất bại - set error message
    loginFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    
    // Đăng xuất - clear tất cả data và localStorage
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      storage.remove(STORAGE_KEYS.AUTH_TOKEN)
      storage.remove(STORAGE_KEYS.USER_DATA)
    },
    
    // Cập nhật thông tin user
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      storage.set(STORAGE_KEYS.USER_DATA, state.user)
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions
export default authSlice.reducer
