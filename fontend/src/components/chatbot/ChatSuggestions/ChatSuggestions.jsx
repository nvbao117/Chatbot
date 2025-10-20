"use client"
import "./ChatSuggestions.module.css"

export const ChatSuggestions = ({ onSelectSuggestion }) => {
  const suggestions = [
    "Explain photosynthesis",
    "Help me with calculus",
    "What is quantum physics?",
    "How to solve quadratic equations?",
    "Explain the water cycle",
    "What is machine learning?",
  ]

  return (
    <div className="suggestions-container">
      <h4>Suggested topics:</h4>
      <div className="suggestions-grid">
        {suggestions.map((suggestion, index) => (
          <button key={index} className="suggestion-button" onClick={() => onSelectSuggestion(suggestion)}>
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChatSuggestions
