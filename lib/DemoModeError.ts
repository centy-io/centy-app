export class DemoModeError extends Error {
  constructor(methodName: string) {
    const message = `Method ${methodName} is not available in demo mode`
    super(message)
    this.name = 'DemoModeError'
  }
}
