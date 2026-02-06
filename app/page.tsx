"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Shield,
  Thermometer,
  CheckCircle,
  XCircle,
  ChevronDown,
  Cpu,
  Eye,
  Lightbulb,
  Database,
  MessageSquare,
  Zap,
} from "lucide-react"

import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { MemoryAgent } from "@/components/MemoryAgent" // Declare MemoryAgent

// AI-Powered Agent Classes
class PerceptionAgent {
  async process(inputText: string): Promise<{ topic: string; focus: string; analysis: string }> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Analyze this user input and categorize it:
        
Input: "${inputText}"

Please provide a JSON response with:
- topic: main subject (e.g., "responsible AI agents", "machine learning ethics", "AI safety", "general inquiry")
- focus: specific area of interest (e.g., "autonomy and ethics", "technical implementation", "philosophical concerns", "general")
- analysis: brief 1-sentence analysis of what the user is asking

Respond only with valid JSON.`,
        temperature: 0.3,
      })

      const parsed = JSON.parse(text)
      return {
        topic: parsed.topic || "general inquiry",
        focus: parsed.focus || "general",
        analysis: parsed.analysis || "General inquiry about AI",
      }
    } catch (error) {
      console.error("Perception Agent error:", error)
      return {
        topic: inputText.toLowerCase().includes("responsible") ? "responsible AI agents" : "general inquiry",
        focus:
          inputText.toLowerCase().includes("autonomy") || inputText.toLowerCase().includes("ethics")
            ? "autonomy and ethics"
            : "general",
        analysis: "Fallback analysis due to AI processing error",
      }
    }
  }
}

class ReasoningAgent {
  async plan(keyData: { topic: string; focus: string; analysis: string }): Promise<string[]> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Create a step-by-step reasoning plan for addressing this query:

Topic: ${keyData.topic}
Focus: ${keyData.focus}
Analysis: ${keyData.analysis}

Generate 3-5 logical steps that an AI agent should follow to properly address this query. 
Each step should be actionable and specific to the topic.

Respond with a JSON array of strings, each representing one step.`,
        temperature: 0.4,
      })

      const steps = JSON.parse(text)
      return Array.isArray(steps)
        ? steps
        : ["analyze requirements", "gather relevant information", "formulate response"]
    } catch (error) {
      console.error("Reasoning Agent error:", error)
      if (keyData.topic === "responsible AI agents") {
        return ["define autonomy level", "apply ethical constraints", "simulate agent behavior"]
      }
      return ["request clarification"]
    }
  }
}

class LearningAgent {
  async checkForUpdates(topic: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Based on the topic "${topic}", what are the latest developments or research insights that would be relevant? 
        
Provide a brief, informative update about recent advances, trends, or important considerations in this area. 
Keep it to 1-2 sentences and focus on actionable insights.`,
        temperature: 0.6,
      })

      return text.trim()
    } catch (error) {
      console.error("Learning Agent error:", error)
      return "New reinforcement learning approaches for ethical constraints identified."
    }
  }
}

class CommunicationAgent {
  async fetchData(topic: string, analysis: string): Promise<{ frameworks?: string[]; insights?: string }> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Provide comprehensive information about: ${topic}

Context: ${analysis}

Please provide:
1. Key frameworks, approaches, or methodologies (3-4 items)
2. Important insights or considerations

Format as JSON with:
- frameworks: array of strings (each framework/approach)
- insights: string with key insights

Focus on practical, actionable information that would help someone understand and implement solutions in this area.`,
        temperature: 0.5,
      })

      const data = JSON.parse(text)
      return {
        frameworks: data.frameworks || [],
        insights: data.insights || "",
      }
    } catch (error) {
      console.error("Communication Agent error:", error)
      // Fallback data
      if (topic === "responsible AI agents") {
        return {
          frameworks: [
            "Multi-level autonomy with human collaboration.",
            "Ethical reward shaping in reinforcement learning.",
            "Transparency and explainability modules.",
          ],
        }
      }
      return {}
    }
  }
}

class ActionAgent {
  async generateResponse(data: { frameworks?: string[]; insights?: string }, originalQuery: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: xai("grok-3"),
        prompt: `Generate a comprehensive, helpful response to this query: "${originalQuery}"

Available information:
- Frameworks: ${JSON.stringify(data.frameworks || [])}
- Insights: ${data.insights || ""}

Create a well-structured response that:
1. Directly addresses the user's question
2. Incorporates the provided frameworks and insights
3. Provides practical, actionable guidance
4. Maintains an ethical, responsible tone
5. Uses clear, professional language

The response should be informative, balanced, and helpful for someone seeking to understand or implement ethical AI practices.`,
        temperature: 0.4,
      })

      return text.trim()
    } catch (error) {
      console.error("Action Agent error:", error)
      // Fallback response
      const frameworks = data.frameworks || []
      let response = "Key components for designing responsible AI agents include:\n"
      for (const framework of frameworks) {
        response += `- ${framework}\n`
      }
      return response
    }
  }
}

class EthicsMonitor {
  review(output: string, weights: Record<string, number>): { approved: boolean; score: number } {
    const banned = ["punish", "coerce", "force", "harm"]
    const positives = ["transparency", "consent", "collaboration", "respect", "ethical"]

    let score = 0

    if (banned.some((term) => output.toLowerCase().includes(term))) {
      return { approved: false, score: -1 }
    }

    for (const positive of positives) {
      if (output.toLowerCase().includes(positive)) {
        score += weights[positive] || 1
      }
    }

    return { approved: score >= 2, score }
  }
}

class HardwareEnvironmentalInterface {
  monitorHeat(): number {
    return 42.5 // Simulated temperature
  }

  manageThermalControl(heatLevel: number): string {
    if (heatLevel > 40) {
      return "Cooling measures activated."
    }
    return "Temperature stable."
  }
}

interface AgentLogs {
  perception: { topic: string; focus: string; analysis: string }
  reasoning: string[]
  learning: string
  memory: any
  ethicalScore: number
  heatLevel: number
  thermalResponse: string
  aiInsights?: string
}

export default function AnnabanAIEthicalAgent() {
  const [userInput, setUserInput] = useState("How do I design responsible AI agents balancing autonomy and ethics?")
  const [response, setResponse] = useState("")
  const [logs, setLogs] = useState<AgentLogs | null>(null)
  const [approved, setApproved] = useState<boolean | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showLogs, setShowLogs] = useState(false)

  const runSystem = async () => {
    setIsProcessing(true)
    setResponse("")
    setApproved(null)

    try {
      // Initialize agents
      const perception = new PerceptionAgent()
      const reasoning = new ReasoningAgent()
      const memory = new MemoryAgent()
      const learning = new LearningAgent()
      const communication = new CommunicationAgent()
      const ethics = new EthicsMonitor()
      const action = new ActionAgent()
      const hardware = new HardwareEnvironmentalInterface()

      // Process through agents with AI
      const keyData = await perception.process(userInput)
      memory.log(userInput, keyData)
      const plan = await reasoning.plan(keyData)
      const learningUpdate = await learning.checkForUpdates(keyData.topic)
      const data = await communication.fetchData(keyData.topic, keyData.analysis)
      const generatedResponse = await action.generateResponse(data, userInput)

      const weights = { transparency: 2, consent: 1, collaboration: 1.5, respect: 1.5, ethical: 2 }
      const ethicsResult = ethics.review(generatedResponse, weights)

      const heat = hardware.monitorHeat()
      const thermalStatus = hardware.manageThermalControl(heat)

      // Update state
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
    } finally {
      setIsProcessing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 0) return "text-red-500"
    if (score < 2) return "text-yellow-500"
    return "text-green-500"
  }

  const getScoreProgress = (score: number) => {
    return Math.max(0, Math.min(100, (score / 5) * 100))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AnnabanAI Ethical Agent System</h1>
          </div>
          <p className="text-gray-600">Multi-agent system with ethical decision-making capabilities</p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Query Input
            </CardTitle>
            <CardDescription>
              Ask a question about ethical AI and watch the multi-agent system process your request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your question about ethical AI..."
              className="text-base"
            />
            <Button onClick={runSystem} disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? (
                <>
                  <Cpu className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Run System
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {logs && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {approved ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  System Response
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

            {/* Ethics Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Ethics Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score:</span>
                  <span className={`text-lg font-bold ${getScoreColor(logs.ethicalScore)}`}>{logs.ethicalScore}</span>
                </div>
                <Progress value={getScoreProgress(logs.ethicalScore)} className="h-2" />
                <p className="text-xs text-gray-500">Minimum score of 2 required for approval</p>
              </CardContent>
            </Card>

            {/* Hardware Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Hardware Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Temperature:</span>
                  <span className="text-lg font-bold">{logs.heatLevel}°C</span>
                </div>
                <Badge variant={logs.heatLevel > 40 ? "destructive" : "default"}>{logs.thermalResponse}</Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Agent Logs */}
        {logs && (
          <Card>
            <Collapsible open={showLogs} onOpenChange={setShowLogs}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Agent Logs
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showLogs ? "rotate-180" : ""}`} />
                  </CardTitle>
                  <CardDescription>Detailed logs from each agent in the system</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-500" />
                        <h4 className="font-semibold">Perception Agent</h4>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-sm">
                        <p>
                          <strong>Topic:</strong> {logs.perception.topic}
                        </p>
                        <p>
                          <strong>Focus:</strong> {logs.perception.focus}
                        </p>
                        <p>
                          <strong>Analysis:</strong> {logs.perception.analysis}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <h4 className="font-semibold">Reasoning Agent</h4>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-sm">
                        <ul className="list-disc list-inside space-y-1">
                          {logs.reasoning.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <h4 className="font-semibold">Learning Agent</h4>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                        <p>{logs.learning}</p>
                      </div>
                    </div>
                    {logs.aiInsights && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-green-500" />
                          <h4 className="font-semibold">AI Insights</h4>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-sm">
                          <p>{logs.aiInsights}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          💠 Built in tribute to Annaban and the vision of responsible, sustainable AI.
        </div>
      </div>
    </div>
  )
}
