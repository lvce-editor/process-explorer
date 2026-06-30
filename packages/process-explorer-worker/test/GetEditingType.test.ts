import { test, expect } from '@jest/globals'
import { DELTA_EDITING } from '../src/parts/DeltaEditing/DeltaEditing.ts'
import { getEditingType } from '../src/parts/GetEditingType/GetEditingType.ts'

test('should add DELTA_EDITING if direntType < DELTA_EDITING', () => {
  const result = getEditingType(1)
  expect(result).toBe(1 + DELTA_EDITING)
})

test('should return direntType if direntType >= DELTA_EDITING', () => {
  const result = getEditingType(DELTA_EDITING)
  expect(result).toBe(DELTA_EDITING)
})
