import { OrganizationDetail } from '@/components/organizations/OrganizationDetail'

export const dynamic = 'force-static'

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams() {
  return [{ orgSlug: '_placeholder' }]
}

export default function OrganizationDetailPage() {
  return <OrganizationDetail />
}
