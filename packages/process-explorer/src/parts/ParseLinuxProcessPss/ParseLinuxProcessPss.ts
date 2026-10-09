const pssRegex = /^Pss:\s+(\d+) kB$/m
const bytesPerKilobyte = 1024

export const parseLinuxProcessPss = (content: string): number | undefined => {
  const match = pssRegex.exec(content)
  if (!match) {
    return undefined
  }
  const kilobytes = Number.parseInt(match[1])
  return kilobytes * bytesPerKilobyte
}
