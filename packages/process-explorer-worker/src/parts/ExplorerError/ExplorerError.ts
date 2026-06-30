export class ExplorerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExplorerError'
  }
}
