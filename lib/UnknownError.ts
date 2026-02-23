export class UnknownError extends Error {
  constructor(cause: unknown) {
    const message =
      typeof cause === 'string' ? cause : 'An unknown error occurred'
    super(message)
    this.name = 'UnknownError'
    this.cause = cause
  }
}
