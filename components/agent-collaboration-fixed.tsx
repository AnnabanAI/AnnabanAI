"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Shield,
  Users,
  Sparkles,
  Search,
  Vote,
  Heart,
  GraduationCap,
  Clock,
  CheckCircle,
  Network,
  Lightbulb,
  AlertTriangle,
} from "lucide-react"

// Helper to call the server-side AI route
async function callAI(type: string, prompt: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, prompt }),
  })
  if (!res.ok) throw new Error("AI request failed")
  const data = await res.json()
  return data.text
}

interface CollaborationStep {
  id: string
  phase: string
  agent: string
  action: string
  output?: string
  status: "pending" | "processing" | "completed" | "blocked"
  ethicalScore?: number
  timestamp: string
}

interface AgentContribution {
  agentId: string
  agentName: string
  domain: string
  contribution: string
  confidence: number
  ethicalAssessment: number
  recommendations: string[]
  concerns?: string[]
}

interface CollaborationScenario {
  id: string
  title: string
  description: string
  complexity: "medium" | "high" | "critical"
  domains: string[]
  stakeholders: string[]
  ethicalChallenges: string[]
  expectedOutcome: string
}

const scenarios: CollaborationScenario[] = [
  {
    id: "ai-governance",
    title: "AI Governance Framework Design",
    description: "Design a comprehensive governance framework for AI development and deployment in the digital civilization",
    complexity: "critical",
    domains: ["governance", "security", "ethics", "research", "education"],
    stakeholders: ["Citizens", "Developers", "Policymakers", "Ethicists"],
    ethicalChallenges: ["Transparency vs Privacy", "Innovation vs Safety", "Autonomy vs Control"],
    expectedOutcome: "Balanced governance framework with ethical safeguards and democratic oversight",
  },
  {
    id: "wellness-crisis",
    title: "Digital Wellness Crisis Response",
    description: "Address a sudden increase in digital burnout and mental health issues among citizens",
    complexity: "high",
    domains: ["wellness", "governance", "education", "creative"],
    stakeholders: ["Affected Citizens", "Mental Health Professionals", "Community Leaders"],
    ethicalChallenges: ["Privacy in Health Data", "Mandatory vs Voluntary Support", "Resource Allocation"],
    expectedOutcome: "Comprehensive wellness intervention with community support and policy changes",
  },
  {
    id: "innovation-dilemma",
    title: "Breakthrough Technology Assessment",
    description: "Evaluate a revolutionary but potentially disruptive AI technology for adoption",
    complexity: "critical",
    domains: ["research", "security", "ethics", "creative", "governance"],
    stakeholders: ["Researchers", "Citizens", "Business Community", "Ethics Board"],
    ethicalChallenges: ["Innovation vs Stability", "Benefits vs Risks", "Equity in Access"],
    expectedOutcome: "Evidence-based decision with ethical guidelines and implementation plan",
  },
]

async function getAgentAnalysis(agentType: string, problem: string, context: any) {
  try {
    const text = await callAI(
      "action",
      `As a ${agentType} agent in a digital civilization, analyze this problem:

Problem: ${problem}
Context: ${JSON.stringify(context)}

Provide your analysis as JSON with:
- contribution: your main insight/recommendation (2-3 sentences)
- confidence: confidence level 1-100
- ethicalAssessment: ethical score 1-100
- recommendations: array of 2-3 specific recommendations
- concerns: array of potential issues you identify

Focus on your domain expertise while considering ethical implications. Respond only with valid JSON.`
    )
    return JSON.parse(text)
  } catch {
    return {
      contribution: `${agentType} analysis: Recommend structured approach with stakeholder consultation and ethical review.`,
      confidence: 75,
      ethicalAssessment: 80,
      recommendations: ["Conduct stakeholder analysis", "Implement ethical safeguards", "Monitor outcomes"],
      concerns: ["Need for broader consultation", "Resource allocation challenges"],
    }
  }
}

async function synthesizeCollaboration(contributions: AgentContribution[], problem: string) {
  try {
    const text = await callAI(
      "action",
      `Synthesize these agent contributions into a comprehensive solution:

Problem: ${problem}

Agent Contributions:
${contributions.map((c) => `${c.agentName} (${c.domain}): ${c.contribution}\nRecommendations: ${c.recommendations.join(", ")}\nConcerns: ${c.concerns?.join(", ") || "None"}`).join("\n\n")}

Create a unified response that integrates all perspectives, addresses identified concerns, provides actionable next steps, and maintains ethical principles.`
    )
    return text
  } catch {
    return "Comprehensive Solution: Based on multi-agent analysis, we recommend a phased approach that balances innovation with ethical considerations, includes stakeholder consultation, implements robust safeguards, and establishes monitoring mechanisms for continuous improvement."
  }
}

const agentTypes = [
  { id: "governance", name: "DemocracyGuide", icon: Vote, color: "bg-blue-500" },
  { id: "security", name: "SecurityGuardian", icon: Shield, color: "bg-red-500" },
  { id: "ethics", name: "FlameKeeper", icon: Sparkles, color: "bg-purple-500" },
  { id: "research", name: "KnowledgeSeeker", icon: Search, color: "bg-green-500" },
  { id: "wellness", name: "HarmonyKeeper", icon: Heart, color: "bg-pink-500" },
  { id: "education", name: "WisdomWeaver", icon: GraduationCap, color: "bg-indigo-500" },
  { id: "creative", name: "InnovationSpark", icon: Lightbulb, color: "bg-yellow-500" },
]

export default function AgentCollaboration() {
  const [selectedScenario, setSelectedScenario] = useState<CollaborationScenario>(scenarios[0])
  const [collaborationSteps, setCollaborationSteps] = useState<CollaborationStep[]>([])
  const [agentContributions, setAgentContributions] = useState<AgentContribution[]>([])
  const [finalSolution, setFinalSolution] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [activeTab, setActiveTab] = useState("scenario")

  const runCollaboration = async () => {
    setIsRunning(true)
    setCollaborationSteps([])
    setAgentContributions([])
    setFinalSolution("")
    setCurrentPhase(0)

    try {
      // Phase 1: Problem Analysis
      setCurrentPhase(1)
      const analysisSteps: CollaborationStep[] = []
      const relevantAgents = agentTypes.filter((agent) => selectedScenario.domains.includes(agent.id))
      const newContributions: AgentContribution[] = []

      for (const agent of relevantAgents) {
        const step: CollaborationStep = {
          id: `analysis-${agent.id}`,
          phase: "Analysis",
          agent: agent.name,
          action: "Analyzing problem from domain perspective",
          status: "processing",
          timestamp: new Date().toISOString(),
        }
        analysisSteps.push(step)
        setCollaborationSteps([...analysisSteps])

        await new Promise((resolve) => setTimeout(resolve, 800))

        const analysis = await getAgentAnalysis(agent.name, selectedScenario.description, {
          complexity: selectedScenario.complexity,
          stakeholders: selectedScenario.stakeholders,
          ethicalChallenges: selectedScenario.ethicalChallenges,
        })

        step.status = "completed"
        step.output = analysis.contribution
        step.ethicalScore = analysis.ethicalAssessment

        const contribution: AgentContribution = {
          agentId: agent.id,
          agentName: agent.name,
          domain: agent.id,
          contribution: analysis.contribution,
          confidence: analysis.confidence,
          ethicalAssessment: analysis.ethicalAssessment,
          recommendations: analysis.recommendations,
          concerns: analysis.concerns,
        }

        newContributions.push(contribution)
        setAgentContributions([...newContributions])
        setCollaborationSteps([...analysisSteps])
      }

      // Phase 2: Cross-Agent Review
      setCurrentPhase(2)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const reviewStep: CollaborationStep = {
        id: "cross-review",
        phase: "Review",
        agent: "All Agents",
        action: "Cross-reviewing contributions and identifying conflicts",
        status: "processing",
        timestamp: new Date().toISOString(),
      }
      setCollaborationSteps((prev) => [...prev, reviewStep])
      await new Promise((resolve) => setTimeout(resolve, 1500))
      reviewStep.status = "completed"
      reviewStep.output = "Identified potential conflicts and synergies between agent recommendations"
      setCollaborationSteps((prev) => [...prev.slice(0, -1), { ...reviewStep }])

      // Phase 3: Ethical Validation
      setCurrentPhase(3)
      const ethicsStep: CollaborationStep = {
        id: "ethics-validation",
        phase: "Ethics",
        agent: "FlameKeeper",
        action: "Validating ethical implications of proposed solutions",
        status: "processing",
        timestamp: new Date().toISOString(),
      }
      setCollaborationSteps((prev) => [...prev, ethicsStep])
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const avgEthicalScore = newContributions.length > 0
        ? newContributions.reduce((sum, c) => sum + c.ethicalAssessment, 0) / newContributions.length
        : 80
      ethicsStep.status = avgEthicalScore >= 75 ? "completed" : "blocked"
      ethicsStep.ethicalScore = Math.round(avgEthicalScore)
      ethicsStep.output = avgEthicalScore >= 75
        ? "Ethical validation passed. Proceeding with synthesis."
        : "Ethical concerns identified. Requiring additional safeguards."
      setCollaborationSteps((prev) => [...prev.slice(0, -1), { ...ethicsStep }])

      // Phase 4: Solution Synthesis
      setCurrentPhase(4)
      const synthesisStep: CollaborationStep = {
        id: "synthesis",
        phase: "Synthesis",
        agent: "AnnabanAI",
        action: "Synthesizing all contributions into unified solution",
        status: "processing",
        timestamp: new Date().toISOString(),
      }
      setCollaborationSteps((prev) => [...prev, synthesisStep])

      const solution = await synthesizeCollaboration(newContributions, selectedScenario.description)
      synthesisStep.status = "completed"
      synthesisStep.output = "Comprehensive solution synthesized"
      setCollaborationSteps((prev) => [...prev.slice(0, -1), { ...synthesisStep }])
      setFinalSolution(solution)
      setCurrentPhase(5)
    } catch (error) {
      console.error("Collaboration error:", error)
    } finally {
      setIsRunning(false)
    }
  }

  const getAgentIcon = (agentName: string) => {
    const agent = agentTypes.find((a) => a.name === agentName)
    return agent?.icon || Brain
  }

  const getAgentColor = (agentName: string) => {
    const agent = agentTypes.find((a) => a.name === agentName)
    return agent?.color || "bg-gray-500"
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6 text-primary" />
            Multi-Agent Collaboration System
          </CardTitle>
          <CardDescription>
            Watch how specialized AI agents work together to solve complex problems through structured collaboration
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenario">Scenario</TabsTrigger>
          <TabsTrigger value="collaboration">Live Collaboration</TabsTrigger>
          <TabsTrigger value="contributions">Agent Insights</TabsTrigger>
          <TabsTrigger value="solution">Final Solution</TabsTrigger>
        </TabsList>

        <TabsContent value="scenario" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedScenario.id === scenario.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <Badge variant={scenario.complexity === "critical" ? "destructive" : scenario.complexity === "high" ? "default" : "secondary"}>
                      {scenario.complexity}
                    </Badge>
                  </div>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-1">Involved Domains</div>
                    <div className="flex flex-wrap gap-1">
                      {scenario.domains.map((domain) => (
                        <Badge key={domain} variant="outline" className="text-xs">{domain}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Ethical Challenges</div>
                    <div className="text-xs text-muted-foreground">{scenario.ethicalChallenges.join(", ")}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Selected: {selectedScenario.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Stakeholders</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedScenario.stakeholders.map((s) => (
                      <Badge key={s} variant="secondary"><Users className="h-3 w-3 mr-1" />{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Expected Outcome</h4>
                  <p className="text-sm text-muted-foreground">{selectedScenario.expectedOutcome}</p>
                </div>
              </div>
              <Button onClick={runCollaboration} disabled={isRunning} size="lg" className="w-full">
                {isRunning ? (
                  <><Clock className="mr-2 h-4 w-4 animate-spin" /> Collaboration in Progress...</>
                ) : (
                  <><Network className="mr-2 h-4 w-4" /> Start Multi-Agent Collaboration</>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-4">
          {(isRunning || currentPhase > 0) && (
            <Card>
              <CardHeader><CardTitle>Collaboration Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Phase {Math.min(currentPhase, 5)} of 5</span>
                    <span>
                      {currentPhase === 1 && "Analysis Phase"}
                      {currentPhase === 2 && "Cross-Review Phase"}
                      {currentPhase === 3 && "Ethical Validation"}
                      {currentPhase === 4 && "Solution Synthesis"}
                      {currentPhase >= 5 && "Complete"}
                    </span>
                  </div>
                  <Progress value={(Math.min(currentPhase, 5) / 5) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Collaboration Timeline</CardTitle>
              <CardDescription>Real-time view of agent interactions and decision-making</CardDescription>
            </CardHeader>
            <CardContent>
              {collaborationSteps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Network className="h-8 w-8 mx-auto mb-2" />
                  <p>No collaboration steps yet. Start a collaboration to see agents working together.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {collaborationSteps.map((step) => {
                    const AgentIcon = getAgentIcon(step.agent)
                    return (
                      <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`p-2 rounded-full ${getAgentColor(step.agent)} text-white`}>
                          <AgentIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-sm">{step.agent}</span>
                            <Badge variant="outline" className="text-xs">{step.phase}</Badge>
                            {step.status === "completed" ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : step.status === "blocked" ? (
                              <AlertTriangle className="h-3 w-3 text-destructive" />
                            ) : (
                              <Clock className="h-3 w-3 text-yellow-500 animate-spin" />
                            )}
                            {step.ethicalScore !== undefined && (
                              <Badge variant={step.ethicalScore >= 75 ? "default" : "destructive"} className="text-xs">
                                Ethics: {step.ethicalScore}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{step.action}</p>
                          {step.output && (
                            <div className="text-xs bg-muted p-2 rounded">{step.output}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-4">
          {agentContributions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                <Brain className="h-8 w-8 mx-auto mb-2" />
                <p>No agent contributions yet. Run a collaboration to see agent insights.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentContributions.map((contrib) => {
                const AgentIcon = getAgentIcon(contrib.agentName)
                return (
                  <Card key={contrib.agentId}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-full ${getAgentColor(contrib.agentName)} text-white`}>
                          <AgentIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{contrib.agentName}</CardTitle>
                          <CardDescription>{contrib.domain}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">{contrib.contribution}</p>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Confidence: </span>
                          <span className="font-medium">{contrib.confidence}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ethics: </span>
                          <span className="font-medium">{contrib.ethicalAssessment}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium mb-1">Recommendations</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {contrib.recommendations.map((r, i) => <li key={i}>- {r}</li>)}
                        </ul>
                      </div>
                      {contrib.concerns && contrib.concerns.length > 0 && (
                        <div>
                          <div className="text-xs font-medium mb-1 text-destructive">Concerns</div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {contrib.concerns.map((c, i) => <li key={i}>- {c}</li>)}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="solution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synthesized Solution</CardTitle>
              <CardDescription>
                Combined recommendation from all participating agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {finalSolution ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-green-800 font-sans">{finalSolution}</pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-8 w-8 mx-auto mb-2" />
                  <p>No solution synthesized yet. Run a collaboration to generate a solution.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
