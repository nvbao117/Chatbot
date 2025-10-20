"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-6 sticky bottom-0">
      <div className="flex gap-4 max-w-4xl mx-auto">
        <textarea
          className="flex-1 resize-none rounded-xl border border-gray-200 px-6 py-4 text-base leading-relaxed placeholder:text-gray-400 focus:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your studies..."
          disabled={isLoading}
          rows="1"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4 text-white font-medium transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          disabled={!input.trim() || isLoading}
          title="Send message (Enter)"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  )
}
