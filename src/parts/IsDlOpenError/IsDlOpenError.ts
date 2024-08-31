import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export const isDlOpenError = (error) => {
  return (
    error &&
    error instanceof Error &&
    'code' in error &&
    error.code === ErrorCodes.ERR_DLOPEN_FAILED
  )
}
