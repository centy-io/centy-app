import type { DaemonErrorItem } from './DaemonErrorItem'
import type { ParsedDaemonError } from './ParsedDaemonError'

/**
 * Parse a daemon error string which may be either a plain string
 * or a JSON-serialized structured error response.
 * Falls back to returning the raw string for backward compatibility.
 */
export function parseDaemonError(error: string): ParsedDaemonError {
  if (!error) return { message: error }

  try {
    const parsed: unknown = JSON.parse(error)
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('messages' in parsed)
    ) {
      return { message: error }
    }
    // After type narrowing: parsed is object & { messages: unknown }
    const messages: unknown = parsed.messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return { message: error }
    }
    const first: unknown = messages[0]
    if (
      typeof first !== 'object' ||
      first === null ||
      !('message' in first) ||
      typeof first.message !== 'string'
    )
      return { message: error }
    const logs =
      'logs' in parsed && typeof parsed.logs === 'string'
        ? parsed.logs
        : undefined
    const tip =
      'tip' in first && typeof first.tip === 'string' ? first.tip : undefined
    const code =
      'code' in first && typeof first.code === 'string' ? first.code : undefined
    return {
      message: first.message,
      tip,
      code,
      logs,
    }
  } catch {
    return { message: error }
  }
}
