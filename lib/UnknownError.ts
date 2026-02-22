export class UnknownError extends Error {
  constructor(cause: unknown) {
    const message =
      cause !== null && cause !== undefined ? String(cause) : 'Unknown error'
    super(message)
    this.name = 'UnknownError'
    this.cause = cause
  }
}
