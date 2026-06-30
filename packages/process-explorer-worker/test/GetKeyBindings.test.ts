import { expect, test } from '@jest/globals'
import { WhenExpression } from '@lvce-editor/constants'
import * as GetKeyBindings from '../src/parts/GetKeyBindings/GetKeyBindings.ts'

test('getKeyBindings', () => {
  expect(GetKeyBindings.getKeyBindings()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        command: 'ProcessExplorer.handleArrowRight',
        when: WhenExpression.FocusExplorer,
      }),
      expect.objectContaining({
        command: 'ProcessExplorer.handleContextMenu',
        when: WhenExpression.FocusExplorer,
      }),
    ]),
  )
})
