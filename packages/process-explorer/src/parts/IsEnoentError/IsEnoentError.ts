import * as IsEnoentErrorLinux from '../IsEnoentErrorLinux/IsEnoentErrorLinux.ts'
import * as IsEnoentErrorWindows from '../IsEnoentErrorWindows/IsEnoentErrorWindows.ts'

export const isEnoentError = (error: any): boolean => {
  if (!error) {
    return false
  }
  return (
    IsEnoentErrorLinux.isEnoentErrorLinux(error) ||
    IsEnoentErrorWindows.isEnoentErrorWindows(error)
  )
}
