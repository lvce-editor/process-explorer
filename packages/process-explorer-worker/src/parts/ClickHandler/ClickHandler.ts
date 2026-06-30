import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export interface ClickHandler {
  (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus: boolean): Promise<ExplorerState>
}
