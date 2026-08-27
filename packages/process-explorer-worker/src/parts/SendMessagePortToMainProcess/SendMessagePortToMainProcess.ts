import { RpcId } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToMainProcess = async (
  port: MessagePort,
): Promise<void> => {
  await RendererWorker.invokeAndTransfer(
    'SendMessagePortToMainProcess.sendMessagePortToMainProcess',
    port,
    'HandleElectronMessagePort.handleElectronMessagePort',
    RpcId.ProcessExplorerRenderer,
  )
}
