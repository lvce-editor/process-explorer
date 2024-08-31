import * as Listen from '../Listen/Listen.ts'
import * as CommandState from '../CommandState/CommandState.ts'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const main = async () => {
  CommandState.registerCommands(CommandMap.commandMap)
  await Listen.listen()
}
