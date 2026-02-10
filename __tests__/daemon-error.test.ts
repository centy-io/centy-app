import { describe, it, expect } from 'vitest'
import { parseDaemonError, isDaemonUnimplemented } from '@/lib/daemon-error'

describe('parseDaemonError', () => {
  it('parses a structured JSON error response', () => {
    const error = JSON.stringify({
      cwd: '/path/to/project',
      logs: '~/.centy/logs/centy-daemon.log',
      messages: [
        {
          message: 'Issue not found',
          tip: "Check that the issue ID or display number is correct, or run 'centy list issues' to see available issues",
          code: 'ISSUE_NOT_FOUND',
        },
      ],
    })

    const result = parseDaemonError(error)

    expect(result.message).toBe('Issue not found')
    expect(result.tip).toBe(
      "Check that the issue ID or display number is correct, or run 'centy list issues' to see available issues"
    )
    expect(result.code).toBe('ISSUE_NOT_FOUND')
    expect(result.logs).toBe('~/.centy/logs/centy-daemon.log')
  })

  it('falls back to raw string for plain text errors', () => {
    const error = 'Issue not found: Issue 01eef871 not found'

    const result = parseDaemonError(error)

    expect(result.message).toBe(error)
    expect(result.tip).toBeUndefined()
    expect(result.code).toBeUndefined()
    expect(result.logs).toBeUndefined()
  })

  it('handles empty string', () => {
    const result = parseDaemonError('')

    expect(result.message).toBe('')
  })

  it('handles JSON without messages array', () => {
    const error = JSON.stringify({ cwd: '/path', logs: '/logs' })

    const result = parseDaemonError(error)

    expect(result.message).toBe(error)
  })

  it('handles JSON with empty messages array', () => {
    const error = JSON.stringify({ messages: [] })

    const result = parseDaemonError(error)

    expect(result.message).toBe(error)
  })

  it('handles message without optional fields', () => {
    const error = JSON.stringify({
      messages: [{ message: 'Something failed' }],
    })

    const result = parseDaemonError(error)

    expect(result.message).toBe('Something failed')
    expect(result.tip).toBeUndefined()
    expect(result.code).toBeUndefined()
    expect(result.logs).toBeUndefined()
  })

  it('uses first message from multiple messages', () => {
    const error = JSON.stringify({
      messages: [
        { message: 'First error', code: 'ERR_1' },
        { message: 'Second error', code: 'ERR_2' },
      ],
    })

    const result = parseDaemonError(error)

    expect(result.message).toBe('First error')
    expect(result.code).toBe('ERR_1')
  })

  it('handles invalid JSON gracefully', () => {
    const error = '{invalid json'

    const result = parseDaemonError(error)

    expect(result.message).toBe(error)
  })
})

describe('isDaemonUnimplemented', () => {
  it('detects unimplemented via error code', () => {
    const error = JSON.stringify({
      messages: [{ message: 'Not supported', code: 'UNIMPLEMENTED' }],
    })

    expect(isDaemonUnimplemented(error)).toBe(true)
  })

  it('detects unimplemented via string matching (backward compat)', () => {
    expect(isDaemonUnimplemented('method is unimplemented')).toBe(true)
  })

  it('returns false for non-unimplemented errors', () => {
    const error = JSON.stringify({
      messages: [{ message: 'Not found', code: 'NOT_FOUND' }],
    })

    expect(isDaemonUnimplemented(error)).toBe(false)
  })

  it('handles case-insensitive code matching', () => {
    const error = JSON.stringify({
      messages: [{ message: 'Not supported', code: 'Unimplemented' }],
    })

    expect(isDaemonUnimplemented(error)).toBe(true)
  })
})
