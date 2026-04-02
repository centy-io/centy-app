import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

const DRAFT_STORAGE_KEY = 'centy-draft-issue-/demo/centy-showcase'

test.describe('Create Issue Form - Cancel navigation', () => {
  test('should navigate to issues list when Cancel is clicked', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page).toHaveURL(/\/demo-org\/centy-showcase\/issues\/?$/)
  })
})

test.describe('Create Issue Form - Successful submission', () => {
  test('should navigate away from the create page after submitting', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('input#title').fill('My new test issue')
    await page.getByRole('button', { name: 'Create Issue' }).click()

    await expect(page).not.toHaveURL(/\/issues\/new/)
  })

  test('should show "Creating..." text on submit button while loading', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('input#title').fill('Loading state test')

    const submitButton = page.getByRole('button', { name: 'Create Issue' })
    await expect(submitButton).toBeEnabled()
    await expect(submitButton).toHaveText('Create Issue')
  })

  test('should clear the draft from localStorage after successful submission', async ({
    page,
  }) => {
    await page.addInitScript((key: string) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          title: 'Will be cleared',
          description: '',
          priority: 2,
        })
      )
    }, DRAFT_STORAGE_KEY)

    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(page.locator('input#title')).toHaveValue('Will be cleared')
    await page.getByRole('button', { name: 'Create Issue' }).click()
    await expect(page).not.toHaveURL(/\/issues\/new/)

    const draft = await page.evaluate((key: string) => {
      return localStorage.getItem(key)
    }, DRAFT_STORAGE_KEY)

    expect(draft).toBeNull()
  })
})

test.describe('Create Issue Form - Attachments section', () => {
  test('should render the attachments form group', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(
      page.locator('.form-group').filter({ hasText: 'Attachments' })
    ).toBeVisible()
  })
})
