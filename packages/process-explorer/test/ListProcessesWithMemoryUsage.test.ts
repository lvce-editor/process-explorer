import type { Rpc } from '@lvce-editor/rpc'
import { expect, jest, test } from '@jest/globals'
import { RpcId } from '@lvce-editor/rpc-registry'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockMainProcessRpc: Rpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => ({})),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
}

test('listProcessesWithMemoryUsage - unix selector', async () => {
  if (process.platform === 'win32') {
    return
  }
  const ListProcessesWithMemoryUsage =
    await import('../src/parts/ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ts')
  RpcRegistry.setRpc(mockMainProcessRpc, RpcId.MainProcess)

  const processes =
    await ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage(process.pid)

  expect(processes).toEqual(expect.any(Array))
  expect(mockMainProcessRpc.invoke).toHaveBeenCalledWith(
    'CreatePidMap.createPidMap',
  )
})
