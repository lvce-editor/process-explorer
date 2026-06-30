import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CanBeDroppedInto from '../CanBeDroppedInto/CanBeDroppedInto.ts'
import { countInRange } from '../CountInRange/CountInRange.ts'
import { dropTargetFull } from '../DropTargetFull/DropTargetFull.ts'
import { getParentEndIndex } from '../GetParentEndIndex/GetParentEndIndex.ts'
import { getParentStartIndex } from '../GetParentStartIndex/GetParentStartIndex.ts'

export const getNewDropTargets = (state: ExplorerState, index: number): readonly number[] => {
  const { items } = state
  if (index === -1) {
    return dropTargetFull
  }
  const item = items[index]
  if (!item) {
    return dropTargetFull
  }
  if (!CanBeDroppedInto.canBeDroppedInto(item)) {
    const startIndex = getParentStartIndex(items, index)
    const endIndex = getParentEndIndex(items, index)
    return countInRange(startIndex, endIndex)
  }
  const newDropTargets = [index]
  return newDropTargets
}
