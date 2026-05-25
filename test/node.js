const { test, expect } = require('@playwright/test');

test('facebook login test', async ({ page }) => {

  await page.goto('https://www.facebook.com/login');

  await page.fill('#email', 'your_email_here');
  await page.fill('#pass', 'your_password_here');

  await page.click('button[name="login"]');

  // check if login succeeded (URL changed)
  await expect(page).not.toHaveURL(/login/);
});