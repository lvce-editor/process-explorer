import { afterEach, expect, test } from '@jest/globals'
import * as IpcChildType from '../src/parts/IpcChildType/IpcChildType.ts'

const originalArgv = [...process.argv]

afterEach(() => {
  process.argv = [...originalArgv]
})

test('Auto - node worker', () => {
  process.argv = ['node', 'processExplorerMain.js', '--ipc-type=node-worker']

  expect(IpcChildType.Auto()).toBe(IpcChildType.NodeWorker)
})

test('Auto - node forked process', () => {
  process.argv = [
    'node',
    'processExplorerMain.js',
    '--ipc-type=node-forked-process',
  ]

  expect(IpcChildType.Auto()).toBe(IpcChildType.NodeForkedProcess)
})

test('Auto - electron utility process', () => {
  process.argv = [
    'node',
    'processExplorerMain.js',
    '--ipc-type=electron-utility-process',
  ]

  expect(IpcChildType.Auto()).toBe(IpcChildType.ElectronUtilityProcess)
})

test('Auto - unknown ipc type', () => {
  process.argv = ['node', 'processExplorerMain.js']

  expect(() => IpcChildType.Auto()).toThrow('[shared-process] unknown ipc type')
})
