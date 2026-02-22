export class ProviderError extends Error {
  constructor(providerName: string) {
    const message = `use${providerName} must be used within a ${providerName}Provider`
    super(message)
    this.name = 'ProviderError'
  }
}
