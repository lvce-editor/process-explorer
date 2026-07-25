import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.focus-next'

const defaultUpdateInterval = 1000

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)

  try {
    await Command.execute('ProcessExplorer.focusFirst')

    // act
    await Command.execute('ProcessExplorer.focusNext')

    // assert
    const focusedRow = Locator('.ProcessExplorerRowFocused[data-index="1"]')
    await expect(focusedRow).toBeVisible()
  } finally {
    await Command.execute(
      'ProcessExplorer.setUpdateInterval',
      defaultUpdateInterval,
    )
  }
}
