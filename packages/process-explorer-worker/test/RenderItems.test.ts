import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { VirtualDomNode } from '../src/parts/VirtualDomNode/VirtualDomNode.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
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
      ariaLevel: 1,
      className: 'ProcessExplorerRow',
      name: '0',
      title: 'main',
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
  const nameHeader = result[2].find(
    (node: VirtualDomNode) => node.className === 'ProcessExplorerHeaderCell',
  )
  expect(nameHeader).not.toHaveProperty('width')
})

test('renderItems - widens the name column for a webcontentsview process', () => {
  const state = {
    ...createDefaultState(),
    initial: false,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(
      [
        ...processes,
        {
          cmd: 'renderer',
          memory: 1,
          name: 'renderer (webcontentsview, soundcloud.com)',
          pid: 5,
          ppid: 1,
        },
      ],
      [],
      1,
    ),
  }
  const result = RenderItems.renderItems(createDefaultState(), state)
  const headers = result[2].filter(
    (node: VirtualDomNode) => node.className === 'ProcessExplorerHeaderCell',
  )

  expect(headers).toHaveLength(2)
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      className: 'ProcessExplorerHeaderCell ProcessExplorerNameHeaderCellWide',
    }),
  )
})

test('renderItems - collapsed row', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    initial: false,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(
      processes,
      [2],
      1,
    ),
  }
  const result = RenderItems.renderItems(createDefaultState(), state)

  expect(result[2]).toContainEqual(
    expect.objectContaining({
      ariaExpanded: false,
      ariaLevel: 2,
      className: 'ProcessExplorerRow ProcessExplorerRowFocused',
      title: 'node child.js',
    }),
  )
})

test('renderItems - aligns leaf and expandable siblings', () => {
  const zygoteProcesses = [
    {
      cmd: 'main',
      memory: 1,
      name: 'main',
      pid: 1,
      ppid: 0,
    },
    {
      cmd: 'zygote',
      memory: 1,
      name: 'zygote',
      pid: 2,
      ppid: 1,
    },
    {
      cmd: 'zygote',
      memory: 1,
      name: 'zygote',
      pid: 3,
      ppid: 1,
    },
    {
      cmd: 'zygote child',
      memory: 1,
      name: 'zygote',
      pid: 4,
      ppid: 3,
    },
  ]
  const state = {
    ...createDefaultState(),
    initial: false,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(
      zygoteProcesses,
      [],
      1,
    ),
  }
  const result = RenderItems.renderItems(createDefaultState(), state)
  const leafZygoteNameCell = result[2].find(
    (node: VirtualDomNode) =>
      node.className ===
        'ProcessExplorerCell ProcessExplorerNameCell ProcessExplorerIndent-2' &&
      node['data-index'] === 1,
  )
  const expandableZygoteNameCell = result[2].find(
    (node: VirtualDomNode) =>
      node.className ===
        'ProcessExplorerCell ProcessExplorerNameCell ProcessExplorerIndent-2' &&
      node['data-index'] === 2,
  )

  expect(leafZygoteNameCell).not.toHaveProperty('paddingLeft')
  expect(expandableZygoteNameCell).not.toHaveProperty('paddingLeft')
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

test('renderItems - error only', () => {
  const state = {
    ...createDefaultState(),
    errorCode: 'E_PROCESS_EXPLORER_REFRESH_FAILED',
    errorCodeFrame: '1 | throw new Error()',
    errorMessage: 'Pretty no pid',
    errorStack: 'Pretty stack',
    initial: false,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = RenderItems.renderItems(createDefaultState(), state)
  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      className: 'ProcessExplorerError',
      type: VirtualDomElements.Div,
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      text: 'E_PROCESS_EXPLORER_REFRESH_FAILED',
      type: VirtualDomElements.Text,
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      text: 'Pretty no pid',
      type: VirtualDomElements.Text,
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      text: '1 | throw new Error()',
      type: VirtualDomElements.Text,
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      text: 'Pretty stack',
      type: VirtualDomElements.Text,
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      childCount: 1,
      type: VirtualDomElements.Pre,
    }),
  )
  expect(result[2]).not.toContainEqual(
    expect.objectContaining({
      className: 'ProcessExplorerTable',
    }),
  )
})

test('renderItems - error message only', () => {
  const state = {
    ...createDefaultState(),
    errorMessage: 'Pretty no pid',
    initial: false,
  }
  const result = RenderItems.renderItems(createDefaultState(), state)

  expect(result[2]).toContainEqual(
    expect.objectContaining({
      childCount: 1,
      className: 'ProcessExplorerError',
      type: VirtualDomElements.Div,
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      text: 'Pretty no pid',
      type: VirtualDomElements.Text,
    }),
  )
})

test('renderItems - unsupported message', () => {
  const state = {
    ...createDefaultState(),
    message: 'Process Explorer is not supported on web.',
  }
  const result = RenderItems.renderItems(createDefaultState(), state)

  expect(result).toEqual([
    ViewletCommand.SetDom2,
    1,
    [
      expect.objectContaining({
        className: 'Viewlet ProcessExplorer',
      }),
      {
        childCount: 1,
        className: 'ProcessExplorerMessage',
        type: VirtualDomElements.Div,
      },
      {
        childCount: 0,
        text: 'Process Explorer is not supported on web.',
        type: VirtualDomElements.Text,
      },
    ],
  ])
})
