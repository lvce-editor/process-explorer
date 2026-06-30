import { RendererWorker as Rpc } from '@lvce-editor/rpc-registry'

export const getWorkspacePath = (): Promise<string> => {
  return Rpc.invoke('Workspace.getPath')
}
