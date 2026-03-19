import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

test.describe('Issues Table Layout', () => {
  test('should display all expected columns', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    await expect(page.getByText('Implement dark mode toggle')).toBeVisible()

    // Verify all column headers are visible
    await expect(page.getByRole('columnheader', { name: '#' })).toBeVisible()
    await expect(
      page.getByRole('columnheader', { name: 'Title' })
    ).toBeVisible()
    await expect(
      page.getByRole('columnheader', { name: 'Status' })
    ).toBeVisible()
    await expect(
      page.getByRole('columnheader', { name: 'Priority' })
    ).toBeVisible()
    await expect(
      page.getByRole('columnheader', { name: 'Created' })
    ).toBeVisible()
    await expect(
      page.getByRole('columnheader', { name: 'Last Seen' })
    ).toBeVisible()
  })

  test('should have centered table container', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    await expect(page.getByText('Implement dark mode toggle')).toBeVisible()

    // Verify the issues-list container has equal auto margins (centered)
    const issuesList = page.locator('.issues-list')
    await expect(issuesList).toBeVisible()

    const { marginLeft, marginRight } = await issuesList.evaluate(el => {
      const style = getComputedStyle(el)
      return { marginLeft: style.marginLeft, marginRight: style.marginRight }
    })
    expect(marginLeft).toBe(marginRight)
  })
})

test.describe('Issues List', () => {
  test('should display list of issues', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    // Should display at least the first few demo issue titles
    await expect(page.getByText('Implement dark mode toggle')).toBeVisible()
    await expect(page.getByText('Fix login timeout issue')).toBeVisible()
  })

  test('should display issue metadata', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    // Should display status indicators (demo issues have various statuses)
    await expect(page.getByText(/open/i).first()).toBeVisible()
  })

  test('should display issue display numbers', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    // Should display issue numbers (use button role which wraps the issue number)
    await expect(
      page.getByRole('button', { name: '#1', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: '#2', exact: true })
    ).toBeVisible()
  })

  test('should navigate to issue detail when clicking on an issue', async ({
    page,
  }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues')

    // Click on the first demo issue
    await page.getByText('Implement dark mode toggle').click()

    // Should navigate to issue detail page
    await expect(page).toHaveURL(/\/issues\//)
  })
})
