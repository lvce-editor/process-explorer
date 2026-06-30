import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ActionType from '../ActionType/ActionType.ts'
import * as GetActionButtonVirtualDom from '../GetActionButtonVirtualDom/GetActionButtonVirtualDom.ts'

export const getActionVirtualDom = (action: ViewletAction): readonly VirtualDomNode[] => {
  switch (action.type) {
    case ActionType.Button:
      return GetActionButtonVirtualDom.getActionButtonVirtualDom(action)
    default:
      return []
  }
}
