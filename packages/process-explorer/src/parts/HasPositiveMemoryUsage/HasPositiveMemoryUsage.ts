export const hasPositiveMemoryUsage = (process: {
  readonly memory: number
}): boolean => {
  return process.memory >= 0
}
