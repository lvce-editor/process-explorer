import * as Assert from '../Assert/Assert.ts'

export const getName = (
  pid: number,
  cmd: string,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): string => {
  Assert.number(pid)
  Assert.string(cmd)
  Assert.number(rootPid)
  Assert.object(pidMap)
  return cmd
}
