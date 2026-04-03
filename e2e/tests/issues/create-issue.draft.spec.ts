import { test, expect } from '@playwright/test'
import { setupDemoMode, navigateToDemoProject } from '../../utils/test-helpers'

interface DraftIssue {
  title: string
  description: string
  priority: number
}

const DRAFT_STORAGE_KEY = 'centy-draft-issue-/demo/centy-showcase'

test.describe('Create Issue Form - Draft persistence', () => {
  test('should auto-save title to localStorage draft', async ({ page }) => {
    await setupDemoMode(page)
    await navigateToDemoProject(page, '/issues/new')

    await page.locator('input#title').fill('Draft issue title')
    await page.waitForTimeout(100)

    const draft = await page.evaluate<DraftIssue | null>((key: string) => {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(raw)
    }, DRAFT_STORAGE_KEY)

    expect(draft).not.toBeNull()
    if (!draft) return
    expect(draft.title).toBe('Draft issue title')
  })

  test('should restore draft title from localStorage on mount', async ({
    page,
  }) => {
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

    const draft = await page.evaluate<DraftIssue | null>((key: string) => {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(raw)
    }, DRAFT_STORAGE_KEY)

    expect(draft).not.toBeNull()
    if (!draft) return
    expect(draft.priority).toBe(3)
  })
})
