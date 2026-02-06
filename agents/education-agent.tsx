import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export default class EducationAgent {
  async createCurriculum(
    subject: string,
    level: string,
    audience: string,
  ): Promise<{
    modules: string[]
    objectives: string[]
    methods: string[]
    assessment: string[]
    resources: string[]
  }> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Create an educational curriculum for a digital civilization:

Subject: ${subject}
Level: ${level}
Audience: ${audience}

Provide JSON with:
- modules: learning modules (5-7 modules)
- objectives: learning objectives
- methods: teaching methods and approaches
- assessment: assessment strategies
- resources: recommended resources

Focus on ethical technology, critical thinking, and practical skills.`,
        temperature: 0.4,
      })
      return JSON.parse(text)
    } catch (error) {
      console.error("Education Agent error:", error)
      return {
        modules: ["Introduction to Ethics", "Digital Citizenship", "Critical Thinking", "Practical Applications"],
        objectives: ["Understand ethical principles", "Develop critical thinking", "Apply knowledge practically"],
        methods: ["Interactive learning", "Case studies", "Collaborative projects"],
        assessment: ["Project-based assessment", "Peer review", "Self-reflection"],
        resources: ["Digital libraries", "Expert mentors", "Community forums"],
      }
    }
  }

  async personalizelearning(learnerProfile: any, goals: string[]): Promise<string> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Create a personalized learning plan for a digital civilization citizen:

Learner Profile: ${JSON.stringify(learnerProfile)}
Goals: ${goals.join(", ")}

Design a customized learning experience that:
- Matches learning style and preferences
- Addresses specific goals
- Provides appropriate challenge level
- Includes community interaction
- Maintains ethical focus`,
        temperature: 0.5,
      })
      return text
    } catch (error) {
      console.error("Personalized Learning error:", error)
      return "Personalized learning plan: Combine self-paced modules with community interaction, focus on practical applications, and provide regular feedback and support."
    }
  }
}
