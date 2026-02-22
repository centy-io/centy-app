import { CreateOrgIssue } from '@/components/organizations/CreateOrgIssue'

export async function generateStaticParams() {
  return [{ orgSlug: '_placeholder' }]
}

export default async function NewOrgIssuePage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  return <CreateOrgIssue orgSlug={orgSlug} />
}
