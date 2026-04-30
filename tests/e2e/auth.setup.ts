import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../.auth/user.json");

setup("seed user", async ({ page }) => {
  await page.goto("/signup");

  await page.fill('[data-testid="auth-signup-email"]', "test@mail.com");
  await page.fill('[data-testid="auth-signup-password"]', "123456");
  await page.click('[data-testid="auth-signup-submit"]');

  await page.waitForURL("/dashboard");

  // Save the storage state (localStorage session) for other tests to reuse
  await page.context().storageState({ path: authFile });
});