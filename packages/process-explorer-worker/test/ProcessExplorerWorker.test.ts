import { expect, jest, test } from '@jest/globals'
import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExpandAll from '../src/parts/ExpandAll/ExpandAll.ts'
import * as FocusNext from '../src/parts/FocusNext/FocusNext.ts'
import * as FocusPrevious from '../src/parts/FocusPrevious/FocusPrevious.ts'
import * as FormatMemory from '../src/parts/FormatMemory/FormatMemory.ts'
import * as GetKeyBindings from '../src/parts/GetKeyBindings/GetKeyBindings.ts'
import * as GetMenuItems from '../src/parts/GetMenuItems/GetMenuItems.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as HandleArrowLeft from '../src/parts/HandleArrowLeft/HandleArrowLeft.ts'
import * as HandleArrowRight from '../src/parts/HandleArrowRight/HandleArrowRight.ts'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import * as HandleDoubleClick from '../src/parts/HandleDoubleClick/HandleDoubleClick.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'
import * as ProcessFlag from '../src/parts/ProcessFlag/ProcessFlag.ts'
import * as Refresh from '../src/parts/Refresh/Refresh.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

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
  {
    cmd: 'leaf',
    memory: 2_500_000,
    name: 'leaf',
    pid: 3,
    ppid: 2,
  },
  {
    cmd: 'orphan',
    memory: 1,
    name: 'orphan',
    pid: 4,
    ppid: 999,
  },
]

test('createDefaultState', () => {
  expect(createDefaultState()).toMatchObject({
    assetDir: '',
    collapsedPids: [],
    errorMessage: '',
    focusedIndex: -1,
    processes: [],
    rootPid: 0,
    visibleProcesses: [],
  })
})

test('create', () => {
  ProcessExplorerStates.clear()
  const state = create(7, '', 1, 2, 300, 400, [], 5, 0, '/asset')
  expect(state).toMatchObject({
    assetDir: '/asset',
    height: 400,
    initial: true,
    parentUid: 5,
    uid: 7,
    width: 300,
    x: 1,
    y: 2,
  })
  expect(ProcessExplorerStates.get(7).newState).toBe(state)
})

test('formatMemory', () => {
  expect(FormatMemory.formatMemory(999)).toBe('999 B')
  expect(FormatMemory.formatMemory(1500)).toBe('1.5 kB')
  expect(FormatMemory.formatMemory(1_500_000)).toBe('1.5 MB')
  expect(FormatMemory.formatMemory(1_500_000_000)).toBe('1.5 GB')
  expect(FormatMemory.formatMemory(1_500_000_000_000)).toBe('1.5 TB')
})

test('getVisibleProcesses - nested tree skips orphan', () => {
  const visible = GetVisibleProcesses.getVisibleProcesses(processes, [], 1)
  expect(visible.map((process) => process.pid)).toEqual([1, 2, 3])
  expect(visible.map((process) => process.depth)).toEqual([1, 2, 3])
  expect(visible.map((process) => process.flags)).toEqual([
    ProcessFlag.Expanded,
    ProcessFlag.Expanded,
    ProcessFlag.None,
  ])
})

test('getVisibleProcesses - collapsed', () => {
  const visible = GetVisibleProcesses.getVisibleProcesses(processes, [2], 1)
  expect(visible.map((process) => process.pid)).toEqual([1, 2])
  expect(visible[1]).toMatchObject({
    flags: ProcessFlag.Collapsed,
    pid: 2,
  })
})

test('focusPrevious and focusNext', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(FocusPrevious.focusPrevious(state).focusedIndex).toBe(0)
  expect(FocusNext.focusNext(state).focusedIndex).toBe(2)
  expect(FocusNext.focusNext({ ...state, focusedIndex: 2 })).toBeDefined()
})

test('handleArrowRight expands collapsed process', () => {
  const state = {
    ...createDefaultState(),
    collapsedPids: [2],
    focusedIndex: 1,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(
      processes,
      [2],
      1,
    ),
  }
  const result = HandleArrowRight.handleArrowRight(state)
  expect(result.collapsedPids).toEqual([])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([
    1, 2, 3,
  ])
})

test('handleArrowRight focuses first child for expanded process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(HandleArrowRight.handleArrowRight(state).focusedIndex).toBe(1)
})

test('handleArrowLeft collapses expanded process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = HandleArrowLeft.handleArrowLeft(state)
  expect(result.collapsedPids).toEqual([2])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([1, 2])
})

test('handleArrowLeft focuses parent for leaf', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 2,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(HandleArrowLeft.handleArrowLeft(state).focusedIndex).toBe(1)
})

test('handleDoubleClick toggles process', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 0,
    processes,
    rootPid: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  expect(HandleDoubleClick.handleDoubleClick(state, 0).collapsedPids).toEqual([
    1,
  ])
})

test('expandAll clears collapsed pids', () => {
  const state = {
    ...createDefaultState(),
    collapsedPids: [1, 2],
    processes,
    rootPid: 1,
  }
  expect(ExpandAll.expandAll(state).collapsedPids).toEqual([])
})

test('refresh - success', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => processes,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(result).toMatchObject({
    errorMessage: '',
    focusedIndex: 0,
    initial: false,
    rootPid: 1,
  })
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([
    1, 2, 3,
  ])
})

test('refresh - error', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessId.getMainProcessId': jest.fn(() => {
      throw new Error('no pid')
    }),
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(result.errorMessage).toBe('no pid')
  expect(result.initial).toBe(false)
})

test('getMenuItems', () => {
  const visible = GetVisibleProcesses.getVisibleProcesses(processes, [], 1)
  expect(GetMenuItems.getMenuItems(visible[1])).toEqual([
    {
      label: 'Kill Process',
    },
    {
      label: 'Debug Process',
    },
  ])
  expect(GetMenuItems.getMenuItems(visible[2])).toEqual([
    {
      label: 'Kill Process',
    },
  ])
})

test('handleContextMenu - close', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({ type: 'close' })),
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await expect(
    HandleContextMenu.handleContextMenu(state, 0, 10, 20),
  ).resolves.toBe(state)
})

test('handleContextMenu - kill', async () => {
  const kill = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({
      data: 'Kill Process',
      type: 'select',
    })),
    'Process.kill': kill,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await HandleContextMenu.handleContextMenu(state, 0, 10, 20)
  expect(kill).toHaveBeenCalledWith(1, 'SIGTERM')
})

test('handleContextMenu - debug', async () => {
  const attachDebugger = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'AttachDebugger.attachDebugger': attachDebugger,
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({
      data: 'Debug Process',
      type: 'select',
    })),
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await HandleContextMenu.handleContextMenu(state, 1, 10, 20)
  expect(attachDebugger).toHaveBeenCalledWith(2)
})

test('renderItems - populated table', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    initial: false,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = RenderItems.renderItems(createDefaultState(), state)
  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      ariaLabel: 'Process Explorer',
      className: 'ProcessExplorerTable',
      role: 'grid',
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      ariaExpanded: true,
      ariaLevel: 2,
      className: 'ProcessExplorerRow ProcessExplorerRowFocused',
      name: '1',
      title: 'node child.js',
    }),
  )
})

test('renderItems - initial is empty', () => {
  const state = {
    ...createDefaultState(),
    initial: true,
  }
  expect(RenderItems.renderItems(createDefaultState(), state)).toEqual([
    ViewletCommand.SetDom2,
    1,
    [],
  ])
})

test('diff2 and render2', () => {
  ProcessExplorerStates.clear()
  const uid = 1
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  ProcessExplorerStates.set(uid, oldState, newState)
  expect(Diff2.diff2(uid)).toEqual([DiffType.RenderItems])
  const commands = Render2.render2(uid, [DiffType.RenderItems])
  expect(commands[0][0]).toBe(ViewletCommand.SetDom2)
  expect(ProcessExplorerStates.get(uid).oldState).toBe(newState)
})

test('diff2 unchanged', () => {
  ProcessExplorerStates.clear()
  const state = createDefaultState()
  ProcessExplorerStates.set(1, state, state)
  expect(Diff2.diff2(1)).toEqual([])
})

test('renderEventListeners', () => {
  expect(RenderEventListeners.renderEventListeners()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: DomEventListenerFunctions.HandleClick,
        params: ['handleClickAt', 'event.target.name'],
      }),
      expect.objectContaining({
        name: DomEventListenerFunctions.HandleContextMenu,
        preventDefault: true,
      }),
    ]),
  )
})

test('getKeyBindings', () => {
  expect(GetKeyBindings.getKeyBindings()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        command: 'ProcessExplorer.handleArrowRight',
        when: WhenExpression.FocusExplorer,
      }),
      expect.objectContaining({
        command: 'ProcessExplorer.handleContextMenu',
        when: WhenExpression.FocusExplorer,
      }),
    ]),
  )
})
