import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openNativeFolder = async (path: string): Promise<void> => {
  await RendererWorker.invoke('OpenNativeFolder.openNativeFolder', /* path */ path)
}
