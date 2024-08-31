import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

interface State {
  ipc: any
}

export const state: State = {
  ipc: undefined,
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
