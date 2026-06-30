interface State {
  commandMap: Readonly<Record<string, any>>
}

const state: State = {
  commandMap: {},
}

export const set = (commandMap: Readonly<Record<string, any>>): void => {
  state.commandMap = commandMap
}

export const get = (): Readonly<Record<string, any>> => {
  return state.commandMap
}
