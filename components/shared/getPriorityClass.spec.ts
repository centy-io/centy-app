import { getPriorityClass } from './getPriorityClass'

describe('getPriorityClass', () => {
  it('returns priority-high for high', () => {
    expect(getPriorityClass('high')).toBe('priority-high')
  })

  it('returns priority-high for critical', () => {
    expect(getPriorityClass('critical')).toBe('priority-high')
  })

  it('returns priority-medium for medium', () => {
    expect(getPriorityClass('medium')).toBe('priority-medium')
  })

  it('returns priority-medium for normal', () => {
    expect(getPriorityClass('normal')).toBe('priority-medium')
  })

  it('returns priority-low for low', () => {
    expect(getPriorityClass('low')).toBe('priority-low')
  })

  it('is case-insensitive', () => {
    expect(getPriorityClass('HIGH')).toBe('priority-high')
    expect(getPriorityClass('Medium')).toBe('priority-medium')
  })

  it('handles P1 as high', () => {
    expect(getPriorityClass('P1')).toBe('priority-high')
  })

  it('handles P2 as medium', () => {
    expect(getPriorityClass('P2')).toBe('priority-medium')
  })

  it('handles P3+ as low', () => {
    expect(getPriorityClass('P3')).toBe('priority-low')
    expect(getPriorityClass('p5')).toBe('priority-low')
  })

  it('returns empty string for unknown labels', () => {
    expect(getPriorityClass('unknown')).toBe('')
    expect(getPriorityClass('')).toBe('')
  })
})
