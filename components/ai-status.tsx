"use client"

import { Badge } from "@/components/ui/badge"
import { Brain, Zap, AlertCircle } from "lucide-react"

interface AIStatusProps {
  status: "idle" | "processing" | "error"
  modelName?: string
}

export function AIStatus({ status, modelName = "xAI Grok-3" }: AIStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "processing":
        return {
          icon: <Brain className="h-3 w-3 animate-pulse" />,
          text: `AI Active (${modelName})`,
          variant: "default" as const,
          className: "bg-blue-500 text-white",
        }
      case "error":
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          text: "AI Fallback Mode",
          variant: "destructive" as const,
          className: "",
        }
      default:
        return {
          icon: <Zap className="h-3 w-3" />,
          text: "AI Ready",
          variant: "outline" as const,
          className: "",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.icon}
      <span className="ml-1">{config.text}</span>
    </Badge>
  )
}
