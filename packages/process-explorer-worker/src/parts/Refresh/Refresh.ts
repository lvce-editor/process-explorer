import { PlatformType } from '@lvce-editor/constants'
import { MainProcess } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as GetErrorCode from '../GetErrorCode/GetErrorCode.ts'
import * as GetFrontendMemoryUsage from '../GetFrontendMemoryUsage/GetFrontendMemoryUsage.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'
import * as InitializeProcessExplorer from '../InitializeProcessExplorer/InitializeProcessExplorer.ts'
import * as PrepareError from '../PrepareError/PrepareError.ts'
import * as ProcessExplorerModule from '../ProcessExplorer/ProcessExplorer.ts'
import * as ReparentSharedProcessChildren from '../ReparentSharedProcessChildren/ReparentSharedProcessChildren.ts'

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
  rootPid: number,
  platform: number,
): Promise<readonly ProcessInfo[]> => {
  if (platform === PlatformType.Electron) {
    const pidMap = await MainProcess.invoke('CreatePidMap.createPidMap')
    return ProcessExplorerModule.invoke(
      'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage',
      rootPid,
      false,
      pidMap,
    )
  }
  return ProcessExplorerModule.invoke(
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage',
    rootPid,
    false,
  )
}

export const refresh = async (
  state: ProcessExplorerState,
): Promise<ProcessExplorerState> => {
  try {
    await InitializeProcessExplorer.initializeProcessExplorer(state.platform)
    const includeElectronData = state.platform === PlatformType.Electron
    const rootPid =
      state.rootPid === -1
        ? await ProcessExplorerModule.invoke('ProcessId.getMainProcessId', {
            includeElectronData,
          })
        : state.rootPid
    const processes = await listProcesses(rootPid, state.platform)
    const frontendMemoryProcesses = state.includeFrontendMemoryUsage
      ? await GetFrontendMemoryUsage.getFrontendMemoryUsage(rootPid)
      : []
    const allProcesses = [...processes, ...frontendMemoryProcesses]
    const displayedProcesses =
      state.platform === PlatformType.Electron
        ? ReparentSharedProcessChildren.reparentSharedProcessChildren(
            allProcesses,
          )
        : allProcesses
    const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
      displayedProcesses,
      state.collapsedPids,
      rootPid,
    )
    return {
      ...state,
      errorCode: '',
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
      errorCode: GetErrorCode.getErrorCode(
        error,
        ErrorCodes.ProcessExplorerRefreshFailed,
      ),
      errorCodeFrame: prettyError.codeFrame || '',
      errorMessage: prettyError.message || PrepareError.getErrorMessage(error),
      errorStack: prettyError.stack || '',
      initial: false,
    }
  }
}
