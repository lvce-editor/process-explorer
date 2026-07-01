import * as SetCommandMap from '../SetCommandMap/SetCommandMap.ts'

export const set = (commandMap: Readonly<Record<string, any>>): void => {
  SetCommandMap.set(commandMap)
}
