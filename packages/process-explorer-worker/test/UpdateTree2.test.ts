import { test, expect } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { updateTree2 } from '../src/parts/UpdateTree2/UpdateTree2.ts'

test('updateTree2 - merges updates into existing tree', () => {
  const rootItems: readonly ExplorerItem[] = [
    { depth: 1, icon: '', name: 'src', path: '/workspace/src', posInSet: 1, selected: false, setSize: 1, type: DirentType.Directory },
  ]
  const childItems: readonly ExplorerItem[] = [
    { depth: 2, icon: '', name: 'index.ts', path: '/workspace/src/index.ts', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  expect(updateTree2({ '': rootItems }, { '/src': childItems })).toEqual({
    '': rootItems,
    '/src': childItems,
  })
})

test('updateTree2 - update overrides existing path', () => {
  const oldItems: readonly ExplorerItem[] = [
    { depth: 1, icon: '', name: 'old.txt', path: '/workspace/old.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  const newItems: readonly ExplorerItem[] = [
    { depth: 1, icon: '', name: 'new.txt', path: '/workspace/new.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File },
  ]
  expect(updateTree2({ '': oldItems }, { '': newItems })).toEqual({
    '': newItems,
  })
})
