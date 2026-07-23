import type { Rpc } from '@lvce-editor/rpc'
import { LazyWebSocketRpcParent2 } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'

export const launchProcessExplorerNode = async (
  onClose: () => void,
): Promise<Rpc> => {
  try {
    const rpc = await LazyWebSocketRpcParent2.create({
      commandMap: {},
      onClose,
      type: 'process-explorer',
    })
    return rpc
  } catch (error) {
    throw new VError(error, 'Failed to create process explorer websocket rpc')
  }
}
