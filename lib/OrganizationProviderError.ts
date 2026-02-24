import { ProviderError } from './ProviderError'

export class OrganizationProviderError extends ProviderError {
  constructor() {
    super('Organization')
  }
}
