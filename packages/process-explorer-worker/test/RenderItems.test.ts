import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'
import {
  createProcessState,
  createVisibleProcesses,
} from './fixtures/ProcessExplorerFixtures.ts'

test('renderItems - populated table', () => {
  const state = createProcessState({
    focusedIndex: 1,
    initial: false,
  })
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
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      ariaLevel: 3,
      title: 'leaf',
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      className: 'ProcessExplorerCell ProcessExplorerNameCell',
      paddingLeft: 'calc(3ch + 17px)',
    }),
  )
})

test('renderItems - collapsed row with fixture state', () => {
  const state = createProcessState({
    collapsedPids: [2],
    focusedIndex: 1,
    initial: false,
    visibleProcesses: createVisibleProcesses([2]),
  })
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

test('renderItems - error message', () => {
  const state = createProcessState({
    errorMessage: 'boom',
    initial: false,
    visibleProcesses: [],
  })
  const result = RenderItems.renderItems(createDefaultState(), state)
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      childCount: 1,
      className: 'ProcessExplorerError',
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      text: 'boom',
    }),
  )
})

test('renderItems - collapsed row', () => {
  const state = createProcessState({
    collapsedPids: [2],
    initial: false,
    visibleProcesses: createVisibleProcesses([2]),
  })
  const result = RenderItems.renderItems(createDefaultState(), state)
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      ariaExpanded: false,
      ariaLevel: 2,
      title: 'node child.js',
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      className: 'ProcessExplorerCell ProcessExplorerNameCell',
      paddingLeft: '1.5ch',
    }),
  )
})
