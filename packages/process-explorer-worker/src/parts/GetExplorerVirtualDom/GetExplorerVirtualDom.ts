import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetErrorMessageDom from '../GetErrorMessageDom/GetErrorMessageDom.ts'
import * as GetExplorerWelcomeVirtualDom from '../GetExplorerWelcomeVirtualDom/GetExplorerWelcomeVirtualDom.ts'
import * as GetListItemsVirtualDom from '../GetListItemsVirtualDom/GetListItemsVirtualDom.ts'
import * as GetLoadErrorVirtualDom from '../GetLoadErrorVirtualDom/GetLoadErrorVirtualDom.ts'
import * as GetScrollBarSize from '../GetScrollBarSize/GetScrollBarSize.ts'
import * as GetScrollBarVirtualDom from '../GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getParentNode = (childCount: number): VirtualDomNode => {
  return {
    childCount,
    className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
    role: AriaRoles.None,
    type: VirtualDomElements.Div,
  }
}

const getChildCount = (scrollBarDomLength: number, errorDomLength: number): number => {
  let childCount = 1
  if (scrollBarDomLength > 0) {
    childCount++
  }
  if (errorDomLength > 0) {
    childCount++
  }
  return childCount
}

export const getExplorerVirtualDom = (
  visibleItems: readonly VisibleExplorerItem[],
  focusedIndex: number,
  root: string,
  isWide: boolean,
  focused: boolean,
  dropTargets: readonly number[],
  height: number,
  contentHeight: number,
  editingErrorMessage: string,
  loadErrorMessage: string,
  showOpenAnotherFolderButton: boolean,
): readonly VirtualDomNode[] => {
  if (!root) {
    return GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(isWide, dropTargets)
  }
  if (loadErrorMessage) {
    return GetLoadErrorVirtualDom.getLoadErrorVirtualDom(loadErrorMessage, isWide, showOpenAnotherFolderButton)
  }
  const scrollBarHeight = GetScrollBarSize.getScrollBarSize(height, contentHeight, 20)
  const scrollBarDom = GetScrollBarVirtualDom.getScrollBarVirtualDom(scrollBarHeight)
  const errorDom = GetErrorMessageDom.getErrorMessageDom(editingErrorMessage)
  const childCount = getChildCount(scrollBarDom.length, errorDom.length)
  const parentNode = getParentNode(childCount)
  const dom: readonly VirtualDomNode[] = [
    parentNode,
    ...GetListItemsVirtualDom.getListItemsVirtualDom(visibleItems, focusedIndex, focused, dropTargets),
    ...scrollBarDom,
    ...errorDom,
  ]
  return dom
}
