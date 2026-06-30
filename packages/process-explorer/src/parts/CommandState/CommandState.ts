type Command = (...args: readonly any[]) => any
type CommandMap = Readonly<Record<string, Command>>

const state = {
  commands: Object.create(null) as Record<string, Command>,
}

const registerCommand = (key: string, fn: Command): void => {
  state.commands[key] = fn
}

export const registerCommands = (commandMap: CommandMap): void => {
  for (const [key, value] of Object.entries(commandMap)) {
    registerCommand(key, value)
  }
}

export const getCommand = (key: string): Command | undefined => {
  return state.commands[key]
}
