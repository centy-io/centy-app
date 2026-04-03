import { UsersList } from '@/components/users/UsersList'

export const dynamic = 'force-static'

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams() {
  return [{ organization: '_placeholder', project: '_placeholder' }]
}

export default function ProjectUsersPage() {
  return <UsersList />
}
