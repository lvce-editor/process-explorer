import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.ts'

const menuEntryNewFile: MenuEntry = {
  command: 'Explorer.newFile',
  flags: MenuItemFlags.None,
  id: 'newFile',
  label: ViewletExplorerStrings.newFile(),
}

const menuEntryNewFolder: MenuEntry = {
  command: 'Explorer.newFolder',
  flags: MenuItemFlags.None,
  id: 'newFolder',
  label: ViewletExplorerStrings.newFolder(),
}

const menuEntryOpenContainingFolder: MenuEntry = {
  command: 'Explorer.openContainingFolder',
  flags: MenuItemFlags.RestoreFocus,
  id: 'openContainingFolder',
  label: ViewletExplorerStrings.openContainingFolder(),
}

const menuEntryOpenInIntegratedTerminal: MenuEntry = {
  command: /* TODO */ '-1',
  flags: MenuItemFlags.None,
  id: 'openInIntegratedTerminal',
  label: ViewletExplorerStrings.openInIntegratedTerminal(),
}

const menuEntryCut: MenuEntry = {
  command: 'Explorer.handleCut',
  flags: MenuItemFlags.RestoreFocus,
  id: 'cut',
  label: ViewletExplorerStrings.cut(),
}

const menuEntryCopy: MenuEntry = {
  command: 'Explorer.handleCopy',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copy',
  label: ViewletExplorerStrings.copy(),
}

const menuEntryPaste: MenuEntry = {
  command: 'Explorer.handlePaste',
  flags: MenuItemFlags.None,
  id: 'paste',
  label: ViewletExplorerStrings.paste(),
}

const menuEntryCopyPath: MenuEntry = {
  command: 'Explorer.copyPath',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copyPath',
  label: ViewletExplorerStrings.copyPath(),
}

const menuEntryCopyRelativePath: MenuEntry = {
  command: 'Explorer.copyRelativePath',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copyRelativePath',
  label: ViewletExplorerStrings.copyRelativePath(),
}

const menuEntrySelectForCompare: MenuEntry = {
  command: 'Explorer.selectForCompare',
  flags: MenuItemFlags.RestoreFocus,
  id: 'selectForCompare',
  label: ViewletExplorerStrings.selectForCompare(),
}

const menuEntryCompareWithSelected: MenuEntry = {
  command: 'Explorer.compareWithSelected',
  flags: MenuItemFlags.RestoreFocus,
  id: 'compareWithSelected',
  label: ViewletExplorerStrings.compareWithSelected(),
}

const menuEntryRename: MenuEntry = {
  command: 'Explorer.renameDirent',
  flags: MenuItemFlags.None,
  id: 'rename',
  label: ViewletExplorerStrings.rename(),
}

const menuEntryDelete: MenuEntry = {
  command: 'Explorer.removeDirent',
  flags: MenuItemFlags.None,
  id: 'delete',
  label: ViewletExplorerStrings.deleteItem(),
}

const menuEntryRemoveFolderFromWorkspace: MenuEntry = {
  command: 'Workspace.close',
  flags: MenuItemFlags.None,
  id: 'removeFolderFromWorkspace',
  label: ViewletExplorerStrings.removeFolderFromWorkspace(),
}

const ALL_ENTRIES: readonly MenuEntry[] = [
  menuEntryNewFile,
  menuEntryNewFolder,
  menuEntryOpenContainingFolder,
  menuEntryOpenInIntegratedTerminal,
  MenuEntrySeparator.menuEntrySeparator,
  menuEntryCut,
  menuEntryCopy,
  menuEntryPaste,
  MenuEntrySeparator.menuEntrySeparator,
  menuEntryCopyPath,
  menuEntryCopyRelativePath,
  MenuEntrySeparator.menuEntrySeparator,
  menuEntryRename,
  menuEntryDelete,
]

// TODO there are two possible ways of getting the focused dirent of explorer
// 1. directly access state of explorer (bad because it directly accesses state of another component)
// 2. expose getFocusedDirent method in explorer (bad because explorer code should not know about for menuEntriesExplorer, which needs that method)
const getFocusedDirent = (explorerState: ExplorerState): ExplorerItem | undefined => {
  if (!explorerState || explorerState.focusedIndex < 0) {
    return undefined
  }
  return explorerState.items[explorerState.focusedIndex]
}

const getMenuEntriesDirectory = (): readonly MenuEntry[] => {
  return ALL_ENTRIES
}

const getMenuEntriesFile = (): readonly MenuEntry[] => {
  return [
    menuEntryOpenContainingFolder,
    menuEntryOpenInIntegratedTerminal,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCut,
    menuEntryCopy,
    menuEntryPaste,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCopyPath,
    menuEntryCopyRelativePath,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntrySelectForCompare,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryRename,
    menuEntryDelete,
  ]
}

const getMenuEntriesFileCompareWithSelected = (): readonly MenuEntry[] => {
  return [
    menuEntryOpenContainingFolder,
    menuEntryOpenInIntegratedTerminal,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCut,
    menuEntryCopy,
    menuEntryPaste,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCopyPath,
    menuEntryCopyRelativePath,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCompareWithSelected,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryRename,
    menuEntryDelete,
  ]
}

const getMenuEntriesDefault = (): readonly MenuEntry[] => {
  return ALL_ENTRIES
}

const getMenuEntriesRoot = (root: string): readonly MenuEntry[] => {
  const entries: MenuEntry[] = [
    menuEntryNewFile,
    menuEntryNewFolder,
    menuEntryOpenContainingFolder,
    menuEntryOpenInIntegratedTerminal,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryPaste,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCopyPath,
    menuEntryCopyRelativePath,
  ]
  if (root) {
    entries.push(MenuEntrySeparator.menuEntrySeparator, menuEntryRemoveFolderFromWorkspace)
  }
  return entries
}

export const getMenuEntries = (state: ExplorerState): readonly MenuEntry[] => {
  const focusedDirent = getFocusedDirent(state)
  if (!focusedDirent) {
    return getMenuEntriesRoot(state.root)
  }
  switch (focusedDirent.type) {
    case DirentType.Directory:
      return getMenuEntriesDirectory()
    case DirentType.File:
      if (state.compareSourceUri && state.compareSourceUri !== focusedDirent.path) {
        return getMenuEntriesFileCompareWithSelected()
      }
      return getMenuEntriesFile()
    default:
      return getMenuEntriesDefault()
  }
}
