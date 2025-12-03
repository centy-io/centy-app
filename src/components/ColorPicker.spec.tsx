import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker', () => {
  it('should render with default value', () => {
    render(<ColorPicker value="#ff0000" onChange={() => {}} />)

    const textInput = screen.getByPlaceholderText('#RRGGBB')
    expect(textInput).toHaveValue('#ff0000')
  })

  it('should render with label when provided', () => {
    render(<ColorPicker value="#ff0000" onChange={() => {}} label="Color" />)

    expect(screen.getByText('Color')).toBeInTheDocument()
  })

  it('should call onChange when color input changes', () => {
    const onChange = vi.fn()
    render(<ColorPicker value="#ff0000" onChange={onChange} />)

    const colorInput = document.querySelector('input[type="color"]')
    fireEvent.change(colorInput!, { target: { value: '#00ff00' } })

    expect(onChange).toHaveBeenCalledWith('#00ff00')
  })

  it('should call onChange when text input changes', () => {
    const onChange = vi.fn()
    render(<ColorPicker value="#ff0000" onChange={onChange} />)

    const textInput = screen.getByPlaceholderText('#RRGGBB')
    fireEvent.change(textInput, { target: { value: '#0000ff' } })

    expect(onChange).toHaveBeenCalledWith('#0000ff')
  })

  it('should use fallback color when value is empty', () => {
    render(<ColorPicker value="" onChange={() => {}} />)

    const colorInput = document.querySelector(
      'input[type="color"]'
    ) as HTMLInputElement
    expect(colorInput.value).toBe('#888888')
  })

  it('should render swatch with correct background color', () => {
    render(<ColorPicker value="#ff5500" onChange={() => {}} />)

    const swatch = document.querySelector('.color-picker-swatch')
    expect(swatch).toHaveStyle({ backgroundColor: '#ff5500' })
  })
})
