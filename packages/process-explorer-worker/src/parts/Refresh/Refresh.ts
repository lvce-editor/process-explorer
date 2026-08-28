import { PlatformType } from '@lvce-editor/constants'
import { MainProcess } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import * as GetFrontendMemoryUsage from '../GetFrontendMemoryUsage/GetFrontendMemoryUsage.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'
import * as GroupProcesses from '../GroupProcesses/GroupProcesses.ts'
import * as InitializeProcessExplorer from '../InitializeProcessExplorer/InitializeProcessExplorer.ts'
import * as PrepareError from '../PrepareError/PrepareError.ts'
import * as ProcessExplorerModule from '../ProcessExplorer/ProcessExplorer.ts'
import * as RemoteProcessExplorer from '../RemoteProcessExplorer/RemoteProcessExplorer.ts'
import * as ReparentSharedProcessChildren from '../ReparentSharedProcessChildren/ReparentSharedProcessChildren.ts'

interface ProcessExplorerRpc {
  readonly invoke: (
    method: string,
    ...params: readonly unknown[]
  ) => Promise<any>
}

const getFocusedIndex = (
  oldFocusedIndex: number,
  visibleProcesses: readonly ProcessInfo[],
): number => {
  if (visibleProcesses.length === 0) {
    return -1
  }
  if (oldFocusedIndex < 0) {
    return 0
  }
  return Math.min(oldFocusedIndex, visibleProcesses.length - 1)
}

const listProcesses = async (
  processExplorer: ProcessExplorerRpc,
  rootPid: number,
  pidMap?: unknown,
): Promise<readonly ProcessInfo[]> => {
  if (pidMap) {
    return processExplorer.invoke(
      'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage',
      rootPid,
      false,
      pidMap,
    )
  }
  return processExplorer.invoke(
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage',
    rootPid,
    false,
  )
}

const getRootPid = async (
  processExplorer: ProcessExplorerRpc,
  rootPid: number,
  includeElectronData: boolean,
): Promise<number> => {
  if (rootPid !== -1) {
    return rootPid
  }
  return processExplorer.invoke('ProcessId.getMainProcessId', {
    includeElectronData,
  })
}

export const refresh = async (
  state: ProcessExplorerState,
): Promise<ProcessExplorerState> => {
  try {
    await InitializeProcessExplorer.initializeProcessExplorer(state.platform)
    const includeElectronData = state.platform === PlatformType.Electron
    const rootPid = await getRootPid(
      ProcessExplorerModule,
      state.rootPid,
      includeElectronData,
    )
    const pidMap = includeElectronData
      ? await MainProcess.invoke('CreatePidMap.createPidMap')
      : undefined
    const processes = await listProcesses(
      ProcessExplorerModule,
      rootPid,
      pidMap,
    )
    const frontendMemoryProcesses = state.includeFrontendMemoryUsage
      ? await GetFrontendMemoryUsage.getFrontendMemoryUsage(rootPid)
      : []
    const allProcesses = [...processes, ...frontendMemoryProcesses]
    const localProcesses =
      state.platform === PlatformType.Electron
        ? ReparentSharedProcessChildren.reparentSharedProcessChildren(
            allProcesses,
          )
        : allProcesses
    let displayedProcesses = localProcesses
    if (
      state.platform === PlatformType.Electron &&
      RemoteProcessExplorer.has()
    ) {
      const remoteRootPid = await getRootPid(RemoteProcessExplorer, -1, false)
      const remoteProcesses = await listProcesses(
        RemoteProcessExplorer,
        remoteRootPid,
      )
      displayedProcesses = GroupProcesses.groupProcesses(
        localProcesses,
        rootPid,
        remoteProcesses,
        remoteRootPid,
      )
    }
    const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
      displayedProcesses,
      state.collapsedPids,
      rootPid,
    )
    return {
      ...state,
      errorCodeFrame: '',
      errorMessage: '',
      errorStack: '',
      focusedIndex: getFocusedIndex(state.focusedIndex, visibleProcesses),
      initial: false,
      processes: displayedProcesses,
      rootPid,
      visibleProcesses,
    }
  } catch (error) {
    const prettyError = await PrepareError.prepareError(error)
    return {
      ...state,
      errorCodeFrame: prettyError.codeFrame || '',
      errorMessage: prettyError.message || PrepareError.getErrorMessage(error),
      errorStack: prettyError.stack || '',
      initial: false,
    }
  }
}
