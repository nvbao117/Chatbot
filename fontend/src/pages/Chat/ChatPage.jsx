import { useState, useRef, useEffect } from "react"
import { ChatHistoryPanel } from "../../components/chatbot/ChatHistoryPanel"
import styles from "./ChatPage.module.css"

export const ChatPage = () => {
  // Load chat history from localStorage
  const loadChatHistory = () => {
    const saved = localStorage.getItem('chatHistory')
    if (saved) {
      return JSON.parse(saved).map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }
    return [
      {
        id: 1,
        text: "Xin chào! Tôi là AI Learning Assistant của EduLearn. Tôi có thể giúp bạn:\n\n• Giải thích các khái niệm khó hiểu\n• Giải bài tập và bài kiểm tra\n• Đưa ra lời khuyên học tập\n• Tìm tài liệu học tập phù hợp\n\nHãy hỏi tôi bất cứ điều gì về việc học của bạn!",
        sender: "bot",
        timestamp: new Date()
      }
    ]
  }

  const [messages, setMessages] = useState(loadChatHistory)
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      setInputMessage("")
      setIsTyping(true)

      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "Tôi hiểu câu hỏi của bạn. Hãy để tôi giải thích chi tiết...",
          "Đây là một câu hỏi rất hay! Dựa trên kiến thức của tôi...",
          "Tôi sẽ giúp bạn hiểu rõ hơn về vấn đề này...",
          "Cảm ơn bạn đã hỏi! Đây là câu trả lời chi tiết...",
          "Tôi có thể hỗ trợ bạn với câu hỏi này. Hãy xem..."
        ]
        
        const botMessage = {
          id: Date.now() + 1,
          text: responses[Math.floor(Math.random() * responses.length)] + "\n\n" + 
                "Đây là một câu trả lời mẫu. Trong thực tế, tôi sẽ phân tích câu hỏi của bạn và đưa ra câu trả lời chi tiết, chính xác dựa trên kiến thức học tập.",
          sender: "bot",
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, 2000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestions = [
    "Giải thích khái niệm quang hợp",
    "Cách giải phương trình bậc 2", 
    "Lịch sử Việt Nam thế kỷ 20",
    "Công thức tính diện tích hình tròn",
    "Cách viết bài luận tiếng Anh",
    "Cách học từ vựng hiệu quả"
  ]

  const quickActions = [
    { icon: "🧮", text: "Toán học", color: "#667eea" },
    { icon: "🔬", text: "Khoa học", color: "#764ba2" },
    { icon: "📚", text: "Văn học", color: "#f093fb" },
    { icon: "🌍", text: "Lịch sử", color: "#4ecdc4" }
  ]

  return (
    <div className={styles.chatPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>🤖 Learning Assistant</h1>
          <p className={styles.subtitle}>AI-powered study companion • Always ready to help</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.newChatBtn} onClick={() => {
            localStorage.removeItem('chatHistory')
            window.location.reload()
          }}>
            ✨ New Chat
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Chat History Sidebar */}
        <div className={styles.historySidebar}>
          <div className={styles.historyHeader}>
            <h3>📋 Lịch sử chat</h3>
            <button 
              className={styles.clearHistoryBtn}
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) {
                  localStorage.removeItem('chatHistory')
                  setMessages([{
                    id: 1,
                    text: "Xin chào! Tôi là AI Learning Assistant của EduLearn. Tôi có thể giúp bạn:\n\n• Giải thích các khái niệm khó hiểu\n• Giải bài tập và bài kiểm tra\n• Đưa ra lời khuyên học tập\n• Tìm tài liệu học tập phù hợp\n\nHãy hỏi tôi bất cứ điều gì về việc học của bạn!",
                    sender: "bot",
                    timestamp: new Date()
                  }])
                }
              }}
              title="Xóa lịch sử"
            >
              🗑️
            </button>
          </div>
          
          <div className={styles.historyList}>
            {messages.length > 1 ? (
              <div className={styles.historyItem}>
                <div className={styles.historyContent}>
                  <div className={styles.historyTitle}>
                    Cuộc trò chuyện hiện tại
                  </div>
                  <div className={styles.historyPreview}>
                    {messages[messages.length - 1]?.text || messages[messages.length - 1]?.content || 'Tin nhắn cuối'}
                  </div>
                  <div className={styles.historyDate}>
                    {messages[0]?.timestamp ? new Date(messages[0].timestamp).toLocaleDateString('vi-VN') : 'Hôm nay'}
                  </div>
                </div>
                <div className={styles.messageCount}>
                  {messages.length} tin nhắn
                </div>
              </div>
            ) : (
              <div className={styles.emptyHistory}>
                <div className={styles.emptyIcon}>💬</div>
                <p>Chưa có lịch sử chat</p>
                <small>Bắt đầu cuộc trò chuyện để xem lịch sử ở đây</small>
              </div>
            )}
          </div>

               {/* Quick Actions */}
               <div className={styles.quickActions}>
                 <h4>Chủ đề nhanh</h4>
                 <div className={styles.quickActionGrid}>
                   {quickActions.map((action, index) => (
                     <button
                       key={index}
                       className={styles.quickActionButton}
                       style={{ '--action-color': action.color }}
                       onClick={() => setInputMessage(`Hãy giúp tôi học về ${action.text}`)}
                     >
                       <span className={styles.actionIcon}>{action.icon}</span>
                       <span className={styles.actionText}>{action.text}</span>
                     </button>
                   ))}
                 </div>
                 
                 <h4>Gợi ý câu hỏi</h4>
                 <div className={styles.quickSuggestions}>
                   {suggestions.slice(0, 3).map((suggestion, index) => (
                     <button
                       key={index}
                       className={styles.quickSuggestion}
                       onClick={() => setInputMessage(suggestion)}
                     >
                       {suggestion}
                     </button>
                   ))}
                 </div>
               </div>
        </div>

        {/* Chat Area */}
        <div className={styles.chatContainer}>
        {/* Messages */}
        <div className={styles.messagesContainer}>
          <div className={styles.messagesWrapper}>
            {messages.length === 1 && (
              <div className={styles.welcomeMessage}>
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: '#333' }}>
                  🎓 Chào mừng đến với Learning Assistant!
                </h2>
                <p style={{ margin: '0', color: '#666', fontSize: '1rem' }}>
                  Tôi ở đây để giúp bạn học tập hiệu quả hơn. Hãy bắt đầu cuộc trò chuyện!
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>
                    {message.text.split('\n').map((line, index) => (
                      <p key={index} style={{ margin: line ? '0 0 8px 0' : '0' }}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.message} ${styles.botMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && !isTyping && (
          <div className={styles.suggestions}>
            <h3>Gợi ý câu hỏi:</h3>
            <div className={styles.suggestionGrid}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionCard}
                  onClick={() => setInputMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn về học tập..."
              className={styles.textInput}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className={styles.sendButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className={styles.inputFooter}>
            <p>AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage