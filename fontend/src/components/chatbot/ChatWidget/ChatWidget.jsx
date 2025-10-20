/**
 * Chat Widget Component
 * 
 * Component này render widget chat nổi với các tính năng:
 * - Chat window với input và messages
 * - Chat history sidebar có thể toggle
 * - Redux state management cho conversations
 * - Auto-save/load từ localStorage
 * - Responsive design cho mobile
 */

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChatWindow } from "../ChatWindow/ChatWindow"
import { ChatHistory } from "../ChatHistory/ChatHistory"
import { useChatbot } from "../../../hooks/useChatbot"

export const ChatWidget = ({ isOpen: externalIsOpen, onToggle }) => {
  // State quản lý mở/đóng widget (internal nếu không có external control)
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  
  // State quản lý hiển thị chat history sidebar
  const [showHistory, setShowHistory] = useState(false)
  
  // Sử dụng external control nếu có, nếu không dùng internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = onToggle || setInternalIsOpen

  // Use Redux chat state
  const { 
    conversations, 
    currentConversationId, 
    messages, 
    isLoading, 
    isTyping, 
    error,
    sendMessage, 
    startChat, 
    loadChat, 
    deleteChat,
    loadMessagesFromLocalStorage,
    initializeFromLocalStorage
  } = useChatbot()

  // Initialize chat with localStorage data if no conversations exist
  useEffect(() => {
    if (conversations.length === 0) {
      const savedHistory = localStorage.getItem('chatHistory')
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory)
          if (parsedHistory.length > 0) {
            // Create a conversation from localStorage data
            const conversationId = Date.now().toString()
            const conversation = {
              id: conversationId,
              title: "Previous Chat",
              createdAt: new Date().toISOString(),
              messageCount: parsedHistory.length
            }
            
            // Initialize with localStorage data
            initializeFromLocalStorage({
              conversations: [conversation],
              messages: parsedHistory,
              currentId: conversationId
            })
          } else {
            // Create default conversation if no history exists
            startChat()
          }
        } catch (error) {
          console.error('Error loading chat history:', error)
          // Create default conversation on error
          startChat()
        }
      } else {
        // Create default conversation if no history exists
        startChat()
      }
    }
  }, [conversations.length, startChat, initializeFromLocalStorage])

  const handleSelectConversation = (conversationId) => {
    loadChat(conversationId)
    setShowHistory(false)
  }

  const handleDeleteConversation = (conversationId) => {
    if (conversations.length <= 1) return // Don't delete the last conversation
    deleteChat(conversationId)
  }

  const handleNewConversation = () => {
    startChat()
    setShowHistory(false)
  }

  return (
    <>
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '6rem',
          right: '2rem',
          width: showHistory ? '700px' : '400px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          zIndex: 101,
          border: '1px solid #e5e7eb',
          display: 'flex',
          transition: 'width 0.3s ease'
        }}>
          {showHistory && (
            <ChatHistory 
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              onDeleteConversation={handleDeleteConversation}
              currentId={currentConversationId}
            />
          )}
          <ChatWindow 
            onClose={() => setIsOpen(false)}
            onToggleHistory={() => setShowHistory(!showHistory)}
            onNewConversation={handleNewConversation}
            currentConversationId={currentConversationId}
            conversations={conversations}
            messages={messages}
            sendMessage={sendMessage}
            isLoading={isLoading}
            isTyping={isTyping}
            error={error}
          />
        </div>
      )}

      <button 
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 100
        }}
        onClick={() => setIsOpen(!isOpen)} 
        title="Open Chat"
      >
        💬
      </button>
    </>
  )
}
