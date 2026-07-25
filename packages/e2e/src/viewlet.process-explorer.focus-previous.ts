import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.focus-previous'

const defaultUpdateInterval = 1000

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)

  try {
    await Command.execute('ProcessExplorer.focusFirst')
    await Command.execute('ProcessExplorer.focusNext')

    // act
    await Command.execute('ProcessExplorer.focusPrevious')

    // assert
    const focusedRow = Locator('.ProcessExplorerRowFocused[data-index="0"]')
    await expect(focusedRow).toBeVisible()
  } finally {
    await Command.execute(
      'ProcessExplorer.setUpdateInterval',
      defaultUpdateInterval,
    )
  }
}
