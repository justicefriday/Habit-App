import { test as setup } from "@playwright/test";

setup("seed user", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    const user = {
      id: "test-user-id",
      email: "test@mail.com",
      password: "123456",
    };

    localStorage.setItem(
      "habit-tracker-users",
      JSON.stringify([user])
    );
  });
});