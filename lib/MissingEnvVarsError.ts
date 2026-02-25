export class MissingEnvVarsError extends Error {
  constructor(missingVars: string[]) {
    const varList = missingVars.map(key => `  - ${key}`).join('\n')
    super(
      `Missing required environment variables:\n${varList}\n\nCopy .env.example to .env.local and fill in the required values.`
    )
    this.name = 'MissingEnvVarsError'
  }
}
