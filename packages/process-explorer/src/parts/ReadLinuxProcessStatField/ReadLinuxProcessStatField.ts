interface LinuxProcessStatField {
  readonly endIndex: number
  readonly value: number
}

export const readLinuxProcessStatField = (
  content: string,
  startIndex: number,
): LinuxProcessStatField => {
  let endIndex = content.indexOf(' ', startIndex)
  if (endIndex === -1) {
    endIndex = content.length
  }
  return {
    endIndex,
    value: Number.parseInt(content.slice(startIndex, endIndex)),
  }
}
