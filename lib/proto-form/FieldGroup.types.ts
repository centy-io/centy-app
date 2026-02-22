import type { FieldGroupRenderProps } from './FieldGroupRenderProps.types'

export interface FieldGroup {
  key: string
  claimedFields: string[]
  title: string
  order: number
  render: (props: FieldGroupRenderProps) => React.ReactNode
}
