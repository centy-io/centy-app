import { UsersPageClient } from './UsersPageClient'

export async function generateStaticParams() {
  return [{ params: undefined }]
}

export default function Page() {
  return <UsersPageClient />
}
