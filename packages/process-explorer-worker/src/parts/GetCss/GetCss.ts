import { getIndentRule } from '../GetIndentRule/GetIndentRule.ts'

export const getCss = (
  scrollBarHeight: number,
  scrollBarTop: number,
  uniqueIndents: readonly number[],
  errorMessageLeft: number,
  errorMessageTop: number,
  errorMessageWidth: number,
): string => {
  const rules = [
    `.Explorer {
  --ScrollBarThumbHeight: ${scrollBarHeight}px;
  --ScrollBarThumbTop: ${scrollBarTop}px;
  --ErrorMessageTop: ${errorMessageTop}px;
  --ErrorMessageLeft: ${errorMessageLeft}px;
  --ErrorMessageWidth: ${errorMessageWidth}px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}`,
    ...uniqueIndents.map(getIndentRule),
  ]
  const css = rules.join('\n')
  return css
}
