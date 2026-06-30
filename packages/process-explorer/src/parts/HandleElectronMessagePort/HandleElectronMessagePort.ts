import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'

export const handleElectronMessagePort = async (
  messagePort: unknown,
  rpcId?: number,
): Promise<void> => {
  await HandleMessagePort.handleMessagePort(messagePort, rpcId)
}
