import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.focus-first'

const defaultUpdateInterval = 1000

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)

  try {
    // act
    await Command.execute('ProcessExplorer.focusFirst')

    // assert
    const focusedRow = Locator('.ProcessExplorerRowFocused[data-index="0"]')
    await expect(focusedRow).toBeVisible()
    await expect(focusedRow).toHaveAttribute('tabindex', '0')
  } finally {
    await Command.execute(
      'ProcessExplorer.setUpdateInterval',
      defaultUpdateInterval,
    )
  }
}
