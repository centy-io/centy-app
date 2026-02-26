import { OrganizationDetail } from '@/components/organizations/OrganizationDetail'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [{ orgSlug: '_placeholder' }]
}

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>
}) {
  const { orgSlug } = await params
  return <OrganizationDetail orgSlug={orgSlug} />
}
