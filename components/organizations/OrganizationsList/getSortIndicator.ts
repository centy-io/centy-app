export function getSortIndicator(sorted: false | 'asc' | 'desc'): string {
  if (sorted === 'asc') return ' \u25B2'
  if (sorted === 'desc') return ' \u25BC'
  return ''
}
