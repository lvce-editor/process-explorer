import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const render2 = (
  uid: number,
  diffResult: readonly number[],
): readonly any[] => {
  const { oldState, scheduledState } = ProcessExplorerStates.get(uid)
  ProcessExplorerStates.set(uid, scheduledState, scheduledState)
  return ApplyRender.applyRender(oldState, scheduledState, diffResult)
}
