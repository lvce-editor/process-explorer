import type { Rpc } from '@lvce-editor/rpc'
import { MainProcess, RpcId, set } from '@lvce-editor/rpc-registry'

export const setRpc = (rpc: Rpc, rpcId?: number): void => {
  if (typeof rpcId !== 'number') {
    return
  }
  if (rpcId === RpcId.MainProcess) {
    MainProcess.set(rpc)
    return
  }
  set(rpcId, rpc)
}
