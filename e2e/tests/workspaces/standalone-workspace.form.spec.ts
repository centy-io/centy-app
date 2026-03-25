import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

test.describe.serial('Standalone Workspace Modal - Form interaction', () => {
  test('should allow entering workspace name and description', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await page.getByRole('button', { name: '+ New Workspace' }).click()

    await page.getByLabel('Name (optional)').fill('My Test Workspace')
    await page
      .getByLabel('Description (optional)')
      .fill('Testing the new workspace feature')

    await expect(page.getByLabel('Name (optional)')).toHaveValue(
      'My Test Workspace'
    )
    await expect(page.getByLabel('Description (optional)')).toHaveValue(
      'Testing the new workspace feature'
    )
  })

  test('should have Create Workspace button', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    await expect(page.locator('.demo-mode-indicator')).toBeVisible()
    await page.getByRole('button', { name: '+ New Workspace' }).click()

    const createBtn = page.getByRole('button', { name: 'Create Workspace' })
    await expect(createBtn).toBeVisible()
    await expect(createBtn).toBeEnabled()
  })
})
