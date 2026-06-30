import { ErrorWorker } from '@lvce-editor/rpc-registry'
import { createErrorWorkerRpc } from '../CreateErrorWorkerRpc/CreateErrorWorkerRpc.ts'

export const initializeErrorWorker = async (): Promise<void> => {
  const rpc = await createErrorWorkerRpc()
  ErrorWorker.set(rpc)
}
