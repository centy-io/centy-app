import { GenericItemCreate } from '@/components/generic/GenericItemCreate'

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

export default async function NewSlugItemPage({
  params,
}: {
  params: Promise<{ itemType: string }>
}) {
  const { itemType } = await params
  return <GenericItemCreate itemType={itemType} />
}
