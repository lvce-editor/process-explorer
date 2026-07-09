import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners', () => {
  expect(RenderEventListeners.renderEventListeners()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: DomEventListenerFunctions.HandleClick,
        params: ['handleClickAt', 'event.target.dataset.index'],
      }),
      expect.objectContaining({
        name: DomEventListenerFunctions.HandleContextMenu,
        preventDefault: true,
      }),
    ]),
  )
})
