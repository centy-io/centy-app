export function getCellClassName(columnId: string): string {
  if (columnId === 'name') return 'org-name'
  if (columnId === 'slug') return 'org-slug'
  if (columnId === 'projectCount') return 'org-projects'
  if (columnId === 'createdAt') return 'org-date'
  return ''
}
