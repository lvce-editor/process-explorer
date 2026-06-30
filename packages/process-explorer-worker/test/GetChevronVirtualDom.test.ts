import { expect, test } from '@jest/globals'
import * as ChevronDownVirtualDom from '../src/parts/ChevronDownVirtualDom/ChevronDownVirtualDom.ts'
import * as ChevronRightVirtualDom from '../src/parts/ChevronRightVirtualDom/ChevronRightVirtualDom.ts'
import * as GetChevronVirtualDom from '../src/parts/GetChevronVirtualDom/GetChevronVirtualDom.ts'

test('getChevronVirtualDom - no chevron', () => {
  expect(GetChevronVirtualDom.getChevronVirtualDom(0)).toEqual([])
})

test('getChevronVirtualDom - right chevron', () => {
  expect(GetChevronVirtualDom.getChevronVirtualDom(1)).toEqual([ChevronRightVirtualDom.chevronRightVirtualDom])
})

test('getChevronVirtualDom - down chevron', () => {
  expect(GetChevronVirtualDom.getChevronVirtualDom(2)).toEqual([ChevronDownVirtualDom.chevronDownVirtualDom])
})
