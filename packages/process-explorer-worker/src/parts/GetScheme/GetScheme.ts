const RE_PROTOCOL = /^[a-z+]:\/\//

export const getScheme = (uri: string): string => {
  const match = uri.match(RE_PROTOCOL)
  if (!match) {
    return ''
  }
  return match[0]
}
