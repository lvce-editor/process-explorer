import { expect, test } from '@jest/globals'
import * as GetExcluded from '../src/parts/GetExcluded/GetExcluded.ts'

test('getExcluded - returns empty array by default', () => {
  expect(GetExcluded.getExcluded()).toEqual([])
})
