import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

interface JsonRpcMessageEvent {
  readonly data: unknown
  readonly target: unknown
}

const preparePrettyError = (error: unknown): unknown => {
  return error
}

const logError = (error: unknown): void => {
  console.error(error)
}

const requiresSocket = (): boolean => {
  return false
}

export const handleMessage = (event: JsonRpcMessageEvent): Promise<void> => {
  return JsonRpc.handleJsonRpcMessage(
    event.target,
    event.data,
    Command.execute,
    Callback.resolve,
    preparePrettyError,
    logError,
    requiresSocket,
  )
}
