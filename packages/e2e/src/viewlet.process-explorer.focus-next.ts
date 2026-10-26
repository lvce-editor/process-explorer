import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.focus-next'

const defaultUpdateInterval = 1000

export const test: Test = async ({ Command, expect, Locator, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)

  try {
    await ProcessExplorer.focusFirst()

    // act
    await ProcessExplorer.focusNext()

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
