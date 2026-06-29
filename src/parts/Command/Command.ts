import * as CommandState from '../CommandState/CommandState.ts'

export const execute = (command: string, ...args: readonly unknown[]) => {
  const fn = CommandState.getCommand(command)
  if (!fn) {
    throw new Error(`Command not found ${command}`)
  }
  return fn(...args)
}
