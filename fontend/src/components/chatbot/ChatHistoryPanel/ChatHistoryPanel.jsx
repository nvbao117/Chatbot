import { useState, useEffect } from "react"
import styles from "./ChatHistoryPanel.module.css"

export const ChatHistoryPanel = ({ onSelectHistory, onClearHistory }) => {
  const [history, setHistory] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadHistory = () => {
      const saved = localStorage.getItem('chatHistory')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setHistory(parsed)
        } catch (error) {
          console.error('Error loading chat history:', error)
        }
      }
    }
    loadHistory()
  }, [])

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) {
      localStorage.removeItem('chatHistory')
      setHistory([])
      onClearHistory?.()
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hôm nay'
    if (diffDays === 2) return 'Hôm qua'
    if (diffDays <= 7) return `${diffDays - 1} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  const getLastMessage = (messages) => {
    if (!messages || messages.length === 0) return 'Chưa có tin nhắn'
    const lastMsg = messages[messages.length - 1]
    return lastMsg.text || lastMsg.content || 'Tin nhắn'
  }

  return (
    <div className={styles.historyPanel}>
      <button 
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Lịch sử chat"
      >
        📋
      </button>
      
      {isOpen && (
        <div className={styles.historyDropdown}>
          <div className={styles.historyHeader}>
            <h3>Lịch sử chat</h3>
            <button 
              className={styles.clearButton}
              onClick={handleClearHistory}
              title="Xóa lịch sử"
            >
              🗑️
            </button>
          </div>
          
          <div className={styles.historyList}>
            {history.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Chưa có lịch sử chat</p>
              </div>
            ) : (
              <div className={styles.historyItem}>
                <div className={styles.historyContent}>
                  <div className={styles.historyTitle}>
                    Cuộc trò chuyện hiện tại
                  </div>
                  <div className={styles.historyPreview}>
                    {getLastMessage(history)}
                  </div>
                  <div className={styles.historyDate}>
                    {formatDate(history[0]?.timestamp)}
                  </div>
                </div>
                <button 
                  className={styles.loadButton}
                  onClick={() => onSelectHistory?.(history)}
                  title="Tải lịch sử"
                >
                  📥
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatHistoryPanel
