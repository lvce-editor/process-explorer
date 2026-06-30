import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.js'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { renderDragData } from '../src/parts/RenderDragData/RenderDragData.js'

test('renderDragData - no items', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    focusedIndex: 0,
    items: [],
    uid: 123,
  }
  const result = renderDragData(oldState, newState)
  expect(result).toEqual(['Viewlet.setDragData', 123, expect.anything()])
})

test('renderDragData - selected and focused items', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...oldState,
    focusedIndex: 1,
    items: [
      { depth: 1, icon: '', name: 'a.txt', path: '/workspace/a.txt', posInSet: 1, selected: true, setSize: 3, type: DirentType.File },
      { depth: 1, icon: '', name: 'b.txt', path: '/workspace/b.txt', posInSet: 2, selected: false, setSize: 3, type: DirentType.File },
      { depth: 1, icon: '', name: 'c.txt', path: 'file:///workspace/c.txt', posInSet: 3, selected: true, setSize: 3, type: DirentType.File },
    ],
    uid: 123,
  }
  expect(renderDragData(oldState, newState)).toEqual([
    'Viewlet.setDragData',
    123,
    {
      items: [
        {
          data: 'file:///workspace/a.txt\nfile:///workspace/b.txt\nfile:///workspace/c.txt',
          type: 'text/uri-list',
        },
        {
          data: 'file:///workspace/a.txt\nfile:///workspace/b.txt\nfile:///workspace/c.txt',
          type: 'text/plain',
        },
      ],
      label: '3',
    },
  ])
})
