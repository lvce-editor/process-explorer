import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as UpdateIcons from '../UpdateIcons/UpdateIcons.ts'

export const handleIconThemeChange = (state: ExplorerState): Promise<ExplorerState> => {
  return UpdateIcons.updateIcons(state)
}
