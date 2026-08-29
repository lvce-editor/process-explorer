import * as GetLinuxProcessListeningPorts from '../GetLinuxProcessListeningPorts/GetLinuxProcessListeningPorts.ts'

export const getProcessListeningPorts = async (
  pid: number,
): Promise<readonly number[]> => {
  if (process.platform !== 'linux') {
    return []
  }
  return GetLinuxProcessListeningPorts.getLinuxProcessListeningPorts(pid)
}
