import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../hooks"
import { Button, Input, Alert } from "@/components/common"
import { validateEmail, validatePassword, validateUsername } from "../../../utils/validators"
import styles from "./RegisterForm.module.css"

export const RegisterForm = () => {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    confirmPassword: "",
    date_of_birth: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }   

  const validateForm = () => {
    const newErrors = {}
    if (!validateUsername(formData.username)) newErrors.username = "Username must be 3-20 characters"
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email address"
    if (!validatePassword(formData.password)) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required"
    if (!formData.date_of_birth) newErrors.date_of_birth = "Birthdate is required" 
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name, 
        date_of_birth: formData.date_of_birth, 
      })
      navigate("/dashboard")
    } catch (err) {
      console.error("Register error:", err)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <Alert type="error" message={error} />}

      <div className={styles.inputGroup}>
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Enter your username"
          icon="👤"
        />
      </div>
      <div className={styles.inputGroup}>
        <Input
          label="Full Name"
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
          placeholder="Enter your full name"
          icon="🧑‍💼"
        />
      </div>
      <div className={styles.inputGroup}>
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          icon="📧"
        />
      </div>
      <div>
        <Input 
          label="Birthdate"
          type="date"
          name="date_of_birth" 
          value={formData.date_of_birth}
          onChange={handleChange} 
          error = {errors.date_of_birth} 
          placeholder="Select your birth date" 
          icon="🎂"
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
          placeholder="Create a strong password"
          icon="🔒"
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Confirm your password"
          icon="🔐"
        />
      </div>

      <div className={styles.passwordRequirements}>
        <h4>Password Requirements:</h4>
        <ul>
          <li className={formData.password.length >= 8 ? styles.valid : styles.invalid}>
            At least 8 characters
          </li>
          <li className={/[A-Z]/.test(formData.password) ? styles.valid : styles.invalid}>
            One uppercase letter
          </li>
          <li className={/[a-z]/.test(formData.password) ? styles.valid : styles.invalid}>
            One lowercase letter
          </li>
          <li className={/\d/.test(formData.password) ? styles.valid : styles.invalid}>
            One number
          </li>
        </ul>
      </div>

      <Button type="submit" loading={loading} className={styles.submitBtn}>
        <span className={styles.buttonIcon}>✨</span>
        Create Account
      </Button>

      <p className={styles.footer}>
        Already have an account? <a href="/login" className={styles.loginLink}>Sign in here</a>
      </p>
    </form>
  )
}
