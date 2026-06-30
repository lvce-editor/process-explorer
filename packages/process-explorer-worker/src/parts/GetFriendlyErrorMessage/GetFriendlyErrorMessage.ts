export const getFriendlyErrorMessage = (errorMessage: string, errorCode: string): string => {
  switch (errorCode) {
    case 'EACCES':
    case 'EPERM':
      return 'permission was denied'
    case 'EBUSY':
      return 'the folder is currently in use'
    case 'ENOENT':
      return 'the folder does not exist'
    case 'ENOTDIR':
      return 'the path is not a folder'
    default:
      return errorMessage || 'an unexpected error occurred'
  }
}
