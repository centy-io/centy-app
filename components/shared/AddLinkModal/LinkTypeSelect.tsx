'use client'

import type { LinkTypeInfo } from '@/gen/centy_pb'

interface LinkTypeSelectProps {
  loadingTypes: boolean
  linkTypes: LinkTypeInfo[]
  selectedLinkType: string
  setSelectedLinkType: (v: string) => void
}

export function LinkTypeSelect({
  loadingTypes,
  linkTypes,
  selectedLinkType,
  setSelectedLinkType,
}: LinkTypeSelectProps) {
  if (loadingTypes) return <div className="link-modal-loading">Loading...</div>
  return (
    <select
      value={selectedLinkType}
      onChange={e => setSelectedLinkType(e.target.value)}
      className="link-modal-select"
    >
      {linkTypes.map(type => (
        <option className="link-modal-option" key={type.name} value={type.name}>
          {type.name} {type.description ? `- ${type.description}` : ''}
        </option>
      ))}
    </select>
  )
}
