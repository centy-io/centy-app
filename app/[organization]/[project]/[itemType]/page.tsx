import { GenericItemsList } from '@/components/generic/GenericItemsList'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [
    {
      organization: '_placeholder',
      project: '_placeholder',
      itemType: '_placeholder',
    },
  ]
}

export default async function SlugItemListPage({
  params,
}: {
  params: Promise<{ itemType: string }>
}) {
  const { itemType } = await params
  return <GenericItemsList itemType={itemType} />
}
