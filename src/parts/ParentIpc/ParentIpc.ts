import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const invoke = (method, ...params) => {
  return JsonRpc.invoke(state.ipc, method, ...params)
}
