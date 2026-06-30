import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as DiffModules from '../DiffModules/DiffModules.ts'

export const diff = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): readonly number[] => {
  const diffResult: number[] = []
  for (let i = 0; i < DiffModules.modules.length; i++) {
    const fn = DiffModules.modules[i]
    if (!fn(oldState, newState)) {
      diffResult.push(DiffModules.numbers[i])
    }
  }
  return diffResult
}
