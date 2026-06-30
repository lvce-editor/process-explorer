import { expect, test } from '@jest/globals'
import * as GetTreeItemIndentWithChevron from '../src/parts/GetTreeItemIndentWithChevron/GetTreeItemIndentWithChevron.ts'

test('getTreeItemIndentWithChevron - depth 0', () => {
  const chevron = 0
  expect(GetTreeItemIndentWithChevron.getTreeItemIndentWithChevron(0, chevron)).toBe(26)
})

test('getTreeItemIndentWithChevron - depth 1', () => {
  const chevron = 0
  expect(GetTreeItemIndentWithChevron.getTreeItemIndentWithChevron(1, chevron)).toBe(34)
})

test('getTreeItemIndentWithChevron - depth 2', () => {
  const chevron = 0
  expect(GetTreeItemIndentWithChevron.getTreeItemIndentWithChevron(2, chevron)).toBe(42)
})

test('getTreeItemIndentWithChevron - depth 3', () => {
  const chevron = 0
  expect(GetTreeItemIndentWithChevron.getTreeItemIndentWithChevron(3, chevron)).toBe(50)
})
