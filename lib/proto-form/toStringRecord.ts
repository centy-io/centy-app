export function toStringRecord(v: unknown): Record<string, string> {
  if (
    v !== null &&
    v !== undefined &&
    typeof v === 'object' &&
    !Array.isArray(v)
  ) {
    const entries = Object.entries(v).filter(
      (pair): pair is [string, string] => typeof pair[1] === 'string'
    )
    return Object.fromEntries(entries)
  }
  return {}
}
