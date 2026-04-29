# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Habit Tracker app >> creates a habit from the dashboard
- Location: tests\e2e\app.spec.ts:61:7

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
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Habit Tracker app", () => {
  4   | 
  5   |   test("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
  6   |     await page.goto("/");
  7   | 
  8   |     await expect(page.getByTestId("splash-screen")).toBeVisible();
  9   | 
  10  |     await page.waitForURL("/login");
  11  |   });
  12  | 
  13  |   // ✅ FIXED: do NOT login here — setup already logged in
  14  |   test("redirects authenticated users from / to /dashboard", async ({ page }) => {
  15  |     await page.goto("/");
  16  | 
  17  |     await page.waitForURL("/dashboard");
  18  |   });
  19  | 
  20  |   test("prevents unauthenticated access to /dashboard", async ({ page }) => {
  21  |     await page.goto("/");
  22  | 
  23  |     // ✅ clear session before testing
  24  |     await page.evaluate(() => {
  25  |       localStorage.removeItem("habit-tracker-session");
  26  |     });
  27  | 
  28  |     await page.goto("/dashboard");
  29  | 
  30  |     await page.waitForURL("/login");
  31  |   });
  32  | 
  33  |   test("signs up a new user and lands on the dashboard", async ({ page }) => {
  34  |     await page.goto("/signup");
  35  | 
  36  |     await page.fill('[data-testid="auth-signup-email"]', "new@mail.com");
  37  |     await page.fill('[data-testid="auth-signup-password"]', "123456");
  38  | 
  39  |     await page.click('[data-testid="auth-signup-submit"]');
  40  | 
  41  |     await page.waitForURL("/dashboard");
  42  |   });
  43  | 
  44  |   // ✅ FIXED: ensure no session before login
  45  |   test("logs in an existing user and loads only that user's habits", async ({ page }) => {
  46  |     await page.goto("/login");
  47  | 
  48  |     await page.evaluate(() => {
  49  |       localStorage.removeItem("habit-tracker-session");
  50  |     });
  51  | 
  52  |     await page.fill('[data-testid="auth-login-email"]', "test@mail.com");
  53  |     await page.fill('[data-testid="auth-login-password"]', "123456");
  54  | 
  55  |     await page.click('[data-testid="auth-login-submit"]');
  56  | 
  57  |     await page.waitForURL("/dashboard");
  58  |   });
  59  | 
  60  |   // ✅ FIXED: wait for form to appear
  61  |   test("creates a habit from the dashboard", async ({ page }) => {
  62  |     await page.goto("/dashboard");
  63  | 
> 64  |     await page.click('[data-testid="create-habit-button"]');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  65  | 
  66  |     await page.waitForSelector('[data-testid="habit-name-input"]');
  67  | 
  68  |     await page.fill('[data-testid="habit-name-input"]', "Drink Water");
  69  | 
  70  |     await page.click('[data-testid="habit-save-button"]');
  71  | 
  72  |     await expect(page.getByText("Drink Water")).toBeVisible();
  73  |   });
  74  | 
  75  |   test("completes a habit for today and updates the streak", async ({ page }) => {
  76  |     await page.goto("/dashboard");
  77  | 
  78  |     await page.click('[data-testid="habit-complete-drink-water"]');
  79  | 
  80  |     await expect(
  81  |       page.getByTestId("habit-streak-drink-water")
  82  |     ).toContainText("1");
  83  |   });
  84  | 
  85  |   test("persists session and habits after page reload", async ({ page }) => {
  86  |     await page.goto("/dashboard");
  87  | 
  88  |     await page.reload();
  89  | 
  90  |     await expect(page.getByText("Drink Water")).toBeVisible();
  91  |   });
  92  | 
  93  |   test("logs out and redirects to /login", async ({ page }) => {
  94  |     await page.goto("/dashboard");
  95  | 
  96  |     await page.click('[data-testid="auth-logout-button"]');
  97  | 
  98  |     await page.waitForURL("/login");
  99  |   });
  100 | 
  101 |   // ✅ SKIPPED (no PWA yet)
  102 |   test.skip("loads the cached app shell when offline after the app has been loaded once", async () => {});
  103 | });
```