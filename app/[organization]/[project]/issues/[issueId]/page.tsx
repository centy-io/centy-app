import { IssueDetail } from '@/components/issues/IssueDetail'

export const dynamic = 'force-static'

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams() {
  return [
    {
      organization: '_placeholder',
      project: '_placeholder',
      issueId: '_placeholder',
    },
  ]
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ issueId: string }>
}) {
  const { issueId } = await params
  return <IssueDetail issueNumber={issueId} />
}
