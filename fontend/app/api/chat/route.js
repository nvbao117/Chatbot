import { generateText } from "ai"

// Store conversations in memory (in production, use a database)
const conversations = new Map()

export async function POST(request) {
  try {
    const { message, conversationId } = await request.json()

    if (!message || !message.trim()) {
      return Response.json({ error: "Message is required" }, { status: 400 })
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

    return Response.json({
      reply: text,
      conversationId,
      messageCount: history.length,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json(
      {
        error: "Failed to process message",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
