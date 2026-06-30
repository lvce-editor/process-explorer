import { test, expect } from '@jest/globals'
import { getDragData } from '../src/parts/GetDragData/GetDragData.js'

test('getDragData - single url', () => {
  const urls: string[] = ['/a.txt']
  const result = getDragData(urls)
  expect(result.items[0]).toEqual({ data: 'file:///a.txt', type: 'text/uri-list' })
  expect(result.items[1]).toEqual({ data: 'file:///a.txt', type: 'text/plain' })
  expect(result.label).toBe('a.txt')
})

test('getDragData - multiple urls', () => {
  const urls: string[] = ['/a.txt', '/b.txt']
  const result = getDragData(urls)
  expect(result.items[0]).toEqual({ data: 'file:///a.txt\nfile:///b.txt', type: 'text/uri-list' })
  expect(result.items[1]).toEqual({ data: 'file:///a.txt\nfile:///b.txt', type: 'text/plain' })
  expect(result.label).toBe('2')
})

test('getDragData - empty', () => {
  const urls: string[] = []
  const result = getDragData(urls)
  expect(result.items[0]).toEqual({ data: '', type: 'text/uri-list' })
  expect(result.items[1]).toEqual({ data: '', type: 'text/plain' })
  expect(result.label).toBe('0')
})
