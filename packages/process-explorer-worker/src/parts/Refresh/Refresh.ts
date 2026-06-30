import { ErrorWorker } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import * as FileSystemWorker from '../FileSystemWorker/FileSystemWorker.ts'
import * as GetVisibleProcesses from '../GetVisibleProcesses/GetVisibleProcesses.ts'

interface PreparedError {
  readonly codeFrame: string | undefined
  readonly message: string | undefined
  readonly stack: string | undefined
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

const prepareError = async (error: unknown): Promise<PreparedError> => {
  try {
    return await ErrorWorker.prepare(error)
  } catch {
    return {
      codeFrame: undefined,
      message: getErrorMessage(error),
      stack: undefined,
    }
  }
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

export const refresh = async (
  state: ProcessExplorerState,
): Promise<ProcessExplorerState> => {
  try {
    const rootPid =
      state.rootPid ||
      (await FileSystemWorker.invoke('ProcessId.getMainProcessId'))
    const processes: readonly ProcessInfo[] = await FileSystemWorker.invoke(
      'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage',
      rootPid,
    )
    const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
      processes,
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
      processes,
      rootPid,
      visibleProcesses,
    }
  } catch (error) {
    const prettyError = await prepareError(error)
    return {
      ...state,
      errorCodeFrame: prettyError.codeFrame || '',
      errorMessage: prettyError.message || getErrorMessage(error),
      errorStack: prettyError.stack || '',
      initial: false,
    }
  }
}
