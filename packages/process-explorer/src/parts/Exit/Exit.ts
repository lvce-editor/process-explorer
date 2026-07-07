export const exit = (): void => {
  process.exitCode = 0
  process.kill(process.pid, 'SIGTERM')
}
