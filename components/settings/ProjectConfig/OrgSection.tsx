import Link from 'next/link'

interface Organization {
  slug: string
  name: string
}

interface OrgSectionProps {
  organizations: Organization[]
  projectOrgSlug: string
  savingOrg: boolean
  onOrgChange: (slug: string) => void
}

export function OrgSection({
  organizations,
  projectOrgSlug,
  savingOrg,
  onOrgChange,
}: OrgSectionProps) {
  return (
    <section className="settings-section">
      <h3>Organization</h3>
      <div className="settings-card">
        <div className="form-group">
          <label htmlFor="project-org">Assign to Organization</label>
          <div className="org-select-row">
            <select
              id="project-org"
              value={projectOrgSlug}
              onChange={e => onOrgChange(e.target.value)}
              disabled={savingOrg}
              className="org-select"
            >
              <option value="">No Organization (Ungrouped)</option>
              {organizations.map(org => (
                <option key={org.slug} value={org.slug}>
                  {org.name}
                </option>
              ))}
            </select>
            {savingOrg && <span className="saving-indicator">Saving...</span>}
          </div>
          <span className="form-hint">
            Group this project under an organization for better management.{' '}
            <Link href="/organizations">Manage organizations</Link>
          </span>
        </div>
      </div>
    </section>
  )
}
