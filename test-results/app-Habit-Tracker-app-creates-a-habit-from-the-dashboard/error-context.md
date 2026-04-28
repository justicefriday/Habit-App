# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Habit Tracker app >> creates a habit from the dashboard
- Location: tests\e2e\app.spec.ts:50:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="create-habit-button"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e13]:
    - textbox "Email" [ref=e14]
    - textbox "Password" [ref=e15]
    - button "Login" [ref=e16]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Habit Tracker app", () => {
  4  |   test("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
  5  |     await page.goto("/");
  6  | 
  7  |     await expect(page.getByTestId("splash-screen")).toBeVisible();
  8  | 
  9  |     await page.waitForURL("/login");
  10 |   });
  11 | 
  12 |   test("redirects authenticated users from / to /dashboard", async ({ page }) => {
  13 |     await page.goto("/login");
  14 | 
  15 |     await page.fill('[data-testid="auth-login-email"]', "test@mail.com");
  16 |     await page.fill('[data-testid="auth-login-password"]', "123456");
  17 |     await page.click('[data-testid="auth-login-submit"]');
  18 | 
  19 |     await page.goto("/");
  20 | 
  21 |     await page.waitForURL("/dashboard");
  22 |   });
  23 | 
  24 |   test("prevents unauthenticated access to /dashboard", async ({ page }) => {
  25 |     await page.goto("/dashboard");
  26 | 
  27 |     await page.waitForURL("/login");
  28 |   });
  29 | 
  30 |   test("signs up a new user and lands on the dashboard", async ({ page }) => {
  31 |     await page.goto("/signup");
  32 | 
  33 |     await page.fill('[data-testid="auth-signup-email"]', "new@mail.com");
  34 |     await page.fill('[data-testid="auth-signup-password"]', "123456");
  35 |     await page.click('[data-testid="auth-signup-submit"]');
  36 | 
  37 |     await page.waitForURL("/dashboard");
  38 |   });
  39 | 
  40 |   test("logs in an existing user and loads only that user's habits", async ({ page }) => {
  41 |     await page.goto("/login");
  42 | 
  43 |     await page.fill('[data-testid="auth-login-email"]', "new@mail.com");
  44 |     await page.fill('[data-testid="auth-login-password"]', "123456");
  45 |     await page.click('[data-testid="auth-login-submit"]');
  46 | 
  47 |     await page.waitForURL("/dashboard");
  48 |   });
  49 | 
  50 |   test("creates a habit from the dashboard", async ({ page }) => {
  51 |     await page.goto("/dashboard");
  52 | 
> 53 |     await page.click('[data-testid="create-habit-button"]');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  54 | 
  55 |     await page.fill('[data-testid="habit-name-input"]', "Drink Water");
  56 | 
  57 |     await page.click('[data-testid="habit-save-button"]');
  58 | 
  59 |     await expect(page.getByText("Drink Water")).toBeVisible();
  60 |   });
  61 | 
  62 |   test("completes a habit for today and updates the streak", async ({ page }) => {
  63 |     await page.goto("/dashboard");
  64 | 
  65 |     await page.click('[data-testid="habit-complete-drink-water"]');
  66 | 
  67 |     await expect(page.getByTestId("habit-streak-drink-water")).toContainText("1");
  68 |   });
  69 | 
  70 |   test("persists session and habits after page reload", async ({ page }) => {
  71 |     await page.goto("/dashboard");
  72 | 
  73 |     await page.reload();
  74 | 
  75 |     await expect(page.getByText("Drink Water")).toBeVisible();
  76 |   });
  77 | 
  78 |   test("logs out and redirects to /login", async ({ page }) => {
  79 |     await page.goto("/dashboard");
  80 | 
  81 |     await page.click('[data-testid="auth-logout-button"]');
  82 | 
  83 |     await page.waitForURL("/login");
  84 |   });
  85 | 
  86 |   test("loads the cached app shell when offline after the app has been loaded once", async ({ page, context }) => {
  87 |     await page.goto("/");
  88 | 
  89 |     await context.setOffline(true);
  90 | 
  91 |     await page.reload();
  92 | 
  93 |     await expect(page.getByTestId("splash-screen")).toBeVisible();
  94 |   });
  95 | });
```