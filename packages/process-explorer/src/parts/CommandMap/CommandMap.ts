import * as E2eFixtureProcess from '../E2eFixtureProcess/E2eFixtureProcess.ts'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as HandleSocket from '../HandleSocket/HandleSocket.ts'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.ts'
import * as KillProcess from '../KillProcess/KillProcess.ts'
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
  'Process.createE2eFixtureProcess': E2eFixtureProcess.createE2eFixtureProcess,
  'Process.disposeE2eFixtureProcess':
    E2eFixtureProcess.disposeE2eFixtureProcess,
  'Process.kill': KillProcess.killProcess,
  'ProcessId.getMainProcessId': ProcessId.getMainProcessId,
}
