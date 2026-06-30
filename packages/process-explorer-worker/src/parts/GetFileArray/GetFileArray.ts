export const getFileArray = (fileList: FileList): readonly File[] => {
  // @ts-ignore
  const files = [...fileList]
  return files
}
