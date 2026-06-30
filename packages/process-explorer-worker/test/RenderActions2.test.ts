import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { renderActions } from '../src/parts/RenderActions2/RenderActions2.ts'

test('should render actions for valid uid', () => {
  const uid = 123
  const mockState = { ...createDefaultState(), root: '/test/path' }

  // Set up the state in ExplorerStates
  ExplorerStates.set(uid, mockState, mockState)

  const result = renderActions(uid)

  // The function should return an array of VirtualDomNode
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)

  // Check that the first element is the actions container
  expect(result[0]).toHaveProperty('type')
  expect(result[0]).toHaveProperty('className')
})

test('should handle state with empty root', () => {
  const uid = 456
  const mockState = { ...createDefaultState(), root: '' }

  ExplorerStates.set(uid, mockState, mockState)

  const result = renderActions(uid)

  // When root is empty, getActions should return empty array
  // but getActionsVirtualDom should still return the container
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)
})

test('should handle different root paths', () => {
  const uid = 789
  const mockState = { ...createDefaultState(), root: '/some/other/path' }

  ExplorerStates.set(uid, mockState, mockState)

  const result = renderActions(uid)

  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)
})
