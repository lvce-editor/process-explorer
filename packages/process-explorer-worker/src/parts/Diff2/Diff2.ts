import * as Diff from '../Diff/Diff.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { oldState, scheduledState } = ProcessExplorerStates.get(uid)
  return Diff.diff(oldState, scheduledState)
}
