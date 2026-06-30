import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { renderItems } from '../src/parts/RenderItems/RenderItems.ts'

test('renderItems - basic', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    focused: true,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: 1,
      },
    ],
    width: 500,
  }
  const result = renderItems(oldState, newState)
  expect(result[0]).toBe('Viewlet.setDom2')
  expect(result[1]).toBeDefined()
})

test('renderItems - narrow width', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    focused: true,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: 1,
      },
    ],
    width: 400,
  }
  const result = renderItems(oldState, newState)
  expect(result[0]).toBe('Viewlet.setDom2')
  expect(result[1]).toBeDefined()
})

test('renderItems - load error message', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    errorCode: 'EACCES',
    errorMessage: 'permission was denied',
    focused: true,
    hasError: true,
    items: [
      {
        depth: 0,
        name: 'test',
        path: '/test',
        selected: false,
        type: 1,
      },
    ],
    root: '/workspace',
  }
  const result = renderItems(oldState, newState)
  const dom = result[2]
  expect(dom).not.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        className: 'ListItems',
      }),
    ]),
  )
  expect(dom).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        text: 'Could not open folder due to permission was denied (error code: EACCES).',
      }),
    ]),
  )
})

test('renderItems - editing and load error messages are both passed and load error mode is used', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    editingErrorMessage: 'file already exists',
    errorCode: 'EACCES',
    errorMessage: 'permission was denied',
    hasError: true,
    root: '/workspace',
  }
  const result = renderItems(oldState, newState)
  const dom = result[2]
  expect(dom).not.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        className: 'ListItems',
      }),
    ]),
  )
  expect(dom).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        text: 'Could not open folder due to permission was denied (error code: EACCES).',
      }),
    ]),
  )
})

test('renderItems - missing folder load error shows friendly message and button', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    errorCode: 'ENOENT',
    errorMessage: 'the folder does not exist',
    hasError: true,
    root: '/workspace/missing-folder',
    width: 500,
  }
  const result = renderItems(oldState, newState)
  const dom = result[2]
  expect(dom).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        text: 'Could not open "/workspace/missing-folder" because the folder does not exist. It may have been moved or deleted.',
      }),
      expect.objectContaining({
        className: 'Button ButtonPrimary ButtonWide',
        name: 'OpenFolder',
        onClick: DomEventListenerFunctions.HandleClickOpenFolder,
      }),
      expect.objectContaining({
        text: 'Open another folder',
      }),
    ]),
  )
})
