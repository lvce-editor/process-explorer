import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as InitializeProcessExplorer from '../InitializeProcessExplorer/InitializeProcessExplorer.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'
import * as Retry from '../Retry/Retry.ts'

export const dispose = async (uid: number): Promise<void> => {
  AutoRefresh.dispose(uid)
  ProcessExplorerStates.dispose(uid)
  try {
    await Retry.waitForPending(uid)
  } finally {
    if (ProcessExplorerStates.getKeys().length === 0) {
      await InitializeProcessExplorer.dispose()
    }
  }
}
