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
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const msInDay = 1000 * 60 * 60 * 24
    const diffTime = now.setHours(0,0,0,0) - date.setHours(0,0,0,0)
    const diffDays = Math.floor(diffTime / msInDay)

    if (diffDays === 0) return 'Hôm nay'
    if (diffDays === 1) return 'Hôm qua'
    if (diffDays > 1 && diffDays <= 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  const getLastMessage = (messages) => {
    if (!messages || messages.length === 0) return 'Chưa có tin nhắn'
    const safe = Array.isArray(messages) ? messages.filter((m) => m && typeof m === 'object') : []
    if (safe.length === 0) return 'Chưa có tin nhắn'
    const lastMsg = safe[safe.length - 1]
    return lastMsg.text || lastMsg.content || lastMsg.message || 'Tin nhắn'
  }

  const historyContent = (
    <>
      <div className={styles.historyHeader}>
        <h3>Lịch sử chat</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button 
            className={styles.clearButton}
            onClick={handleClearHistory}
            title="Xóa lịch sử"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.historyList}>
        {history.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Chưa có lịch sử chat</p>
          </div>
        ) : (
          history.map((h, idx) => (
            <div key={idx} className={styles.historyItem} onClick={() => onSelectHistory?.(h?.messages || h)}>
              <div className={styles.historyContent}>
                <div className={styles.historyTitle}>
                  {h.title || `Cuộc trò chuyện ${idx + 1}`}
                </div>
                <div className={styles.historyPreview}>
                  {getLastMessage(h.messages || h)}
                </div>
                <div className={styles.historyDate}>
                  {formatDate((h.messages && h.messages[h.messages.length - 1]?.timestamp) || h.timestamp)}
                </div>
              </div>
              <button 
                className={styles.loadButton}
                onClick={(e) => { e.stopPropagation(); onSelectHistory?.(h?.messages || h) }}
                title="Tải lịch sử"
              >
                📥
              </button>
            </div>
          ))
        )}
      </div>
    </>
  )

  return (
    <div className={styles.historyPanel}>
      {/* Sidebar for desktop */}
      <aside className={styles.sidebar}>
        {historyContent}
      </aside>

      {/* Toggle for small screens */}
      <button 
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        title="Lịch sử chat"
      >
        📋
      </button>

      {/* Dropdown for small screens */}
      {isOpen && (
        <div className={styles.historyDropdown}>
          {historyContent}
        </div>
      )}
    </div>
  )
}

export default ChatHistoryPanel
