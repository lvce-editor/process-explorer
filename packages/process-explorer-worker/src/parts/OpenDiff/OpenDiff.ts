import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openDiff = async (leftUri: string, rightUri: string, focus: boolean): Promise<void> => {
  await RendererWorker.openUri(`diff://${leftUri}<->${rightUri}`, focus)
}
