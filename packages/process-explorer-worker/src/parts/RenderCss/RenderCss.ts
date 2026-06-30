import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getCss } from '../GetCss/GetCss.ts'
import * as GetErrorMessagePosition from '../GetErrorMessagePosition/GetErrorMessagePosition.ts'
import { getScrollBarSize } from '../GetScrollBarSize/GetScrollBarSize.ts'
import { getScrollBarTop } from '../GetScrollBarTop/GetScrollBarTop.ts'
import { getUniqueIndents } from '../GetUniqueIndents/GetUniqueIndents.ts'

export const renderCss = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  const {
    chevronSpace,
    defaultPaddingLeft,
    deltaY,
    fileIconWidth,
    focusedIndex,
    height,
    indent,
    itemHeight,
    items,
    minLineY,
    padding,
    uid,
    visibleExplorerItems,
    width,
  } = newState
  const uniqueIndents = getUniqueIndents(visibleExplorerItems)
  const contentHeight = items.length * itemHeight
  const scrollBarTop = getScrollBarTop(height, contentHeight, deltaY)
  const scrollBarHeight = getScrollBarSize(height, contentHeight, 20)
  const depth = items[focusedIndex]?.depth || 0
  const { errorMessageWidth, left, top } = GetErrorMessagePosition.getErrorMessagePosition(
    itemHeight,
    focusedIndex,
    minLineY,
    depth,
    indent,
    fileIconWidth,
    padding + defaultPaddingLeft + chevronSpace,
    width,
  )
  const css = getCss(scrollBarHeight, scrollBarTop, uniqueIndents, left, top, errorMessageWidth)
  return [ViewletCommand.SetCss, uid, css]
}
