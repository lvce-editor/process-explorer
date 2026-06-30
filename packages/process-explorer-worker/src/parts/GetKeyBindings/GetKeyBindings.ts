import { WhenExpression } from '@lvce-editor/constants'
import { KeyCode, KeyModifier } from '@lvce-editor/virtual-dom-worker'
import type { KeyBinding } from '../KeyBinding/KeyBinding.ts'

export const getKeyBindings = (): readonly KeyBinding[] => {
  return [
    {
      command: 'Explorer.selectUp',
      key: KeyModifier.Shift | KeyCode.UpArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.selectDown',
      key: KeyModifier.Shift | KeyCode.DownArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.handleArrowRight',
      key: KeyCode.RightArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.handleArrowLeft',
      key: KeyCode.LeftArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.focusFirst',
      key: KeyCode.Home,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.focusLast',
      key: KeyCode.End,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.focusPrevious',
      key: KeyCode.UpArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.focusNext',
      key: KeyCode.DownArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.expandAll',
      key: KeyModifier.CtrlCmd | KeyCode.Star,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.expandRecursively',
      key: KeyModifier.Alt | KeyCode.RightArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.collapseAll',
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.handlePaste',
      key: KeyModifier.CtrlCmd | KeyCode.KeyV,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.handleCopy',
      key: KeyModifier.CtrlCmd | KeyCode.KeyC,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.handleCut',
      key: KeyModifier.CtrlCmd | KeyCode.KeyX,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.renameDirent',
      key: KeyCode.F2,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.cancelEdit',
      key: KeyCode.Escape,
      when: WhenExpression.FocusExplorerEditBox,
    },
    {
      command: 'Explorer.acceptEdit',
      key: KeyCode.Enter,
      when: WhenExpression.FocusExplorerEditBox,
    },
    {
      command: 'Explorer.removeDirent',
      key: KeyCode.Delete,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.focusNone',
      key: KeyCode.Escape,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.handleClickCurrentButKeepFocus',
      key: KeyCode.Space,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.handleClickCurrent',
      key: KeyCode.Enter,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.handleEscape',
      key: KeyCode.Escape,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'Explorer.selectAll',
      key: KeyModifier.CtrlCmd | KeyCode.KeyA,
      when: WhenExpression.FocusExplorer,
    },
  ]
}
