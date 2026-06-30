import { createFileSystemWorkerRpc } from '../CreateFileSystemWorkerRpc/CreateFileSystemWorkerRpc.ts'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.ts'

export const initializeFileSystemWorker = async (): Promise<void> => {
  const rpc = await createFileSystemWorkerRpc()
  FileSystemWorker.set(rpc)
}
