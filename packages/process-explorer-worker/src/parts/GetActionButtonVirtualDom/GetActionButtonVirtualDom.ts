import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getActionButtonVirtualDom = (action: ViewletAction): readonly VirtualDomNode[] => {
  const { icon, id, name } = action
  return [
    {
      childCount: 1,
      className: ClassNames.IconButton,
      name,
      title: id,
      type: VirtualDomElements.Button,
    },
    GetIconVirtualDom.getIconVirtualDom(icon || ''),
  ]
}
