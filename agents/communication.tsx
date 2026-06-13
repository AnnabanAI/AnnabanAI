export default class CommunicationAgent {
  fetchData(topic: string, analysis: string, aiData?: any): { frameworks?: string[]; insights?: string } {
    if (aiData) {
      return {
        frameworks: aiData.frameworks || [],
        insights: aiData.insights || "",
      }
    }

    // Fallback data without AI
    if (topic === "responsible AI agents") {
      return {
        frameworks: [
          "Multi-level autonomy with human collaboration.",
          "Ethical reward shaping in reinforcement learning.",
          "Transparency and explainability modules.",
        ],
        insights: "Focus on balancing autonomy with human oversight and ethical constraints.",
      }
    }
    return {
      frameworks: ["General AI principles", "Safety considerations", "Human-centered design"],
      insights: "Consider ethical implications and user needs in AI development.",
    }
  }
}
