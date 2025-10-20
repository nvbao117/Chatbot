import { generateText } from "ai"

// Store conversations in memory (in production, use a database)
const conversations = new Map()

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { message, conversationId } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" })
    }

    // Get or create conversation
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, [])
    }

    const history = conversations.get(conversationId)

    // Add user message to history
    history.push({
      role: "user",
      content: message,
    })

    // Generate AI response using Vercel AI SDK
    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      system: `You are a helpful learning assistant. Your role is to:
1. Explain complex topics in simple, understandable language
2. Provide examples and analogies when helpful
3. Ask clarifying questions if needed
4. Suggest related topics to explore
5. Help with homework and study questions
6. Encourage critical thinking

Keep responses concise but informative. Use formatting like bullet points when appropriate.`,
      messages: history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    // Add bot response to history
    history.push({
      role: "assistant",
      content: text,
    })

    // Keep only last 20 messages to save memory
    if (history.length > 20) {
      conversations.set(conversationId, history.slice(-20))
    }

    return res.status(200).json({
      reply: text,
      conversationId,
      messageCount: history.length,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return res.status(500).json({
      error: "Failed to process message",
      details: error.message,
    })
  }
}
