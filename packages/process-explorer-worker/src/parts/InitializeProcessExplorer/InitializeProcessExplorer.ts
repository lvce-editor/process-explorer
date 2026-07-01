import { PlatformType } from '@lvce-editor/constants'
import * as LaunchProcessExplorerElectron from '../LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts'
import * as LaunchProcessExplorerNode from '../LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts'
import * as ProcessExplorerModule from '../ProcessExplorer/ProcessExplorer.ts'

let initializedPlatform = 0

export const initializeProcessExplorer = async (
  platform: number,
): Promise<void> => {
  if (initializedPlatform === platform) {
    return
  }
  if (platform === PlatformType.Electron) {
    const rpc = await LaunchProcessExplorerElectron.launchProcessExplorerElectron()
    ProcessExplorerModule.set(rpc)
    initializedPlatform = platform
    return
  }
  if (platform === PlatformType.Remote) {
    const rpc = await LaunchProcessExplorerNode.launchProcessExplorerNode()
    ProcessExplorerModule.set(rpc)
    initializedPlatform = platform
  }
}

export const clear = (): void => {
  initializedPlatform = 0
}
