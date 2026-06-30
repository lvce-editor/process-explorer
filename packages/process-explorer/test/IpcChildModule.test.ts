import { expect, test } from '@jest/globals'
import {
  ElectronMessagePortRpcClient,
  ElectronUtilityProcessRpcClient,
  NodeForkedProcessRpcClient,
  NodeWebSocketRpcClient,
  NodeWorkerRpcClient,
} from '@lvce-editor/rpc'
import * as IpcChildModule from '../src/parts/IpcChildModule/IpcChildModule.ts'
import * as IpcChildType from '../src/parts/IpcChildType/IpcChildType.ts'

test('getModule', () => {
  expect(IpcChildModule.getModule(IpcChildType.ElectronMessagePort)).toBe(
    ElectronMessagePortRpcClient.create,
  )
  expect(IpcChildModule.getModule(IpcChildType.ElectronUtilityProcess)).toBe(
    ElectronUtilityProcessRpcClient.create,
  )
  expect(IpcChildModule.getModule(IpcChildType.NodeForkedProcess)).toBe(
    NodeForkedProcessRpcClient.create,
  )
  expect(IpcChildModule.getModule(IpcChildType.NodeWorker)).toBe(
    NodeWorkerRpcClient.create,
  )
  expect(IpcChildModule.getModule(IpcChildType.WebSocket)).toBe(
    NodeWebSocketRpcClient.create,
  )
})
