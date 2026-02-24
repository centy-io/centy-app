import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

// Draft storage key mirrors getDraftStorageKey('doc', '/demo/centy-showcase')
const DRAFT_STORAGE_KEY = 'centy-draft-doc-/demo/centy-showcase'

// The demo createDoc handler returns DEMO_DOCS[0] (slug: 'getting-started')
const DEMO_DOC_SLUG = 'getting-started'

test.describe('Create Doc Form', () => {
  test.describe('Page rendering', () => {
    test('should render the create doc page heading', async ({ page }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(
        page.getByRole('heading', { name: 'Create New Document', level: 2 })
      ).toBeVisible()
    })

    test('should render the create-doc container', async ({ page }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(page.locator('div.create-doc')).toBeVisible()
    })

    test('should render the create doc form', async ({ page }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(page.locator('form.create-doc-form')).toBeVisible()
    })

    test('should render the title input with correct placeholder', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      const titleInput = page.locator('input#title')
      await expect(titleInput).toBeVisible()
      await expect(titleInput).toHaveAttribute('placeholder', 'Document title')
    })

    test('should render the slug input with correct placeholder', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      const slugInput = page.locator('input#slug')
      await expect(slugInput).toBeVisible()
      await expect(slugInput).toHaveAttribute(
        'placeholder',
        'e.g., getting-started'
      )
    })

    test('should render the content editor container', async ({ page }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(
        page.locator('.form-group').filter({ hasText: 'Content' })
      ).toBeVisible()
      await expect(page.locator('.text-editor')).toBeVisible()
    })

    test('should render Cancel and Create Document buttons', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Create Document' })
      ).toBeVisible()
    })

    test('should render form group labels', async ({ page }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(page.locator('label[for="title"]')).toBeVisible()
      await expect(page.locator('label[for="slug"]')).toBeVisible()
      await expect(page.locator('label[for="content"]')).toBeVisible()
    })
  })

  test.describe('Form validation', () => {
    test('should disable submit button when title is empty', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      const submitButton = page.getByRole('button', { name: 'Create Document' })
      await expect(submitButton).toBeDisabled()
    })

    test('should enable submit button when title has content', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.locator('input#title').fill('My new document')

      const submitButton = page.getByRole('button', { name: 'Create Document' })
      await expect(submitButton).toBeEnabled()
    })

    test('should disable submit button again when title is cleared', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      const titleInput = page.locator('input#title')
      const submitButton = page.getByRole('button', { name: 'Create Document' })

      await titleInput.fill('Some title')
      await expect(submitButton).toBeEnabled()

      await titleInput.clear()
      await expect(submitButton).toBeDisabled()
    })

    test('should disable submit button when title contains only whitespace', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.locator('input#title').fill('   ')

      const submitButton = page.getByRole('button', { name: 'Create Document' })
      await expect(submitButton).toBeDisabled()
    })

    test('should allow submitting with only title filled (slug is optional)', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.locator('input#title').fill('Title only doc')
      // slug is left empty intentionally - it is optional

      const submitButton = page.getByRole('button', { name: 'Create Document' })
      await expect(submitButton).toBeEnabled()
    })
  })

  test.describe('Form interactions', () => {
    test('should update title input value as the user types', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      const titleInput = page.locator('input#title')
      await titleInput.fill('Architecture Overview')

      await expect(titleInput).toHaveValue('Architecture Overview')
    })

    test('should update slug input value as the user types', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      const slugInput = page.locator('input#slug')
      await slugInput.fill('architecture-overview')

      await expect(slugInput).toHaveValue('architecture-overview')
    })

    test('should start with empty title, slug, and content', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(page.locator('input#title')).toHaveValue('')
      await expect(page.locator('input#slug')).toHaveValue('')
    })
  })

  test.describe('Draft persistence', () => {
    test('should auto-save title to localStorage draft', async ({ page }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.locator('input#title').fill('Draft document')

      // Wait a tick for the auto-save effect to run
      await page.waitForTimeout(100)

      const draft = await page.evaluate((key: string) => {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : null
      }, DRAFT_STORAGE_KEY)

      expect(draft).not.toBeNull()
      expect(draft.title).toBe('Draft document')
    })

    test('should auto-save slug to localStorage draft', async ({ page }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.locator('input#title').fill('Draft doc')
      await page.locator('input#slug').fill('draft-doc')

      await page.waitForTimeout(100)

      const draft = await page.evaluate((key: string) => {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : null
      }, DRAFT_STORAGE_KEY)

      expect(draft).not.toBeNull()
      expect(draft.slug).toBe('draft-doc')
    })

    test('should restore draft title from localStorage on mount', async ({
      page,
    }) => {
      await page.addInitScript((key: string) => {
        localStorage.setItem(
          key,
          JSON.stringify({
            title: 'Restored document',
            content: '',
            slug: '',
          })
        )
      }, DRAFT_STORAGE_KEY)

      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(page.locator('input#title')).toHaveValue('Restored document')
    })

    test('should restore draft slug from localStorage on mount', async ({
      page,
    }) => {
      await page.addInitScript((key: string) => {
        localStorage.setItem(
          key,
          JSON.stringify({
            title: 'My Doc',
            content: '',
            slug: 'my-doc',
          })
        )
      }, DRAFT_STORAGE_KEY)

      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await expect(page.locator('input#slug')).toHaveValue('my-doc')
    })
  })

  test.describe('Cancel navigation', () => {
    test('should navigate to docs list when Cancel is clicked', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.getByRole('button', { name: 'Cancel' }).click()

      await expect(page).toHaveURL(/\/demo-org\/centy-showcase\/docs\/?$/)
    })
  })

  test.describe('Successful submission', () => {
    test('should navigate away from the create page after submitting', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.locator('input#title').fill('My new test document')
      await page.getByRole('button', { name: 'Create Document' }).click()

      // After success the app navigates to the doc detail page.
      // The demo createDoc handler returns DEMO_DOCS[0] (slug: 'getting-started').
      await expect(page).not.toHaveURL(/\/docs\/new/)
    })

    test('should navigate to the created doc slug after submission', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.locator('input#title').fill('My new test document')
      await page.getByRole('button', { name: 'Create Document' }).click()

      // Demo handler returns DEMO_DOCS[0] with slug 'getting-started'
      await expect(page).toHaveURL(new RegExp(`/docs/${DEMO_DOC_SLUG}`))
    })

    test('should show Create Document button text before submission', async ({
      page,
    }) => {
      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      await page.locator('input#title').fill('Loading state test')

      const submitButton = page.getByRole('button', { name: 'Create Document' })
      await expect(submitButton).toBeEnabled()
      await expect(submitButton).toHaveText('Create Document')
    })

    test('should clear the draft from localStorage after successful submission', async ({
      page,
    }) => {
      await page.addInitScript((key: string) => {
        localStorage.setItem(
          key,
          JSON.stringify({
            title: 'Will be cleared',
            content: '',
            slug: '',
          })
        )
      }, DRAFT_STORAGE_KEY)

      await setupDemoMode(page)
      await navigateToDemoProject(page, '/docs/new')

      // Confirm draft loaded
      await expect(page.locator('input#title')).toHaveValue('Will be cleared')

      // Submit
      await page.getByRole('button', { name: 'Create Document' }).click()

      // Wait for navigation away from the form
      await expect(page).not.toHaveURL(/\/docs\/new/)

      // Draft must have been removed
      const draft = await page.evaluate((key: string) => {
        return localStorage.getItem(key)
      }, DRAFT_STORAGE_KEY)

      expect(draft).toBeNull()
    })
  })
})
