import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openUri = async (uri: string, focus: boolean): Promise<void> => {
  await RendererWorker.openUri(uri, /* focus */ focus)
}
