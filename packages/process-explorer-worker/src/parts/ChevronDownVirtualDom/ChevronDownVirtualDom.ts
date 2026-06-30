import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const chevronDownVirtualDom: VirtualDomNode = {
  childCount: 0,
  className: MergeClassNames.mergeClassNames(ClassNames.Chevron, ClassNames.MaskIconChevronDown),
  type: VirtualDomElements.Div,
}
