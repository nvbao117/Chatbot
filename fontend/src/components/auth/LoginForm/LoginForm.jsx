/**
 * Form Đăng Nhập
 * 
 * Component này render form đăng nhập với các tính năng:
 * - Input email và password với validation
 * - Hiển thị lỗi từ server hoặc validation
 * - Tùy chọn "Remember me" và "Forgot password"
 * - Button submit với loading state
 * - Link chuyển đến trang đăng ký
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../hooks"
import { Button, Input, Alert } from "@/components/common"
import { validatePassword } from "../../../utils/validators"
 import styles from "./LoginForm.module.css"

export const LoginForm = () => {
  // Hook navigation để chuyển trang sau khi đăng nhập thành công
  const navigate = useNavigate()
  
  // Hook authentication để lấy các function và state liên quan đến đăng nhập
  const { login, loading, error } = useAuth()
  
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({ identifier: "", password: "" })
  
  // State quản lý lỗi validation
  const [errors, setErrors] = useState({})

  // Function xử lý thay đổi input - cập nhật state và xóa lỗi của field đó
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  // Function validation form - kiểm tra email/username và password hợp lệ
  const validateForm = () => {
    const newErrors = {}
    if (!formData.identifier.trim()) newErrors.identifier = "Please enter your email or username"
    if (!validatePassword(formData.password)) newErrors.password = "Password must be at least 8 characters"
    return newErrors
  }

  // Function xử lý submit form - validation và gọi API đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    // Nếu có lỗi validation, hiển thị lỗi và dừng
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Gọi API đăng nhập và chuyển đến dashboard
      await login(formData.identifier, formData.password)
      navigate("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert type="error" message={error} />}

      <div className={styles.inputGroup}>
        <Input
          label="Email or Username"
          type="text"
          name="identifier"
          value={formData.identifier}
          onChange={handleChange}
          error={errors.identifier}
          placeholder="Enter your email or username"
          icon="📧"
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          icon="🔒"
        />
      </div>

      <div className={styles.options}>
        <label className={styles.rememberMe}>
          <input type="checkbox" />
          <span className={styles.checkmark}></span>
          Remember me
        </label>
        <a href="/forgot-password" className={styles.forgotPassword}>
          Forgot password?
        </a>
      </div>

      <Button type="submit" loading={loading} className={styles.submitBtn}>
        <span className={styles.buttonIcon}>🚀</span>
        Sign In
      </Button>

      <p className={styles.footer}>
        Don't have an account? <a href="/register" className={styles.registerLink}>Sign up here</a>
      </p>
    </form>
  )
}
