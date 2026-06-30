import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ChevronDownVirtualDom from '../ChevronDownVirtualDom/ChevronDownVirtualDom.ts'
import * as ChevronRightVirtualDom from '../ChevronRightVirtualDom/ChevronRightVirtualDom.ts'

const chevronDomNodes: readonly (readonly VirtualDomNode[])[] = [
  [],
  [ChevronRightVirtualDom.chevronRightVirtualDom],
  [ChevronDownVirtualDom.chevronDownVirtualDom],
]

export const getChevronVirtualDom = (chevronType: number): readonly VirtualDomNode[] => {
  return chevronDomNodes[chevronType]
}
