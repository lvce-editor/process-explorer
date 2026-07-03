import * as CommandMapState from '../CommandMapState/CommandMapState.ts'

export const set = (commandMap: Readonly<Record<string, any>>): void => {
  CommandMapState.state.commandMap = commandMap
}
