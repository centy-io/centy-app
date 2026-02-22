import { NotFoundError } from './NotFoundError'

export class OrganizationNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('Organization', id)
  }
}
