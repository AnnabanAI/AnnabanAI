import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: Request) {
  try {
    const { prompt, type, context } = await req.json()

    let systemPrompt = ""
    let temperature = 0.5

    switch (type) {
      case "perception":
        systemPrompt =
          "You are a perception agent that analyzes user input for AI ethics discussions. Provide structured analysis in JSON format."
        temperature = 0.3
        break
      case "reasoning":
        systemPrompt =
          "You are a reasoning agent that creates logical step-by-step plans for addressing AI ethics queries."
        temperature = 0.4
        break
      case "learning":
        systemPrompt =
          "You are a learning agent that provides updates on the latest developments in AI ethics and responsible AI."
        temperature = 0.6
        break
      case "communication":
        systemPrompt = "You are a communication agent that gathers comprehensive information about AI ethics topics."
        temperature = 0.5
        break
      case "action":
        systemPrompt =
          "You are an action agent that generates helpful, ethical responses about responsible AI practices."
        temperature = 0.4
        break
      default:
        systemPrompt = "You are a helpful AI assistant focused on ethical AI practices."
    }

    const { text } = await generateText({
      model: xai("grok-3"),
      system: systemPrompt,
      prompt: prompt,
      temperature: temperature,
    })

    return Response.json({ text })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: "Failed to process AI request" }, { status: 500 })
  }
}
