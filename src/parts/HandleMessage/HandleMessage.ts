import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

const preparePrettyError = (error) => {
  return error
}

const logError = (error) => {
  console.error(error)
}

const requiresSocket = () => {
  return false
}

export const handleMessage = (event) => {
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
