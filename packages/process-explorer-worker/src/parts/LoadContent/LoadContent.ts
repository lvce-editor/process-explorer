import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetErrorCode from '../GetErrorCode/GetErrorCode.ts'
import * as GetErrorMessage from '../GetErrorMessage/GetErrorMessage.ts'
import * as GetExcluded from '../GetExcluded/GetExcluded.ts'
import * as GetFileDecorations from '../GetFileDecorations/GetFileDecorations.ts'
import * as GetFriendlyErrorMessage from '../GetFriendlyErrorMessage/GetFriendlyErrorMessage.ts'
import * as GetPathSeparator from '../GetPathSeparator/GetPathSeparator.ts'
import * as GetRestoredDeltaY from '../GetRestoredDeltaY/GetRestoredDeltaY.ts'
import * as GetSavedRoot from '../GetSavedRoot/GetSavedRoot.ts'
import { getScheme } from '../GetScheme/GetScheme.ts'
import * as GetSettings from '../GetSettings/GetSettings.ts'
import * as GetWorkspacePath from '../GetWorkspacePath/GetWorkspacePath.ts'
import * as RestoreExpandedState from '../RestoreExpandedState/RestoreExpandedState.ts'

export const loadContent = async (state: ExplorerState, savedState: any): Promise<ExplorerState> => {
  const { assetDir, height, itemHeight, platform } = state
  const { confirmDelete, sourceControlDecorations, useChevrons } = await GetSettings.getSettings()
  const workspacePath = await GetWorkspacePath.getWorkspacePath()
  const root = GetSavedRoot.getSavedRoot(savedState, workspacePath)
  try {
    // TODO path separator could be restored from saved state
    const pathSeparator = await GetPathSeparator.getPathSeparator(root) // TODO only load path separator once
    const excluded = GetExcluded.getExcluded()
    const restoredDirents = await RestoreExpandedState.restoreExpandedState(savedState, root, pathSeparator, excluded)
    const rawDeltaY = GetRestoredDeltaY.getRestoredDeltaY(savedState)
    const maxDeltaY = Math.max(restoredDirents.length * itemHeight - height, 0)
    const deltaY = Math.min(Math.max(rawDeltaY, 0), maxDeltaY)
    const minLineY = Math.round(deltaY / itemHeight)

    const scheme = getScheme(root)
    const decorations = await GetFileDecorations.getFileDecorations(
      scheme,
      root,
      restoredDirents.filter((item: any) => item.depth === 1).map((item: any) => item.path),
      sourceControlDecorations,
      assetDir,
      platform,
    )
    return {
      ...state,
      confirmDelete,
      decorations,
      deltaY,
      errorCode: '',
      errorMessage: '',
      excluded,
      hasError: false,
      initial: false,
      items: restoredDirents,
      maxIndent: 10,
      minLineY,
      pathSeparator,
      root,
      useChevrons,
    }
  } catch (error) {
    const errorCode = GetErrorCode.getErrorCode(error)
    const errorMessage = GetFriendlyErrorMessage.getFriendlyErrorMessage(GetErrorMessage.getErrorMessage(error), errorCode)
    return {
      ...state,
      confirmDelete,
      errorCode,
      errorMessage,
      hasError: true,
      initial: false,
      items: [],
      root,
      useChevrons,
    }
  }
}
