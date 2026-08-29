import { setTimeout } from 'node:timers/promises'
import * as GetInspectorPortsFromCommand from '../GetInspectorPortsFromCommand/GetInspectorPortsFromCommand.ts'
import * as GetInspectorProcessId from '../GetInspectorProcessId/GetInspectorProcessId.ts'
import * as GetProcessListeningPorts from '../GetProcessListeningPorts/GetProcessListeningPorts.ts'

interface InspectorTarget {
  readonly title?: string
  readonly webSocketDebuggerUrl?: string
}

const maxAttempts = 50
const retryDelay = 100

export const getInspectorWebSocketUrlAtPort = async (
  pid: number,
  port: number,
): Promise<string> => {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
      signal: AbortSignal.timeout(500),
    })
    if (!response.ok) {
      return ''
    }
    const targets = (await response.json()) as readonly InspectorTarget[]
    if (!Array.isArray(targets)) {
      return ''
    }
    const pidSuffix = `[${pid}]`
    for (const target of targets) {
      const { title = '', webSocketDebuggerUrl = '' } = target
      if (!webSocketDebuggerUrl) {
        continue
      }
      if (title.endsWith(pidSuffix)) {
        return webSocketDebuggerUrl
      }
      const inspectorPid =
        await GetInspectorProcessId.getInspectorProcessId(webSocketDebuggerUrl)
      if (inspectorPid === pid) {
        return webSocketDebuggerUrl
      }
    }
    return ''
  } catch {
    return ''
  }
}

export const getInspectorWebSocketUrl = async (
  pid: number,
  command: string,
): Promise<string> => {
  const commandPorts =
    GetInspectorPortsFromCommand.getInspectorPortsFromCommand(command)
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const listeningPorts =
      await GetProcessListeningPorts.getProcessListeningPorts(pid)
    const ports = new Set([...commandPorts, ...listeningPorts])
    const urls = await Promise.all(
      Array.from(ports, (port) => getInspectorWebSocketUrlAtPort(pid, port)),
    )
    const url = urls.find(Boolean)
    if (url) {
      return url
    }
    await setTimeout(retryDelay)
  }
  throw new Error(`Could not find the inspector for process ${pid}`)
}
