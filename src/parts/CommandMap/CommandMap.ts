import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as ListProcessesWithMemoryUsage from '../ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ts'
import * as ProcessId from '../ProcessId/ProcessId.ts'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort':
    HandleElectronMessagePort.handleElectronMessagePort,
  'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage,
  'ProcessId.getMainProcessId': ProcessId.getMainProcessId,
  // 'ElectronContextMenu.openContextMenu': ElectronWebContentsView.handleContextMenu,
}
