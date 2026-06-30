import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import * as ViewletExplorerActions from '../GetActions/GetActions.ts'
import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.ts'

export const renderActions = (uid: number): readonly VirtualDomNode[] => {
  const { newState } = ExplorerStates.get(uid)
  const actions = ViewletExplorerActions.getActions(newState.root)
  const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
  return dom
}
