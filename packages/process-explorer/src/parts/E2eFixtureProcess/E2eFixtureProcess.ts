import { spawn } from 'node:child_process'
import * as Process from '../Process/Process.ts'
import * as Signal from '../Signal/Signal.ts'

const fixtureScript =
  'setTimeout(() => process.exit(0), 120_000); setInterval(() => {}, 1000)'

const fixtureProcesses = new Map<string, number>()

export const createE2eFixtureProcess = (marker: string): number => {
  const childProcess = spawn(process.execPath, ['-e', fixtureScript, marker], {
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',
    },
    shell: false,
    stdio: 'ignore',
  })
  childProcess.unref()
  if (!childProcess.pid) {
    throw new Error('Failed to create e2e fixture process')
  }
  fixtureProcesses.set(marker, childProcess.pid)
  return childProcess.pid
}

const getFixtureProcessId = (pidOrMarker: number | string): number => {
  if (typeof pidOrMarker === 'number') {
    return pidOrMarker
  }
  return fixtureProcesses.get(pidOrMarker) || 0
}

export const disposeE2eFixtureProcess = (
  pidOrMarker: number | string,
): void => {
  const pid = getFixtureProcessId(pidOrMarker)
  if (!pid) {
    return
  }
  try {
    Process.kill(pid, Signal.SIGTERM)
  } catch {
    // best effort cleanup for tests
  } finally {
    if (typeof pidOrMarker === 'string') {
      fixtureProcesses.delete(pidOrMarker)
    }
  }
}
