export function getLinkTypeDisplay(linkType: string): string {
  return linkType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
