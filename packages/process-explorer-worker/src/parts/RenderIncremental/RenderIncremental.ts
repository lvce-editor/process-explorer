import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'

export const renderIncremental = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): readonly any[] => {
  const oldDom = RenderItems.renderItems(oldState, oldState)[2]
  const newDom = RenderItems.renderItems(newState, newState)[2]
  const patches = diffTree(oldDom, newDom)
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
