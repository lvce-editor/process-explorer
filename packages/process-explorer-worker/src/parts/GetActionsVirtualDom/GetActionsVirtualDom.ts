import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetActionVirtualDom from '../GetActionVirtualDom/GetActionVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getActionsVirtualDom = (actions: readonly ViewletAction[]): readonly VirtualDomNode[] => {
  return [
    {
      childCount: actions.length,
      className: ClassNames.Actions,
      onClick: DomEventListenerFunctions.HandleButtonClick,
      role: AriaRoles.ToolBar,
      type: VirtualDomElements.Div,
    },
    ...actions.flatMap(GetActionVirtualDom.getActionVirtualDom),
  ]
}
