import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

test('renderIncremental - returns patches for changed items', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    items: [{ depth: 1, icon: '', name: 'test.txt', path: '/workspace/test.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File }],
    uid: 123,
  }
  const result = renderIncremental(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetPatches)
  expect(result[1]).toBe(123)
  expect(result[2]).toEqual(expect.any(Array))
})
