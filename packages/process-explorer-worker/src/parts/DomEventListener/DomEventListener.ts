export interface DomEventListener {
  readonly name: string | number
  readonly params: readonly string[]
  readonly passive?: boolean
  readonly preventDefault?: boolean
  readonly stopPropagation?: boolean
}
