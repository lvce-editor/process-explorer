import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToIconThemeWorker = async (port: any): Promise<void> => {
  await RendererWorker.sendMessagePortToIconThemeWorker(port, 0)
}
