import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const handleFocus = (
  state: ProcessExplorerState,
): ProcessExplorerState => {
  return {
    ...state,
    focused: true,
  }
}
