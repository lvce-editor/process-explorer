import { test, expect } from '@jest/globals'
import type { FileDecoration } from '../src/parts/FileDecoration/FileDecoration.ts'
import { normalizeDecorations } from '../src/parts/NormalizeDecorations/NormalizeDecorations.ts'

test('normalizeDecorations - returns empty array when input is null', () => {
  const result = normalizeDecorations(null as any)
  expect(result).toEqual([])
})

test('normalizeDecorations - returns empty array when input is undefined', () => {
  const result = normalizeDecorations(undefined as any)
  expect(result).toEqual([])
})

test('normalizeDecorations - returns empty array when input is not an array', () => {
  const result = normalizeDecorations('not an array' as any)
  expect(result).toEqual([])
})

test('normalizeDecorations - returns empty array when input is an empty array', () => {
  const result = normalizeDecorations([])
  expect(result).toEqual([])
})

test('normalizeDecorations - filters out invalid decorations (null)', () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///test.txt' },
    null as any,
    { decoration: 'added', uri: 'file:///test2.txt' },
  ]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added', uri: 'file:///test2.txt' },
  ])
})

test('normalizeDecorations - filters out invalid decorations (undefined)', () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///test.txt' },
    undefined as any,
    { decoration: 'added', uri: 'file:///test2.txt' },
  ]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added', uri: 'file:///test2.txt' },
  ])
})

test('normalizeDecorations - filters out decorations with missing decoration property', () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///test.txt' },
    { uri: 'file:///test2.txt' } as any,
    { decoration: 'added', uri: 'file:///test3.txt' },
  ]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added', uri: 'file:///test3.txt' },
  ])
})

test('normalizeDecorations - filters out decorations with missing uri property', () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added' } as any,
    { decoration: 'deleted', uri: 'file:///test3.txt' },
  ]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'deleted', uri: 'file:///test3.txt' },
  ])
})

test('normalizeDecorations - filters out decorations with non-string decoration property', () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 123, uri: 'file:///test2.txt' } as any,
    { decoration: 'added', uri: 'file:///test3.txt' },
  ]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added', uri: 'file:///test3.txt' },
  ])
})

test('normalizeDecorations - filters out decorations with non-string uri property', () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added', uri: 123 } as any,
    { decoration: 'deleted', uri: 'file:///test3.txt' },
  ]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'deleted', uri: 'file:///test3.txt' },
  ])
})

test('normalizeDecorations - returns all valid decorations', () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added', uri: 'file:///test2.txt' },
    { decoration: 'deleted', uri: 'file:///test3.txt' },
  ]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added', uri: 'file:///test2.txt' },
    { decoration: 'deleted', uri: 'file:///test3.txt' },
  ])
})

test('normalizeDecorations - handles mixed valid and invalid decorations', () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///test.txt' },
    null as any,
    { decoration: 'added', uri: 'file:///test2.txt' },
    undefined as any,
    { decoration: 'deleted' } as any,
    { decoration: 'renamed', uri: 'file:///test3.txt' },
    { uri: 'file:///test4.txt' } as any,
  ]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([
    { decoration: 'modified', uri: 'file:///test.txt' },
    { decoration: 'added', uri: 'file:///test2.txt' },
    { decoration: 'renamed', uri: 'file:///test3.txt' },
  ])
})

test('normalizeDecorations - returns empty array when all decorations are invalid', () => {
  const decorations: FileDecoration[] = [null as any, undefined as any, { decoration: 'added' } as any, { uri: 'file:///test.txt' } as any]
  const result = normalizeDecorations(decorations)
  expect(result).toEqual([])
})
