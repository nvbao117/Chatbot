/**
 * Validation Utilities
 * 
 * File này chứa các utility functions để validate form data:
 * - Email validation với regex pattern
 * - Password validation (độ dài tối thiểu)
 * - Username validation (độ dài hợp lệ)
 * - Generic form validation với custom rules
 * 
 * Sử dụng trong các form components để validate input trước khi submit
 */

// Validate email format sử dụng regex pattern
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validate password - phải có ít nhất 8 ký tự
export const validatePassword = (password) => {
  return password.length >= 8
}

// Validate username - phải có từ 3-20 ký tự
export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20
}

// Generic form validation function
// Nhận formData và rules object, trả về errors object
export const validateForm = (formData, rules) => {
  const errors = {}

  // Duyệt qua tất cả fields trong rules
  Object.keys(rules).forEach((field) => {
    const rule = rules[field]
    const value = formData[field]

    // Kiểm tra required field
    if (rule.required && !value) {
      errors[field] = `${field} is required`
    } 
    // Kiểm tra custom validator
    else if (rule.validator && !rule.validator(value)) {
      errors[field] = rule.message || `${field} is invalid`
    }
  })

  return errors
}
