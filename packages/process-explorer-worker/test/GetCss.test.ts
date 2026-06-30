import { test, expect } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss - basic scrollBarHeight and empty indents', () => {
  const scrollBarHeight = 20
  const scrollBarTop = 0
  const uniqueIndents: readonly number[] = []
  const result = getCss(scrollBarHeight, scrollBarTop, uniqueIndents, 0, 0, 0)
  expect(result).toBe(`.Explorer {
  --ScrollBarThumbHeight: 20px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 0px;
  --ErrorMessageLeft: 0px;
  --ErrorMessageWidth: 0px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}`)
})

test('getCss - with single indent', () => {
  const scrollBarHeight = 15
  const scrollBarTop = 0
  const uniqueIndents: readonly number[] = [10]
  const result = getCss(scrollBarHeight, scrollBarTop, uniqueIndents, 0, 0, 0)
  expect(result).toBe(`.Explorer {
  --ScrollBarThumbHeight: 15px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 0px;
  --ErrorMessageLeft: 0px;
  --ErrorMessageWidth: 0px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}
.Indent-10 {
  padding-left: 10px;
}`)
})

test('getCss - with multiple indents', () => {
  const scrollBarHeight = 25
  const scrollBarTop = 0
  const uniqueIndents: readonly number[] = [0, 20, 40]
  const result = getCss(scrollBarHeight, scrollBarTop, uniqueIndents, 0, 0, 0)
  expect(result).toBe(`.Explorer {
  --ScrollBarThumbHeight: 25px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 0px;
  --ErrorMessageLeft: 0px;
  --ErrorMessageWidth: 0px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}
.Indent-0 {
  padding-left: 0px;
}
.Indent-20 {
  padding-left: 20px;
}
.Indent-40 {
  padding-left: 40px;
}`)
})

test('getCss - with zero scrollBarHeight', () => {
  const scrollBarHeight = 0
  const scrollBarTop = 0
  const uniqueIndents: readonly number[] = [5, 10]
  const result = getCss(scrollBarHeight, scrollBarTop, uniqueIndents, 0, 0, 0)
  expect(result).toBe(`.Explorer {
  --ScrollBarThumbHeight: 0px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 0px;
  --ErrorMessageLeft: 0px;
  --ErrorMessageWidth: 0px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}
.Indent-5 {
  padding-left: 5px;
}
.Indent-10 {
  padding-left: 10px;
}`)
})

test('getCss - with large indents', () => {
  const scrollBarHeight = 30
  const scrollBarTop = 0
  const uniqueIndents: readonly number[] = [100, 200, 300]
  const result = getCss(scrollBarHeight, scrollBarTop, uniqueIndents, 0, 0, 0)
  expect(result).toBe(`.Explorer {
  --ScrollBarThumbHeight: 30px;
  --ScrollBarThumbTop: 0px;
  --ErrorMessageTop: 0px;
  --ErrorMessageLeft: 0px;
  --ErrorMessageWidth: 0px;
}
.Explorer .ScrollBarThumb {
  height: var(--ScrollBarThumbHeight);
  translate: 0px var(--ScrollBarThumbTop);
}
.Indent-100 {
  padding-left: 100px;
}
.Indent-200 {
  padding-left: 200px;
}
.Indent-300 {
  padding-left: 300px;
}`)
})
