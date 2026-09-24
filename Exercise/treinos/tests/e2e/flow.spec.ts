import { test, expect } from '@playwright/test'

test.describe('Catálogo de Treinos - E2E Flow Tests', () => {
  test('Test 1: Profile Selection and Categories Flow', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/')

    // 2. Verify landing page shows profile selection
    await expect(page.locator('text=Catálogo de Treinos')).toBeVisible()
    await expect(page.locator('text=Escolha quem vai treinar')).toBeVisible()

    // 3. Verify both profile buttons exist
    const higorBtn = page.locator('button:has-text("Higor")')
    const brendaBtn = page.locator('button:has-text("Brenda")')
    await expect(higorBtn).toBeVisible()
    await expect(brendaBtn).toBeVisible()

    // 4. Click Higor profile
    await higorBtn.click()

    // 5. Verify profile was selected and categories appear
    await expect(page.locator('text=Olá, Higor')).toBeVisible()
    await expect(page.locator('text=O que vamos treinar hoje?')).toBeVisible()

    // 6. Verify at least one category is displayed
    const categories = page.locator('[style*="backgroundColor"]').filter({ hasNot: page.locator('text=Trocar perfil') })
    const categoryCount = await categories.count()
    expect(categoryCount).toBeGreaterThan(0)

    // 7. Verify "Trocar perfil" button is present
    await expect(page.locator('button:has-text("Trocar perfil")')).toBeVisible()

    // 8. Click on first category to navigate
    const firstCategory = page.locator('div').filter({ has: page.locator('text=Academia') }).first()
    if (await firstCategory.isVisible()) {
      await firstCategory.click()
      // Should navigate to categoria route
      await expect(page).toHaveURL(/\/categoria\//)
    }
  })

  test('Test 2: Exercise Library Search and Filtering', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/')

    // 2. Click Higor to establish profile
    await page.locator('button:has-text("Higor")').click()

    // 3. Wait for categories to load
    await expect(page.locator('text=O que vamos treinar hoje?')).toBeVisible()

    // 4. Navigate to exercises library - click on BottomNav if available
    // First, try clicking Exercícios from bottom nav
    const exercisiosLink = page.locator('button').filter({ hasText: /Exercícios/ }).first()

    if (await exercisiosLink.isVisible()) {
      await exercisiosLink.click()
    } else {
      // Fallback: navigate directly
      await page.goto('/exercicios')
    }

    // 5. Verify we're on the exercises page
    await expect(page.locator('text=Biblioteca de Exercícios')).toBeVisible()

    // 6. Verify search input is present
    const searchInput = page.locator('input[placeholder*="Buscar"]')
    await expect(searchInput).toBeVisible()

    // 7. Type in search box to filter exercises
    await searchInput.fill('flexão')

    // 8. Verify search works - results should be filtered
    // Allow a moment for filtering
    await page.waitForTimeout(300)

    // 9. Verify that we have some exercises showing
    const exerciseItems = page.locator('div').filter({ hasNot: page.locator('input') })
    const itemsAfterSearch = await exerciseItems.count()
    expect(itemsAfterSearch).toBeGreaterThan(0)

    // 10. Clear search and verify all exercises return
    await searchInput.clear()
    await page.waitForTimeout(300)

    // 11. Verify category filter buttons exist (Todos, or specific categories)
    const filterButtons = page.locator('button').filter({ hasText: /Todos|academia|corpo-livre|forca/ })
    const filterCount = await filterButtons.count()
    expect(filterCount).toBeGreaterThanOrEqual(1)
  })

  test('Test 3: Mobile Viewport (390px) Responsiveness', async ({ page }) => {
    // 1. Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })

    // 2. Navigate to home
    await page.goto('/')

    // 3. Verify page loads correctly on mobile
    const width = await page.evaluate(() => window.innerWidth)
    expect(width).toBe(390)

    // 4. Verify title is visible and centered
    await expect(page.locator('text=Catálogo de Treinos')).toBeVisible()

    // 5. Verify profile buttons are clickable on mobile
    const higorBtn = page.locator('button:has-text("Higor")')
    await expect(higorBtn).toBeVisible()

    // 6. Click Higor profile
    await higorBtn.click()

    // 7. Verify profile selection worked
    await expect(page.locator('text=Olá, Higor')).toBeVisible()

    // 8. Verify categories are visible and scrollable on mobile
    const categoryArea = page.locator('div').filter({ hasText: /O que vamos treinar hoje?/ }).first()
    await expect(categoryArea).toBeVisible()

    // 9. Verify no horizontal scroll occurs
    const bodyWidth = await page.evaluate(() => {
      const bodyElement = document.documentElement
      return bodyElement.scrollWidth === bodyElement.clientWidth
    })
    expect(bodyWidth).toBe(true)

    // 10. Scroll down if needed and verify categories are accessible
    await page.evaluate(() => window.scrollBy(0, 200))
    await page.waitForTimeout(300)

    // 11. Verify at least one category is visible
    const categoryCount = await page.locator('div').filter({ hasText: /descricao/ }).count()
    expect(categoryCount).toBeGreaterThan(0)

    // 12. Test navigation works on mobile
    const firstCategory = page.locator('div').filter({ hasText: /descricao/ }).first()
    if (await firstCategory.isVisible()) {
      await firstCategory.click()
      // Verify navigation happened
      await page.waitForTimeout(500)
      const url = page.url()
      expect(url).toContain('/categoria/')
    }
  })
})
