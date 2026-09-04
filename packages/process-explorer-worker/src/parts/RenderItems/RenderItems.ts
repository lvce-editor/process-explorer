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

const processExplorer: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames(ClassNames.Viewlet, ClassNames.ProcessExplorer),
  role: AriaRoles.None,
  type: VirtualDomElements.Div,
}

const getRowClassName = (focused: boolean): string => {
  if (focused) {
    return mergeClassNames(ClassNames.Row, ClassNames.RowFocused)
  }
  return ClassNames.Row
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
): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      className,
      'data-index': index,
      name: String(index),
      role: AriaRoles.GridCell,
      tabIndex: -1,
      type: VirtualDomElements.Td,
    },
    text(value),
  ]
}

const shouldUseWideNameColumn = (
  visibleProcesses: readonly VisibleProcess[],
): boolean => {
  return visibleProcesses.some((process) =>
    process.name.toLowerCase().includes('webcontentsview'),
  )
}

const getHeaderDom = (
  visibleProcesses: readonly VisibleProcess[],
): readonly VirtualDomNode[] => {
  const useWideNameColumn = shouldUseWideNameColumn(visibleProcesses)
  return [
    tableHeadNode,
    headerRowNode,
    ...['Name', 'PID', 'Memory'].flatMap((label, index) => [
      {
        ...headerCellNode,
        ...(index === 0 &&
          useWideNameColumn && {
            className: mergeClassNames(
              ClassNames.HeaderCell,
              ClassNames.NameHeaderCellWide,
            ),
          }),
      },
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
      mergeClassNames(
        ClassNames.Cell,
        ClassNames.NameCell,
        `ProcessExplorerIndent-${process.depth}`,
      ),
      process.name,
      index,
    ),
    ...getCellDom(
      ClassNames.Cell,
      process.synthetic ? '' : String(process.pid),
      index,
    ),
    ...getCellDom(
      ClassNames.Cell,
      process.synthetic ? '' : FormatMemory.formatMemory(process.memory),
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
  const { errorCode, errorCodeFrame, errorMessage, errorStack } = state
  return Boolean(errorCode || errorMessage || errorCodeFrame || errorStack)
}

const getMessageDom = (message: string): readonly VirtualDomNode[] => {
  return [
    processExplorer,
    {
      childCount: 1,
      className: ClassNames.Message,
      type: VirtualDomElements.Div,
    },
    text(message),
  ]
}

const getErrorDom = (
  state: ProcessExplorerState,
): readonly VirtualDomNode[] => {
  const { errorCode, errorCodeFrame, errorMessage, errorStack } = state
  const errorCodeDom = getErrorSectionDom(errorCode, VirtualDomElements.Div)
  const messageDom = getErrorSectionDom(errorMessage, VirtualDomElements.Div)
  const codeFrameDom = getErrorSectionDom(
    errorCodeFrame,
    VirtualDomElements.Pre,
  )
  const stackDom = getErrorSectionDom(errorStack, VirtualDomElements.Pre)
  const childCount =
    errorCodeDom.length / 2 +
    messageDom.length / 2 +
    codeFrameDom.length / 2 +
    stackDom.length / 2
  return [
    processExplorer,
    {
      childCount,
      className: ClassNames.Error,
      type: VirtualDomElements.Div,
    },
    ...errorCodeDom,
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
    processExplorer,
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
    ...getHeaderDom(visibleProcesses),
    ...getBodyDom(state),
  ]
}

const getDom = (state: ProcessExplorerState): readonly VirtualDomNode[] => {
  const { initial, message } = state
  if (initial) {
    return []
  }
  if (message) {
    return getMessageDom(message)
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
