import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import { renderCss } from '../src/parts/RenderCss/RenderCss.ts'

test('renderCss - creates unique indent classes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    uid: 123,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(
      [
        { cmd: 'main', memory: 1, name: 'main', pid: 1, ppid: 0 },
        { cmd: 'child', memory: 1, name: 'child', pid: 2, ppid: 1 },
        { cmd: 'sibling', memory: 1, name: 'sibling', pid: 3, ppid: 1 },
      ],
      [],
      1,
    ),
  }

  expect(renderCss(oldState, newState)).toEqual([
    ViewletCommand.SetCss,
    123,
    `.ProcessExplorerNameCell.ProcessExplorerIndent-1 {
  padding-left: 0ch;
}
.ProcessExplorerNameCell.ProcessExplorerIndent-2 {
  padding-left: 1.5ch;
}`,
  ])
})
