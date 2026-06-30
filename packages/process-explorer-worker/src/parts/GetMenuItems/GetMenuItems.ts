import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'
import * as IsDebuggable from '../IsDebuggable/IsDebuggable.ts'

export const KillProcess = 'Kill Process'
export const DebugProcess = 'Debug Process'

export interface MenuItem {
  readonly label: string
}

export const getMenuItems = (process: VisibleProcess): readonly MenuItem[] => {
  const menuItems: MenuItem[] = [
    {
      label: KillProcess,
    },
  ]
  if (IsDebuggable.isDebuggable(process.cmd)) {
    menuItems.push({
      label: DebugProcess,
    })
  }
  return menuItems
}
