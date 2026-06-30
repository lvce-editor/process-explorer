import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'
import * as GetMenuItems from '../GetMenuItems/GetMenuItems.ts'
import * as Signal from '../Signal/Signal.ts'

interface ContextMenuEvent {
  readonly data?: string
  readonly type: string
}

const handleContextMenuSelect = async (
  label: string,
  process: VisibleProcess,
): Promise<void> => {
  switch (label) {
    case GetMenuItems.DebugProcess:
      await RendererWorker.invoke('AttachDebugger.attachDebugger', process.pid)
      return
    case GetMenuItems.KillProcess:
      await RendererWorker.invoke('Process.kill', process.pid, Signal.SigTerm)
      return
    default:
      return
  }
}

export const handleContextMenu = async (
  state: ProcessExplorerState,
  index: number = state.focusedIndex,
  x: number = 0,
  y: number = 0,
): Promise<ProcessExplorerState> => {
  const process = state.visibleProcesses[index]
  if (!process) {
    return state
  }
  const menuItems = GetMenuItems.getMenuItems(process)
  const event: ContextMenuEvent = await RendererWorker.invoke(
    'ElectronContextMenu.openContextMenu',
    menuItems,
    x,
    y,
    process,
  )
  if (event.type === 'close' || !event.data) {
    return state
  }
  await handleContextMenuSelect(event.data, process)
  return state
}
