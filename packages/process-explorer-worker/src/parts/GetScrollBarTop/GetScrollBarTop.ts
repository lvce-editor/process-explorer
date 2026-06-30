export const getScrollBarTop = (height: number, contentHeight: number, scrollTop: number): number => {
  if (contentHeight <= 0 || !Number.isFinite(contentHeight)) {
    return 0
  }
  const scrollBarTop = Math.round((scrollTop / contentHeight) * height)
  if (!Number.isFinite(scrollBarTop)) {
    return 0
  }
  return scrollBarTop
}
