"use client"

export function ChatMessage({ message }) {
  const isUser = message.sender === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6 animate-in fade-in slide-in-from-bottom-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-6 py-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-br-none transform hover:scale-[1.02] transition-transform"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-none hover:border-purple-100 transition-colors"
        }`}
      >
        {message.type === "text" && <p className="text-sm leading-relaxed">{message.content}</p>}
        {message.type === "code" && (
          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
            <code>{message.content}</code>
          </pre>
        )}
      </div>
      <span className={`text-xs text-gray-500 mt-1 ${isUser ? "mr-2" : "ml-2"}`}>
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  )
}
