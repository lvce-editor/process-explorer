export const ensureUri = (item: string): string => {
  if (item.startsWith('/')) {
    return `file://` + item
  }
  return item
}

export const ensureUris = (maybeUris: readonly string[]): readonly string[] => {
  return maybeUris.map(ensureUri)
}
