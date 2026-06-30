import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

interface ListenOptions {
  readonly method: number
  readonly [key: string]: unknown
}

export const listen = async ({ method, ...params }: ListenOptions): Promise<any> => {
  const module = IpcChildModule.getModule(method)
  // @ts-ignore
  const rawIpc = module.listen(params)
  // @ts-ignore
  if (module.signal) {
    // @ts-ignore
    module.signal(rawIpc)
  }
  // @ts-ignore
  const ipc = module.wrap(rawIpc)
  return ipc
}
