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
  const { rpc } = state
  if (!rpc) {
    throw new Error('RemoteProcessExplorerModule is not initialized')
  }
  return rpc.invoke(method, ...params)
}

export const set = (newRpc: Rpc): void => {
  state.rpc = newRpc
}

export const has = (): boolean => {
  const { rpc } = state
  return Boolean(rpc)
}

export const clear = (): void => {
  state.rpc = undefined
}

export const dispose = async (): Promise<void> => {
  const { rpc } = state
  state.rpc = undefined
  await rpc?.dispose()
}
