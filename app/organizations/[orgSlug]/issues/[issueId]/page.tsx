import { OrgIssueDetail } from '@/components/organizations/OrgIssueDetail'

export const dynamic = 'force-static'

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams() {
  return [{ orgSlug: '_placeholder', issueId: '_placeholder' }]
}

export default async function OrgIssueDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string; issueId: string }>
}) {
  const { orgSlug, issueId } = await params
  return <OrgIssueDetail orgSlug={orgSlug} issueId={issueId} />
}
