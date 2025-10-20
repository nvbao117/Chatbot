"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "./chat-message"
import { TypingIndicator } from "./typing-indicator"
import { MessageCircle } from "lucide-react"

export function ChatWindow({ messages, isTyping }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center max-w-2xl mx-auto">
          <div className="p-4 rounded-full bg-purple-100/50 mb-6">
            <MessageCircle className="h-12 w-12 text-purple-500" />
          </div>
          <h3 className="mb-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Welcome to Learning Assistant</h3>
          <p className="mb-8 text-gray-600 text-lg">Ask me anything about your studies. I'm here to help you learn and grow!</p>
          <div className="rounded-xl bg-white p-6 shadow-lg border border-purple-100/50 text-left w-full max-w-md hover:shadow-xl transition-shadow">
            <p className="mb-4 text-base font-semibold text-purple-900">Try asking about:</p>
            <ul className="space-y-3 text-base text-gray-700">
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-purple-400 mr-3"></span>
                Explaining difficult concepts
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-pink-400 mr-3"></span>
                Solving homework problems
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-indigo-400 mr-3"></span>
                Study tips and strategies
              </li>
              <li className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-blue-400 mr-3"></span>
                Related topics to explore
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}
