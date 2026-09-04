import { PlatformType } from '@lvce-editor/constants'
import { MainProcess, RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleProcessExplorerRpcClose from '../HandleProcessExplorerRpcClose/HandleProcessExplorerRpcClose.ts'
import * as LaunchProcessExplorerElectron from '../LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts'
import * as LaunchProcessExplorerNode from '../LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts'
import * as ProcessExplorerModule from '../ProcessExplorer/ProcessExplorer.ts'
import * as RemoteProcessExplorer from '../RemoteProcessExplorer/RemoteProcessExplorer.ts'

interface State {
  initializedPlatform: number
  remoteInitialized: boolean
}

const state: State = {
  initializedPlatform: 0,
  remoteInitialized: false,
}

const handleClose = async (): Promise<void> => {
  state.initializedPlatform = 0
  ProcessExplorerModule.clear()
  await HandleProcessExplorerRpcClose.handleProcessExplorerRpcClose()
}

const handleRemoteClose = (): void => {
  state.remoteInitialized = false
  RemoteProcessExplorer.clear()
  void RendererWorker.invoke('ProcessExplorer.update').catch(() => {})
}

const isRemoteWorkspace = async (): Promise<boolean> => {
  try {
    return await RendererWorker.invoke('WebSocketCapability.isActive')
  } catch {
    return false
  }
}

const initializeRemoteProcessExplorer = async (): Promise<void> => {
  const remoteWorkspace = await isRemoteWorkspace()
  if (!remoteWorkspace) {
    if (state.remoteInitialized) {
      state.remoteInitialized = false
      await RemoteProcessExplorer.dispose()
    }
    return
  }
  if (state.remoteInitialized) {
    return
  }
  try {
    const remoteRpc =
      await LaunchProcessExplorerNode.launchProcessExplorerNode(
        handleRemoteClose,
      )
    RemoteProcessExplorer.set(remoteRpc)
    state.remoteInitialized = true
  } catch {
    RemoteProcessExplorer.clear()
  }
}

export const initializeProcessExplorer = async (
  platform: number,
): Promise<void> => {
  if (state.initializedPlatform === platform) {
    if (platform === PlatformType.Electron) {
      await initializeRemoteProcessExplorer()
    }
    return
  }
  if (platform === PlatformType.Electron) {
    const { mainProcessRpc, processExplorerRpc } =
      await LaunchProcessExplorerElectron.launchProcessExplorerElectron()
    MainProcess.set(mainProcessRpc)
    ProcessExplorerModule.set(processExplorerRpc)
    state.initializedPlatform = platform
    await initializeRemoteProcessExplorer()
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
  state.remoteInitialized = false
  RemoteProcessExplorer.clear()
}

export const dispose = async (): Promise<void> => {
  const { initializedPlatform } = state
  state.initializedPlatform = 0
  state.remoteInitialized = false
  if (initializedPlatform === PlatformType.Electron) {
    await Promise.all([
      MainProcess.dispose(),
      ProcessExplorerModule.dispose(),
      RemoteProcessExplorer.dispose(),
    ])
    return
  }
  await Promise.all([
    ProcessExplorerModule.dispose(),
    RemoteProcessExplorer.dispose(),
  ])
}
