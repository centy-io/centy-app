import { GenericItemDetail } from '@/components/generic/GenericItemDetail'

export const dynamic = 'force-static'

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateStaticParams() {
  return [
    {
      organization: '_placeholder',
      project: '_placeholder',
      itemType: '_placeholder',
      slug: '_placeholder',
    },
  ]
}

export default async function SlugItemDetailPage({
  params,
}: {
  params: Promise<{ itemType: string; slug: string }>
}) {
  const { itemType, slug } = await params
  return <GenericItemDetail itemType={itemType} itemId={slug} />
}
