export class UnknownError extends Error {
  constructor(cause: unknown) {
    super(String(cause))
    this.name = 'UnknownError'
  }
}
