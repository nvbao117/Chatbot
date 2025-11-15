import { useState, useRef, useEffect } from "react"
import { ChatHistoryPanel } from "../../components/chatbot/ChatHistoryPanel"
import { useChatbot } from "../../hooks/useChatbot"
import styles from "./ChatPage.module.css"

const SUGGESTIONS = [
  "Giai thich khai niem quang hop",
  "Cach giai phuong trinh bac hai",
  "Lich su Viet Nam the ky 20",
  "Tinh dien tich hinh tron",
  "Tips viet bai luan tieng Anh",
  "Cach hoc tu vung hieu qua",
]

const normalizeStoredMessages = (history = []) =>
  (Array.isArray(history) ? history : [])
    .flatMap((item) => (Array.isArray(item?.messages) ? item.messages : [item]))
    .filter((item) => item && (typeof item === "object"))
    .map((msg) => ({
      id: msg.id || `${Date.now()}-${Math.random()}`,
      content: msg.text || msg.content || msg.message || "",
      sender: msg.sender || (msg.role === "assistant" ? "bot" : "bot"),
      timestamp: msg.timestamp || new Date().toISOString(),
      type: "text",
    }))

export const ChatPage = () => {
  const {
    messages,
    sendMessage,
    isTyping,
    error,
    startChat,
    loadMessagesFromLocalStorage,
    currentConversationId,
  } = useChatbot()

  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messages.length > 0 || currentConversationId) return

    const saved = localStorage.getItem("chatHistory")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) {
          const normalized = normalizeStoredMessages(parsed)
          startChat({
            title: "Previous Chat",
            messages: normalized,
          })
          loadMessagesFromLocalStorage(parsed)
          return
        }
      } catch (storageError) {
        console.error("Failed to restore chat history from storage:", storageError)
      }
    }

    startChat()
  }, [messages.length, currentConversationId, startChat, loadMessagesFromLocalStorage])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    sendMessage(inputMessage)
    setInputMessage("")
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleSelectHistory = (history) => {
    const normalized = normalizeStoredMessages(history)
    startChat({ title: "Previous Chat", messages: normalized })
    loadMessagesFromLocalStorage(history)
  }

  const handleClearHistory = () => {
    startChat({ title: "New Chat", messages: [] })
  }

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.chatPage}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Learning Assistant</h1>
            <p className={styles.subtitle}>AI-powered study companion always ready to help</p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.newChatBtn}
              onClick={() => {
                localStorage.removeItem("chatHistory")
                startChat({ title: "New Chat", messages: [] })
              }}
            >
              New Chat
            </button>
          </div>
        </div>

        <div className={styles.mainContent}>
          <ChatHistoryPanel
            onSelectHistory={handleSelectHistory}
            onClearHistory={() => {
              localStorage.removeItem("chatHistory")
              handleClearHistory()
            }}
          />

          <div className={styles.chatContainer}>
            <div className={styles.messagesContainer}>
              <div className={styles.messagesWrapper}>
                {messages.length === 0 && (
                  <div className={styles.welcomeMessage}>
                    <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.5rem", color: "#333" }}>
                      Chao mung den voi Learning Assistant!
                    </h2>
                    <p style={{ margin: 0, color: "#666", fontSize: "1rem" }}>
                      Toi o day de giup ban hoc tap hieu qua hon. Hay bat dau cuoc tro chuyen!
                    </p>
                  </div>
                )}

                {(Array.isArray(messages) ? messages.filter((m) => m && typeof m === 'object') : []).map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${message.sender === "user" ? styles.userMessage : styles.botMessage}`}
                  >
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>
                        {(message.content || "").split("\n").map((line, index) => (
                          <p key={index} style={{ margin: line ? "0 0 8px 0" : 0 }}>
                            {line}
                          </p>
                        ))}
                      </div>
                      {message.timestamp && (
                        <div className={styles.messageTime}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      )}
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

                {error && (
                  <div className={`${styles.message} ${styles.botMessage}`}>
                    <div className={styles.messageContent}>
                      <div className={styles.messageText}>
                        <p style={{ margin: 0, color: "#dc2626" }}>{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 0 && !isTyping && (
              <div className={styles.suggestions}>
                <h3>Goi y cau hoi:</h3>
                <div className={styles.suggestionGrid}>
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      className={styles.suggestionCard}
                      onClick={() => setInputMessage(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.inputContainer}>
              <div className={styles.inputWrapper}>
                <textarea
                  value={inputMessage}
                  onChange={(event) => setInputMessage(event.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Nhap cau hoi cua ban ve hoc tap..."
                  className={styles.textInput}
                  rows={1}
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className={styles.sendButton}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className={styles.inputFooter}>
                <p>AI co the mac loi. Hay kiem tra thong tin quan trong.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatPage
