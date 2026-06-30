import { test, expect } from '@jest/globals'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { getRenderer } from '../src/parts/GetRenderer/GetRenderer.ts'

test('should return RenderItems for RenderItems diffType', () => {
  const renderer = getRenderer(DiffType.RenderItems)
  expect(typeof renderer).toBe('function')
})

test('should return RenderFocus for RenderFocus diffType', () => {
  const renderer = getRenderer(DiffType.RenderFocus)
  expect(typeof renderer).toBe('function')
})

test('should return RenderFocusContext for RenderFocusContext diffType', () => {
  const renderer = getRenderer(DiffType.RenderFocusContext)
  expect(typeof renderer).toBe('function')
})

test('should return RenderValue for RenderValue diffType', () => {
  const renderer = getRenderer(DiffType.RenderValue)
  expect(typeof renderer).toBe('function')
})

test('should return RenderEditingSelection for RenderSelection diffType', () => {
  const renderer = getRenderer(DiffType.RenderSelection)
  expect(typeof renderer).toBe('function')
})

test('should throw for unknown diffType', () => {
  expect(() => getRenderer(9999)).toThrow('unknown renderer')
})
