import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

const getMissingFolderMessage = (root: string): string => {
  if (root) {
    return `Could not open "${root}" because the folder does not exist. It may have been moved or deleted.`
  }
  return 'Could not open folder because the folder does not exist. It may have been moved or deleted.'
}

export const getLoadErrorMessage = (state: ExplorerState): string => {
  if (state.hasError) {
    if (state.errorCode === 'ENOENT') {
      return getMissingFolderMessage(state.root)
    }
    const code = state.errorCode ? ` (error code: ${state.errorCode})` : ''
    const reason = state.errorMessage || 'an unexpected error occurred'
    return `Could not open folder due to ${reason}${code}.`
  }
  return ''
}

export const shouldShowOpenAnotherFolderButton = (state: ExplorerState): boolean => {
  return state.hasError && state.errorCode === 'ENOENT'
}
