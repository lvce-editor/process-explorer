import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileDecoration } from '../FileDecoration/FileDecoration.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as ChevronType from '../ChevronType/ChevronType.ts'
import { createDecorationMap } from '../CreateDecorationMap/CreateDecorationMap.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChevronType from '../GetChevronType/GetChevronType.ts'
import * as GetExpandedType from '../GetExpandedType/GetExpandedType.ts'
import { getTreeItemClassName } from '../GetTreeItemClassName/GetTreeItemClassName.ts'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.ts'
import * as GetTreeItemIndentWithChevron from '../GetTreeItemIndentWithChevron/GetTreeItemIndentWithChevron.ts'

const ariaExpandedValues: (string | undefined)[] = [undefined, 'true', 'false']

const getEditingChevron = (direntType: number): number => {
  switch (direntType) {
    case DirentType.EditingDirectoryExpanded:
      return ChevronType.Down
    case DirentType.EditingFolder:
      return ChevronType.Right
    default:
      return ChevronType.None
  }
}

export const getVisibleExplorerItems = (
  items: readonly ExplorerItem[],
  minLineY: number,
  maxLineY: number,
  focusedIndex: number,
  editingIndex: number,
  editingErrorMessage: string,
  icons: readonly string[],
  useChevrons: boolean,
  dropTargets: readonly number[],
  editingIcon: string,
  cutItems: readonly string[],
  sourceControlIgnoredUris: readonly string[] = [],
  decorations: readonly FileDecoration[],
): readonly VisibleExplorerItem[] => {
  const decorationMap = createDecorationMap(decorations)
  const visible: VisibleExplorerItem[] = []
  const indentFn = useChevrons ? GetTreeItemIndentWithChevron.getTreeItemIndentWithChevron : GetTreeItemIndent.getTreeItemIndent
  let iconIndex = 0
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    let chevron = GetChevronType.getChevronType(item.type, useChevrons)
    const isEditing = i === editingIndex
    let icon = icons[iconIndex++]
    if (isEditing) {
      icon = editingIcon
      chevron = getEditingChevron(item.type)
    }
    const isFocused = i === focusedIndex
    const id = isFocused ? 'TreeItemActive' : undefined
    const isSelected = item.selected
    const isCut = cutItems.includes(item.path)
    const isDropping = dropTargets.includes(i)
    const isIgnored = sourceControlIgnoredUris.includes(item.path)
    const indent = indentFn(item.depth, chevron)
    const decoration = decorationMap[item.path] || ''
    const className = getTreeItemClassName(isSelected, isFocused, isDropping, useChevrons, indent, decoration)
    const expanded = GetExpandedType.getExpandedType(item.type)
    const ariaExpanded = ariaExpandedValues[expanded]
    visible.push({
      ...item,
      ariaExpanded,
      chevron,
      className,
      decoration,
      hasEditingError: isEditing && Boolean(editingErrorMessage),
      icon,
      id,
      indent,
      index: i,
      isCut,
      isEditing: isEditing,
      isIgnored,
      posInSet: item.posInSet ?? i + 1,
      setSize: item.setSize ?? items.length,
    })
  }
  return visible
}
