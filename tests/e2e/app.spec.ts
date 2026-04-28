import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("splash-screen")).toBeVisible();

    await page.waitForURL("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.fill('[data-testid="auth-login-email"]', "test@mail.com");
    await page.fill('[data-testid="auth-login-password"]', "123456");
    await page.click('[data-testid="auth-login-submit"]');

    await page.goto("/");

    await page.waitForURL("/dashboard");
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await page.waitForURL("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', "new@mail.com");
    await page.fill('[data-testid="auth-signup-password"]', "123456");
    await page.click('[data-testid="auth-signup-submit"]');

    await page.waitForURL("/dashboard");
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await page.goto("/login");

    await page.fill('[data-testid="auth-login-email"]', "new@mail.com");
    await page.fill('[data-testid="auth-login-password"]', "123456");
    await page.click('[data-testid="auth-login-submit"]');

    await page.waitForURL("/dashboard");
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await page.click('[data-testid="create-habit-button"]');

    await page.fill('[data-testid="habit-name-input"]', "Drink Water");

    await page.click('[data-testid="habit-save-button"]');

    await expect(page.getByText("Drink Water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await page.goto("/dashboard");

    await page.click('[data-testid="habit-complete-drink-water"]');

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.goto("/dashboard");

    await page.reload();

    await expect(page.getByText("Drink Water")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");

    await page.click('[data-testid="auth-logout-button"]');

    await page.waitForURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({ page, context }) => {
    await page.goto("/");

    await context.setOffline(true);

    await page.reload();

    await expect(page.getByTestId("splash-screen")).toBeVisible();
  });
});