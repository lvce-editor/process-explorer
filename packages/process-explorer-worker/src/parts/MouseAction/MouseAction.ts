export interface MouseAction {
  readonly button: number
  readonly command: string
  readonly description: string
  readonly modifiers: {
    readonly ctrl?: boolean
    readonly shift?: boolean
    readonly alt?: boolean
    readonly meta?: boolean
  }
  readonly when?: number
}
