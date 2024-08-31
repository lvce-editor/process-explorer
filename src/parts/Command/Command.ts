import * as CommandState from '../CommandState/CommandState.ts'

export const execute = (command, ...args) => {
  const fn = CommandState.getCommand(command)
  if (!fn) {
    throw new Error(`Command not found ${command}`)
  }
  return fn(...args)
}
