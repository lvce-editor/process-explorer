import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'
import * as IpcChild from '../IpcChild/IpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const listen = async (): Promise<void> => {
  CommandMapRef.set(CommandMap.commandMap)
  await IpcChild.listen({
    commandMap: CommandMap.commandMap,
    method: IpcChildType.Auto(),
  })
}
