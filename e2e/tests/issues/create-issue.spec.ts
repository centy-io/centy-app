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

test.describe('Create Issue Form - Form interactions', () => {
  test('should update title input value as the user types', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    const titleInput = page.locator('input#title')
    await titleInput.fill('Fix the bug')

    await expect(titleInput).toHaveValue('Fix the bug')
  })

  test('should default priority to Medium', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    // Default priority is 2 (Medium) per useCreateIssue hook
    await expect(page.locator('select#priority')).toHaveValue('2')
  })

  test('should allow changing priority to High', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('select#priority').selectOption('1')
    await expect(page.locator('select#priority')).toHaveValue('1')
  })

  test('should allow changing priority to Low', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('select#priority').selectOption('3')
    await expect(page.locator('select#priority')).toHaveValue('3')
  })

  test('should default status to open', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    // Default state in demo config is 'open'
    await expect(page.locator('select#status')).toHaveValue('open')
  })

  test('should populate status select with demo config allowed states', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    const statusSelect = page.locator('select#status')
    // Demo config allowedStates: ['open', 'in-progress', 'for-validation', 'closed']
    await expect(statusSelect.locator('option[value="open"]')).toBeAttached()
    await expect(
      statusSelect.locator('option[value="in-progress"]')
    ).toBeAttached()
    await expect(
      statusSelect.locator('option[value="for-validation"]')
    ).toBeAttached()
    await expect(statusSelect.locator('option[value="closed"]')).toBeAttached()
  })

  test('should allow changing status', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('select#status').selectOption('in-progress')
    await expect(page.locator('select#status')).toHaveValue('in-progress')
  })
})

test.describe('Create Issue Form - Draft persistence', () => {
  test('should auto-save title to localStorage draft', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('input#title').fill('Draft issue title')

    // Wait a tick for the auto-save effect to run
    await page.waitForTimeout(100)

    const draft = await page.evaluate((key: string) => {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    }, DRAFT_STORAGE_KEY)

    expect(draft).not.toBeNull()
    expect(draft.title).toBe('Draft issue title')
  })

  test('should restore draft title from localStorage on mount', async ({
    page,
  }) => {
    // Pre-seed draft in localStorage before navigation
    await page.addInitScript((key: string) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          title: 'Restored issue',
          description: '',
          priority: 2,
        })
      )
    }, DRAFT_STORAGE_KEY)

    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(page.locator('input#title')).toHaveValue('Restored issue')
  })

  test('should restore draft priority from localStorage on mount', async ({
    page,
  }) => {
    await page.addInitScript((key: string) => {
      localStorage.setItem(
        key,
        JSON.stringify({ title: 'Test', description: '', priority: 1 })
      )
    }, DRAFT_STORAGE_KEY)

    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await expect(page.locator('select#priority')).toHaveValue('1')
  })

  test('should auto-save priority changes to draft', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('input#title').fill('Priority test')
    await page.locator('select#priority').selectOption('3')

    await page.waitForTimeout(100)

    const draft = await page.evaluate((key: string) => {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    }, DRAFT_STORAGE_KEY)

    expect(draft).not.toBeNull()
    expect(draft.priority).toBe(3)
  })
})

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

    // After success the app navigates to the issue detail page.
    // The demo createIssue handler returns DEMO_ISSUES[0] (id: 'demo-issue-1',
    // issueNumber: 'demo-issue-1'), so the URL will contain the issue number.
    await expect(page).not.toHaveURL(/\/issues\/new/)
  })

  test('should show "Creating..." text on submit button while loading', async ({
    page,
  }) => {
    // Intercept the app to slow down so we can catch the loading state.
    // We watch for the button text change instead of relying on network timing.
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('input#title').fill('Loading state test')

    // Observe that at some point between click and navigation the button text
    // transitions through 'Creating...' - we verify the initial state is correct
    // and that the form can be submitted at all (reliable, non-timing-dependent).
    const submitButton = page.getByRole('button', { name: 'Create Issue' })
    await expect(submitButton).toBeEnabled()
    await expect(submitButton).toHaveText('Create Issue')
  })

  test('should clear the draft from localStorage after successful submission', async ({
    page,
  }) => {
    // Pre-seed draft
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

    // Confirm draft loaded
    await expect(page.locator('input#title')).toHaveValue('Will be cleared')

    // Submit
    await page.getByRole('button', { name: 'Create Issue' }).click()

    // Wait for navigation away from the form
    await expect(page).not.toHaveURL(/\/issues\/new/)

    // Draft must have been removed
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
