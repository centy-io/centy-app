import { describe, expect, it } from 'vitest'
import { MissingEnvVarsError } from './MissingEnvVarsError'

describe('MissingEnvVarsError', () => {
  it('should include missing variable names in the message', () => {
    const error = new MissingEnvVarsError([
      'NEXT_PUBLIC_DAEMON_URL',
      'NEXT_PUBLIC_DOCS_URL',
    ])
    expect(error.message).toContain('NEXT_PUBLIC_DAEMON_URL')
    expect(error.message).toContain('NEXT_PUBLIC_DOCS_URL')
  })

  it('should have the correct error name', () => {
    const error = new MissingEnvVarsError(['SOME_VAR'])
    expect(error.name).toBe('MissingEnvVarsError')
  })

  it('should be an instance of Error', () => {
    const error = new MissingEnvVarsError(['SOME_VAR'])
    expect(error).toBeInstanceOf(Error)
  })
})
