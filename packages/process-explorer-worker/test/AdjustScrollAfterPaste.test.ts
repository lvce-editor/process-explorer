import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { adjustScrollAfterPaste } from '../src/parts/AdjustScrollAfterPaste/AdjustScrollAfterPaste.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('should adjust scroll when focused index is below minLineY', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 100,
    height: 100,
    itemHeight: 20,
    maxLineY: 10,
    minLineY: 5,
  }

  const result = adjustScrollAfterPaste(state, 2)

  expect(result.focusedIndex).toBe(2)
  expect(result.focused).toBe(true)
  expect(result.minLineY).toBe(0)
  expect(result.maxLineY).toBe(5)
  expect(result.deltaY).toBe(0)
})

test('should adjust scroll when focused index is above maxLineY', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 100,
    height: 100,
    itemHeight: 20,
    maxLineY: 10,
    minLineY: 5,
  }

  const result = adjustScrollAfterPaste(state, 15)

  expect(result.focusedIndex).toBe(15)
  expect(result.focused).toBe(true)
  expect(result.minLineY).toBe(13)
  expect(result.maxLineY).toBe(18)
  expect(result.deltaY).toBe(260)
})

test('should not adjust scroll when focused index is within viewport', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 100,
    height: 100,
    itemHeight: 20,
    maxLineY: 10,
    minLineY: 5,
  }

  const result = adjustScrollAfterPaste(state, 7)

  expect(result.focusedIndex).toBe(7)
  expect(result.focused).toBe(true)
  expect(result.minLineY).toBe(5)
  expect(result.maxLineY).toBe(10)
  expect(result.deltaY).toBe(100)
})

test('should handle edge case with odd viewport size', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 100,
    height: 120,
    itemHeight: 20,
    maxLineY: 11, // Odd size: 6 items
    minLineY: 5,
  }

  const result = adjustScrollAfterPaste(state, 2)

  expect(result.focusedIndex).toBe(2)
  expect(result.focused).toBe(true)
  expect(result.minLineY).toBe(-1)
  expect(result.maxLineY).toBe(5)
  expect(result.deltaY).toBe(-20)
})
