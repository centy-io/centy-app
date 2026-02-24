import type { CustomFieldDefinition } from '@/gen/centy_pb'

interface FieldDetailsProps {
  field: CustomFieldDefinition
}

export function FieldDetails({ field }: FieldDetailsProps) {
  return (
    <div className="custom-field-details">
      {field.defaultValue && (
        <span className="custom-field-default">
          Default:{' '}
          <code className="custom-field-default-value">
            {field.defaultValue}
          </code>
        </span>
      )}
      {field.fieldType === 'enum' && field.enumValues.length > 0 && (
        <span className="custom-field-enum-values">
          Options:{' '}
          {field.enumValues.map((v, i) => (
            <code className="custom-field-enum-value" key={v}>
              {v}
              {i < field.enumValues.length - 1 ? ', ' : ''}
            </code>
          ))}
        </span>
      )}
    </div>
  )
}
