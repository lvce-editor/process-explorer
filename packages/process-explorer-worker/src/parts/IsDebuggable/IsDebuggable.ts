export const isDebuggable = (command: string): boolean => {
  return (
    command.includes('node ') ||
    command.includes('node.exe') ||
    command.includes('node.mojom.NodeService')
  )
}
