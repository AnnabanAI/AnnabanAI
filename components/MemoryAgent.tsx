"use client"

import { useState } from "react"

interface MemoryEntry {
  query: string
  context: any
}

export function MemoryAgent() {
  const [history, setHistory] = useState<MemoryEntry[]>([])

  const log = (query: string, context: any) => {
    setHistory((prevHistory) => [...prevHistory, { query, context }])
  }

  const recall = () => {
    return history.length > 0 ? history[history.length - 1] : {}
  }

  return { log, recall }
}
