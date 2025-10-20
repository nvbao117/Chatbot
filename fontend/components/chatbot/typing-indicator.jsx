"use client"

export function TypingIndicator() {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 px-4 py-2 w-fit">
      <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0s" }} />
      <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
      <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
    </div>
  )
}
