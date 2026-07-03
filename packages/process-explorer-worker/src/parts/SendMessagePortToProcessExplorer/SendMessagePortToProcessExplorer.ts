import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToProcessExplorer = async (
  port: MessagePort,
): Promise<void> => {
  await RendererWorker.sendMessagePortToProcessExplorer(port)
}
