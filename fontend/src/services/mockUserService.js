// Mock user service for development
export const mockUserService = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      id: 1,
      email: "admin@example.com",
      name: "Admin User",
      avatar: "/placeholder-user.jpg",
      role: "student",
      joinDate: "2024-01-01",
      lastActive: "2024-01-15",
      preferences: {
        theme: "light",
        language: "vi",
        notifications: true
      }
    }
  },

  updateProfile: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      ...data,
      updatedAt: new Date().toISOString()
    }
  },

  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      totalStudyTime: 45,
      completedTopics: 12,
      averageScore: 85,
      streak: 5,
      level: 3,
      points: 1250
    }
  }
}
