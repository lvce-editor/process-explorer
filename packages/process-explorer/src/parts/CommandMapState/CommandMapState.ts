interface State {
  commandMap: Readonly<Record<string, any>>
}

export const state: State = {
  commandMap: {},
}
