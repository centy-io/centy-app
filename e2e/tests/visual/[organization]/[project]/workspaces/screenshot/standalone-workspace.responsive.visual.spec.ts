import { test, expect } from '@playwright/test'

async function setupDemoWithProject(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('centy_demo_mode', 'true')
  })
  await page.goto('/issues?org=demo-org&project=%2Fdemo%2Fcenty-showcase')
  await page.waitForLoadState('domcontentloaded')
  await expect(page.locator('.demo-mode-indicator')).toBeVisible()
  await expect(page.locator('text=Implement dark mode toggle')).toBeVisible()
}

test.describe('Standalone Workspace Modal Dark Theme Visual Tests @visual', () => {
  test('standalone workspace modal - dark theme', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.emulateMedia({ colorScheme: 'dark' })
    await setupDemoWithProject(page)

    await page.getByRole('button', { name: '+ New Workspace' }).click()
    await expect(page.locator('.standalone-modal-overlay')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot('standalone-workspace-modal-dark.png', {
      fullPage: true,
    })
  })
})

test.describe('Standalone Workspace Modal Responsive Visual Tests @visual', () => {
  test('standalone workspace modal - mobile viewport', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.setViewportSize({ width: 375, height: 667 })
    await setupDemoWithProject(page)

    await page.getByRole('button', { name: '+ New Workspace' }).click()
    await expect(page.locator('.standalone-modal-overlay')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'standalone-workspace-modal-mobile.png',
      { fullPage: true }
    )
  })

  test('standalone workspace modal - tablet viewport', async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      'mobile-not-supported overlay prevents click interactions'
    )
    await page.setViewportSize({ width: 768, height: 1024 })
    await setupDemoWithProject(page)

    await page.getByRole('button', { name: '+ New Workspace' }).click()
    await expect(page.locator('.standalone-modal-overlay')).toBeVisible()
    await page.waitForTimeout(300)

    await expect(page).toHaveScreenshot(
      'standalone-workspace-modal-tablet.png',
      { fullPage: true }
    )
  })
})
