import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as IsDebuggable from '../IsDebuggable/IsDebuggable.ts'
import * as MenuItemLabels from '../MenuItemLabels/MenuItemLabels.ts'

export const getMenuEntries = (
  state: ProcessExplorerState,
): readonly MenuEntry[] => {
  const process = state.visibleProcesses[state.focusedIndex]
  if (!process) {
    return []
  }
  const menuEntries: MenuEntry[] = [
    {
      args: [state.focusedIndex],
      command: 'ProcessExplorer.killProcess',
      flags: MenuItemFlags.None,
      id: 'killProcess',
      label: MenuItemLabels.KillProcess,
    },
  ]
  if (IsDebuggable.isDebuggable(process.cmd)) {
    menuEntries.push({
      args: [state.focusedIndex],
      command: 'ProcessExplorer.debugProcess',
      flags: MenuItemFlags.None,
      id: 'debugProcess',
      label: MenuItemLabels.DebugProcess,
    })
  }
  return menuEntries
}
