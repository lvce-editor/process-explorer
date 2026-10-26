import { ViewletCommand } from '@lvce-editor/constants'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import { getCss } from '../GetCss/GetCss.ts'

export const renderCss = (
  oldState: ProcessExplorerState,
  newState: ProcessExplorerState,
): readonly any[] => {
  const css = getCss(newState.uniqueIndents)
  return [ViewletCommand.SetCss, newState.uid, css]
}
