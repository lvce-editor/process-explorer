import type { Rpc } from '@lvce-editor/rpc'

interface State {
  rpc: Rpc | undefined
}

const state: State = {
  rpc: undefined,
}

export const invoke = async (
  method: string,
  ...params: readonly unknown[]
): Promise<any> => {
  if (!state.rpc) {
    throw new Error('ProcessExplorerModule is not initialized')
  }
  return state.rpc.invoke(method, ...params)
}

export const set = (newRpc: Rpc): void => {
  state.rpc = newRpc
}

export const clear = (): void => {
  state.rpc = undefined
}
