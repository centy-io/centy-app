import { CreateOrgIssue } from '@/components/organizations/CreateOrgIssue'

export const dynamic = 'force-static'

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams() {
  return [{ orgSlug: '_placeholder' }]
}

export default function NewOrgIssuePage() {
  return <CreateOrgIssue />
}
