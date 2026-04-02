export function getPriorityLabel(level: number, totalLevels: number): string {
  if (totalLevels <= 3) {
    const labels = ['High', 'Medium', 'Low']
    return labels[level - 1] || `P${level}`
  }
  if (totalLevels === 4) {
    const labels = ['Critical', 'High', 'Medium', 'Low']
    return labels[level - 1] || `P${level}`
  }
  return `P${level}`
}
