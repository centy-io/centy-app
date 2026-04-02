import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

test.describe('Create Issue Form - Form validation', () => {
  test('should disable submit button when title is empty', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    const submitButton = page.getByRole('button', { name: 'Create Issue' })
    await expect(submitButton).toBeDisabled()
  })

  test('should enable submit button when title has content', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('input#title').fill('My new issue')

    const submitButton = page.getByRole('button', { name: 'Create Issue' })
    await expect(submitButton).toBeEnabled()
  })

  test('should disable submit button again when title is cleared', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    const titleInput = page.locator('input#title')
    const submitButton = page.getByRole('button', { name: 'Create Issue' })

    await titleInput.fill('Some title')
    await expect(submitButton).toBeEnabled()

    await titleInput.clear()
    await expect(submitButton).toBeDisabled()
  })

  test('should disable submit button when title contains only whitespace', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('input#title').fill('   ')

    const submitButton = page.getByRole('button', { name: 'Create Issue' })
    await expect(submitButton).toBeDisabled()
  })
})
