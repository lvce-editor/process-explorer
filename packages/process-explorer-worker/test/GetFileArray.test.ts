import { test, expect } from '@jest/globals'
import { getFileArray } from '../src/parts/GetFileArray/GetFileArray.ts'

class MockFileList implements FileList {
  private files: File[] = []

  constructor(files: File[] = []) {
    this.files = files
  }

  get length(): number {
    return this.files.length
  }

  item(index: number): File | null {
    return this.files[index] || null
  }

  [Symbol.iterator](): any {
    return this.files[Symbol.iterator]()
  }

  [index: number]: File
}

test('getFileArray converts FileList to array', () => {
  const mockFile = new File(['test'], 'test.txt')
  const mockFileList = new MockFileList([mockFile])

  const result = getFileArray(mockFileList)
  expect(result).toHaveLength(1)
  expect(result[0]).toBe(mockFile)
})

test('getFileArray handles empty FileList', () => {
  const mockFileList = new MockFileList()

  const result = getFileArray(mockFileList)
  expect(result).toHaveLength(0)
})
