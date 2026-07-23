import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as InitializeProcessExplorer from '../InitializeProcessExplorer/InitializeProcessExplorer.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const dispose = async (uid: number): Promise<void> => {
  AutoRefresh.dispose(uid)
  ProcessExplorerStates.dispose(uid)
  if (ProcessExplorerStates.getKeys().length === 0) {
    await InitializeProcessExplorer.dispose()
  }
}
