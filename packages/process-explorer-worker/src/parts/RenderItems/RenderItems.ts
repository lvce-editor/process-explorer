import { ViewletCommand } from '@lvce-editor/constants'
import { text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as FormatMemory from '../FormatMemory/FormatMemory.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'

const getRowClassName = (focused: boolean): string => {
  if (focused) {
    return `${ClassNames.Row} ${ClassNames.RowFocused}`
  }
  return ClassNames.Row
}

const getPaddingLeft = (process: VisibleProcess): string => {
  if (process.depth <= 1) {
    return '0'
  }
  const depthCh = (process.depth - 1) * 1.5
  if (process.flags === ProcessFlag.None) {
    return `calc(${depthCh}ch + 17px)`
  }
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
    {
      childCount: 1,
      className: ClassNames.TableHead,
      role: AriaRoles.RowGroup,
      type: VirtualDomElements.THead,
    },
    {
      childCount: 3,
      className: ClassNames.Row,
      role: AriaRoles.Row,
      type: VirtualDomElements.Tr,
    },
    ...['Name', 'PID', 'Memory'].flatMap((label) => [
      {
        childCount: 1,
        className: ClassNames.HeaderCell,
        type: VirtualDomElements.Th,
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
      ariaDescription: '',
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
      `${ClassNames.Cell} ${ClassNames.NameCell}`,
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

const getErrorDom = (errorMessage: string): readonly VirtualDomNode[] => {
  if (!errorMessage) {
    return []
  }
  return [
    {
      childCount: 1,
      className: ClassNames.Error,
      type: VirtualDomElements.Div,
    },
    text(errorMessage),
  ]
}

const getDom = (state: ProcessExplorerState): readonly VirtualDomNode[] => {
  if (state.initial) {
    return []
  }
  const errorDom = getErrorDom(state.errorMessage)
  return [
    {
      childCount: 1 + (errorDom.length > 0 ? 1 : 0),
      className: `${ClassNames.Viewlet} ${ClassNames.ProcessExplorer}`,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    {
      ariaLabel: 'Process Explorer',
      ariaRowCount: state.visibleProcesses.length + 1,
      childCount: 2,
      className: ClassNames.Table,
      onBlur: DomEventListenerFunctions.HandleBlur,
      onClick: DomEventListenerFunctions.HandleClick,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onDblClick: DomEventListenerFunctions.HandleDoubleClick,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      role: AriaRoles.Grid,
      tabIndex: 0,
      type: VirtualDomElements.Table,
    },
    ...getHeaderDom(),
    ...getBodyDom(state),
    ...errorDom,
  ]
}

export const renderItems = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): readonly any[] => {
  return [ViewletCommand.SetDom2, newState.uid, getDom(newState)]
}
