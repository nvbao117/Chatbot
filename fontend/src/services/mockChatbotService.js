// Mock chatbot service for development
export const mockChatbotService = {
  sendMessage: async (message, conversationId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Generate contextual responses based on message content
    const responses = [
      "Tôi hiểu câu hỏi của bạn. Hãy để tôi giải thích chi tiết...",
      "Đây là một câu hỏi rất hay! Dựa trên kiến thức của tôi...",
      "Tôi sẽ giúp bạn hiểu rõ hơn về vấn đề này...",
      "Cảm ơn bạn đã hỏi! Đây là câu trả lời chi tiết...",
      "Tôi có thể hỗ trợ bạn với câu hỏi này. Hãy xem...",
      "Dựa trên kinh nghiệm học tập, tôi khuyên bạn...",
      "Đây là cách tiếp cận vấn đề này một cách hiệu quả...",
      "Tôi sẽ chia sẻ một số mẹo học tập hữu ích...",
      "Câu hỏi này rất quan trọng trong việc học tập...",
      "Hãy cùng tôi phân tích vấn đề này từ nhiều góc độ..."
    ]
    
    // Add some contextual responses
    if (message.toLowerCase().includes('toán') || message.toLowerCase().includes('math')) {
      responses.push("Về môn Toán, tôi có thể giúp bạn với các khái niệm cơ bản như đại số, hình học, và giải tích...")
    }
    if (message.toLowerCase().includes('vật lý') || message.toLowerCase().includes('physics')) {
      responses.push("Vật lý là môn khoa học thú vị! Tôi có thể giải thích về cơ học, nhiệt động lực học, và điện từ học...")
    }
    if (message.toLowerCase().includes('hóa học') || message.toLowerCase().includes('chemistry')) {
      responses.push("Hóa học giúp chúng ta hiểu về cấu trúc và tính chất của vật chất. Tôi có thể hỗ trợ bạn với các phản ứng hóa học...")
    }
    if (message.toLowerCase().includes('tiếng anh') || message.toLowerCase().includes('english')) {
      responses.push("Tiếng Anh là ngôn ngữ quan trọng! Tôi có thể giúp bạn với ngữ pháp, từ vựng, và kỹ năng giao tiếp...")
    }
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    return {
      message: randomResponse + "\n\n" + 
               "Đây là một câu trả lời mẫu từ AI Learning Assistant. Trong thực tế, tôi sẽ phân tích câu hỏi của bạn và đưa ra câu trả lời chi tiết, chính xác dựa trên kiến thức học tập.",
      conversationId: conversationId || Date.now().toString(),
      timestamp: new Date().toISOString()
    }
  },

  getHistory: async (conversationId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      messages: [],
      conversationId
    }
  },

  clearHistory: async (conversationId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { success: true, conversationId }
  }
}
