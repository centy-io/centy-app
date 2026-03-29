interface WithFilterValue {
  column: { getFilterValue: () => unknown }
}

export function getColumnFilterValue(header: WithFilterValue): string {
  const v = header.column.getFilterValue()
  return typeof v === 'string' ? v : ''
}
