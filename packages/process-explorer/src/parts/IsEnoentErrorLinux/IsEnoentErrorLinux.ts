import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isEnoentErrorLinux = (error: any): boolean => {
  return error.code === ErrorCodes.ENOENT
}
