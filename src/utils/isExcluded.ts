export function isExcluded(filePath: string, excludeExts: string[]): boolean {
  const ext = filePath.substring(filePath.lastIndexOf('.'));
  return excludeExts.includes(ext);
}
