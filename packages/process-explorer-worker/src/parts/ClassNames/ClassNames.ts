// 0 = 'Button'
// 1 = 'IconButton'
// 2 = 'Button IconButton'
// it could make dom diffing faster, since for classname,
// once at start, send all classnames to renderer process
// only numbers are compared. it could also make rendering faster,
// representing the concatenated strings for example
// since less data is transferred to renderer process
// then, components uses numeric classname
// TODO add option to make classnames numeric
// when a component uses multiple classnames, it is a new number
export const Actions = 'Actions'
export const Button = 'Button'
export const ButtonNarrow = 'ButtonNarrow'
export const ButtonPrimary = 'ButtonPrimary'
export const ButtonWide = 'ButtonWide'
export const Chevron = 'Chevron'
export const Empty = ''
export const Explorer = 'Explorer'
export const ExplorerDropTarget = 'DropTarget'
export const ExplorerErrorMessage = 'ExplorerErrorMessage'
export const ExplorerInputBox = 'ExplorerInputBox'
export const FileIcon = 'FileIcon'
export const FocusOutline = 'FocusOutline'
export const IconButton = 'IconButton'
export const InputBox = 'InputBox'
export const InputValidationError = 'InputValidationError'
export const Label = 'Label'
export const LabelCut = 'LabelCut'
export const ListItems = 'ListItems'
export const MaskIconChevronDown = 'MaskIconChevronDown'
export const MaskIconChevronRight = 'MaskIconChevronRight'
export const ScrollBar = 'ScrollBar'
export const ScrollBarSmall = 'ScrollBarSmall'
export const ScrollBarThumb = 'ScrollBarThumb'
export const TreeItem = 'TreeItem'
export const TreeItemActive = 'TreeItemActive'
export const Viewlet = 'Viewlet'
export const Welcome = 'Welcome'
export const WelcomeMessage = 'WelcomeMessage'
