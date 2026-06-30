import { expect, test } from '@jest/globals'
import { getKeyBindings } from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings', () => {
  const keyBindings = getKeyBindings()
  expect(keyBindings).toBeDefined()
})
