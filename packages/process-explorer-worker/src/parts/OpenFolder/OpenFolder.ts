import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openFolder = async (): Promise<void> => {
  await RendererWorker.invoke(`Dialog.openFolder`)
}
