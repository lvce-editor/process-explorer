import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const { get, getCommandIds, registerCommands, set, wrapGetter } =
  ViewletRegistry.create<ProcessExplorerState>()
