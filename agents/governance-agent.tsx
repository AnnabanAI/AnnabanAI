import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export default class GovernanceAgent {
  async createPolicy(
    issue: string,
    stakeholders: string[],
  ): Promise<{
    policy: string
    rationale: string
    implementation: string[]
    metrics: string[]
    review: string
  }> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Create a governance policy for a digital civilization addressing: ${issue}

Stakeholders: ${stakeholders.join(", ")}

Provide JSON with:
- policy: clear policy statement
- rationale: reasoning behind the policy
- implementation: step-by-step implementation plan
- metrics: success metrics and KPIs
- review: review and update schedule

Ensure democratic principles, transparency, and ethical governance.`,
        temperature: 0.3,
      })
      return JSON.parse(text)
    } catch (error) {
      console.error("Governance Agent error:", error)
      return {
        policy: `Governance policy for ${issue}: Establish transparent decision-making processes with stakeholder input.`,
        rationale: "Democratic governance requires inclusive participation and ethical oversight.",
        implementation: ["Stakeholder consultation", "Policy drafting", "Public review", "Implementation"],
        metrics: ["Stakeholder satisfaction", "Policy effectiveness", "Compliance rates"],
        review: "Quarterly review with annual comprehensive assessment",
      }
    }
  }

  async mediateDispute(parties: string[], issue: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `As a governance mediator in a digital civilization, help resolve this dispute:

Parties: ${parties.join(" vs ")}
Issue: ${issue}

Provide a fair, balanced mediation approach that:
- Acknowledges all perspectives
- Identifies common ground
- Proposes win-win solutions
- Maintains ethical principles
- Preserves community harmony`,
        temperature: 0.4,
      })
      return text
    } catch (error) {
      console.error("Dispute Mediation error:", error)
      return "Mediation recommendation: Facilitate open dialogue between parties, identify shared interests, and develop collaborative solutions that respect all stakeholders' concerns."
    }
  }
}
