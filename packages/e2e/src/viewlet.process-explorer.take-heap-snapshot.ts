import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.take-heap-snapshot'

export const skip = navigator.platform === 'Win32'

const maxRefreshAttempts = 20

export const test: Test = async ({ Command, ContextMenu, expect, Locator }) => {
  await Command.execute('Developer.openProcessExplorer')
  const marker = `process-explorer-e2e-heap-snapshot-${Date.now()}`

  try {
    await Command.execute('ProcessExplorer.createE2eFixtureProcess', marker)
    const row = Locator(`.ProcessExplorerRow[title*="${marker}"]`)
    for (let i = 0; i < maxRefreshAttempts; i++) {
      await Command.execute('ProcessExplorer.refresh')
      try {
        await expect(row).toBeVisible()
        break
      } catch {
        // keep refreshing while the process appears in ps
      }
    }
    await expect(row).toBeVisible()
    await new Promise((resolve) => setTimeout(resolve, 500))

    // eslint-disable-next-line e2e/no-direct-click -- focuses the exact fixture process
    await row.click()
    await Command.execute('ProcessExplorer.handleContextMenu')
    const takeHeapSnapshot = Locator('.MenuItem', {
      hasText: 'Take Heap Snapshot',
    })
    await expect(takeHeapSnapshot).toBeVisible()
    await ContextMenu.selectItem('Take Heap Snapshot')

    const heapSnapshotTab = Locator('.MainTabSelected[title$=".heapsnapshot"]')
    await expect(heapSnapshotTab).toBeVisible()
  } finally {
    await Command.execute('ProcessExplorer.disposeE2eFixtureProcess', marker)
    await Command.execute('ProcessExplorer.setRootProcessId', -1)
    await Command.execute('ProcessExplorer.refresh')
  }
}
