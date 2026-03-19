import { SharedAssets } from '@/components/assets/SharedAssets'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [{ organization: '_placeholder', project: '_placeholder' }]
}

export default function ProjectAssetsPage() {
  return <SharedAssets />
}
