import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as CommandState from '../CommandState/CommandState.ts'
import * as Listen from '../Listen/Listen.ts'

export const main = async (): Promise<void> => {
  CommandState.registerCommands(CommandMap.commandMap)
  await Listen.listen()
}
