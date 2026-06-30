import type { Rpc } from '@lvce-editor/rpc'
import { expect, jest, test } from '@jest/globals'
import { get } from '@lvce-editor/rpc-registry'
import * as RpcRegistry from '../src/parts/RpcRegistry/RpcRegistry.ts'

const mockRpc: Rpc = {
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
}

test('setRpc - generic rpc id', () => {
  RpcRegistry.setRpc(mockRpc, 33)

  expect(get(33)).toBe(mockRpc)
})
