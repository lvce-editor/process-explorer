import type { MenuEntryId } from '@lvce-editor/constants'

interface ContextMenuPropsBase {
  readonly menuId: number
}

interface ContextMenuPropsExplorer extends ContextMenuPropsBase {
  readonly menuId: typeof MenuEntryId.Explorer
}

export type ContextMenuProps = ContextMenuPropsExplorer
