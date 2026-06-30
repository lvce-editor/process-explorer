import { expect, test } from '@jest/globals'
import { getDropHandler } from '../src/parts/GetDropHandler/GetDropHandler.ts'
import * as HandleDropIndex from '../src/parts/HandleDropIndex/HandleDropIndex.ts'
import * as HandleDropRoot from '../src/parts/HandleDropRoot/HandleDropRoot.ts'

test('get root drop handler', () => {
  const handler = getDropHandler(-1)
  expect(handler).toBe(HandleDropRoot.handleDropRoot)
})

test('get index drop handler', () => {
  const handler = getDropHandler(0)
  expect(handler).toBe(HandleDropIndex.handleDropIndex)
})
