import { parseDaemonError } from './parseDaemonError'

/**
 * Check if a daemon error string or caught error contains an "unimplemented" indicator.
 * Checks both the structured `code` field and falls back to string matching.
 */
export function isDaemonUnimplemented(error: string): boolean {
  const parsed = parseDaemonError(error)
  if (parsed.code && parsed.code.toLowerCase() === 'unimplemented') return true
  return error.toLowerCase().includes('unimplemented')
}
