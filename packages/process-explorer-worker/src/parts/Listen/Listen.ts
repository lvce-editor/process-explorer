import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../ProcessExplorerStates/ProcessExplorerStates.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/initializeRendereWorker.ts'
import { initializeFileSystemWorker } from '../InitializeFileSystemWorker/InitializeFileSystemWorker.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)

  await Promise.all([initializeRendererWorker(), initializeFileSystemWorker()])
}
