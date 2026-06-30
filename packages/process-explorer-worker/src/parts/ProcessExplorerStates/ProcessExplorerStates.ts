import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const {
  clear,
  get,
  getCommandIds,
  registerCommands,
  set,
  wrapCommand,
  wrapLoadContent,
} = ViewletRegistry.create<ProcessExplorerState>()
