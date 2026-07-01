import { RendererWorker } from '@lvce-editor/rpc-registry'

interface RendererWorkerWithProcessExplorer {
  readonly sendMessagePortToProcessExplorer: (port: MessagePort) => Promise<void>
}

export const sendMessagePortToProcessExplorer = async (
  port: MessagePort,
): Promise<void> => {
  const rendererWorker =
    RendererWorker as unknown as RendererWorkerWithProcessExplorer
  await rendererWorker.sendMessagePortToProcessExplorer(port)
}
