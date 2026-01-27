# Hide ProjectSelector when no organization is explicitly selected

Add a new ‘Not selected’ state for organization selection. Currently, the ProjectSelector is always visible even when selectedOrgSlug is null (All Orgs). Instead, distinguish between ‘not yet selected’ (initial state, hide ProjectSelector) and ‘All Orgs’ (explicitly selected, show ProjectSelector). This requires updating OrganizationProvider state model, OrgSwitcher UI, and Header conditional rendering.
