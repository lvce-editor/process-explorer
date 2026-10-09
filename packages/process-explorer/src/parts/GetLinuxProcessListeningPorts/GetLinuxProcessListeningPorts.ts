import { readFile, readdir, readlink } from 'node:fs/promises'

const socketRegex = /^socket:\[(\d+)\]$/
const whitespaceRegex = /\s+/

export const parseProcNetTcp = (
  content: string,
  socketInodes: ReadonlySet<string>,
): readonly number[] => {
  const ports: number[] = []
  const lines = content.split('\n').slice(1)
  for (const line of lines) {
    const fields = line.trim().split(whitespaceRegex)
    if (fields.length < 10 || fields[3] !== '0A') {
      continue
    }
    const inode = fields[9]
    if (!socketInodes.has(inode)) {
      continue
    }
    const separatorIndex = fields[1].lastIndexOf(':')
    const port = Number.parseInt(fields[1].slice(separatorIndex + 1), 16)
    if (port > 0) {
      ports.push(port)
    }
  }
  return ports
}

const getSocketInodes = async (pid: number): Promise<ReadonlySet<string>> => {
  const directory = `/proc/${pid}/fd`
  const entries = await readdir(directory)
  const links = await Promise.allSettled(
    entries.map((entry) => readlink(`${directory}/${entry}`)),
  )
  const inodes = new Set<string>()
  for (const link of links) {
    if (link.status !== 'fulfilled') {
      continue
    }
    const match = link.value.match(socketRegex)
    if (match) {
      inodes.add(match[1])
    }
  }
  return inodes
}

const readNetworkTable = async (path: string): Promise<string> => {
  try {
    return await readFile(path, 'utf8')
  } catch {
    return ''
  }
}

export const getLinuxProcessListeningPorts = async (
  pid: number,
): Promise<readonly number[]> => {
  try {
    const socketInodes = await getSocketInodes(pid)
    const [tcp, tcp6] = await Promise.all([
      readNetworkTable(`/proc/${pid}/net/tcp`),
      readNetworkTable(`/proc/${pid}/net/tcp6`),
    ])
    return [
      ...parseProcNetTcp(tcp, socketInodes),
      ...parseProcNetTcp(tcp6, socketInodes),
    ]
  } catch {
    return []
  }
}
