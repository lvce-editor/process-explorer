import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { DroppedArgs } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'
import * as HandleDropRootDefault from '../HandleDropRootDefault/HandleDropRootDefault.ts'
import * as HandleDropRootElectron from '../HandleDropRootElectron/HandleDropRootElectron.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

interface DropHandler {
  (state: ExplorerState, fileHandles: DroppedArgs, files: readonly File[], paths: readonly string[]): Promise<ExplorerState>
}

const getModule = (isElectron: boolean): DropHandler => {
  if (isElectron) {
    return HandleDropRootElectron.handleDrop
  }
  return HandleDropRootDefault.handleDrop
}

export const handleDropRoot = async (
  state: ExplorerState,
  fileHandles: DroppedArgs,
  files: readonly File[],
  paths: readonly string[],
): Promise<ExplorerState> => {
  const isElectron = state.platform === PlatformType.Electron
  const fn = getModule(isElectron)
  return fn(state, fileHandles, files, paths)
}
