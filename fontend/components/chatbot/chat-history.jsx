"use client"

import { Trash2 } from "lucide-react"

export function ChatHistory({ conversations, onSelectConversation, onDeleteConversation, currentId }) {
  return (
    <div className="w-80 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white flex flex-col shadow-lg">
      <div className="border-b border-gray-200 p-6 bg-white">
        <h3 className="font-bold text-xl text-gray-900">Chat History</h3>
        <p className="text-sm text-gray-500 mt-1">Your previous conversations</p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-500">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group mb-2 flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all ${
                currentId === conv.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{conv.title}</p>
                <span className={`text-xs ${currentId === conv.id ? "text-purple-100" : "text-gray-500"}`}>
                  {new Date(conv.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button
                className={`ml-2 opacity-0 transition-opacity group-hover:opacity-100 ${
                  currentId === conv.id ? "text-white" : "text-gray-400 hover:text-red-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteConversation(conv.id)
                }}
                title="Delete conversation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
