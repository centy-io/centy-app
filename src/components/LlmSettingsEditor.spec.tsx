import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LlmSettingsEditor } from './LlmSettingsEditor'
import type { LlmConfig } from '../gen/centy_pb.ts'

describe('LlmSettingsEditor', () => {
  const defaultConfig: LlmConfig = {
    autoCloseOnComplete: false,
    updateStatusOnStart: false,
    allowDirectEdits: false,
    $typeName: 'centy.LlmConfig',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all checkbox options', () => {
    render(<LlmSettingsEditor value={defaultConfig} onChange={() => {}} />)

    expect(screen.getByText('Auto-close on complete')).toBeInTheDocument()
    expect(screen.getByText('Update status on start')).toBeInTheDocument()
    expect(screen.getByText('Allow direct edits')).toBeInTheDocument()
  })

  it('should render descriptions for all options', () => {
    render(<LlmSettingsEditor value={defaultConfig} onChange={() => {}} />)

    expect(
      screen.getByText('Automatically close issues when marked complete by LLM')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Update status to in-progress when LLM starts work')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Allow LLM to directly edit issue files instead of using CLI'
      )
    ).toBeInTheDocument()
  })

  it('should render checkboxes unchecked when all false', () => {
    render(<LlmSettingsEditor value={defaultConfig} onChange={() => {}} />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it('should render checkboxes checked when values are true', () => {
    const config: LlmConfig = {
      autoCloseOnComplete: true,
      updateStatusOnStart: true,
      allowDirectEdits: true,
      $typeName: 'centy.LlmConfig',
    }
    render(<LlmSettingsEditor value={config} onChange={() => {}} />)

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked()
    })
  })

  it('should call onChange when auto-close checkbox is clicked', () => {
    const onChange = vi.fn()
    render(<LlmSettingsEditor value={defaultConfig} onChange={onChange} />)

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      autoCloseOnComplete: true,
    })
  })

  it('should call onChange when update-status checkbox is clicked', () => {
    const onChange = vi.fn()
    render(<LlmSettingsEditor value={defaultConfig} onChange={onChange} />)

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1])

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      updateStatusOnStart: true,
    })
  })

  it('should call onChange when allow-direct-edits checkbox is clicked', () => {
    const onChange = vi.fn()
    render(<LlmSettingsEditor value={defaultConfig} onChange={onChange} />)

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[2])

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      allowDirectEdits: true,
    })
  })

  it('should handle undefined value prop', () => {
    render(<LlmSettingsEditor value={undefined} onChange={() => {}} />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked()
    })
  })

  it('should uncheck checkbox when already checked', () => {
    const config: LlmConfig = {
      autoCloseOnComplete: true,
      updateStatusOnStart: false,
      allowDirectEdits: false,
      $typeName: 'centy.LlmConfig',
    }
    const onChange = vi.fn()
    render(<LlmSettingsEditor value={config} onChange={onChange} />)

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    expect(onChange).toHaveBeenCalledWith({
      ...config,
      autoCloseOnComplete: false,
    })
  })

  it('should preserve other values when changing one checkbox', () => {
    const config: LlmConfig = {
      autoCloseOnComplete: true,
      updateStatusOnStart: true,
      allowDirectEdits: false,
      $typeName: 'centy.LlmConfig',
    }
    const onChange = vi.fn()
    render(<LlmSettingsEditor value={config} onChange={onChange} />)

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[2])

    expect(onChange).toHaveBeenCalledWith({
      autoCloseOnComplete: true,
      updateStatusOnStart: true,
      allowDirectEdits: true,
      $typeName: 'centy.LlmConfig',
    })
  })
})
