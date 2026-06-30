import { expect, test } from '@jest/globals'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { getFileOperationsCopy } from '../src/parts/GetFileOperationsCopy/GetFileOperationsCopy.ts'

test('getFileOperationsCopy - no conflicts', () => {
  const root = '/test'
  const existingUris = ['/test/existing.txt']
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([{ from: '/source/file.txt', path: '/test/file.txt', type: FileOperationType.Copy }])
})

test('getFileOperationsCopy - single conflict', () => {
  const root = '/test'
  const existingUris = ['/test/file.txt']
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([{ from: '/source/file.txt', path: '/test/file copy.txt', type: FileOperationType.Copy }])
})

test('getFileOperationsCopy - multiple conflicts', () => {
  const root = '/test'
  const existingUris = ['/test/file.txt', '/test/file copy.txt']
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([{ from: '/source/file.txt', path: '/test/file copy 1.txt', type: FileOperationType.Copy }])
})

test('getFileOperationsCopy - multiple numbered conflicts', () => {
  const root = '/test'
  const existingUris = ['/test/file.txt', '/test/file copy.txt', '/test/file copy 1.txt', '/test/file copy 2.txt']
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([{ from: '/source/file.txt', path: '/test/file copy 3.txt', type: FileOperationType.Copy }])
})

test('getFileOperationsCopy - file without extension', () => {
  const root = '/test'
  const existingUris = ['/test/README']
  const files = ['/source/README']

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([{ from: '/source/README', path: '/test/README copy', type: FileOperationType.Copy }])
})

test('getFileOperationsCopy - file without extension multiple conflicts', () => {
  const root = '/test'
  const existingUris = ['/test/README', '/test/README copy', '/test/README copy 1']
  const files = ['/source/README']

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([{ from: '/source/README', path: '/test/README copy 2', type: FileOperationType.Copy }])
})

test('getFileOperationsCopy - multiple files with conflicts', () => {
  const root = '/test'
  const existingUris = ['/test/file1.txt', '/test/file2.txt']
  const files = ['/source/file1.txt', '/source/file2.txt']

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([
    { from: '/source/file1.txt', path: '/test/file1 copy.txt', type: FileOperationType.Copy },
    { from: '/source/file2.txt', path: '/test/file2 copy.txt', type: FileOperationType.Copy },
  ])
})

test('getFileOperationsCopy - empty existingUris', () => {
  const root = '/test'
  const existingUris: readonly string[] = []
  const files = ['/source/file.txt']

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([{ from: '/source/file.txt', path: '/test/file.txt', type: FileOperationType.Copy }])
})

test('getFileOperationsCopy - empty files', () => {
  const root = '/test'
  const existingUris = ['/test/existing.txt']
  const files: readonly string[] = []

  const result = getFileOperationsCopy(root, existingUris, files, root)
  expect(result).toEqual([])
})
