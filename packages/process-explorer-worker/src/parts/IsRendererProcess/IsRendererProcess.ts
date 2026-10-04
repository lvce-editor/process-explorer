import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'

export const isRendererProcess = (process: ProcessInfo): boolean => {
  if (process.source === 'remote') {
    return false
  }
  return (
    process.name === 'renderer' ||
    process.name.startsWith('webcontentsview') ||
    process.name.startsWith('webcontents-view')
  )
}
