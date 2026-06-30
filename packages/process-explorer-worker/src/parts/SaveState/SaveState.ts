import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import * as GetPath from '../GetPath/GetPath.ts'
import * as IsExpandedDirectory from '../IsExpandedDirectory/IsExpandedDirectory.ts'

export const saveState = (state: ExplorerState): SavedState => {
  const { deltaY, items, maxLineY, minLineY, root } = state
  const expandedPaths = items.filter(IsExpandedDirectory.isExpandedDirectory).map(GetPath.getPath)
  return {
    deltaY,
    expandedPaths,
    maxLineY,
    minLineY,
    root,
  }
}
