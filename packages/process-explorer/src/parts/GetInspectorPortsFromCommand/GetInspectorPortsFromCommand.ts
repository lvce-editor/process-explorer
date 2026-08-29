const defaultInspectorPorts = [9000, 9229]

const inspectOptionRegex = /--inspect(?:-brk|-wait|-port)?(?:=|\s+)([^\s"']+)/g
const digitsRegex = /^\d+$/

export const getInspectorPortsFromCommand = (
  command: string,
): readonly number[] => {
  const ports = new Set(defaultInspectorPorts)
  for (const match of command.matchAll(inspectOptionRegex)) {
    const portText = match[1].split(':').at(-1) || ''
    const port = digitsRegex.test(portText) ? Number(portText) : 0
    if (port > 0 && port <= 65_535) {
      ports.add(port)
    }
  }
  return [...ports]
}
