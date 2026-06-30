import { test, expect, jest } from '@jest/globals'
import { getFileHandleText } from '../src/parts/GetFileHandleText/GetFileHandleText.ts'

test('getFileHandleText returns file content as text', async () => {
  const mockGetFile = jest.fn<() => Promise<{ text: () => Promise<string> }>>().mockResolvedValue({
    text: jest.fn<() => Promise<string>>().mockResolvedValue('test content'),
  })
  const mockFileHandle = {
    getFile: mockGetFile,
  } as unknown as FileSystemFileHandle

  const result = await getFileHandleText(mockFileHandle)
  expect(result).toBe('test content')
  expect(mockGetFile).toHaveBeenCalled()
})
