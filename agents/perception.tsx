export default class PerceptionAgent {
  process(inputText: string, aiAnalysis?: any): { topic: string; focus: string; analysis: string } {
    if (aiAnalysis) {
      return {
        topic: aiAnalysis.topic || "general inquiry",
        focus: aiAnalysis.focus || "general",
        analysis: aiAnalysis.analysis || "AI-powered analysis",
      }
    }

    // Fallback logic without AI
    return {
      topic: inputText.toLowerCase().includes("responsible") ? "responsible AI agents" : "general inquiry",
      focus:
        inputText.toLowerCase().includes("autonomy") || inputText.toLowerCase().includes("ethics")
          ? "autonomy and ethics"
          : "general",
      analysis: "Rule-based analysis of user input",
    }
  }
}
