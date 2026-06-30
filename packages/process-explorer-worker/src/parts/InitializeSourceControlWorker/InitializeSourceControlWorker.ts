import { SourceControlWorker } from '@lvce-editor/rpc-registry'
import { createSourceControlWorkerRpc } from '../CreateSourceControlWorkerRpc/CreateSourceControlWorkerWorkerRpc.ts'

export const initializeSourceControlWorker = async (): Promise<void> => {
  try {
    const rpc = await createSourceControlWorkerRpc()
    // TODO
    SourceControlWorker.set(rpc)
  } catch {
    // ignore
  }
}
