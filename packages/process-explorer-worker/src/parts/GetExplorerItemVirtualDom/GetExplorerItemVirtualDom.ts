import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as GetInputDom from '../GetInputDom/GetInputDom.ts'
import * as GetLabelDom from '../GetLabelDom/GetLabelDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getTitle = (path: string): string => {
  if (path.startsWith('file://')) {
    return path.slice('file://'.length)
  }
  return path
}

export const getExplorerItemVirtualDom = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  const { ariaExpanded, chevron, className, depth, hasEditingError, icon, id, index, isCut, isEditing, isIgnored, name, path, posInSet, setSize } =
    item
  const chevronDom = GetChevronVirtualDom.getChevronVirtualDom(chevron)
  return [
    {
      ariaDescription: '',
      ariaExpanded,
      ariaLabel: name,
      ariaLevel: depth,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      childCount: 2 + chevronDom.length,
      className,
      'data-index': index,
      draggable: true,
      id,
      role: AriaRoles.TreeItem,
      title: getTitle(path),
      type: VirtualDomElements.Div,
    },
    ...chevronDom,
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    ...GetInputDom.getInputDom(isEditing, hasEditingError),
    ...GetLabelDom.getLabelDom(isEditing, name, isCut || isIgnored),
  ]
}
