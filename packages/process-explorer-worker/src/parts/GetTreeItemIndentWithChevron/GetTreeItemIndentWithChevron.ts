// TODO make all of these variable configurable
const defaultPaddingLeft = 4

const defaultIndent = 8

// TODO make chevron size configurable
const chevronSize = 22

export const getTreeItemIndentWithChevron = (depth: number, chevron: number): number => {
  // TODO use numeric value here, convert to string value in renderer process
  const extraSpace = chevron ? 0 : chevronSize
  return depth * defaultIndent + extraSpace + defaultPaddingLeft
}
