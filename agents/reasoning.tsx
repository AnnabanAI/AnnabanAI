export default class ReasoningAgent {
  plan(keyData: { topic: string; focus: string; analysis: string }, aiPlan?: string[]): string[] {
    if (aiPlan && Array.isArray(aiPlan)) {
      return aiPlan
    }

    // Fallback logic without AI
    if (keyData.topic === "responsible AI agents") {
      return ["define autonomy level", "apply ethical constraints", "simulate agent behavior"]
    }
    return ["request clarification", "gather context", "formulate response"]
  }
}
