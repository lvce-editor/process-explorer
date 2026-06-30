import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getScrollBarVirtualDom = (scrollBarHeight: number): readonly VirtualDomNode[] => {
  const shouldShowScrollbar = scrollBarHeight > 0
  if (!shouldShowScrollbar) {
    return []
  }
  return [
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(ClassNames.ScrollBar, ClassNames.ScrollBarSmall),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.ScrollBarThumb,
      type: VirtualDomElements.Div,
    },
  ]
}
