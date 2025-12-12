import { IssuesPageClient } from './IssuesPageClient'

export async function generateStaticParams() {
  return [{ params: [] }]
}

export default function Page() {
  return <IssuesPageClient />
}
