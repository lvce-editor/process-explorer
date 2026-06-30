import { initializeRendererWorker } from '../InitializeRendererWorker/initializeRendereWorker.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)

  await Promise.all([initializeRendererWorker()])
}
