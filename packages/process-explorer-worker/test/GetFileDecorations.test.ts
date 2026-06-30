import { test, expect, jest } from '@jest/globals'
import { SourceControlWorker } from '@lvce-editor/rpc-registry'
import type { FileDecoration } from '../src/parts/FileDecoration/FileDecoration.ts'

test.skip('getFileDecorations - returns empty array when decorationsEnabled is false', async () => {
  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], false, '', 0)
  expect(result).toEqual([])
})

test('getFileDecorations - returns empty array when no provider IDs', async () => {
  using mockRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return []
    },
  })

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true, '', 0)
  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([['SourceControl.getEnabledProviderIds', 'file', '/root', '', 0]])
})

test.skip('getFileDecorations - returns decorations for single file', async () => {
  const decorations: FileDecoration[] = [{ decoration: 'modified', uri: 'file:///file1.txt' }]
  using mockRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return ['git']
    },
    'SourceControl.getFileDecorations'() {
      return decorations
    },
  })

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true, '', 0)
  expect(result).toEqual(decorations)
  expect(mockRpc.invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root', '', 0],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt', '', 0]],
  ])
})

test.skip('getFileDecorations - converts paths to URIs', async () => {
  const decorations: FileDecoration[] = [
    { decoration: 'modified', uri: 'file:///file1.txt' },
    { decoration: 'added', uri: 'file:///file2.txt' },
  ]
  using mockRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return ['git']
    },
    'SourceControl.getFileDecorations'() {
      return decorations
    },
  })

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt', '/file2.txt'], true, '', 0)
  expect(result).toEqual(decorations)
  expect(mockRpc.invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root', '', 0],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt', 'file:///file2.txt', '', 0]],
  ])
})

test.skip('getFileDecorations - handles URIs that are already URIs', async () => {
  const decorations: FileDecoration[] = [{ decoration: 'modified', uri: 'file:///file1.txt' }]
  using mockRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return ['git']
    },
    'SourceControl.getFileDecorations'() {
      return decorations
    },
  })

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['file:///file1.txt'], true, '', 0)
  expect(result).toEqual(decorations)
  expect(mockRpc.invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root', '', 0],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt', '', 0]],
  ])
})

test.skip('getFileDecorations - uses first provider ID when multiple are available', async () => {
  const decorations: FileDecoration[] = [{ decoration: 'modified', uri: 'file:///file1.txt' }]
  using mockRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return ['git', 'svn', 'hg']
    },
    'SourceControl.getFileDecorations'() {
      return decorations
    },
  })

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true, '', 0)
  expect(result).toEqual(decorations)
  expect(mockRpc.invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root', '', 0],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt', '', 0]],
  ])
})

test('getFileDecorations - returns empty array when getEnabledProviderIds throws', async () => {
  using mockRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      throw new Error('Provider error')
    },
  })

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true, '', 0)
  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([['SourceControl.getEnabledProviderIds', 'file', '/root', '', 0]])
  expect(consoleErrorSpy).toHaveBeenCalled()

  consoleErrorSpy.mockRestore()
})

test('getFileDecorations - returns empty array when getFileDecorations throws', async () => {
  using mockRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return ['git']
    },
    'SourceControl.getFileDecorations'() {
      throw new Error('Decorations error')
    },
  })

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', ['/file1.txt'], true, '', 0)
  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root', '', 0],
    ['SourceControl.getFileDecorations', 'git', ['file:///file1.txt'], '', 0],
  ])
  expect(consoleErrorSpy).toHaveBeenCalled()

  consoleErrorSpy.mockRestore()
})

test('getFileDecorations - handles empty URIs array', async () => {
  using mockRpc = SourceControlWorker.registerMockRpc({
    'SourceControl.getEnabledProviderIds'() {
      return ['git']
    },
    'SourceControl.getFileDecorations'() {
      return []
    },
  })

  const { getFileDecorations } = await import('../src/parts/GetFileDecorations/GetFileDecorations.ts')
  const result = await getFileDecorations('file', '/root', [], true, '', 0)
  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([
    ['SourceControl.getEnabledProviderIds', 'file', '/root', '', 0],
    ['SourceControl.getFileDecorations', 'git', [], '', 0],
  ])
})
