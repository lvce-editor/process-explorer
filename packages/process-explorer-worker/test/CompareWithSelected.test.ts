import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { compareWithSelected } from '../src/parts/CompareWithSelected/CompareWithSelected.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('compareWithSelected - opens diff for selected and focused file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    compareSourceUri: '/a.txt',
    focusedIndex: 1,
    items: [
      { depth: 0, name: 'a.txt', path: '/a.txt', selected: false, type: DirentType.File },
      { depth: 0, name: 'b.txt', path: '/b.txt', selected: false, type: DirentType.File },
    ],
  }

  const result = await compareWithSelected(state)

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'diff:///a.txt<->/b.txt', true]])
  expect(result).toEqual({
    ...state,
    compareSourceUri: '',
  })
})

test('compareWithSelected - ignores same focused file', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})

  const state: ExplorerState = {
    ...createDefaultState(),
    compareSourceUri: '/a.txt',
    focusedIndex: 0,
    items: [{ depth: 0, name: 'a.txt', path: '/a.txt', selected: false, type: DirentType.File }],
  }

  const result = await compareWithSelected(state)

  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
})
