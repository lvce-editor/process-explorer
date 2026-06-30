import { expect, test } from '@jest/globals'
import * as ActionType from '../src/parts/ActionType/ActionType.ts'
import * as ViewletExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'
import * as GetActions from '../src/parts/GetActions/GetActions.ts'
import * as MaskIcon from '../src/parts/MaskIcon/MaskIcon.ts'

test('getActions - with root', () => {
  expect(GetActions.getActions('/test-root')).toEqual([
    {
      command: 'newFile',
      icon: MaskIcon.NewFile,
      id: ViewletExplorerStrings.newFile(),
      name: 'NewFile',
      type: ActionType.Button,
    },
    {
      command: 'newFolder',
      icon: MaskIcon.NewFolder,
      id: ViewletExplorerStrings.newFolder(),
      name: 'NewFolder',
      type: ActionType.Button,
    },
    {
      command: 'refresh',
      icon: MaskIcon.Refresh,
      id: ViewletExplorerStrings.refresh(),
      name: 'Refresh',
      type: ActionType.Button,
    },
    {
      command: 'collapseAll',
      icon: MaskIcon.CollapseAll,
      id: ViewletExplorerStrings.collapseAll(),
      name: 'CollapseAll',
      type: ActionType.Button,
    },
  ])
})

test('getActions - no root', () => {
  expect(GetActions.getActions('')).toEqual([])
})
