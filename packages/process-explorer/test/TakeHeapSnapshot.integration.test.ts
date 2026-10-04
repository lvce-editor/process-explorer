import { expect, test } from '@jest/globals'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { readFile, rm } from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import * as TakeHeapSnapshot from '../src/parts/TakeHeapSnapshot/TakeHeapSnapshot.ts'

const fileUriRegex = /^file:\/\//

test.each([
  '/tmp/snapshot with space.heapsnapshot',
  '/tmp/snapshot#1.heapsnapshot',
])('encodes heap snapshot path %s as a file URI', (path) => {
  const uri = TakeHeapSnapshot.getHeapSnapshotUri(path)
  const fileName = path.slice(path.lastIndexOf('/') + 1)
  expect(uri).toMatch(fileUriRegex)
  expect(uri).toContain(encodeURIComponent(fileName))
})

test('takes a heap snapshot from a node process', async () => {
  if (process.platform === 'win32') {
    return
  }
  const child = spawn(
    process.execPath,
    ['-e', 'setInterval(() => {}, 1000)', 'snapshot-target'],
    {
      stdio: 'ignore',
    },
  )
  let snapshotUri = ''
  try {
    expect(child.pid).toEqual(expect.any(Number))
    await setTimeout(200)
    snapshotUri = await TakeHeapSnapshot.takeHeapSnapshot(
      child.pid as number,
      `${process.execPath} -e "setInterval(() => {}, 1000)" snapshot-target`,
    )
    expect(snapshotUri).toMatch(fileUriRegex)
    const snapshotPath = fileURLToPath(snapshotUri)
    const content = JSON.parse(await readFile(snapshotPath, 'utf8'))
    expect(content.snapshot.meta).toEqual(expect.any(Object))
    expect(content.nodes.length).toBeGreaterThan(0)
  } finally {
    if (child.exitCode === null) {
      const exitPromise = once(child, 'exit')
      child.kill()
      await exitPromise
    }
    if (snapshotUri) {
      await rm(fileURLToPath(snapshotUri), { force: true })
    }
  }
})
