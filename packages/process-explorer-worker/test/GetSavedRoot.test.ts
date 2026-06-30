import { expect, test } from '@jest/globals'
import * as GetSavedRoot from '../src/parts/GetSavedRoot/GetSavedRoot.ts'

test('getSavedRoot - returns workspace path', () => {
  expect(GetSavedRoot.getSavedRoot({ root: '/stale-workspace' }, '/workspace')).toBe('/workspace')
})
