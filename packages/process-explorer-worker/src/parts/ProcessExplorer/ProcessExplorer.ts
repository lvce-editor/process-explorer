import type { Rpc } from '@lvce-editor/rpc'

let rpc: Rpc | undefined

export const invoke = async (
  method: string,
  ...params: readonly unknown[]
): Promise<any> => {
  if (!rpc) {
    throw new Error('ProcessExplorerModule is not initialized')
  }
  return rpc.invoke(method, ...params)
}

export const set = (newRpc: Rpc): void => {
  rpc = newRpc
}

export const clear = (): void => {
  rpc = undefined
}
