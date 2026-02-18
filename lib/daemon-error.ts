export interface DaemonErrorItem {
  message: string
  tip?: string
  code?: string
}

export interface DaemonErrorResponse {
  cwd?: string
  logs?: string
  messages: DaemonErrorItem[]
}

export interface ParsedDaemonError {
  message: string
  tip?: string
  code?: string
  logs?: string
}

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

/**
 * Check if a daemon error string or caught error contains an "unimplemented" indicator.
 * Checks both the structured `code` field and falls back to string matching.
 */
export function isDaemonUnimplemented(error: string): boolean {
  const parsed = parseDaemonError(error)
  if (parsed.code && parsed.code.toLowerCase() === 'unimplemented') return true
  return error.toLowerCase().includes('unimplemented')
}
