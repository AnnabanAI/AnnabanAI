export default class ActionAgent {
  generateResponse(
    data: { frameworks?: string[]; insights?: string },
    originalQuery: string,
    aiResponse?: string,
  ): string {
    if (aiResponse) {
      return aiResponse
    }

    // Fallback response without AI
    const frameworks = data.frameworks || []
    let response = `Regarding your question: "${originalQuery}"\n\nKey considerations include:\n`

    for (const framework of frameworks) {
      response += `- ${framework}\n`
    }

    if (data.insights) {
      response += `\nInsights: ${data.insights}`
    }

    return response
  }
}
