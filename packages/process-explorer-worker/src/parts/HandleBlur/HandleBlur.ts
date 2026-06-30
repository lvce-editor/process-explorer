import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const handleBlur = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  return {
    ...state,
    focused: false,
  }
}
