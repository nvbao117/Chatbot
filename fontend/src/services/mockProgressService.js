// Mock progress service for development
export const mockProgressService = {
  getOverview: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      overallProgress: 25,
      completedTopics: 12,
      totalPoints: 1250,
      studyStreak: 5,
      subjectProgress: [
        {
          id: 1,
          name: "Toán học",
          progress: 20,
          completedTopics: 3,
          totalTopics: 15
        },
        {
          id: 2,
          name: "Vật lý",
          progress: 8,
          completedTopics: 1,
          totalTopics: 12
        },
        {
          id: 3,
          name: "Hóa học",
          progress: 28,
          completedTopics: 5,
          totalTopics: 18
        }
      ]
    }
  },

  getSubjectProgress: async (subjectId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      subjectId,
      progress: 20,
      completedTopics: 3,
      totalTopics: 15,
      lastStudied: "2024-01-15",
      averageScore: 85
    }
  },

  getTopicProgress: async (topicId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      topicId,
      progress: 75,
      completed: false,
      score: 0,
      timeSpent: 45
    }
  }
}
