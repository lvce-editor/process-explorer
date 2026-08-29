import { expect, test } from '@jest/globals'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { readFile, rm } from 'node:fs/promises'
import { setTimeout } from 'node:timers/promises'
import * as TakeHeapSnapshot from '../src/parts/TakeHeapSnapshot/TakeHeapSnapshot.ts'

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
  let snapshotPath = ''
  try {
    expect(child.pid).toEqual(expect.any(Number))
    await setTimeout(200)
    snapshotPath = await TakeHeapSnapshot.takeHeapSnapshot(
      child.pid as number,
      `${process.execPath} -e "setInterval(() => {}, 1000)" snapshot-target`,
    )
    const content = JSON.parse(await readFile(snapshotPath, 'utf8'))
    expect(content.snapshot.meta).toEqual(expect.any(Object))
    expect(content.nodes.length).toBeGreaterThan(0)
  } finally {
    if (child.exitCode === null) {
      const exitPromise = once(child, 'exit')
      child.kill()
      await exitPromise
    }
    if (snapshotPath) {
      await rm(snapshotPath, { force: true })
    }
  }
})
