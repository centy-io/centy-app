// eslint-disable-next-line ddd/require-spec-file
export function toStringArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((item): item is string => typeof item === 'string')
    : []
}
