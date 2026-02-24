import { ProviderError } from './ProviderError'

export class PathContextProviderError extends ProviderError {
  constructor() {
    super('PathContext')
  }
}
