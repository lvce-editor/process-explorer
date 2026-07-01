import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as HandleSocket from '../HandleSocket/HandleSocket.ts'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.ts'
import * as ListProcessesWithMemoryUsage from '../ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ts'
import * as ProcessId from '../ProcessId/ProcessId.ts'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort':
    HandleElectronMessagePort.handleElectronMessagePort,
  'HandleMessagePort.handleMessagePort': HandleMessagePort.handleMessagePort,
  'HandleSocket.handleSocket': HandleSocket.handleSocket,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
    ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage,
  'ProcessId.getMainProcessId': ProcessId.getMainProcessId,
  // 'ElectronContextMenu.openContextMenu': ElectronWebContentsView.handleContextMenu,
}
