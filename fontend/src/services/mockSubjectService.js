// Mock subject service for development
export const mockSubjectService = {
  getAll: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return [
      {
        id: 1,
        name: "Toán học",
        description: "Học toán từ cơ bản đến nâng cao",
        icon: "📐",
        color: "#FF6B6B",
        totalTopics: 15,
        completedTopics: 3,
        progress: 20,
        difficulty: "medium"
      },
      {
        id: 2,
        name: "Vật lý",
        description: "Khám phá thế giới vật lý",
        icon: "⚛️",
        color: "#4ECDC4",
        totalTopics: 12,
        completedTopics: 1,
        progress: 8,
        difficulty: "hard"
      },
      {
        id: 3,
        name: "Hóa học",
        description: "Tìm hiểu về các nguyên tố và phản ứng",
        icon: "🧪",
        color: "#45B7D1",
        totalTopics: 18,
        completedTopics: 5,
        progress: 28,
        difficulty: "medium"
      },
      {
        id: 4,
        name: "Sinh học",
        description: "Khám phá thế giới sinh vật",
        icon: "🧬",
        color: "#96CEB4",
        totalTopics: 20,
        completedTopics: 2,
        progress: 10,
        difficulty: "easy"
      },
      {
        id: 5,
        name: "Tiếng Anh",
        description: "Học tiếng Anh hiệu quả",
        icon: "🌍",
        color: "#FFEAA7",
        totalTopics: 25,
        completedTopics: 8,
        progress: 32,
        difficulty: "easy"
      },
      {
        id: 6,
        name: "Lịch sử",
        description: "Tìm hiểu lịch sử thế giới",
        icon: "📚",
        color: "#DDA15E",
        totalTopics: 14,
        completedTopics: 0,
        progress: 0,
        difficulty: "medium"
      }
    ]
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const subjects = await mockSubjectService.getAll()
    return subjects.find(subject => subject.id === parseInt(id))
  },

  getTopics: async (subjectId, params) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Mock topics data
    const topics = [
      {
        id: 1,
        title: "Cơ bản về số học",
        description: "Học các phép tính cơ bản",
        duration: "2 giờ",
        difficulty: "easy",
        completed: true,
        progress: 100
      },
      {
        id: 2,
        title: "Đại số tuyến tính",
        description: "Ma trận và vector",
        duration: "3 giờ",
        difficulty: "medium",
        completed: false,
        progress: 0
      }
    ]
    
    return topics
  }
}
