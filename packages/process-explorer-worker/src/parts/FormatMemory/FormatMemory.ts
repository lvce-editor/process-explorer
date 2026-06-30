export const formatMemory = (memory: number): string => {
  if (memory < 1000) {
    return `${memory} B`
  }
  if (memory < 1000 ** 2) {
    return `${(memory / 1000).toFixed(1)} kB`
  }
  if (memory < 1000 ** 3) {
    return `${(memory / 1000 ** 2).toFixed(1)} MB`
  }
  if (memory < 1000 ** 4) {
    return `${(memory / 1000 ** 3).toFixed(1)} GB`
  }
  return `${(memory / 1000 ** 4).toFixed(1)} TB`
}
