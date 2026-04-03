export const getPriorityLabel = (priority: number): string => {
  if (priority === 1) return 'High'
  if (priority === 2) return 'Medium'
  if (priority === 3) return 'Low'
  return ''
}
