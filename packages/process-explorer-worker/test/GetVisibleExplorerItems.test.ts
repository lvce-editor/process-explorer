import { expect, test } from '@jest/globals'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { FileDecoration } from '../src/parts/FileDecoration/FileDecoration.ts'
import { getVisibleExplorerItems } from '../src/parts/GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

test('getVisibleExplorerItems - basic', () => {
  const items: ExplorerItem[] = [
    {
      depth: 0,
      name: 'test',
      path: '/test',
      selected: false,
      type: 0,
    },
  ]
  const editingIcon = ''
  const decorations: readonly FileDecoration[] = []
  const result = getVisibleExplorerItems(items, 0, 1, 0, -1, '', ['icon'], true, [], editingIcon, [], [], decorations)
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    ariaExpanded: undefined,
    chevron: 0,
    depth: 0,
    hasEditingError: false,
    icon: 'icon',
    id: 'TreeItemActive',
    indent: 26,
    isEditing: false,
    name: 'test',
    path: '/test',
  })
})

test('getVisibleExplorerItems - editing', () => {
  const items: ExplorerItem[] = [
    {
      depth: 0,
      name: 'test',
      path: '/test',
      selected: true,
      type: 0,
    },
  ]
  const editingIcon = ''
  const decorations: readonly FileDecoration[] = []
  const result = getVisibleExplorerItems(items, 0, 1, 0, 0, 'error', ['icon'], true, [], editingIcon, [], [], decorations)
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    hasEditingError: true,
    isEditing: true,
  })
})

test('getVisibleExplorerItems - new item', () => {
  const items: readonly ExplorerItem[] = []
  const editingIcon = ''
  const decorations: readonly FileDecoration[] = []

  const result = getVisibleExplorerItems(items, 0, 1, -1, -1, 'error', [], true, [], editingIcon, [], [], decorations)
  expect(result).toHaveLength(0)
  // expect(result[0]).toMatchObject({
  //   depth: 3,
  //   name: 'new',
  //   path: '/test/new',
  //   isEditing: true,
  //   hasEditingError: true,
  // })
})

test('getVisibleExplorerItems - ignored item is dimmed', () => {
  const items: ExplorerItem[] = [
    {
      depth: 0,
      name: 'ignored.txt',
      path: '/ignored.txt',
      selected: false,
      type: 0,
    },
  ]
  const editingIcon = ''
  const ignored = ['/ignored.txt']
  const decorations: readonly FileDecoration[] = []

  const result = getVisibleExplorerItems(items, 0, 1, 0, -1, '', ['icon'], true, [], editingIcon, [], ignored, decorations)
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({
    isCut: false,
    isIgnored: true,
  })
})
