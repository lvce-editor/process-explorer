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
    uniqueIndents: [1, 2],
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(
      [
        {
          cmd: 'main',
          memory: 1,
          name: 'main',
          parentTreeId: 0,
          pid: 1,
          ppid: 0,
          source: 'local' as const,
          synthetic: false,
          treeId: 1,
        },
        {
          cmd: 'child',
          memory: 1,
          name: 'child',
          parentTreeId: 1,
          pid: 2,
          ppid: 1,
          source: 'local' as const,
          synthetic: false,
          treeId: 2,
        },
        {
          cmd: 'sibling',
          memory: 1,
          name: 'sibling',
          parentTreeId: 1,
          pid: 3,
          ppid: 1,
          source: 'local' as const,
          synthetic: false,
          treeId: 3,
        },
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
