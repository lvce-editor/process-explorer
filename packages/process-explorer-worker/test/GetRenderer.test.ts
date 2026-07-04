import { expect, test } from '@jest/globals'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as GetRenderer from '../src/parts/GetRenderer/GetRenderer.ts'
import * as RenderFocus from '../src/parts/RenderFocus/RenderFocus.ts'
import * as RenderFocusContext from '../src/parts/RenderFocusContext/RenderFocusContext.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

test('getRenderer returns renderer for diff type', () => {
  expect(GetRenderer.getRenderer(DiffType.RenderFocus)).toBe(
    RenderFocus.renderFocus,
  )
  expect(GetRenderer.getRenderer(DiffType.RenderFocusContext)).toBe(
    RenderFocusContext.renderFocusContext,
  )
  expect(GetRenderer.getRenderer(DiffType.RenderItems)).toBe(
    RenderItems.renderItems,
  )
})

test('getRenderer throws for unknown diff type', () => {
  expect(() => GetRenderer.getRenderer(999)).toThrow('unknown renderer 999')
})
