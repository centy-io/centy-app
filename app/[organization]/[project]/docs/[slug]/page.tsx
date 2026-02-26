import { DocDetail } from '@/components/docs/DocDetail'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [
    {
      organization: '_placeholder',
      project: '_placeholder',
      slug: '_placeholder',
    },
  ]
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <DocDetail slug={slug} />
}
