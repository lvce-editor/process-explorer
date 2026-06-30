import { expect, test } from '@jest/globals'
import * as FileOperationType from '../src/parts/FileOperationType/FileOperationType.ts'
import { getFileOperations } from '../src/parts/GetFileOperations/GetFileOperations.ts'

test('getFileOperations - empty tree', () => {
  const root = '/test'
  const uploadTree = {}
  expect(getFileOperations(root, uploadTree)).toEqual([])
})

test('getFileOperations - single file', () => {
  const root = '/test'
  const uploadTree = {
    'file.txt': 'content',
  }
  expect(getFileOperations(root, uploadTree)).toEqual([{ path: '/test/file.txt', text: 'content', type: FileOperationType.CreateFile }])
})

test('getFileOperations - single folder', () => {
  const root = '/test'
  const uploadTree = {
    folder: {},
  }
  expect(getFileOperations(root, uploadTree)).toEqual([{ path: '/test/folder', type: FileOperationType.CreateFolder }])
})

test.skip('getFileOperations - nested structure', () => {
  const root = '/test'
  const uploadTree = {
    'file3.txt': 'content3',
    folder1: {
      'file1.txt': 'content1',
      subfolder: {
        'file2.txt': 'content2',
      },
    },
  }
  expect(getFileOperations(root, uploadTree)).toEqual([
    { path: '/test/folder1', type: FileOperationType.CreateFolder },
    { path: '/test/folder1/file1.txt', text: 'content1', type: FileOperationType.CreateFile },
    { path: '/test/folder1/subfolder', type: FileOperationType.CreateFolder },
    { path: '/test/folder1/subfolder/file2.txt', text: 'content2', type: FileOperationType.CreateFile },
    { path: '/test/file3.txt', text: 'content3', type: FileOperationType.CreateFile },
  ])
})
