import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as ProcessId from '../ProcessId/ProcessId.ts'
import * as ListProcessesWithMemoryUsage from '../ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ts'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort':
    HandleElectronMessagePort.handleElectronMessagePort,
  'ProcessId.getMainProcessId': ProcessId.getMainProcessId,
  'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage,
  // 'ElectronContextMenu.openContextMenu': ElectronWebContentsView.handleContextMenu,
}
