export interface Position {
  readonly errorMessageWidth: number
  readonly left: number
  readonly top: number
}

export const getErrorMessagePosition = (
  itemHeight: number,
  focusedIndex: number,
  minLineY: number,
  depth: number,
  indent: number,
  fileIconWidth: number,
  padding: number,
  width: number,
): Position => {
  const top = itemHeight * (focusedIndex - minLineY + 1)
  const left = depth * indent + fileIconWidth + padding
  const errorMessageWidth = width - left
  return {
    errorMessageWidth,
    left,
    top,
  }
}
