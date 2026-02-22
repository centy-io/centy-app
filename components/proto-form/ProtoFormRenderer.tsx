'use client'

import type { DescMessage } from '@bufbuild/protobuf'
import { AutoFieldRenderer } from './AutoFieldRenderer'
import { getFieldMeta } from '@/lib/proto-form/field-metadata'
import type { FieldGroup } from '@/lib/proto-form/FieldGroup'
import type { FieldOverride } from '@/lib/proto-form/FieldOverride'

interface ProtoFormRendererProps {
  schema: DescMessage
  value: Record<string, unknown>
  onChange: (updates: Record<string, unknown>) => void
  fieldGroups?: FieldGroup[]
  fieldOverrides?: Record<string, FieldOverride>
}

export function ProtoFormRenderer({
  schema,
  value,
  onChange,
  fieldGroups,
  fieldOverrides,
}: ProtoFormRendererProps) {
  const groups =
    fieldGroups !== null && fieldGroups !== undefined ? fieldGroups : []
  const overrides =
    fieldOverrides !== null && fieldOverrides !== undefined
      ? fieldOverrides
      : {}

  const claimedFields = new Set<string>()
  for (const group of groups) {
    for (const f of group.claimedFields) {
      claimedFields.add(f)
    }
  }
  for (const [localName, override] of Object.entries(overrides)) {
    if (override.hidden === true) claimedFields.add(localName)
  }

  const sortedGroups = [...groups].sort((a, b) => a.order - b.order)
  const unclaimedFields = schema.fields.filter(
    f => !claimedFields.has(f.localName)
  )

  return (
    <>
      {sortedGroups.map(group => (
        <section key={group.key} className="settings-section">
          <h3 className="settings-section-title">{group.title}</h3>
          <div className="settings-card">
            {group.render({ value, onChange })}
          </div>
        </section>
      ))}

      {unclaimedFields.map(field => {
        const override = overrides[field.localName]
        const meta = getFieldMeta(field, override)
        const fieldValue = value[field.localName]

        return (
          <section key={field.localName} className="settings-section">
            <h3 className="settings-section-title">{meta.label}</h3>
            <div className="settings-card">
              <AutoFieldRenderer
                field={field}
                label={meta.label}
                description={meta.description}
                value={fieldValue}
                onChange={val => onChange({ [field.localName]: val })}
                ProtoFormRenderer={ProtoFormRenderer}
              />
            </div>
          </section>
        )
      })}
    </>
  )
}
