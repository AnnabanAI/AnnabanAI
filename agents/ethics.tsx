export default class EthicsMonitor {
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
