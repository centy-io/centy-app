import type { RefObject } from 'react'

export interface StatusChangeSlice {
  showStatusDropdown: boolean
  setShowStatusDropdown: (v: boolean) => void
  updatingStatus: boolean
  statusDropdownRef: RefObject<HTMLDivElement | null>
  handleStatusChange: (status: string) => void
}
