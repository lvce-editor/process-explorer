import * as CommandMap from '../CommandMap/CommandMap.ts'
import { initializeErrorWorker } from '../InitializeErrorWorker/InitializeErrorWorker.ts'
import { initializeFileSystemWorker } from '../InitializeFileSystemWorker/InitializeFileSystemWorker.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/initializeRendereWorker.ts'
import { registerCommands } from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)

  await Promise.all([
    initializeRendererWorker(),
    initializeFileSystemWorker(),
    initializeErrorWorker(),
  ])
}
