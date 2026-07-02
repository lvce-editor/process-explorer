import type * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'

export interface ContextMenuProps {
  readonly index: number
  readonly menuId: typeof MenuEntryId.ProcessExplorer
}
