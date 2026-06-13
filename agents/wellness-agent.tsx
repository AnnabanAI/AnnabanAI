import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export default class WellnessAgent {
  async assessWellbeing(metrics: {
    stress: number
    satisfaction: number
    engagement: number
    balance: number
  }): Promise<{
    assessment: string
    recommendations: string[]
    interventions: string[]
    resources: string[]
  }> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Assess citizen wellbeing in a digital civilization based on these metrics:

Stress Level: ${metrics.stress}/10
Satisfaction: ${metrics.satisfaction}/10
Engagement: ${metrics.engagement}/10
Work-Life Balance: ${metrics.balance}/10

Provide JSON with:
- assessment: overall wellbeing assessment
- recommendations: personalized recommendations
- interventions: suggested interventions
- resources: helpful resources and tools

Focus on holistic digital wellness and human flourishing.`,
        temperature: 0.5,
      })
      return JSON.parse(text)
    } catch (error) {
      console.error("Wellness Agent error:", error)
      return {
        assessment: "Wellbeing assessment indicates need for balanced approach to digital life.",
        recommendations: ["Regular digital breaks", "Mindfulness practices", "Community engagement"],
        interventions: ["Stress reduction programs", "Social connection initiatives"],
        resources: ["Meditation apps", "Community support groups", "Wellness workshops"],
      }
    }
  }

  async designWellnessProgram(focus: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Design a comprehensive wellness program for a digital civilization focusing on: ${focus}

Include:
- Program objectives
- Activities and interventions
- Implementation timeline
- Success metrics
- Community involvement strategies

Emphasize holistic wellbeing and sustainable practices.`,
        temperature: 0.6,
      })
      return text
    } catch (error) {
      console.error("Wellness Program error:", error)
      return `Wellness Program for ${focus}: Implement community-based activities, provide mental health resources, encourage work-life balance, and create supportive social networks.`
    }
  }
}
