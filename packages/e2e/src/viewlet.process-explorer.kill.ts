import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.kill'

const maxRefreshAttempts = 20

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  const marker = `process-explorer-e2e-kill-${Date.now()}`

  try {
    await Command.execute('ProcessExplorer.createE2eFixtureProcess', marker)
    const row = Locator(`.ProcessExplorerRow[title*="${marker}"]`)
    const pidCell = row.locator('.ProcessExplorerCell').nth(1)
    for (let i = 0; i < maxRefreshAttempts; i++) {
      await Command.execute('ProcessExplorer.refresh')
      try {
        await expect(row).toBeVisible()
        await expect(pidCell).toBeVisible()
        break
      } catch {
        // keep refreshing while the process appears in ps
      }
    }
    await expect(row).toBeVisible()
    await expect(pidCell).toBeVisible()

    // act
    await Command.execute('ProcessExplorer.focusFirst')
    const focusedRow = Locator(`.ProcessExplorerRowFocused[title*="${marker}"]`)
    await expect(focusedRow).toBeVisible()
    await Command.execute('ProcessExplorer.killProcess')

    // assert
    for (let i = 0; i < maxRefreshAttempts; i++) {
      await Command.execute('ProcessExplorer.refresh')
      try {
        await expect(row).toBeHidden()
        return
      } catch {
        // keep refreshing while the process exits
      }
    }
    await expect(row).toBeHidden()
  } finally {
    await Command.execute('ProcessExplorer.disposeE2eFixtureProcess', marker)
  }
}
