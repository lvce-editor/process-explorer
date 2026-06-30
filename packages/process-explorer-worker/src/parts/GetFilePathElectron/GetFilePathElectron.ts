import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getFilePathElectron = async (file: File): Promise<string> => {
  return RendererWorker.invoke('FileSystemHandle.getFilePathElectron', file)
}
