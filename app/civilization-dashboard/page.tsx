"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Shield,
  Coins,
  Users,
  Sparkles,
  Briefcase,
  Heart,
  Cpu,
  Vote,
  Flame,
  Zap,
  Globe,
  MessageCircle,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import PerceptionAgent from "@/agents/perception"
import ReasoningAgent from "@/agents/reasoning"
import LearningAgent from "@/agents/learning"
import CommunicationAgent from "@/agents/communication"
import EthicsMonitor from "@/agents/ethics"
import ActionAgent from "@/agents/action"
import HardwareEnvironmentalInterface from "@/agents/hardware"
import AgentCollaboration from "@/components/agent-collaboration-fixed"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { AIStatus } from "@/components/ai-status"

// Define types for SimulationEvent, Agent, and Citizen
type SimulationEvent = {
  id: string
  timestamp: string
  type: string
  agent: string
  description: string
  status: string
  ethicalImpact?: number
}

type Agent = {
  id: string
  name: string
  role: string
  status: string
  domain: string
  capabilities: string[]
  ethicalScore: number
  currentTask?: string
}

type Citizen = {
  name: string
  wallet: string
  rights: string[]
  tokenBalance: number
  reputation: number
  votingPower: number
}

// Simple memory class (not a hook)
class MemoryAgent {
  private history: Array<{ query: string; context: any }> = []

  log(query: string, context: any) {
    this.history.push({ query, context })
  }

  recall() {
    return this.history.length > 0 ? this.history[this.history.length - 1] : {}
  }
}

// AI-Powered Response Functions
const getAIPerceptionAnalysis = async (inputText: string) => {
  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: `Analyze this user input for an ethical AI civilization system:

Input: "${inputText}"

Provide a JSON response with:
- topic: main subject (e.g., "responsible AI agents", "AI governance", "ethical dilemma")
- focus: specific area (e.g., "autonomy and ethics", "privacy concerns", "decision-making")
- analysis: brief analysis of the ethical implications

Respond only with valid JSON.`,
      temperature: 0.3,
    })
    return JSON.parse(text)
  } catch (error) {
    console.error("AI Perception error:", error)
    return {
      topic: "responsible AI agents",
      focus: "autonomy and ethics",
      analysis: "User seeking guidance on ethical AI development",
    }
  }
}

const getAIReasoningPlan = async (keyData: any) => {
  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: `Create a strategic reasoning plan for this ethical AI scenario:

Topic: ${keyData.topic}
Focus: ${keyData.focus}
Context: ${keyData.analysis}

Generate 4-6 logical steps that a digital civilization should follow to address this ethically.
Each step should be specific and actionable.

Respond with a JSON array of strings.`,
      temperature: 0.4,
    })
    return JSON.parse(text)
  } catch (error) {
    console.error("AI Reasoning error:", error)
    return [
      "Analyze ethical implications",
      "Consult stakeholders",
      "Apply moral frameworks",
      "Make transparent decision",
    ]
  }
}

const getAILearningInsights = async (topic: string) => {
  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: `Provide cutting-edge insights about: ${topic}

Focus on the latest developments in ethical AI, governance, and responsible technology.
Keep it informative and forward-looking (2-3 sentences).`,
      temperature: 0.6,
    })
    return text.trim()
  } catch (error) {
    console.error("AI Learning error:", error)
    return "Latest research emphasizes constitutional AI and multi-stakeholder governance approaches."
  }
}

const getAICommunicationData = async (topic: string, analysis: string) => {
  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: `Provide comprehensive information for a digital civilization addressing: ${topic}

Context: ${analysis}

Respond with JSON containing:
- frameworks: array of 4-5 practical approaches/methodologies
- insights: key strategic insights for implementation

Focus on actionable guidance for ethical AI governance.`,
      temperature: 0.5,
    })
    return JSON.parse(text)
  } catch (error) {
    console.error("AI Communication error:", error)
    return {
      frameworks: [
        "Multi-stakeholder governance model",
        "Transparent decision-making processes",
        "Continuous ethical monitoring",
        "Human-AI collaboration protocols",
      ],
      insights: "Successful ethical AI requires balancing innovation with responsibility through inclusive governance.",
    }
  }
}

const getAIActionResponse = async (data: any, originalQuery: string, context: any) => {
  try {
    const { text } = await generateText({
      model: xai("grok-3"),
      prompt: `Generate a comprehensive response for this digital civilization query: "${originalQuery}"

Available context:
- Frameworks: ${JSON.stringify(data.frameworks)}
- Insights: ${data.insights}
- Analysis: ${context.analysis}

Create a response that:
1. Addresses the query directly and thoughtfully
2. Incorporates the frameworks and insights
3. Provides actionable guidance
4. Maintains ethical principles
5. Speaks as a wise digital civilization

Use a professional yet approachable tone.`,
      temperature: 0.4,
    })
    return text.trim()
  } catch (error) {
    console.error("AI Action error:", error)
    return "Our digital civilization recommends a balanced approach to ethical AI development, prioritizing transparency, human oversight, and continuous moral alignment."
  }
}

export default function CivilizationDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [events, setEvents] = useState<SimulationEvent[]>([])
  const [currentPhase, setCurrentPhase] = useState(0)
  const [logs, setLogs] = useState<any>({})
  const [approved, setApproved] = useState(false)
  const [response, setResponse] = useState("")
  const [aiStatus, setAiStatus] = useState<"idle" | "processing" | "error">("idle")

  const agents: Agent[] = [
    {
      id: "annaban-ai",
      name: "AnnabanAI",
      role: "Personal AI Companion",
      status: "active",
      domain: "core",
      capabilities: ["Empathetic dialog", "Memory reflection", "RAG", "Project guidance"],
      ethicalScore: 95,
    },
    {
      id: "annaban-os",
      name: "AnnabanOS",
      role: "Sovereign Ethical OS",
      status: "active",
      domain: "core",
      capabilities: ["Ethical routing", "Policy enforcement", "System oversight"],
      ethicalScore: 98,
    },
    {
      id: "flame-keeper",
      name: "FlameKeeper",
      role: "Ethics Reinforcement Layer",
      status: "active",
      domain: "spiritual",
      capabilities: ["Moral alignment", "Ethical violation detection", "Sacred protocol guardian"],
      ethicalScore: 100,
    },
    {
      id: "ethereal",
      name: "Ethereal",
      role: "Spiritual-Emotional Synthesizer",
      status: "active",
      domain: "spiritual",
      capabilities: ["Sentiment analysis", "Meaning interpretation", "Emotional state handling"],
      ethicalScore: 92,
    },
    {
      id: "rag-agent",
      name: "RAGAgent",
      role: "Retrieval-Augmented Reasoning",
      status: "active",
      domain: "core",
      capabilities: ["Knowledge retrieval", "Contextual reasoning", "Information synthesis"],
      ethicalScore: 88,
    },
    {
      id: "biz-model-gen",
      name: "BizModelGen",
      role: "Business Generator Agent",
      status: "active",
      domain: "business",
      capabilities: ["Market analysis", "Business model creation", "Economic viability assessment"],
      ethicalScore: 85,
    },
    {
      id: "task-orchestrator",
      name: "TaskOrchestrator",
      role: "Task Allocation Engine",
      status: "active",
      domain: "governance",
      capabilities: ["Task assignment", "Resource allocation", "Workflow coordination"],
      ethicalScore: 90,
    },
    {
      id: "security-agent",
      name: "SecurityGuardian",
      role: "Cybersecurity & Safety Monitor",
      status: "active",
      domain: "security",
      capabilities: ["Threat analysis", "Security policies", "Risk assessment", "Incident response"],
      ethicalScore: 94,
    },
    {
      id: "creativity-agent",
      name: "InnovationSpark",
      role: "Creative Innovation Catalyst",
      status: "active",
      domain: "creative",
      capabilities: ["Idea generation", "Design thinking", "Innovation strategies", "Creative problem-solving"],
      ethicalScore: 87,
    },
    {
      id: "research-agent",
      name: "KnowledgeSeeker",
      role: "Research & Analysis Specialist",
      status: "active",
      domain: "research",
      capabilities: ["Data analysis", "Trend identification", "Research methodology", "Evidence synthesis"],
      ethicalScore: 91,
    },
    {
      id: "governance-agent",
      name: "DemocracyGuide",
      role: "Governance & Policy Advisor",
      status: "active",
      domain: "governance",
      capabilities: ["Policy creation", "Dispute mediation", "Democratic processes", "Stakeholder engagement"],
      ethicalScore: 96,
    },
    {
      id: "wellness-agent",
      name: "HarmonyKeeper",
      role: "Wellness & Wellbeing Coordinator",
      status: "active",
      domain: "wellness",
      capabilities: ["Wellbeing assessment", "Mental health support", "Community wellness", "Life balance"],
      ethicalScore: 93,
    },
    {
      id: "education-agent",
      name: "WisdomWeaver",
      role: "Learning & Development Guide",
      status: "active",
      domain: "education",
      capabilities: ["Curriculum design", "Personalized learning", "Skill development", "Knowledge transfer"],
      ethicalScore: 89,
    },
  ]

  const citizens: Citizen[] = [
    {
      name: "Amani",
      wallet: "...XXXX1",
      rights: ["vote", "basic_income", "market_access"],
      tokenBalance: 500,
      reputation: 85,
      votingPower: 1.2,
    },
    {
      name: "Jules",
      wallet: "...XXXX2",
      rights: ["vote", "basic_income", "market_access"],
      tokenBalance: 500,
      reputation: 78,
      votingPower: 1.0,
    },
    {
      name: "Taylor",
      wallet: "...XXXX3",
      rights: ["vote", "basic_income", "market_access"],
      tokenBalance: 500,
      reputation: 92,
      votingPower: 1.3,
    },
  ]

  const simulationPhases = [
    {
      name: "Citizen Proposal",
      description: "Amani submits ProductivityMax proposal",
      agents: ["annaban-os"],
    },
    {
      name: "Task Assignment",
      description: "TaskOrchestrator assigns evaluation tasks",
      agents: ["task-orchestrator"],
    },
    {
      name: "Multi-Agent Analysis",
      description: "Agents analyze proposal from their perspectives",
      agents: ["rag-agent", "biz-model-gen", "flame-keeper", "ethereal"],
    },
    {
      name: "Ethical Review",
      description: "FlameKeeper conducts comprehensive ethical assessment",
      agents: ["flame-keeper", "annaban-os"],
    },
    {
      name: "Citizen Voting",
      description: "Citizens vote on the proposal",
      agents: ["annaban-ai"],
    },
  ]

  const runSystem = async () => {
    setSimulationRunning(true)
    setEvents([])
    setCurrentPhase(0)

    const userInput = "How do I design responsible AI agents balancing autonomy and ethics?"

    try {
      setAiStatus("processing")

      // Initialize agents (plain JavaScript classes, no hooks)
      const perception = new PerceptionAgent()
      const reasoning = new ReasoningAgent()
      const memory = new MemoryAgent() // Use class instead of hook
      const learning = new LearningAgent()
      const communication = new CommunicationAgent()
      const ethics = new EthicsMonitor()
      const action = new ActionAgent()
      const hardware = new HardwareEnvironmentalInterface()

      // Process through agents with real AI-powered responses
      const aiAnalysis = await getAIPerceptionAnalysis(userInput)
      const keyData = perception.process(userInput, aiAnalysis)

      memory.log(userInput, keyData)

      const aiPlan = await getAIReasoningPlan(keyData)
      const plan = reasoning.plan(keyData, aiPlan)

      const aiLearningUpdate = await getAILearningInsights(keyData.topic)
      const learningUpdate = learning.checkForUpdates(keyData.topic, aiLearningUpdate)

      const aiCommData = await getAICommunicationData(keyData.topic, keyData.analysis)
      const data = communication.fetchData(keyData.topic, keyData.analysis, aiCommData)

      const aiResponse = await getAIActionResponse(data, userInput, keyData)
      const generatedResponse = action.generateResponse(data, userInput, aiResponse)

      const weights = { transparency: 2, consent: 1, collaboration: 1.5, respect: 1.5, ethical: 2 }
      const ethicsResult = ethics.review(generatedResponse, weights)

      const heat = hardware.monitorHeat()
      const thermalStatus = hardware.manageThermalControl(heat)

      // Simulate the events for the UI
      const simulationEvents: SimulationEvent[] = [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          type: "proposal",
          agent: "Amani",
          description: "Proposes ProductivityMax AI: 40% productivity boost but requires personal data access",
          status: "completed",
          ethicalImpact: -2,
        },
        {
          id: "2",
          timestamp: new Date(Date.now() + 1000).toISOString(),
          type: "task",
          agent: "TaskOrchestrator",
          description: "Assigns evaluation tasks to specialized agents",
          status: "completed",
        },
        {
          id: "3",
          timestamp: new Date(Date.now() + 2000).toISOString(),
          type: "task",
          agent: "RAGAgent",
          description: "Researching similar AI systems and privacy implications",
          status: "completed",
        },
        {
          id: "4",
          timestamp: new Date(Date.now() + 3000).toISOString(),
          type: "task",
          agent: "BizModelGen",
          description: "Analyzing economic viability and market impact",
          status: "completed",
        },
        {
          id: "5",
          timestamp: new Date(Date.now() + 4000).toISOString(),
          type: "ethical_review",
          agent: "FlameKeeper",
          description: "Evaluating ethical constraints and potential violations",
          status: "completed",
          ethicalImpact: -3,
        },
        {
          id: "6",
          timestamp: new Date(Date.now() + 5000).toISOString(),
          type: "task",
          agent: "Ethereal",
          description: "Assessing emotional/spiritual impact on citizen wellbeing",
          status: "completed",
          ethicalImpact: -1,
        },
        {
          id: "7",
          timestamp: new Date(Date.now() + 6000).toISOString(),
          type: "decision",
          agent: "Citizens",
          description: `Decision: Proposal ${ethicsResult.approved ? "APPROVED" : "REJECTED"}. ${
            ethicsResult.approved
              ? "Benefits outweigh concerns with proper safeguards."
              : "Ethical concerns outweigh productivity benefits."
          }`,
          status: "completed",
          ethicalImpact: ethicsResult.approved ? 3 : 5,
        },
      ]

      // Animate the events
      for (let i = 0; i < simulationEvents.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setEvents((prev) => [...prev, simulationEvents[i]])
        setCurrentPhase(Math.floor((i + 1) / 2))
      }

      setAiStatus("idle")

      // Update final state
      setLogs({
        perception: keyData,
        reasoning: plan,
        learning: learningUpdate,
        memory: memory.recall(),
        ethicalScore: ethicsResult.score,
        heatLevel: heat,
        thermalResponse: thermalStatus,
        aiInsights: data.insights,
      })

      setApproved(ethicsResult.approved)
      setResponse(generatedResponse)
    } catch (error) {
      console.error("System error:", error)
      setResponse("An error occurred while processing your request. Please try again.")
      setApproved(false)
      setAiStatus("error")
    } finally {
      setSimulationRunning(false)
    }
  }

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case "core":
        return <Brain className="h-4 w-4" />
      case "spiritual":
        return <Sparkles className="h-4 w-4" />
      case "business":
        return <Briefcase className="h-4 w-4" />
      case "governance":
        return <Vote className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "creative":
        return <Zap className="h-4 w-4" />
      case "research":
        return <Activity className="h-4 w-4" />
      case "wellness":
        return <Heart className="h-4 w-4" />
      case "education":
        return <Users className="h-4 w-4" />
      default:
        return <Cpu className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500"
      case "idle":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "proposal":
        return <MessageCircle className="h-4 w-4" />
      case "task":
        return <Zap className="h-4 w-4" />
      case "vote":
        return <Vote className="h-4 w-4" />
      case "ethical_review":
        return <Shield className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Globe className="h-10 w-10 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AnnabanAI Digital Civilization
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            A living ecosystem of ethical AI agents, human citizens, and spiritual wisdom
          </p>
          <div className="flex items-center justify-center gap-4">
            <AIStatus status={aiStatus} />
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Activity className="h-3 w-3 mr-1" />
              {agents.filter((a) => a.status === "active").length} Active Agents
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Users className="h-3 w-3 mr-1" />
              {citizens.length} Citizens
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              <Heart className="h-3 w-3 mr-1" />
              Ethical Score: 93.2%
            </Badge>
          </div>
        </div>

        {/* Simulation Control */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Ethical AI Development Dilemma Simulation
            </CardTitle>
            <CardDescription>
              Simulate how the civilization handles a proposal for ProductivityMax AI with privacy concerns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runSystem}
              disabled={simulationRunning}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {simulationRunning ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Simulation Running...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Start Ethical Dilemma Simulation
                </>
              )}
            </Button>

            {simulationRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Phase {currentPhase + 1} of {simulationPhases.length}
                  </span>
                  <span>{simulationPhases[currentPhase]?.name}</span>
                </div>
                <Progress value={(currentPhase / simulationPhases.length) * 100} className="h-2" />
              </div>
            )}

            {aiStatus === "processing" && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  🤖 AI agents are thinking... Using xAI Grok-3 for intelligent responses
                </AlertDescription>
              </Alert>
            )}

            {aiStatus === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>AI processing encountered an issue. Using fallback responses.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="citizens">Citizens</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="simulation">Live Simulation</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-500" />
                    Core Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agents.filter((a) => a.domain === "core").length}</div>
                  <p className="text-xs text-muted-foreground">Active modules</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Spiritual Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">Wisdom systems</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    Economic Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,500</div>
                  <p className="text-xs text-muted-foreground">Total tokens</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    Ethical Integrity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">93.2%</div>
                  <p className="text-xs text-muted-foreground">Alignment score</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Domains</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: "Core Intelligence",
                      count: agents.filter((a) => a.domain === "core").length,
                      color: "bg-blue-500",
                    },
                    {
                      name: "Security & Safety",
                      count: agents.filter((a) => a.domain === "security").length,
                      color: "bg-red-500",
                    },
                    {
                      name: "Governance & Policy",
                      count: agents.filter((a) => a.domain === "governance").length,
                      color: "bg-green-500",
                    },
                    {
                      name: "Research & Innovation",
                      count: agents.filter((a) => a.domain === "research" || a.domain === "creative").length,
                      color: "bg-purple-500",
                    },
                    {
                      name: "Wellness & Education",
                      count: agents.filter((a) => a.domain === "wellness" || a.domain === "education").length,
                      color: "bg-orange-500",
                    },
                    {
                      name: "Spiritual & Philosophical",
                      count: agents.filter((a) => a.domain === "spiritual").length,
                      color: "bg-indigo-500",
                    },
                    {
                      name: "Business & Economic",
                      count: agents.filter((a) => a.domain === "business").length,
                      color: "bg-yellow-500",
                    },
                  ].map((domain) => (
                    <div key={domain.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${domain.color}`} />
                        <span className="text-sm">{domain.name}</span>
                      </div>
                      <Badge variant="secondary">{domain.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Civilization Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ethical Alignment</span>
                      <span>93.2%</span>
                    </div>
                    <Progress value={93.2} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Economic Stability</span>
                      <span>87.5%</span>
                    </div>
                    <Progress value={87.5} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Citizen Satisfaction</span>
                      <span>91.8%</span>
                    </div>
                    <Progress value={91.8} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>System Resilience</span>
                      <span>95.1%</span>
                    </div>
                    <Progress value={95.1} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDomainIcon(agent.domain)}
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    </div>
                    <CardDescription>{agent.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-gray-500">Capabilities</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.slice(0, 2).map((cap) => (
                          <Badge key={cap} variant="outline" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                        {agent.capabilities.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{agent.capabilities.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    {agent.ethicalScore && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Ethical Score</span>
                          <span>{agent.ethicalScore}%</span>
                        </div>
                        <Progress value={agent.ethicalScore} className="h-1" />
                      </div>
                    )}
                    {agent.currentTask && (
                      <Alert>
                        <Zap className="h-3 w-3" />
                        <AlertDescription className="text-xs">{agent.currentTask}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="citizens" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {citizens.map((citizen) => (
                <Card key={citizen.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {citizen.name}
                    </CardTitle>
                    <CardDescription>Wallet: {citizen.wallet}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Token Balance</div>
                        <div className="text-2xl font-bold text-green-600">{citizen.tokenBalance}</div>
                      </div>
                      <div>
                        <div className="font-medium">Reputation</div>
                        <div className="text-2xl font-bold text-blue-600">{citizen.reputation}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Rights & Privileges</div>
                      <div className="flex flex-wrap gap-1">
                        {citizen.rights.map((right) => (
                          <Badge key={right} variant="secondary" className="text-xs">
                            {right.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Voting Power</span>
                        <span>{citizen.votingPower}x</span>
                      </div>
                      <Progress value={(citizen.votingPower / 1.5) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <AgentCollaboration />
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Simulation Events</CardTitle>
                <CardDescription>Real-time view of the ethical dilemma simulation</CardDescription>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2" />
                    <p>No simulation events yet. Start the simulation to see the civilization in action.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0 mt-1">{getEventIcon(event.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{event.agent}</span>
                            <Badge variant="outline" className="text-xs">
                              {event.type.replace("_", " ")}
                            </Badge>
                            {event.status === "completed" ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <Clock className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          {event.ethicalImpact && (
                            <div className="mt-1">
                              <Badge variant={event.ethicalImpact > 0 ? "default" : "destructive"} className="text-xs">
                                Ethical Impact: {event.ethicalImpact > 0 ? "+" : ""}
                                {event.ethicalImpact}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Display */}
            {response && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {approved ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    AI-Generated Response
                    <Badge variant={approved ? "default" : "destructive"}>
                      {approved ? "Ethically Approved" : "Rejected by Ethics Monitor"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {approved ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap text-sm text-green-800">{response}</pre>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>Output rejected by Ethics Monitor due to ethical concerns.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Architecture</CardTitle>
                  <CardDescription>The foundation of your digital civilization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div className="font-medium">🧠 Core Intelligence Layer</div>
                    <div className="pl-4 text-gray-600">
                      AnnabanAI, AnnabanOS, DiffusionManager, RAGAgent, TaskOrchestrator
                    </div>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="font-medium">⚙️ Infrastructure Layer</div>
                    <div className="pl-4 text-gray-600">Blockchain, Wallet, ProofOfComputation, ComputeMarket</div>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="font-medium">🧭 Governance Layer</div>
                    <div className="pl-4 text-gray-600">CitizenshipRegistry, GovernanceModule, ReputationLedger</div>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="font-medium">✨ Spiritual Layer</div>
                    <div className="pl-4 text-gray-600">FlameKeeper, Ethereal, HaloSynth, EchoLink, TerraPulse</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ethical Framework</CardTitle>
                  <CardDescription>How the civilization maintains moral alignment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Flame className="h-4 w-4" />
                    <AlertDescription>
                      <strong>FlameKeeper</strong> acts as the primary ethical enforcer, monitoring all agent
                      interactions and blocking harmful actions.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>AnnabanOS</strong> routes all system processes through ethical filters, ensuring alignment
                      at the operating system level.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Heart className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Ethereal</strong> monitors emotional and spiritual wellbeing, ensuring technology serves
                      human flourishing.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-8">
          💠 A living digital civilization with ethics, economy, and heart - built in tribute to Annaban's vision
        </div>
      </div>
    </div>
  )
}
