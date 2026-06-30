import { WhenExpression } from '@lvce-editor/constants'
import type { MouseAction } from '../MouseAction/MouseAction.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

export const getMouseActions = (): readonly MouseAction[] => {
  return [
    {
      button: MouseEventType.LeftClick,
      command: 'Explorer.openFile',
      description: 'Open file on click',
      modifiers: {},
      when: WhenExpression.FocusExplorer,
    },
    {
      button: MouseEventType.LeftClick,
      command: 'Explorer.toggleSelection',
      description: 'Toggle selection with Ctrl+Click',
      modifiers: {
        ctrl: true,
      },
      when: WhenExpression.FocusExplorer,
    },
    {
      button: MouseEventType.LeftClick,
      command: 'Explorer.rangeSelection',
      description: 'Select range with Shift+Click',
      modifiers: {
        shift: true,
      },
      when: WhenExpression.FocusExplorer,
    },
  ]
}
