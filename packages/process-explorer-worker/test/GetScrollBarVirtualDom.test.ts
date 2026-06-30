import { expect, test } from '@jest/globals'
import { getScrollBarVirtualDom } from '../src/parts/GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'

test('getScrollBarVirtualDom - no scrollbar when height is 0', () => {
  const dom = getScrollBarVirtualDom(0)
  expect(dom).toEqual([])
})

test('getScrollBarVirtualDom - renders scrollbar', () => {
  const dom = getScrollBarVirtualDom(100)
  expect(dom).toEqual([
    {
      childCount: 1,
      className: 'ScrollBar ScrollBarSmall',
      type: 4,
    },
    {
      childCount: 0,
      className: 'ScrollBarThumb',
      type: 4,
    },
  ])
})
