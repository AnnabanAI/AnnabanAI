import { xai } from "@ai-sdk/xai"

// Configure xAI with your API key
export const grokModel = xai("grok-3")

// AI Configuration settings
export const AI_CONFIG = {
  model: grokModel,
  defaultTemperature: 0.5,
  maxTokens: 2000,
  timeout: 30000, // 30 seconds
}

// Error handling wrapper for AI calls
export async function safeAICall<T>(
  aiFunction: () => Promise<T>,
  fallback: T,
  errorMessage = "AI call failed",
): Promise<T> {
  try {
    return await aiFunction()
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    return fallback
  }
}
