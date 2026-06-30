export const getRestoredDeltaY = (savedState: any): number => {
  if (savedState && typeof savedState.deltaY === 'number') {
    return savedState.deltaY
  }
  return 0
}
