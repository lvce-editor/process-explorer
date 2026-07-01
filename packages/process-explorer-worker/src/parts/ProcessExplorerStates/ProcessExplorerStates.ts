import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const {
  clear,
  dispose,
  get,
  getCommandIds,
  getKeys,
  registerCommands,
  set,
  wrapCommand,
  wrapGetter,
  wrapLoadContent,
} = ViewletRegistry.create<ProcessExplorerState>()
