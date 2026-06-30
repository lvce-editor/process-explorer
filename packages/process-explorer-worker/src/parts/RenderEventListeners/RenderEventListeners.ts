import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenersFunctions.HandleInputBlur,
      params: ['handleInputBlur'],
    },
    {
      name: DomEventListenersFunctions.HandleListFocus,
      params: ['handleFocus', EventExpression.IsTrusted, EventExpression.EventTargetClassName],
    },
    {
      name: DomEventListenersFunctions.HandleListBlur,
      params: ['handleBlur'],
    },
    {
      name: DomEventListenersFunctions.HandleClick,
      params: [
        'handleClickAt',
        EventExpression.DefaultPrevented,
        EventExpression.Button,
        EventExpression.CtrlKey,
        EventExpression.ShiftKey,
        EventExpression.ClientX,
        EventExpression.ClientY,
      ],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleInputClick,
      params: ['handleInputClick'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleClickOpenFolder,
      params: ['handleClickOpenFolder'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandlePointerDown,
      params: ['handlePointerDown', EventExpression.Button, EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleDoubleClick,
      params: ['handleDoubleClick', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleEditingInput,
      params: ['updateEditingValue', EventExpression.TargetValue],
    },
    {
      name: DomEventListenersFunctions.HandleContextMenu,
      params: ['handleContextMenu', EventExpression.Button, EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleContextMenuWelcome,
      params: ['handleContextMenuWelcome'],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleWheel,
      params: ['handleWheel', EventExpression.DeltaMode, EventExpression.DeltaY],
      passive: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragOver,
      params: ['handleDragOver', EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDrop,
      params: ['handleDrop', EventExpression.ClientX, EventExpression.ClientY, EventExpression.DataTransferFiles2, EventExpression.DataTransferFiles],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleDragLeave,
      params: ['handleDragLeave'],
    },
    {
      name: DomEventListenersFunctions.HandleButtonClick,
      params: ['handleButtonClick', EventExpression.TargetName],
    },
    {
      name: DomEventListenersFunctions.HandleDragEnd,
      params: ['handleDragEnd'],
    },
    {
      // @ts-ignore
      dragEffect: 'copyMove',
      name: DomEventListenersFunctions.HandleDragStart,
      params: ['handleDragStart'],
    },
  ]
}
