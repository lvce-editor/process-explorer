import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.click-highlight'

const defaultUpdateInterval = 1000

export const test: Test = async ({
  Command,
  expect,
  Locator,
  ProcessExplorer,
}) => {
  // arrange
  await ProcessExplorer.open()
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)
  const nameCell = Locator('.ProcessExplorerNameCell[data-index="0"]')
  const focusedRow = Locator('.ProcessExplorerRowFocused[data-index="0"]')
  await expect(nameCell).toBeVisible()

  try {
    // act
    await ProcessExplorer.clickRow(0)

    // assert
    await expect(focusedRow).toBeVisible()
  } finally {
    await Command.execute(
      'ProcessExplorer.setUpdateInterval',
      defaultUpdateInterval,
    )
  }
}
