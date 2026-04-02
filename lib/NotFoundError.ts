export class NotFoundError extends Error {
  constructor(entityType: string, id: string) {
    const message = `${entityType} ${id} not found`
    super(message)
    this.name = 'NotFoundError'
  }
}
