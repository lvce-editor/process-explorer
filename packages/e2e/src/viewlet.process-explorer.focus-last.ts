import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.focus-last'

const defaultUpdateInterval = 1000

export const test: Test = async ({ Command, expect, Locator, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)

  try {
    // act
    await ProcessExplorer.focusLast()

    // assert
    const focusedRow = Locator(
      '.ProcessExplorerTableBody > .ProcessExplorerRow:last-child.ProcessExplorerRowFocused',
    )
    await expect(focusedRow).toBeVisible()
  } finally {
    await Command.execute(
      'ProcessExplorer.setUpdateInterval',
      defaultUpdateInterval,
    )
  }
}
