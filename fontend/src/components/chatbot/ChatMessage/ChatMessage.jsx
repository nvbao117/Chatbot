import "./ChatMessage.module.css"

export const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user"

  return (
    <div className={`chat-message ${isUser ? "user-message" : "bot-message"}`}>
      <div className={`message-content ${isUser ? "user-content" : "bot-content"}`}>
        {message.type === "text" && <p className="message-text">{message.content}</p>}
        {message.type === "code" && (
          <pre className="message-code">
            <code>{message.content}</code>
          </pre>
        )}
      </div>
      <span className="message-time">
        {new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  )
}

export default ChatMessage
