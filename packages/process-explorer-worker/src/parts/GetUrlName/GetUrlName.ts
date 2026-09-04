const QueryOrHashRegex = /[?#]/

export const getUrlName = (url: string): string => {
  if (!url || url === 'cross-origin-url') {
    return url
  }
  if (URL.canParse(url)) {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    return parts.at(-1) || parsed.hostname || url
  }
  const withoutQuery = url.split(QueryOrHashRegex, 1)[0]
  const parts = withoutQuery.split('/').filter(Boolean)
  return parts.at(-1) || url
}
