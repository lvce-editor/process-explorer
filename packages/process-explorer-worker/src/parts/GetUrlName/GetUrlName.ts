export const getUrlName = (url: string): string => {
  if (!url || url === 'cross-origin-url') {
    return url
  }
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    return parts.at(-1) || parsed.hostname || url
  } catch {
    const withoutQuery = url.split(/[?#]/, 1)[0]
    const parts = withoutQuery.split('/').filter(Boolean)
    return parts.at(-1) || url
  }
}
