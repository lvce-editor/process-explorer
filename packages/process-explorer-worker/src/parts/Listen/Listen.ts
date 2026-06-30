import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../ExplorerStates/ExplorerStates.ts'
import { initializeFileSystemWorker } from '../InitializeFileSystemWorker/InitializeFileSystemWorker.ts'
import { initializeIconThemeWorker } from '../InitializeIconThemeWorker/InitializeIconThemeWorker.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/initializeRendereWorker.ts'
import { initializeSourceControlWorker } from '../InitializeSourceControlWorker/InitializeSourceControlWorker.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([initializeRendererWorker(), initializeFileSystemWorker(), initializeIconThemeWorker(), initializeSourceControlWorker()])
}
