import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import { getMenuEntries } from '../GetMenuEntries/GetMenuEntries.ts'

export const getMenuEntries2 = (state: ExplorerState): readonly MenuEntry[] => {
  return getMenuEntries(state)
}
