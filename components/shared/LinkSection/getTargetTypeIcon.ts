export function getTargetTypeIcon(targetItemType: string): string {
  if (targetItemType === 'issue') {
    return '!'
  }
  if (targetItemType === 'doc') {
    return 'D'
  }
  return '?'
}
