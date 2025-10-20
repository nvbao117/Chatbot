// Mock achievement service for development
export const mockAchievementService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return [
      {
        id: 1,
        name: "Người mới bắt đầu",
        description: "Hoàn thành bài học đầu tiên",
        icon: "🎯",
        unlocked: true,
        unlockedAt: "2024-01-10",
        points: 50
      },
      {
        id: 2,
        name: "Học sinh chăm chỉ",
        description: "Học liên tiếp 3 ngày",
        icon: "🔥",
        unlocked: true,
        unlockedAt: "2024-01-12",
        points: 100
      },
      {
        id: 3,
        name: "Thiên tài toán học",
        description: "Hoàn thành tất cả bài toán",
        icon: "🧮",
        unlocked: false,
        unlockedAt: null,
        points: 200
      },
      {
        id: 4,
        name: "Nhà khoa học",
        description: "Đạt điểm cao trong 5 bài kiểm tra",
        icon: "🔬",
        unlocked: false,
        unlockedAt: null,
        points: 300
      }
    ]
  },

  unlock: async (achievementId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      success: true,
      achievement: {
        id: achievementId,
        name: "Achievement Unlocked!",
        description: "Congratulations!",
        points: 100
      }
    }
  }
}
