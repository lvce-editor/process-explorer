import type { Rpc } from '@lvce-editor/rpc'
import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

interface ListenOptions {
  readonly method: number
  readonly [key: string]: unknown
}

export const listen = async ({
  method,
  ...params
}: ListenOptions): Promise<Rpc> => {
  const create = IpcChildModule.getModule(method)
  const rpc = await create(params)
  return rpc
}
