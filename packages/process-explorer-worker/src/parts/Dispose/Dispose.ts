import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const dispose = (uid: number): void => {
  AutoRefresh.dispose(uid)
  ProcessExplorerStates.dispose(uid)
}
