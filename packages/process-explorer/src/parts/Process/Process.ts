export const kill = (pid: number, signal: NodeJS.Signals): void => {
  process.kill(pid, signal)
}
