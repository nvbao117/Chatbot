// Mock authentication service for development
export const mockAuthService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock validation
    if (email === "admin@example.com" && password === "password123") {
      return {
        user: {
          id: 1,
          email: "admin@example.com",
          name: "Admin User",
          username: "admin",
          avatar: "/placeholder-user.jpg",
          role: "admin",
          permissions: ["manage_users", "manage_content", "view_analytics", "manage_quizzes", "manage_settings"]
        },
        token: "mock-jwt-token-12345"
      }
    } else if (email === "teacher@example.com" && password === "password123") {
      return {
        user: {
          id: 2,
          email: "teacher@example.com",
          name: "Teacher User", 
          username: "teacher",
          avatar: "/placeholder-user.jpg",
          role: "teacher",
          permissions: ["view_users", "manage_content", "view_analytics", "manage_quizzes"]
        },
        token: "mock-jwt-token-67890"
      }
    } else if (email === "user@example.com" && password === "password123") {
      return {
        user: {
          id: 3,
          email: "user@example.com", 
          name: "Student User",
          username: "student",
          avatar: "/placeholder-user.jpg",
          role: "student",
          permissions: ["view_subjects", "view_topics", "view_progress"]
        },
        token: "mock-jwt-token-11111"
      }
    } else {
      throw new Error("Invalid email or password")
    }
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      user: {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        avatar: "/placeholder-user.jpg",
        role: "student"
      },
      token: `mock-jwt-token-${Date.now()}`
    }
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { message: "Logged out successfully" }
  },

  refreshToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { token: `mock-refresh-token-${Date.now()}` }
  },

  verifyToken: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { valid: true }
  }
}
