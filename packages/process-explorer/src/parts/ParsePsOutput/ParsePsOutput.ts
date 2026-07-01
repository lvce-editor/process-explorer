// parse ps output based on vscode https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

import type { ParsedProcessItem } from '../ProcessItem/ProcessItem.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.ts'
import * as ParsePsOutputLine from '../ParsePsOutputLine/ParsePsOutputLine.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

export const parsePsOutput = (
  stdout: string,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): readonly ParsedProcessItem[] => {
  Assert.string(stdout)
  Assert.number(rootPid)
  Assert.object(pidMap)
  if (stdout === Character.EmptyString) {
    return []
  }
  const lines = SplitLines.splitLines(stdout)
  const result: ParsedProcessItem[] = []
  const depthMap = Object.create(null)
  depthMap[rootPid] = 1
  const parsedLines = lines.map(ParsePsOutputLine.parsePsOutputLine)
  for (const parsedLine of parsedLines) {
    const { cmd, pid, ppid } = parsedLine
    const depth = pid === rootPid ? 1 : depthMap[ppid]
    if (!depth) {
      continue
    }
    result.push({
      ...parsedLine,
      depth,
      name: ListProcessGetName.getName(pid, cmd, rootPid, pidMap),
    })
    depthMap[pid] = depth + 1
  }
  return result
}
