export function cleanupPriorityColors(
  colors: Record<string, string>,
  newLevels: number
): Record<string, string> {
  const newColors: Record<string, string> = {}
  for (let i = 1; i <= newLevels; i++) {
    if (colors[String(i)]) {
      newColors[String(i)] = colors[String(i)]
    }
  }
  return newColors
}
