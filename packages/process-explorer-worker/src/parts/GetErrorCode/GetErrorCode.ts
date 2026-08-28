export const getErrorCode = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== 'object') {
    return fallback
  }
  const code = 'code' in error ? error.code : undefined
  if (typeof code !== 'string' || !code) {
    return fallback
  }
  return code
}
