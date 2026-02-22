import { ProviderError } from './ProviderError'

export class ProjectProviderError extends ProviderError {
  constructor() {
    super('Project')
  }
}
