export const getScrollBarSize = (size: number, contentSize: number, minimumSliderSize: number): number => {
  if (size >= contentSize) {
    return 0
  }
  return Math.max(Math.round(size ** 2 / contentSize), minimumSliderSize)
}
