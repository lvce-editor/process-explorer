import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss - basic with empty visibleExplorerItems', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 20,
    uid: 123,
    visibleExplorerItems: [],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    123,
    `.Explorer {
  --ScrollBarThumbHeight: 0px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 20px;
  --ErrorMessageLeft: 48px;
  --ErrorMessageWidth: 52px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}`,
  ])
})

test('renderCss - with single visibleExplorerItem', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 15,
    uid: 456,
    visibleExplorerItems: [
      {
        ariaExpanded: undefined,
        chevron: 0,
        className: 'file',
        depth: 0,
        hasEditingError: false,
        icon: 'file',
        id: '1',
        indent: 10,
        index: 0,
        isCut: false,
        isEditing: false,
        isIgnored: false,
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
      },
    ],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    456,
    `.Explorer {
  --ScrollBarThumbHeight: 0px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 20px;
  --ErrorMessageLeft: 48px;
  --ErrorMessageWidth: 52px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}
.Indent-10 {
  padding-left: 10px;
}`,
  ])
})

test('renderCss - with multiple visibleExplorerItems with different indents', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 25,
    uid: 789,
    visibleExplorerItems: [
      {
        ariaExpanded: 'true',
        chevron: 1,
        className: 'folder',
        depth: 0,
        hasEditingError: false,
        icon: 'folder',
        id: '1',
        indent: 0,
        index: 0,
        isCut: false,
        isEditing: false,
        isIgnored: false,
        name: 'folder1',
        path: '/folder1',
        posInSet: 1,
        selected: false,
        setSize: 2,
      },
      {
        ariaExpanded: undefined,
        chevron: 0,
        className: 'file',
        depth: 1,
        hasEditingError: false,
        icon: 'file',
        id: '2',
        indent: 20,
        index: 1,
        isCut: false,
        isEditing: false,
        isIgnored: false,
        name: 'file1.txt',
        path: '/folder1/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
      },
      {
        ariaExpanded: undefined,
        chevron: 0,
        className: 'file',
        depth: 1,
        hasEditingError: false,
        icon: 'file',
        id: '3',
        indent: 20,
        index: 2,
        isCut: false,
        isEditing: false,
        isIgnored: false,
        name: 'file2.txt',
        path: '/folder1/file2.txt',
        posInSet: 2,
        selected: false,
        setSize: 1,
      },
    ],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    789,
    `.Explorer {
  --ScrollBarThumbHeight: 0px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 20px;
  --ErrorMessageLeft: 48px;
  --ErrorMessageWidth: 52px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}
.Indent-0 {
  padding-left: 0px;
}
.Indent-20 {
  padding-left: 20px;
}`,
  ])
})

test('renderCss - with duplicate indents should only generate unique indent classes', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 30,
    uid: 999,
    visibleExplorerItems: [
      {
        ariaExpanded: undefined,
        chevron: 0,
        className: 'file',
        depth: 0,
        hasEditingError: false,
        icon: 'file',
        id: '1',
        indent: 10,
        index: 0,
        isCut: false,
        isEditing: false,
        isIgnored: false,
        name: 'file1.txt',
        path: '/file1.txt',
        posInSet: 1,
        selected: false,
        setSize: 3,
      },
      {
        ariaExpanded: undefined,
        chevron: 0,
        className: 'file',
        depth: 0,
        hasEditingError: false,
        icon: 'file',
        id: '2',
        indent: 10,
        index: 1,
        isCut: false,
        isEditing: false,
        isIgnored: false,
        name: 'file2.txt',
        path: '/file2.txt',
        posInSet: 2,
        selected: false,
        setSize: 3,
      },
      {
        ariaExpanded: undefined,
        chevron: 0,
        className: 'file',
        depth: 0,
        hasEditingError: false,
        icon: 'file',
        id: '3',
        indent: 20,
        index: 2,
        isCut: false,
        isEditing: false,
        isIgnored: false,
        name: 'file3.txt',
        path: '/file3.txt',
        posInSet: 3,
        selected: false,
        setSize: 3,
      },
    ],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    999,
    `.Explorer {
  --ScrollBarThumbHeight: 0px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 20px;
  --ErrorMessageLeft: 48px;
  --ErrorMessageWidth: 52px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}
.Indent-10 {
  padding-left: 10px;
}
.Indent-20 {
  padding-left: 20px;
}`,
  ])
})

test('renderCss - with zero scrollBarHeight', () => {
  const oldState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    scrollBarHeight: 0,
    uid: 111,
    visibleExplorerItems: [
      {
        ariaExpanded: undefined,
        chevron: 0,
        className: 'file',
        depth: 0,
        hasEditingError: false,
        icon: 'file',
        id: '1',
        indent: 5,
        index: 0,
        isCut: false,
        isEditing: false,
        isIgnored: false,
        name: 'test.txt',
        path: '/test.txt',
        posInSet: 1,
        selected: false,
        setSize: 1,
      },
    ],
  }
  const result = renderCss(oldState, newState)
  expect(result).toEqual([
    'Viewlet.setCss',
    111,
    `.Explorer {
  --ScrollBarThumbHeight: 0px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 20px;
  --ErrorMessageLeft: 48px;
  --ErrorMessageWidth: 52px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}
.Indent-5 {
  padding-left: 5px;
}`,
  ])
})
