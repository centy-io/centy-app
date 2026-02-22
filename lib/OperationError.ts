export class OperationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OperationError'
  }
}
