import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.keyboard-navigation'

export const test: Test = async ({ Command, expect, KeyBoard, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  const table = Locator('.ProcessExplorerTable')
  await Command.execute('ProcessExplorer.focusFirst')

  // act
  await KeyBoard.press('ArrowDown')
  await KeyBoard.press('ArrowUp')

  // assert
  const focusedRow = Locator('.ProcessExplorerRowFocused')
  await expect(table).toBeVisible()
  await expect(focusedRow).toBeVisible()
}
