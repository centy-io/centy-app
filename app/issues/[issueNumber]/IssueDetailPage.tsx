'use client'

import { useParams } from 'next/navigation'
import { IssueDetail } from '@/components/issues/IssueDetail'

export function IssueDetailPage() {
  const params = useParams()
  const issueNumber = params.issueNumber as string

  return <IssueDetail issueNumber={issueNumber} />
}
