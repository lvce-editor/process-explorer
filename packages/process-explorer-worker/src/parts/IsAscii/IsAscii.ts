const RE_ASCII = /^[a-z]$/

export const isAscii = (key: string): boolean => {
  return RE_ASCII.test(key)
}
