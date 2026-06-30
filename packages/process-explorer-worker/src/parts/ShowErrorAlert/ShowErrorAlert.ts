import { RendererWorker } from '@lvce-editor/rpc-registry'

export const showErrorAlert = async (errorMessage: string): Promise<void> => {
  await RendererWorker.confirm(errorMessage)
}
