import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = 'docs/screenshots';
const BASE_URL = 'http://localhost:5173';

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.createContext({
    viewport: { width: 390, height: 844 }, // iPhone SE viewport
  });

  const page = await context.newPage();

  try {
    console.log('Taking screenshots...');

    // Wait for app to load
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Screenshot 1: Home Screen (Profile Selection)
    console.log('📸 Capturing Home screen...');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-home-screen.png'),
      fullPage: true,
    });

    // Screenshot 2: Categoria Screen (Categories)
    console.log('📸 Capturing Categories screen...');
    // Click first workout to go to categories
    const firstWorkoutButton = page.locator('button:has-text("Ver Treino")').first();
    if (await firstWorkoutButton.isVisible()) {
      await firstWorkoutButton.click();
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '02-categories-screen.png'),
        fullPage: true,
      });
    }

    // Screenshot 3: Treino Screen (Workout Details)
    console.log('📸 Capturing Workout Details screen...');
    // Click first category to expand
    const firstCategory = page.locator('[role="button"]:has-text("Aquecimento")').first();
    if (await firstCategory.isVisible()) {
      await firstCategory.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '03-treino-screen.png'),
        fullPage: true,
      });
    }

    // Screenshot 4: Library Screen (Exercise Search)
    console.log('📸 Capturing Library/Search screen...');
    // Go back to home
    const homeNav = page.locator('a:has-text("Home"), button:has-text("Home")').first();
    if (await homeNav.isVisible()) {
      await homeNav.click();
      await page.waitForTimeout(1000);
    }

    // Click on Exercícios/Library nav
    const libraryNav = page.locator('a:has-text("Exercícios")').first();
    if (await libraryNav.isVisible()) {
      await libraryNav.click();
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, '04-library-screen.png'),
        fullPage: true,
      });
    }

    console.log(`✅ Screenshots saved to ${SCREENSHOT_DIR}/`);
    console.log('   - 01-home-screen.png');
    console.log('   - 02-categories-screen.png');
    console.log('   - 03-treino-screen.png');
    console.log('   - 04-library-screen.png');

  } catch (error) {
    console.error('❌ Error taking screenshots:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

takeScreenshots().catch(console.error);
