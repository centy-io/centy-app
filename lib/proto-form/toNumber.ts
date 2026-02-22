// eslint-disable-next-line ddd/require-spec-file
export function toNumber(v: unknown, fallback: number): number {
  return typeof v === 'number' ? v : fallback
}
