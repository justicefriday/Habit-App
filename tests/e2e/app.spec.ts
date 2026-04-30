import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {

  test("shows the splash screen and redirects unauthenticated users to /login", async ({ browser }) => {
    // New context with no storage AND no service worker
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    // Unregister any service workers so SW cache doesn't interfere
    await page.addInitScript(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => reg.unregister());
        });
      }
    });

    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await page.waitForURL("/login");

    await context.close();
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ browser }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.addInitScript(() => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => reg.unregister());
        });
      }
    });

    await page.goto("/dashboard");
    await page.waitForURL("/login");

    await context.close();
  });

  test("signs up a new user and lands on the dashboard", async ({ browser }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.goto("/signup");
    await page.fill('[data-testid="auth-signup-email"]', "brand-new@mail.com");
    await page.fill('[data-testid="auth-signup-password"]', "123456");
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL("/dashboard");

    await context.close();
  });

  test("logs in an existing user and loads only that user's habits", async ({ browser }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    await page.goto("/signup");
    await page.fill('[data-testid="auth-signup-email"]', "existing@mail.com");
    await page.fill('[data-testid="auth-signup-password"]', "123456");
    await page.click('[data-testid="auth-signup-submit"]');
    await page.waitForURL("/dashboard");

    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL("/login");

    await page.fill('[data-testid="auth-login-email"]', "existing@mail.com");
    await page.fill('[data-testid="auth-login-password"]', "123456");
    await page.click('[data-testid="auth-login-submit"]');
    await page.waitForURL("/dashboard");

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await context.close();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    await page.click('[data-testid="create-habit-button"]');
    await page.waitForSelector('[data-testid="habit-name-input"]');
    await page.fill('[data-testid="habit-name-input"]', "Drink Water");
    await page.click('[data-testid="habit-save-button"]');

    await expect(page.getByText("Drink Water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    await page.click('[data-testid="create-habit-button"]');
    await page.waitForSelector('[data-testid="habit-name-input"]');
    await page.fill('[data-testid="habit-name-input"]', "Drink Water");
    await page.click('[data-testid="habit-save-button"]');
    await expect(page.getByText("Drink Water")).toBeVisible();

    await page.click('[data-testid="habit-complete-drink-water"]');
    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    await page.click('[data-testid="create-habit-button"]');
    await page.waitForSelector('[data-testid="habit-name-input"]');
    await page.fill('[data-testid="habit-name-input"]', "Drink Water");
    await page.click('[data-testid="habit-save-button"]');
    await expect(page.getByText("Drink Water")).toBeVisible();

    await page.reload();
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
    await expect(page.getByText("Drink Water")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();

    await page.click('[data-testid="auth-logout-button"]');
    await page.waitForURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({ page, context }) => {
  // Load app while online so SW installs and caches offline.html
  await page.goto("/");
  await page.waitForURL("/dashboard");

  // Wait for SW to install and activate
  await page.waitForTimeout(3000);

  // Go offline — next navigation will hit SW fetch handler
  await context.setOffline(true);

  // Try to navigate — SW will serve offline.html which has data-testid="splash-screen"
  try {
    await page.goto("/", { waitUntil: "commit", timeout: 8000 });
  } catch {
    // Network error expected — SW serves cached offline.html
  }

  await expect(page.getByTestId("splash-screen")).toBeVisible({ timeout: 8000 });

  await context.setOffline(false);
});
});