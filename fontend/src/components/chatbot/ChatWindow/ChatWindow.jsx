import { useState, useEffect } from "react"
import { TypingIndicator } from "../TypingIndicator/TypingIndicator"

export const ChatWindow = ({ 
  onClose, 
  onToggleHistory, 
  onNewConversation, 
  currentConversationId, 
  conversations, 
  messages,
  sendMessage,
  isLoading,
  isTyping,
  error
}) => {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage("")
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onToggleHistory}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#667eea',
              padding: '0.25rem'
            }}
            title="Lịch sử chat"
          >
            📋
          </button>
          <h3 style={{ margin: 0, color: '#374151' }}>EduLearn Chat</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={onNewConversation}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontWeight: '500'
            }}
            title="Cuộc trò chuyện mới"
          >
            ✨
          </button>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            color: '#666',
            padding: '2rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>Xin chào!</h3>
            <p style={{ margin: '0', fontSize: '0.9rem' }}>
              Tôi là AI Learning Assistant. Hãy hỏi tôi bất cứ điều gì về học tập!
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              backgroundColor: message.sender === 'user' ? '#6366f1' : '#f3f4f6',
              color: message.sender === 'user' ? 'white' : '#333',
              marginBottom: '0.5rem'
            }}
          >
            <div>{message.content || message.text}</div>
            {message.timestamp && (
              <div style={{
                fontSize: '0.7rem',
                opacity: 0.7,
                marginTop: '0.25rem',
                textAlign: message.sender === 'user' ? 'right' : 'left'
              }}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            maxWidth: '80%',
            padding: '0.5rem 1rem',
            borderRadius: '1rem',
            backgroundColor: '#f3f4f6',
            color: '#333',
            marginBottom: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>AI đang trả lời</span>
              <TypingIndicator />
            </div>
          </div>
        )}
        
        {error && (
          <div style={{
            alignSelf: 'flex-start',
            maxWidth: '80%',
            padding: '0.5rem 1rem',
            borderRadius: '1rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            marginBottom: '0.5rem',
            border: '1px solid #fecaca'
          }}>
            <div>❌ {error}</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            outline: 'none'
          }}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  )
}

export default ChatWindow