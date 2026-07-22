import { ViewletCommand } from '@lvce-editor/constants'
import {
  mergeClassNames,
  text,
  VirtualDomElements,
} from '@lvce-editor/virtual-dom-worker'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as FormatMemory from '../FormatMemory/FormatMemory.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'

const tableHeadNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.TableHead,
  role: AriaRoles.RowGroup,
  type: VirtualDomElements.THead,
}

const headerRowNode: VirtualDomNode = {
  childCount: 3,
  className: ClassNames.Row,
  role: AriaRoles.Row,
  type: VirtualDomElements.Tr,
}

const headerCellNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.HeaderCell,
  type: VirtualDomElements.Th,
}

const getRowClassName = (focused: boolean): string => {
  if (focused) {
    return mergeClassNames(ClassNames.Row, ClassNames.RowFocused)
  }
  return ClassNames.Row
}

const getPaddingLeft = (process: VisibleProcess): string => {
  if (process.depth <= 1) {
    return '0'
  }
  const depthCh = (process.depth - 1) * 1.5
  return `${depthCh}ch`
}

const getAriaExpanded = (process: VisibleProcess): boolean | undefined => {
  switch (process.flags) {
    case ProcessFlag.Collapsed:
      return false
    case ProcessFlag.Expanded:
      return true
    default:
      return undefined
  }
}

const getCellDom = (
  className: string,
  value: string,
  index: number,
  paddingLeft?: string,
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className,
      'data-index': index,
      name: String(index),
      paddingLeft,
      role: AriaRoles.GridCell,
      tabIndex: -1,
      type: VirtualDomElements.Td,
    },
    text(value),
  ]
}

const getHeaderDom = (): readonly VirtualDomNode[] => {
  return [
    tableHeadNode,
    headerRowNode,
    ...['Name', 'PID', 'Memory'].flatMap((label) => [
      headerCellNode,
      text(label),
    ]),
  ]
}

const getRowDom = (
  process: VisibleProcess,
  index: number,
  focused: boolean,
): readonly VirtualDomNode[] => {
  return [
    {
      ariaExpanded: getAriaExpanded(process),
      ariaLevel: process.depth,
      childCount: 3,
      className: getRowClassName(focused),
      'data-index': index,
      name: String(index),
      role: AriaRoles.Row,
      tabIndex: focused ? 0 : -1,
      title: process.cmd,
      type: VirtualDomElements.Tr,
    },
    ...getCellDom(
      mergeClassNames(ClassNames.Cell, ClassNames.NameCell),
      process.name,
      index,
      getPaddingLeft(process),
    ),
    ...getCellDom(ClassNames.Cell, String(process.pid), index),
    ...getCellDom(
      ClassNames.Cell,
      FormatMemory.formatMemory(process.memory),
      index,
    ),
  ]
}

const getBodyDom = (state: ProcessExplorerState): readonly VirtualDomNode[] => {
  const { focusedIndex, visibleProcesses } = state
  return [
    {
      childCount: visibleProcesses.length,
      className: ClassNames.TableBody,
      role: AriaRoles.RowGroup,
      type: VirtualDomElements.TBody,
    },
    ...visibleProcesses.flatMap((process, index) =>
      getRowDom(process, index, index === focusedIndex),
    ),
  ]
}

const getErrorSectionDom = (
  value: string,
  type: number,
): readonly VirtualDomNode[] => {
  if (!value) {
    return []
  }
  return [
    {
      childCount: 1,
      type,
    },
    text(value),
  ]
}

const hasError = (state: ProcessExplorerState): boolean => {
  const { errorCodeFrame, errorMessage, errorStack } = state
  return Boolean(errorMessage || errorCodeFrame || errorStack)
}

const getErrorDom = (
  state: ProcessExplorerState,
): readonly VirtualDomNode[] => {
  const { errorCodeFrame, errorMessage, errorStack } = state
  const messageDom = getErrorSectionDom(errorMessage, VirtualDomElements.Div)
  const codeFrameDom = getErrorSectionDom(
    errorCodeFrame,
    VirtualDomElements.Pre,
  )
  const stackDom = getErrorSectionDom(errorStack, VirtualDomElements.Pre)
  const childCount =
    messageDom.length / 2 + codeFrameDom.length / 2 + stackDom.length / 2
  return [
    {
      childCount: 1,
      className: mergeClassNames(
        ClassNames.Viewlet,
        ClassNames.ProcessExplorer,
      ),
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    {
      childCount,
      className: ClassNames.Error,
      type: VirtualDomElements.Div,
    },
    ...messageDom,
    ...codeFrameDom,
    ...stackDom,
  ]
}

const getTableDom = (
  state: ProcessExplorerState,
): readonly VirtualDomNode[] => {
  const { visibleProcesses } = state
  return [
    {
      childCount: 1,
      className: mergeClassNames(
        ClassNames.Viewlet,
        ClassNames.ProcessExplorer,
      ),
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    {
      ariaLabel: 'Process Explorer',
      ariaRowCount: visibleProcesses.length + 1,
      childCount: 2,
      className: ClassNames.Table,
      onBlur: DomEventListenerFunctions.HandleBlur,
      onClick: DomEventListenerFunctions.HandleClick,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onDblClick: DomEventListenerFunctions.HandleDoubleClick,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      role: AriaRoles.Grid,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Table,
    },
    ...getHeaderDom(),
    ...getBodyDom(state),
  ]
}

const getDom = (state: ProcessExplorerState): readonly VirtualDomNode[] => {
  const { initial } = state
  if (initial) {
    return []
  }
  if (hasError(state)) {
    return getErrorDom(state)
  }
  return getTableDom(state)
}

export const renderItems = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): readonly any[] => {
  return [ViewletCommand.SetDom2, newState.uid, getDom(newState)]
}
