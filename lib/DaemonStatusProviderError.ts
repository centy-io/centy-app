import { ProviderError } from './ProviderError'

export class DaemonStatusProviderError extends ProviderError {
  constructor() {
    super('DaemonStatus')
  }
}
