export function formatDeleteErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}
