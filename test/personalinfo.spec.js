const {test, expect} = require ('@playwright/test');

test.afterAll (async () => {
    console.log ("Done Testing")
});

test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.locator("//button[normalize-space()='Login']").click();

    await expect(page).toHaveURL(/dashboard/);
});

test('Personal Info', async ({ page }) => {
    await page.getByText('My Info').click();
    await expect(page).toHaveURL(/viewPersonalDetails/);

    await page.getByPlaceholder('First Name').fill("Eisen")
    await page.getByPlaceholder('Middle Name').fill("Luffy")
    await page.getByPlaceholder('Last Name').fill("Ace")

    await page.locator("(//button[@type='submit'][normalize-space()='Save'])[1]").click();
});
