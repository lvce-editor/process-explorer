import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToErrorWorker = async (
  port: MessagePort,
): Promise<void> => {
  await RendererWorker.sendMessagePortToErrorWorker(port, 0)
}
