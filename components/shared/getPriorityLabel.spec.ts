import { getPriorityLabel } from './getPriorityLabel'

describe('getPriorityLabel', () => {
  it('returns High for priority 1', () => {
    expect(getPriorityLabel(1)).toBe('High')
  })

  it('returns Medium for priority 2', () => {
    expect(getPriorityLabel(2)).toBe('Medium')
  })

  it('returns Low for priority 3', () => {
    expect(getPriorityLabel(3)).toBe('Low')
  })

  it('returns empty string for unknown priority', () => {
    expect(getPriorityLabel(0)).toBe('')
    expect(getPriorityLabel(4)).toBe('')
  })
})
