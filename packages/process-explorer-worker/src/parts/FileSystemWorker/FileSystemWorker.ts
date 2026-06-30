import { FileSystemWorker, RendererWorker } from '@lvce-editor/rpc-registry'

// TODO use direct connection
export const invoke = async (method: string, ...params: readonly unknown[]): Promise<any> => {
  return RendererWorker.invoke(method, ...params)
}

export const { set } = FileSystemWorker
