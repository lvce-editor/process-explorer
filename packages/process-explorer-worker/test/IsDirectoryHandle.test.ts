import { test, expect } from '@jest/globals'
import { isDirectoryHandle } from '../src/parts/IsDirectoryHandle/IsDirectoryHandle.ts'

test('isDirectoryHandle', () => {
  const fileHandle = {
    kind: 'file',
  } as FileSystemHandle
  const directoryHandle = {
    kind: 'directory',
  } as FileSystemHandle
  expect(isDirectoryHandle(fileHandle)).toBe(false)
  expect(isDirectoryHandle(directoryHandle)).toBe(true)
})
