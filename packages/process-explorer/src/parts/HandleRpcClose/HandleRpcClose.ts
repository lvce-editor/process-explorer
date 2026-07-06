import type { Rpc } from '@lvce-editor/rpc'
import { SharedProcess } from '@lvce-editor/rpc-registry'
import * as Exit from '../Exit/Exit.ts'

type IpcWithClose =
  | {
      readonly addEventListener: (
        type: string,
        listener: () => void,
        options?: { readonly once?: boolean },
      ) => void
      readonly removeEventListener?: (
        type: string,
        listener: () => void,
      ) => void
    }
  | {
      readonly on: (type: string, listener: () => void) => void
      readonly off?: (type: string, listener: () => void) => void
    }

interface RpcWithIpc extends Rpc {
  readonly ipc?: IpcWithClose
}

const removeCloseListener = (ipc: IpcWithClose, listener: () => void): void => {
  if ('removeEventListener' in ipc && ipc.removeEventListener) {
    ipc.removeEventListener('close', listener)
    return
  }
  if ('off' in ipc && ipc.off) {
    ipc.off('close', listener)
  }
}

export const handleClose = async (): Promise<void> => {
  let refCount: number
  try {
    refCount = await SharedProcess.invoke('ProcessExplorer.decreaseRefCount')
  } catch {
    Exit.exit()
    return
  }
  if (refCount === 0) {
    Exit.exit()
  }
}

export const listen = (rpc: Rpc): void => {
  const { ipc } = rpc as RpcWithIpc
  if (!ipc) {
    return
  }
  let didClose = false
  const listener = (): void => {
    if (didClose) {
      return
    }
    didClose = true
    removeCloseListener(ipc, listener)
    void handleClose()
  }
  if ('addEventListener' in ipc) {
    ipc.addEventListener('close', listener, { once: true })
    return
  }
  ipc.on('close', listener)
}
