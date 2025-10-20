"use client"

export function ChatSuggestions({ onSelectSuggestion }) {
  const suggestions = [
    "Explain photosynthesis",
    "Help me with calculus",
    "What is quantum physics?",
    "How to solve quadratic equations?",
    "Explain the water cycle",
    "What is machine learning?",
  ]

  return (
    <div className="border-t border-gray-200 bg-gray-50 p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Suggested topics:</h4>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-700 transition-all hover:border-purple-500 hover:bg-purple-50 hover:shadow-md"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
