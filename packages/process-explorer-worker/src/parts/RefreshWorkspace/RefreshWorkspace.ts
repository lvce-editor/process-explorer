import { RendererWorker } from '@lvce-editor/rpc-registry'

export const refreshWorkspace = async (): Promise<void> => {
  // TODO maybe pass an application id to this?
  try {
    await RendererWorker.invoke('Layout.handleWorkspaceRefresh')
  } catch {
    // ignore
  }
}
