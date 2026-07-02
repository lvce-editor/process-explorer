import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'

const execFile = promisify(execFileCallback)

const parseProcessId = (stdout: string): number => {
  const parentProcessId = Number(stdout.trim())
  if (!Number.isFinite(parentProcessId) || parentProcessId <= 0) {
    return 0
  }
  return parentProcessId
}

const getParentProcessIdUnix = async (pid: number): Promise<number> => {
  const { stdout } = await execFile('ps', ['-o', 'ppid=', '-p', String(pid)])
  return parseProcessId(stdout)
}

const getParentProcessIdWindows = async (pid: number): Promise<number> => {
  const { stdout } = await execFile('powershell.exe', [
    '-NoProfile',
    '-Command',
    `(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}").ParentProcessId`,
  ])
  return parseProcessId(stdout)
}

const getParentProcessId = async (pid: number): Promise<number> => {
  if (process.platform === 'win32') {
    return getParentProcessIdWindows(pid)
  }
  return getParentProcessIdUnix(pid)
}

const getRemoteRootProcessId = async (
  childProcessId = process.ppid,
): Promise<number> => {
  try {
    const parentProcessId = await getParentProcessId(childProcessId)
    return parentProcessId || process.ppid
  } catch {
    return process.ppid
  }
}

interface GetMainProcessIdOptions {
  readonly childProcessId?: number
  readonly includeElectronData?: boolean
}

export const getMainProcessId = ({
  childProcessId = process.ppid,
  includeElectronData = true,
}: GetMainProcessIdOptions = {}): Promise<number> => {
  if (includeElectronData) {
    return Promise.resolve(process.ppid)
  }
  return getRemoteRootProcessId(childProcessId)
}
