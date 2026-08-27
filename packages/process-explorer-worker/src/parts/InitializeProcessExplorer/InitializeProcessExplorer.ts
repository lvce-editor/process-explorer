import { PlatformType } from '@lvce-editor/constants'
import { MainProcess } from '@lvce-editor/rpc-registry'
import * as HandleProcessExplorerRpcClose from '../HandleProcessExplorerRpcClose/HandleProcessExplorerRpcClose.ts'
import * as LaunchProcessExplorerElectron from '../LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts'
import * as LaunchProcessExplorerNode from '../LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts'
import * as ProcessExplorerModule from '../ProcessExplorer/ProcessExplorer.ts'

interface State {
  initializedPlatform: number
}

const state: State = {
  initializedPlatform: 0,
}

const handleClose = async (): Promise<void> => {
  state.initializedPlatform = 0
  ProcessExplorerModule.clear()
  await HandleProcessExplorerRpcClose.handleProcessExplorerRpcClose()
}

export const initializeProcessExplorer = async (
  platform: number,
): Promise<void> => {
  if (state.initializedPlatform === platform) {
    return
  }
  if (platform === PlatformType.Electron) {
    const { mainProcessRpc, processExplorerRpc } =
      await LaunchProcessExplorerElectron.launchProcessExplorerElectron()
    MainProcess.set(mainProcessRpc)
    ProcessExplorerModule.set(processExplorerRpc)
    state.initializedPlatform = platform
    return
  }
  if (platform === PlatformType.Remote) {
    const rpc = await LaunchProcessExplorerNode.launchProcessExplorerNode(
      () => {
        void handleClose()
      },
    )
    ProcessExplorerModule.set(rpc)
    state.initializedPlatform = platform
  }
}

export const clear = (): void => {
  state.initializedPlatform = 0
}

export const dispose = async (): Promise<void> => {
  const { initializedPlatform } = state
  state.initializedPlatform = 0
  if (initializedPlatform === PlatformType.Electron) {
    await Promise.all([MainProcess.dispose(), ProcessExplorerModule.dispose()])
    return
  }
  await ProcessExplorerModule.dispose()
}
