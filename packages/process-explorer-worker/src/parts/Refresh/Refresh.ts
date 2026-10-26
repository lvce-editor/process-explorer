import { PlatformType } from '@lvce-editor/constants'
import { MainProcess } from '@lvce-editor/rpc-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as GetErrorCode from '../GetErrorCode/GetErrorCode.ts'
import * as GetFrontendMemoryUsage from '../GetFrontendMemoryUsage/GetFrontendMemoryUsage.ts'
import * as GetProcessDisplayNameCached from '../GetProcessDisplayNameCached/GetProcessDisplayNameCached.ts'
import * as GetUniqueIndents from '../GetUniqueIndents/GetUniqueIndents.ts'
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
  pidMap?: Readonly<Record<number, string>>,
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
  const {
    collapsedPids,
    displayNameCache: stateDisplayNameCache,
    focusedIndex,
    includeFrontendMemoryUsage,
    platform,
    rootPid: stateRootPid,
    uniqueIndents,
  } = state
  if (platform === PlatformType.Web) {
    return {
      ...state,
      initial: false,
      message: 'Process Explorer is not supported on web.',
    }
  }
  try {
    await InitializeProcessExplorer.initializeProcessExplorer(platform)
    const includeElectronData = platform === PlatformType.Electron
    const rootPid = await getRootPid(
      ProcessExplorerModule,
      stateRootPid,
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
    const frontendMemoryProcesses = includeFrontendMemoryUsage
      ? await GetFrontendMemoryUsage.getFrontendMemoryUsage(rootPid)
      : []
    const displayNameCacheDraft = Object.assign(
      Object.create(null),
      stateDisplayNameCache,
    )
    const namedProcesses = processes.map((process) => {
      const name = GetProcessDisplayNameCached.getName(
        process.pid,
        process.cmd,
        rootPid,
        pidMap || {},
        displayNameCacheDraft,
      )
      return { ...process, name }
    })
    const allProcesses = [...namedProcesses, ...frontendMemoryProcesses]
    const localProcesses =
      platform === PlatformType.Electron
        ? ReparentSharedProcessChildren.reparentSharedProcessChildren(
            allProcesses,
          )
        : allProcesses
    let displayedProcesses = localProcesses
    if (platform === PlatformType.Electron && RemoteProcessExplorer.has()) {
      const remoteRootPid = await getRootPid(RemoteProcessExplorer, -1, false)
      const remoteProcesses = await listProcesses(
        RemoteProcessExplorer,
        remoteRootPid,
      )
      const namedRemoteProcesses = remoteProcesses.map((process) => {
        const name = GetProcessDisplayNameCached.getName(
          process.pid,
          process.cmd,
          remoteRootPid,
          {},
          displayNameCacheDraft,
        )
        return { ...process, name }
      })
      displayedProcesses = GroupProcesses.groupProcesses(
        localProcesses,
        rootPid,
        namedRemoteProcesses,
        remoteRootPid,
      )
    }
    const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
      displayedProcesses,
      collapsedPids,
      rootPid,
    )
    return {
      ...state,
      displayNameCache: GetProcessDisplayNameCached.trimCache(
        displayNameCacheDraft,
      ),
      errorCode: '',
      errorCodeFrame: '',
      errorMessage: '',
      errorStack: '',
      focusedIndex: getFocusedIndex(focusedIndex, visibleProcesses),
      initial: false,
      message: '',
      processes: displayedProcesses,
      rootPid,
      uniqueIndents: GetUniqueIndents.getUniqueIndents(
        visibleProcesses,
        uniqueIndents,
      ),
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
      message: '',
    }
  }
}
