import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'

export const getComponentDom = (uid: number): readonly VirtualDomNode[] => {
  const { newState } = ProcessExplorerStates.get(uid)
  return RenderItems.getDom(newState)
}
