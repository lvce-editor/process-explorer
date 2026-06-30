import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenerFunctions.HandleFocus,
      params: ['handleFocus'],
    },
    {
      name: DomEventListenerFunctions.HandleBlur,
      params: ['handleBlur'],
    },
    {
      name: DomEventListenerFunctions.HandleClick,
      params: ['handleClickAt', EventExpression.TargetName],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandleDoubleClick,
      params: ['handleDoubleClick', EventExpression.TargetName],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandleContextMenu,
      params: [
        'handleContextMenu',
        EventExpression.TargetName,
        EventExpression.ClientX,
        EventExpression.ClientY,
      ],
      preventDefault: true,
    },
    {
      name: DomEventListenerFunctions.HandlePointerDown,
      params: ['handleClickAt', EventExpression.TargetName],
    },
  ]
}
