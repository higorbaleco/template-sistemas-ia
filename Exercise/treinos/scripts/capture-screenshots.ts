import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOT_DIR = 'docs/screenshots';
const BASE_URL = 'http://localhost:3001';

async function captureScreenshots() {
  const browser = await chromium.launch();

  try {
    // Create screenshots directory
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    // Mobile viewport (iPhone 12)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    });

    const mobilePage = await mobileContext.newPage();

    console.log('🚀 Starting screenshot capture...\n');

    // Navigate to app
    console.log('⏳ Loading app at', BASE_URL);
    await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(2000);

    // Screenshot 1: Home Screen
    console.log('📸 Screen 1: Home (Profile Selection)');
    await mobilePage.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-home-profile-selection.png'),
      fullPage: true,
    });
    console.log('   ✅ Saved: 01-home-profile-selection.png\n');

    // Screenshot 2: Select a workout and go to categories
    console.log('📸 Screen 2: Categoria (Categories)');
    const workoutButtons = mobilePage.locator('button:has-text("Ver Treino")');
    const count = await workoutButtons.count();
    if (count > 0) {
      await workoutButtons.first().click();
      await mobilePage.waitForTimeout(2000);
      await mobilePage.screenshot({
        path: path.join(SCREENSHOT_DIR, '02-categoria-categories.png'),
        fullPage: true,
      });
      console.log('   ✅ Saved: 02-categoria-categories.png\n');
    }

    // Screenshot 3: Expand a category to show exercises
    console.log('📸 Screen 3: Treino (Workout Details)');
    const categoryButtons = mobilePage.locator('[role="button"]').filter({ hasText: /Aquecimento|Força|Core/ }).first();
    if (await categoryButtons.isVisible()) {
      await categoryButtons.click();
      await mobilePage.waitForTimeout(1500);
      await mobilePage.screenshot({
        path: path.join(SCREENSHOT_DIR, '03-treino-workout-details.png'),
        fullPage: true,
      });
      console.log('   ✅ Saved: 03-treino-workout-details.png\n');
    }

    // Screenshot 4: Navigate to Exercícios (Library)
    console.log('📸 Screen 4: Library/Exercícios (Exercise Search)');

    // Go back to home first
    const homeLinks = mobilePage.locator('a:has-text("Home"), [data-testid="nav-home"]').first();
    if (await homeLinks.isVisible({ timeout: 5000 }).catch(() => false)) {
      await homeLinks.click();
      await mobilePage.waitForTimeout(1500);
    }

    // Navigate to library
    const libraryLinks = mobilePage.locator('a:has-text("Exercícios"), [data-testid="nav-exercicios"]');
    const libCount = await libraryLinks.count();
    if (libCount > 0) {
      await libraryLinks.first().click();
      await mobilePage.waitForTimeout(2000);
      await mobilePage.screenshot({
        path: path.join(SCREENSHOT_DIR, '04-library-exercise-search.png'),
        fullPage: true,
      });
      console.log('   ✅ Saved: 04-library-exercise-search.png\n');
    }

    // Desktop screenshots for comparison
    console.log('📸 Screen 5: Desktop View (1200px)');
    const desktopContext = await browser.newContext({
      viewport: { width: 1200, height: 800 }
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(2000);
    await desktopPage.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-desktop-responsive.png'),
      fullPage: true,
    });
    console.log('   ✅ Saved: 05-desktop-responsive.png\n');
    await desktopContext.close();

    await mobileContext.close();

    console.log('✅ All screenshots captured successfully!\n');
    console.log('📁 Screenshot location:', path.resolve(SCREENSHOT_DIR));

  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

captureScreenshots();
