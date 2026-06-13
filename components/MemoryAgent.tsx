interface MemoryEntry {
  query: string
  context: any
}

export class MemoryAgent {
  private history: MemoryEntry[] = []

  log(query: string, context: any) {
    this.history.push({ query, context })
  }

  recall() {
    return this.history.length > 0 ? this.history[this.history.length - 1] : {}
  }
}
