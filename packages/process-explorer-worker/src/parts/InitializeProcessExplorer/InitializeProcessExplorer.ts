import { PlatformType } from '@lvce-editor/constants'
import { MainProcess, RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleProcessExplorerRpcClose from '../HandleProcessExplorerRpcClose/HandleProcessExplorerRpcClose.ts'
import * as LaunchProcessExplorerElectron from '../LaunchProcessExplorerElectron/LaunchProcessExplorerElectron.ts'
import * as LaunchProcessExplorerNode from '../LaunchProcessExplorerNode/LaunchProcessExplorerNode.ts'
import * as ProcessExplorerModule from '../ProcessExplorer/ProcessExplorer.ts'
import * as RemoteProcessExplorer from '../RemoteProcessExplorer/RemoteProcessExplorer.ts'

interface State {
  connectionId: number
  initializedPlatform: number
  remoteInitialized: boolean
}

const state: State = {
  connectionId: 0,
  initializedPlatform: 0,
  remoteInitialized: false,
}

const handleClose = async (connectionId: number): Promise<void> => {
  const { connectionId: currentConnectionId } = state
  if (connectionId !== currentConnectionId) {
    return
  }
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
  const { remoteInitialized } = state
  if (!remoteWorkspace) {
    if (remoteInitialized) {
      state.remoteInitialized = false
      await RemoteProcessExplorer.dispose()
    }
    return
  }
  if (remoteInitialized) {
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
  const { initializedPlatform } = state
  if (initializedPlatform === platform) {
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
    const connectionId = ++state.connectionId
    const rpc = await LaunchProcessExplorerNode.launchProcessExplorerNode(
      () => {
        void handleClose(connectionId)
      },
    )
    ProcessExplorerModule.set(rpc)
    state.initializedPlatform = platform
  }
}

// Killing the process marks the view closed before the transport's close event arrives.
// Retire that endpoint before retrying, and ignore its eventual close notification.
export const retireClosedConnection = async (): Promise<void> => {
  const { initializedPlatform } = state
  if (!initializedPlatform) {
    return
  }
  state.connectionId++
  state.initializedPlatform = 0
  await ProcessExplorerModule.dispose()
  if (initializedPlatform === PlatformType.Electron) {
    await MainProcess.dispose()
  }
}

export const clear = (): void => {
  state.connectionId++
  state.initializedPlatform = 0
  state.remoteInitialized = false
  RemoteProcessExplorer.clear()
}

export const dispose = async (): Promise<void> => {
  state.connectionId++
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
