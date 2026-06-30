import { test, expect } from '@jest/globals'
import { isFileHandle } from '../src/parts/IsFileHandle/IsFileHandle.ts'

test('isFileHandle', () => {
  const fileHandle = {
    kind: 'file',
  } as FileSystemHandle
  const directoryHandle = {
    kind: 'directory',
  } as FileSystemHandle
  expect(isFileHandle(fileHandle)).toBe(true)
  expect(isFileHandle(directoryHandle)).toBe(false)
})
