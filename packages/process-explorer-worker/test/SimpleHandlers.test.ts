import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetMenuEntryIds from '../src/parts/GetMenuEntryIds/GetMenuEntryIds.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as HandleBlur from '../src/parts/HandleBlur/HandleBlur.ts'
import * as HandleClickAt from '../src/parts/HandleClickAt/HandleClickAt.ts'
import * as HandleFocus from '../src/parts/HandleFocus/HandleFocus.ts'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.ts'
import * as ProcessExplorerModule from '../src/parts/ProcessExplorer/ProcessExplorer.ts'
import * as SendMessagePortToFileSystemWorker from '../src/parts/SendMessagePortToFileSystemWorker/SendMessagePortToFileSystemWorker.ts'

const processes = [
  {
    cmd: 'main',
    memory: 1,
    name: 'main',
    pid: 1,
    ppid: 0,
  },
  {
    cmd: 'node child.js',
    memory: 1500,
    name: 'child',
    pid: 2,
    ppid: 1,
  },
]

test('handleBlur', () => {
  const state = {
    ...createDefaultState(),
    focused: true,
  }

  expect(HandleBlur.handleBlur(state)).toEqual({
    ...state,
    focused: false,
  })
})

test('handleFocus', () => {
  const state = createDefaultState()

  expect(HandleFocus.handleFocus(state)).toEqual({
    ...state,
    focused: true,
  })
})

test('handleClickAt', () => {
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }

  expect(HandleClickAt.handleClickAt(state, 1).focusedIndex).toBe(1)
})

test('handleClickAt - string index', () => {
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }

  expect(HandleClickAt.handleClickAt(state, '1').focusedIndex).toBe(1)
})

test('getMenuEntryIds', () => {
  expect(GetMenuEntryIds.getMenuEntryIds()).toEqual([
    MenuEntryId.ProcessExplorer,
  ])
})

test('processExplorer invoke - not initialized', async () => {
  ProcessExplorerModule.clear()

  await expect(ProcessExplorerModule.invoke('test')).rejects.toThrow(
    'ProcessExplorerModule is not initialized',
  )
})

test('sendMessagePortToFileSystemWorker', async () => {
  const sendMessagePortToFileSystemWorker = jest.fn()
  const port = {} as MessagePort
  using _mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker':
      sendMessagePortToFileSystemWorker,
  })

  await SendMessagePortToFileSystemWorker.sendMessagePortToFileSystemWorker(
    port,
  )

  expect(sendMessagePortToFileSystemWorker).toHaveBeenCalledWith(
    port,
    'FileSystem.handleMessagePort',
    0,
  )
})
