import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'
import * as ResolveSymbolicLinks from '../src/parts/ResolveSymbolicLinks/ResolveSymbolicLinks.ts'

test('should resolve symbolic links to files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat'(path: string) {
      if (path.includes('symlink-file')) {
        return DirentType.File
      }
      if (path.includes('symlink-dir')) {
        return DirentType.Directory
      }
      throw new Error(`unexpected path ${path}`)
    },
  })

  const uri = '/test/path'
  const rawDirents = [
    { name: 'symlink-file', type: DirentType.Symlink },
    { name: 'regular-file', type: DirentType.File },
    { name: 'symlink-dir', type: DirentType.Symlink },
  ]

  const result = await ResolveSymbolicLinks.resolveSymbolicLinks(uri, rawDirents)

  expect(result).toEqual([
    { name: 'symlink-file', type: DirentType.SymLinkFile },
    { name: 'regular-file', type: DirentType.File },
    { name: 'symlink-dir', type: DirentType.SymLinkFolder },
  ])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.stat', '/test/path/symlink-file'],
    ['FileSystem.stat', '/test/path/symlink-dir'],
  ])
})

test('should handle ENOENT errors by returning SymLinkFile type', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat'() {
      const enoentError = new Error('File not found') as Error & { code: string }
      enoentError.code = ErrorCodes.ENOENT
      throw enoentError
    },
  })

  const uri = '/test/path'
  const rawDirents = [{ name: 'broken-symlink', type: DirentType.Symlink }]

  const result = await ResolveSymbolicLinks.resolveSymbolicLinks(uri, rawDirents)

  expect(result).toEqual([{ name: 'broken-symlink', type: DirentType.SymLinkFile }])
  expect(mockRpc.invocations).toEqual([['FileSystem.stat', '/test/path/broken-symlink']])
})

test('should handle other errors by returning original dirent', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat'() {
      const otherError = new Error('Permission denied') as Error & { code: string }
      otherError.code = 'EACCES'
      throw otherError
    },
  })

  // Mock console.error to prevent noise in test output
  const originalConsoleError = console.error
  console.error = jest.fn()

  const uri = '/test/path'
  const rawDirents = [{ name: 'error-symlink', type: DirentType.Symlink }]

  const result = await ResolveSymbolicLinks.resolveSymbolicLinks(uri, rawDirents)

  expect(result).toEqual([{ name: 'error-symlink', type: DirentType.Symlink }])
  expect(mockRpc.invocations).toEqual([['FileSystem.stat', '/test/path/error-symlink']])

  // Verify console.error was called with the expected message
  expect(console.error).toHaveBeenCalledWith('Failed to resolve symbolic link for error-symlink: Error: Permission denied')

  // Restore console.error
  console.error = originalConsoleError
})

test('should handle non-symbolic link dirents without processing', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

  const uri = '/test/path'
  const rawDirents = [
    { name: 'file.txt', type: DirentType.File },
    { name: 'folder', type: DirentType.Directory },
    { name: 'device', type: DirentType.BlockDevice },
  ]

  const result = await ResolveSymbolicLinks.resolveSymbolicLinks(uri, rawDirents)

  expect(result).toEqual(rawDirents)
  expect(mockRpc.invocations).toEqual([])
})

test('should handle empty dirents array', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

  const uri = '/test/path'
  const rawDirents: any[] = []

  const result = await ResolveSymbolicLinks.resolveSymbolicLinks(uri, rawDirents)

  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})

test('should handle mixed dirents with some symlinks and some regular files', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat'(path: string) {
      if (path.includes('symlink1')) {
        return DirentType.File
      }
      if (path.includes('symlink2')) {
        return DirentType.Directory
      }
      throw new Error(`unexpected path ${path}`)
    },
  })

  const uri = '/test/path'
  const rawDirents = [
    { name: 'file1.txt', type: DirentType.File },
    { name: 'symlink1', type: DirentType.Symlink },
    { name: 'folder', type: DirentType.Directory },
    { name: 'symlink2', type: DirentType.Symlink },
    { name: 'file2.txt', type: DirentType.File },
  ]

  const result = await ResolveSymbolicLinks.resolveSymbolicLinks(uri, rawDirents)

  expect(result).toEqual([
    { name: 'file1.txt', type: DirentType.File },
    { name: 'symlink1', type: DirentType.SymLinkFile },
    { name: 'folder', type: DirentType.Directory },
    { name: 'symlink2', type: DirentType.SymLinkFolder },
    { name: 'file2.txt', type: DirentType.File },
  ])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.stat', '/test/path/symlink1'],
    ['FileSystem.stat', '/test/path/symlink2'],
  ])
})

test('should handle symlinks that resolve to different types', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.stat'(path: string) {
      if (path.includes('symlink-file')) {
        return DirentType.File
      }
      if (path.includes('symlink-dir')) {
        return DirentType.Directory
      }
      if (path.includes('symlink-socket')) {
        return DirentType.Socket
      }
      throw new Error(`unexpected path ${path}`)
    },
  })

  const uri = '/test/path'
  const rawDirents = [
    { name: 'symlink-file', type: DirentType.Symlink },
    { name: 'symlink-dir', type: DirentType.Symlink },
    { name: 'symlink-socket', type: DirentType.Symlink },
  ]

  const result = await ResolveSymbolicLinks.resolveSymbolicLinks(uri, rawDirents)

  expect(result).toEqual([
    { name: 'symlink-file', type: DirentType.SymLinkFile },
    { name: 'symlink-dir', type: DirentType.SymLinkFolder },
    { name: 'symlink-socket', type: DirentType.Symlink },
  ])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.stat', '/test/path/symlink-file'],
    ['FileSystem.stat', '/test/path/symlink-dir'],
    ['FileSystem.stat', '/test/path/symlink-socket'],
  ])
})
