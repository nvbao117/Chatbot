"use client"

import { useEffect } from "react"
import { useChatbot } from "@/lib/hooks/use-chatbot"
import { ChatWindow } from "@/components/chatbot/chat-window"
import { ChatInput } from "@/components/chatbot/chat-input"
import { ChatHistory } from "@/components/chatbot/chat-history"
import { ChatSuggestions } from "@/components/chatbot/chat-suggestions"

export default function ChatPage() {
  const {
    messages,
    isLoading,
    isTyping,
    error,
    currentConversationId,
    conversations,
    sendMessage,
    startChat,
    loadChat,
    deleteChat,
  } = useChatbot()

  useEffect(() => {
    if (!currentConversationId) {
      startChat()
    }
  }, [currentConversationId, startChat])

  const handleSendMessage = (message) => {
    sendMessage(message)
  }

  const handleSelectSuggestion = (suggestion) => {
    sendMessage(suggestion)
  }

  return (
    <div className="flex h-screen bg-white">
      <ChatHistory
        conversations={conversations}
        onSelectConversation={loadChat}
        onDeleteConversation={deleteChat}
        currentId={currentConversationId}
      />
      <div className="flex flex-1 flex-col">
        <div className="border-b border-gray-200 bg-white px-8 py-6 shadow-sm relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Learning Assistant</h1>
            <p className="text-gray-600 mt-2">Your personal AI tutor ready to help you learn and grow</p>
          </div>
        </div>
        <ChatWindow messages={messages} isTyping={isTyping} />
        {messages.length === 0 && !isTyping && <ChatSuggestions onSelectSuggestion={handleSelectSuggestion} />}
        {error && (
          <div className="border-t border-red-200 bg-red-50 px-6 py-3 text-sm text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading || isTyping} />
      </div>
    </div>
  )
}
