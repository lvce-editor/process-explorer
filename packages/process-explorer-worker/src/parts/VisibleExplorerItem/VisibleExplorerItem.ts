export interface VisibleExplorerItem {
  readonly ariaExpanded: string | undefined // TODO make it always string
  readonly chevron: number
  readonly className: string
  readonly decoration?: string
  readonly depth: number
  readonly hasEditingError: boolean
  readonly icon: string
  readonly id: string | undefined // TODO make it always string
  readonly indent: number
  readonly index: number
  readonly isCut: boolean
  readonly isEditing: boolean
  readonly isIgnored: boolean
  readonly name: string
  readonly path: string
  readonly posInSet: number
  readonly selected: boolean
  readonly setSize: number
}
