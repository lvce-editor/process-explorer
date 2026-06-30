import { getDragLabel } from '../GetDragLabel/GetDragLabel.ts'

const toUri = (path: string): string => {
  if (path.startsWith('file://')) {
    return path
  }
  return 'file://' + path
}

interface DragInfoItem {
  readonly data: string
  readonly type: string
}

export interface IDragInfoNew {
  readonly items: readonly DragInfoItem[]
  readonly label?: string
}

export const getDragData = (urls: readonly string[]): IDragInfoNew => {
  const data = urls.map(toUri).join('\n')
  const dragData: readonly DragInfoItem[] = [
    {
      data,
      type: 'text/uri-list',
    },
    {
      data,
      type: 'text/plain',
    },
  ]
  return {
    items: dragData,
    label: getDragLabel(urls),
  }
}
