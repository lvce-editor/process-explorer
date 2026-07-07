import type { Rpc } from '@lvce-editor/rpc'
import { expect, jest, test } from '@jest/globals'
import { get, remove, RpcId } from '@lvce-editor/rpc-registry'
import * as Listen from '../src/parts/Listen/Listen.ts'

const mockRpc: Rpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
}

test('registerLaunchParentRpc', () => {
  remove(RpcId.SharedProcess)

  Listen.registerLaunchParentRpc(mockRpc)

  expect(get(RpcId.SharedProcess)).toBe(mockRpc)
})
