import { ViewletCommand } from '@lvce-editor/constants'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import { getCss } from '../GetCss/GetCss.ts'
import { getUniqueDepths } from '../GetUniqueDepths/GetUniqueDepths.ts'

export const renderCss = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): readonly any[] => {
  const depths = getUniqueDepths(newState.visibleProcesses)
  const css = getCss(depths)
  return [ViewletCommand.SetCss, newState.uid, css]
}
