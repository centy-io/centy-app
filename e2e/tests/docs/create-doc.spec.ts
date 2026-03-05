import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

// The demo createItem handler returns DEMO_DOCS[0] (slug: 'getting-started')
const DEMO_DOC_SLUG = 'getting-started'

test.describe('Create Doc Form - Page rendering', () => {
  test('should render the create doc page heading', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    await expect(
      page.getByRole('heading', { name: /create new/i, level: 2 })
    ).toBeVisible()
  })

  test('should render the create item container', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    await expect(page.locator('div.create-generic-item')).toBeVisible()
  })

  test('should render the create form', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    await expect(page.locator('form.create-generic-form')).toBeVisible()
  })

  test('should render the title input', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    const titleInput = page.locator('input#title')
    await expect(titleInput).toBeVisible()
  })

  test('should render Cancel and Create buttons', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    await expect(page.getByRole('link', { name: 'Cancel' })).toBeVisible()
    await expect(page.getByRole('button', { name: /create/i })).toBeVisible()
  })
})

test.describe('Create Doc Form - Form validation', () => {
  test('should disable submit button when title is empty', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    const submitButton = page.getByRole('button', { name: /create/i })
    await expect(submitButton).toBeDisabled()
  })

  test('should enable submit button when title has content', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    await page.locator('input#title').fill('My new document')

    const submitButton = page.getByRole('button', { name: /create/i })
    await expect(submitButton).toBeEnabled()
  })

  test('should disable submit button when title is cleared', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    const titleInput = page.locator('input#title')
    const submitButton = page.getByRole('button', { name: /create/i })

    await titleInput.fill('Some title')
    await expect(submitButton).toBeEnabled()

    await titleInput.clear()
    await expect(submitButton).toBeDisabled()
  })
})

test.describe('Create Doc Form - Form interactions', () => {
  test('should update title input value as the user types', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    const titleInput = page.locator('input#title')
    await titleInput.fill('Architecture Overview')

    await expect(titleInput).toHaveValue('Architecture Overview')
  })

  test('should start with empty title', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    await expect(page.locator('input#title')).toHaveValue('')
  })
})

test.describe('Create Doc Form - Successful submission', () => {
  test('should navigate away from the create page after submitting', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    await page.locator('input#title').fill('My new test document')
    await page.getByRole('button', { name: /create/i }).click()

    // After success the app navigates to the doc detail page.
    await expect(page).not.toHaveURL(/\/docs\/new/)
  })

  test('should navigate to the created doc slug after submission', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/docs/new')

    await page.locator('input#title').fill('My new test document')
    await page.getByRole('button', { name: /create/i }).click()

    // Demo handler returns DEMO_DOCS[0] with slug 'getting-started'
    await expect(page).toHaveURL(new RegExp(`/docs/${DEMO_DOC_SLUG}`))
  })
})
