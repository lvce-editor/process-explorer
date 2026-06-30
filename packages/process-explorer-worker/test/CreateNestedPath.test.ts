import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createNestedPath } from '../src/parts/CreateNestedPath/CreateNestedPath.ts'

test('createNestedPath - creates all directories', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {
      return
    },
  })
  const root = '/a'
  await createNestedPath(root, '/a/b/c', '/')
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', '/ab'],
    ['FileSystem.mkdir', '/ab/c'],
  ])
})

test('createNestedPath - handles existing directories', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {
      return Promise.reject(new Error('Directory already exists'))
    },
  })
  const root = '/a'
  await createNestedPath(root, '/a/b/c', '/')
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.mkdir', '/ab'],
    ['FileSystem.mkdir', '/ab/c'],
  ])
})

test('createNestedPath - propagates other errors', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.mkdir'() {
      return Promise.reject(new Error('Permission denied'))
    },
  })
  const root = '/a'
  await expect(createNestedPath(root, '/a/b/c', '/')).rejects.toThrow('Permission denied')
  expect(mockRpc.invocations).toEqual([['FileSystem.mkdir', '/ab']])
})
