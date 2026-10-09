import type { LinuxProcessStat } from '../LinuxProcessStat/LinuxProcessStat.ts'
import * as ReadLinuxProcessStatField from '../ReadLinuxProcessStatField/ReadLinuxProcessStatField.ts'

const pageSize = 4096

export const parseLinuxProcessStat = (content: string): LinuxProcessStat => {
  const commandStartIndex = content.indexOf('(')
  const commandEndIndex = content.lastIndexOf(')')
  if (commandStartIndex === -1 || commandEndIndex === -1) {
    throw new TypeError('Invalid process stat')
  }
  const pid = Number.parseInt(content.slice(0, commandStartIndex).trim())
  const command = content.slice(commandStartIndex + 1, commandEndIndex)
  let fieldIndex = 3
  let startIndex = commandEndIndex + 2
  let ppid = 0
  let residentPages = 0
  while (fieldIndex <= 24) {
    const field = ReadLinuxProcessStatField.readLinuxProcessStatField(
      content,
      startIndex,
    )
    if (fieldIndex === 4) {
      ppid = field.value
    } else if (fieldIndex === 24) {
      residentPages = field.value
    }
    fieldIndex++
    startIndex = field.endIndex + 1
  }
  if (
    !Number.isFinite(pid) ||
    !Number.isFinite(ppid) ||
    !Number.isFinite(residentPages)
  ) {
    throw new TypeError('Invalid process stat')
  }
  return {
    command,
    memory: residentPages * pageSize,
    pid,
    ppid,
  }
}
