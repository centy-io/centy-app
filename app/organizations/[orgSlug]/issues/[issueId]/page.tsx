import { OrgIssueDetail } from '@/components/organizations/OrgIssueDetail'

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
