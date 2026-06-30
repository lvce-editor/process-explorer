import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ProcessExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleResize } from '../src/parts/HandleResize/HandleResize.ts'

test('handleResize updates dimensions, viewport lines and scrollbarHeight', () => {
  const items: readonly ExplorerItem[] = Array.from(
    { length: 10 },
    (_, index) => ({
      depth: 0,
      name: `file-${index}`,
      path: `/file-${index}`,
      selected: false,
      type: 1,
    }),
  )
  const state: ExplorerState = {
    ...createDefaultState(),
    itemHeight: 20,
    items,
  }

  const result = handleResize(state, { height: 100, width: 300 })

  expect(result).toEqual({
    ...state,
    height: 100,
    maxLineY: 6,
    minLineY: 0,
    scrollBarHeight: 50,
    width: 300,
  })
})

test('handleResize clamps deltaY when viewport gets larger', () => {
  const items: readonly ExplorerItem[] = Array.from(
    { length: 10 },
    (_, index) => ({
      depth: 0,
      name: `file-${index}`,
      path: `/file-${index}`,
      selected: false,
      type: 1,
    }),
  )
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 180,
    height: 20,
    itemHeight: 20,
    items,
    maxLineY: 1,
    minLineY: 9,
  }

  const result = handleResize(state, { height: 120, width: 300 })

  expect(result.deltaY).toBe(80)
  expect(result.minLineY).toBe(4)
  expect(result.maxLineY).toBe(11)
  expect(result.scrollBarHeight).toBe(72)
})

test('handleResize returns same state for invalid dimensions', () => {
  const state: ExplorerState = createDefaultState()
  const result = handleResize(state, { height: NaN, width: 200 })
  expect(result).toBe(state)
})
