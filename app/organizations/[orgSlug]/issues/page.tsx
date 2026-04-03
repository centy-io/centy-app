import { OrgIssuesList } from '@/components/organizations/OrgIssuesList'

export const dynamic = 'force-static'

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams() {
  return [{ orgSlug: '_placeholder' }]
}

export default async function OrgIssuesPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  return <OrgIssuesList orgSlug={orgSlug} />
}
