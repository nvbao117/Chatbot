import styles from "./ChatHistory.module.css"

export const ChatHistory = ({ conversations, onSelectConversation, onDeleteConversation, currentId }) => {
  return (
    <div className={styles.chatHistory}>
      <div className={styles.historyHeader}>
        <h3>Lịch sử chat</h3>
      </div>
      <div className={styles.historyList}>
        {conversations.length === 0 ? (
          <p className={styles.emptyHistory}>Chưa có cuộc trò chuyện nào</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.historyItem} ${currentId === conv.id ? styles.active : ""}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className={styles.historyItemContent}>
                <p className={styles.historyTitle}>{conv.title}</p>
                <span className={styles.historyDate}>{new Date(conv.createdAt).toLocaleDateString()}</span>
              </div>
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteConversation(conv.id)
                }}
                title="Xóa cuộc trò chuyện"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ChatHistory
