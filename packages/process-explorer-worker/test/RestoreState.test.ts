import { test, expect } from '@jest/globals'
import { restoreState } from '../src/parts/RestoreState/RestoreState.ts'

test('restoreState returns default state when savedState is null', () => {
  const result = restoreState(null)
  expect(result).toEqual({
    deltaY: 0,
    minLineY: 0,
    root: '',
  })
})

test('restoreState returns default state when savedState is undefined', () => {
  const result = restoreState(undefined)
  expect(result).toEqual({
    deltaY: 0,
    minLineY: 0,
    root: '',
  })
})

test('restoreState returns correct state with valid input', () => {
  const savedState = {
    deltaY: 50,
    minLineY: 100,
    workspacePath: '/test/path',
  }
  const result = restoreState(savedState)
  expect(result).toEqual({
    deltaY: 50,
    minLineY: 100,
    root: '/test/path',
  })
})

test('restoreState handles partial state with missing properties', () => {
  const savedState = {
    workspacePath: '/test/path',
  }
  const result = restoreState(savedState)
  expect(result).toEqual({
    deltaY: 0,
    minLineY: 0,
    root: '/test/path',
  })
})

test('restoreState handles invalid property types', () => {
  const savedState = {
    deltaY: true,
    minLineY: '100',
    workspacePath: 123,
  }
  const result = restoreState(savedState)
  expect(result).toEqual({
    deltaY: 0,
    minLineY: 0,
    root: '',
  })
})

test('restoreState handles non-object input', () => {
  const result = restoreState('invalid')
  expect(result).toEqual({
    deltaY: 0,
    minLineY: 0,
    root: '',
  })
})
