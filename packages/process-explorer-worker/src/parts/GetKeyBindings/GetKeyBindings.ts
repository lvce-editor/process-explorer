import { KeyCode, KeyModifier, WhenExpression } from '@lvce-editor/constants'
import type { KeyBinding } from '../KeyBinding/KeyBinding.ts'

export const getKeyBindings = (): readonly KeyBinding[] => {
  return [
    {
      command: 'ProcessExplorer.handleArrowRight',
      key: KeyCode.RightArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.handleArrowLeft',
      key: KeyCode.LeftArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.focusFirst',
      key: KeyCode.Home,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.focusLast',
      key: KeyCode.End,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.focusPrevious',
      key: KeyCode.UpArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.focusNext',
      key: KeyCode.DownArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.collapseAll',
      key: KeyModifier.CtrlCmd | KeyCode.LeftArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.expandAll',
      key: KeyModifier.CtrlCmd | KeyCode.RightArrow,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.expandAll',
      key: KeyModifier.CtrlCmd | KeyCode.Star,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.handleDoubleClick',
      key: KeyCode.Enter,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.handleDoubleClick',
      key: KeyCode.Space,
      when: WhenExpression.FocusExplorer,
    },
    {
      command: 'ProcessExplorer.handleContextMenu',
      key: KeyCode.ContextMenu,
      when: WhenExpression.FocusExplorer,
    },
  ]
}
