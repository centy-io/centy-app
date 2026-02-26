import { CreateIssue } from '@/components/issues/CreateIssue'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [{ organization: '_placeholder', project: '_placeholder' }]
}

export default function NewIssuePage() {
  return <CreateIssue />
}
