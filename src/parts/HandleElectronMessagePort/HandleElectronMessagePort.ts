import * as Assert from '../Assert/Assert.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as IpcId from '../IpcId/IpcId.ts'
import * as ParentIpc from '../ParentIpc/ParentIpc.ts'
import * as ProcessExplorerFrontendIpc from '../ProcessExplorerFrontendIpc/ProcessExplorerFrontendIpc.ts'

export const handleElectronMessagePort = async (messagePort, ipcId) => {
  Assert.object(messagePort)
  // Assert.number(ipcId)
  const ipc = await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
  HandleIpc.handleIpc(ipc)
  if (ipcId === IpcId.MainProcess) {
    ParentIpc.state.ipc = ipc
  } else if (ipcId === IpcId.ProcessExplorerRenderer) {
    // TODO how to connect message ports to the correct
    // renderer process?
    ProcessExplorerFrontendIpc.state.ipc = ipc
  }
}
