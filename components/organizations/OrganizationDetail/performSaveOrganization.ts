import { route } from 'nextjs-routes'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { performUpdateOrg } from './performUpdateOrg'
import { formatOrgErr } from './formatOrgErr'
import type { Organization } from '@/gen/centy_pb'

interface PerformSaveOrgParams {
  orgSlug: string
  editName: string
  editDescription: string
  editSlug: string
  setSaving: (v: boolean) => void
  setError: (v: string | null) => void
  setOrganization: (v: Organization) => void
  setIsEditing: (v: boolean) => void
  router: AppRouterInstance
}

export async function performSaveOrganization(
  params: PerformSaveOrgParams
): Promise<void> {
  const {
    orgSlug,
    editName,
    editDescription,
    editSlug,
    setSaving,
    setError,
    setOrganization,
    setIsEditing,
    router,
  } = params
  if (!orgSlug) return
  setSaving(true)
  setError(null)
  try {
    const result = await performUpdateOrg(
      orgSlug,
      editName,
      editDescription,
      editSlug
    )
    if ('error' in result) {
      setError(result.error)
    } else {
      setOrganization(result.org)
      setIsEditing(false)
      if (result.org.slug !== orgSlug)
        router.push(
          route({
            pathname: '/organizations/[orgSlug]',
            query: { orgSlug: result.org.slug },
          })
        )
    }
  } catch (err) {
    setError(formatOrgErr(err))
  } finally {
    setSaving(false)
  }
}
