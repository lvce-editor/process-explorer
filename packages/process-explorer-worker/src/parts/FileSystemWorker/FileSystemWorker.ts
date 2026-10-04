import { FileSystemWorker } from '@lvce-editor/rpc-registry'

export const set = (
  ...args: Parameters<typeof FileSystemWorker.set>
): ReturnType<typeof FileSystemWorker.set> => FileSystemWorker.set(...args)
