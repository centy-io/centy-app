import { NotFoundError } from './NotFoundError'

export class UserNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('User', id)
  }
}
