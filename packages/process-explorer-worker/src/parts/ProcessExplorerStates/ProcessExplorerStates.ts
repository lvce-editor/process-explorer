import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const { get, getCommandIds, registerCommands, set, wrapGetter } =
  ViewletRegistry.create<ProcessExplorerState>()
