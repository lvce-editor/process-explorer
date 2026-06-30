import * as CommandMapState from '../CommandMapState/CommandMapState.ts'

export const get = (): Readonly<Record<string, any>> => {
  return CommandMapState.state.commandMap
}
