import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isEsrchError = (error: any): boolean => {
  return error && error.code === ErrorCodes.ESRCH
}
