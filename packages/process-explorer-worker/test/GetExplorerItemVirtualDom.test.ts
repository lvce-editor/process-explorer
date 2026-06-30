import { expect, test } from '@jest/globals'
import type { VisibleExplorerItem } from '../src/parts/VisibleExplorerItem/VisibleExplorerItem.ts'
import { getExplorerItemVirtualDom } from '../src/parts/GetExplorerItemVirtualDom/GetExplorerItemVirtualDom.ts'

test('basic item', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test.txt',
    path: '/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(4)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
  expect(dom[0].ariaLabel).toBe('test.txt')
  expect(dom[0].title).toBe('/test.txt')
})

test('file uri item removes file scheme from title', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test.txt',
    path: 'file:///test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom[0].title).toBe('/test.txt')
})

test('non-file uri item keeps scheme in title', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test.txt',
    path: 'memfs:///test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom[0].title).toBe('memfs:///test.txt')
})

test('item with chevron', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: 'true',
    chevron: 1,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'folder',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: false,
    isIgnored: false,
    name: 'test',
    path: '/test',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(5)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
  expect(dom[0].ariaLabel).toBe('test')
})

test('item in editing state', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: false,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: true,
    isIgnored: false,
    name: 'test.txt',
    path: '/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(3)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
})

test('item with error', () => {
  const item: VisibleExplorerItem = {
    ariaExpanded: undefined,
    chevron: 0,
    className: '',
    depth: 1,
    hasEditingError: true,
    icon: 'file',
    id: '1',
    indent: 0,
    index: 0,
    isCut: false,
    isEditing: true,
    isIgnored: false,
    name: 'test.txt',
    path: '/test.txt',
    posInSet: 1,
    selected: false,
    setSize: 2,
  }
  const dom = getExplorerItemVirtualDom(item)
  expect(dom).toHaveLength(3)
  expect(dom[0].type).toBe(4)
  expect(dom[0].role).toBe('treeitem')
})
