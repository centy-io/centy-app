import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

// Draft storage key mirrors getDraftStorageKey('issue', '/demo/centy-showcase')
const DRAFT_STORAGE_KEY = 'centy-draft-issue-/demo/centy-showcase'

test.describe('Create Issue Form - Page rendering (basic elements)', () => {
  test('should render the create issue page heading', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(
      page.getByRole('heading', { name: 'Create New Issue', level: 2 })
    ).toBeVisible()
  })

  test('should render the create issue form', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(page.locator('form.create-issue-form')).toBeVisible()
  })

  test('should render the title input with correct placeholder', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    const titleInput = page.locator('input#title')
    await expect(titleInput).toBeVisible()
    await expect(titleInput).toHaveAttribute('placeholder', 'Issue title')
  })

  test('should render the priority select with all options', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    const prioritySelect = page.locator('select#priority')
    await expect(prioritySelect).toBeVisible()

    await expect(prioritySelect.locator('option[value="1"]')).toContainText(
      'High'
    )
    await expect(prioritySelect.locator('option[value="2"]')).toContainText(
      'Medium'
    )
    await expect(prioritySelect.locator('option[value="3"]')).toContainText(
      'Low'
    )
  })
})

test.describe('Create Issue Form - Page rendering (fields)', () => {
  test('should render the status select', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(page.locator('select#status')).toBeVisible()
  })

  test('should render the description editor container', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    // The TextEditor renders inside a .form-group after the label
    await expect(
      page.locator('.form-group').filter({ hasText: 'Description' })
    ).toBeVisible()
    await expect(page.locator('.text-editor')).toBeVisible()
  })

  test('should render Cancel and Create Issue buttons', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Create Issue' })
    ).toBeVisible()
  })

  test('should render form group labels', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(
      page.locator('.form-label').filter({ hasText: 'Title' })
    ).toBeVisible()
    await expect(
      page.locator('.form-label').filter({ hasText: 'Description' })
    ).toBeVisible()
    await expect(
      page.locator('.form-label').filter({ hasText: 'Priority' })
    ).toBeVisible()
    await expect(
      page.locator('.form-label').filter({ hasText: 'Status' })
    ).toBeVisible()
  })
})
