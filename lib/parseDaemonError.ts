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
    const typedMessages: DaemonErrorItem[] = messages
    const first = typedMessages[0]
    const logs =
      'logs' in parsed && typeof parsed.logs === 'string'
        ? parsed.logs
        : undefined
    return {
      message: first.message,
      tip: first.tip,
      code: first.code,
      logs,
    }
  } catch {
    return { message: error }
  }
}
