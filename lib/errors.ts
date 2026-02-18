export class ProviderError extends Error {
  constructor(providerName: string) {
    const message = `use${providerName} must be used within a ${providerName}Provider`
    super(message)
    this.name = 'ProviderError'
  }
}

export class DaemonStatusProviderError extends ProviderError {
  constructor() {
    super('DaemonStatus')
  }
}

export class OrganizationProviderError extends ProviderError {
  constructor() {
    super('Organization')
  }
}

export class PathContextProviderError extends ProviderError {
  constructor() {
    super('PathContext')
  }
}

export class ProjectProviderError extends ProviderError {
  constructor() {
    super('Project')
  }
}

export class DemoModeError extends Error {
  constructor(methodName: string) {
    const message = `Method ${methodName} is not available in demo mode`
    super(message)
    this.name = 'DemoModeError'
  }
}

export class NotFoundError extends Error {
  constructor(entityType: string, id: string) {
    const message = `${entityType} ${id} not found`
    super(message)
    this.name = 'NotFoundError'
  }
}

export class OrganizationNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Organization', id)
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('User', id)
  }
}
