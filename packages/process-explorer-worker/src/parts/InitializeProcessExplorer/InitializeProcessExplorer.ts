import { PlatformType } from '@lvce-editor/constants'
import * as LaunchProcessExplorerElectron from '../LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts'
import * as LaunchProcessExplorerNode from '../LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts'
import * as ProcessExplorerModule from '../ProcessExplorer/ProcessExplorer.ts'

interface State {
  initializedPlatform: number
}

const state: State = {
  initializedPlatform: 0,
}

export const initializeProcessExplorer = async (
  platform: number,
): Promise<void> => {
  if (state.initializedPlatform === platform) {
    return
  }
  if (platform === PlatformType.Electron) {
    const rpc =
      await LaunchProcessExplorerElectron.launchProcessExplorerElectron()
    ProcessExplorerModule.set(rpc)
    state.initializedPlatform = platform
    return
  }
  if (platform === PlatformType.Remote) {
    const rpc = await LaunchProcessExplorerNode.launchProcessExplorerNode()
    ProcessExplorerModule.set(rpc)
    state.initializedPlatform = platform
  }
}

export const clear = (): void => {
  state.initializedPlatform = 0
}

export const dispose = async (): Promise<void> => {
  state.initializedPlatform = 0
  await ProcessExplorerModule.dispose()
}
