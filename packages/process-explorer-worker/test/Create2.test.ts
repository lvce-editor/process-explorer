import { expect, test } from '@jest/globals'
import { create2 } from '../src/parts/Create2/Create2.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'

test('create2', () => {
  const uid = 1
  const uri = 'test'
  const x = 0
  const y = 0
  const width = 100
  const height = 200
  const args = {}
  const parentUid = 0
  const platform = 0

  create2(uid, uri, x, y, width, height, args, parentUid, platform)

  const state = ExplorerStates.get(uid)
  expect(state).toBeDefined()
})
