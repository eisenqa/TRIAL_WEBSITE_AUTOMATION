const { test, expect } = require('@playwright/test');



test.afterAll(async ()=>{ 
    console.log("Done Testing")
});

// this will give screenshot on error

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true });

        await testInfo.attach('Failure Screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
    }
});

//valid credentials here

test('correct credentials', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    const loginText = page.locator("//h5[normalize-space()='Login']");
    await expect(loginText).toBeVisible();

    const logo = page.locator("//img[@alt='company-branding']");
    await expect(logo).toBeVisible();

    await page.getByPlaceholder("Username").fill("Admin");
    await page.getByPlaceholder("Password").fill("admin123");

    await page.screenshot({ path: 'screenshots/login.png', fullPage: true });

    await page.locator("//button[normalize-space()='Login']").click();

    await expect(page).toHaveURL(/dashboard/);

    await page.screenshot({ path: 'screenshots/dashboard.png', fullPage: true });

    await page.getByAltText("profile picture").first().click();
    await page.getByText("Logout").click();
});


// invalid credentials here

test('invalid credentials', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.getByPlaceholder("Username").fill("unknown");
    await page.getByPlaceholder("Password").fill("qwerty123"); // FIXED typo

    await page.locator("//button[normalize-space()='Login']").click();

    const errorLocator = page.locator("//p[contains(@class,'oxd-alert-content-text')]");

    await expect(errorLocator).toBeVisible();

    const errormessage = await errorLocator.textContent();

    console.log("Error message is:", errormessage);

    expect(errormessage.includes("Invalid credentials")).toBeTruthy();
});


test('invalid username + correct password', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.getByPlaceholder("Username").fill("Admin");
    await page.getByPlaceholder("Password").fill("qwert123");

    await page.locator("//button[normalize-space()='Login']").click();

    const errorLocator = page.locator("//p[contains(@class,'oxd-alert-content-text')]");

    await expect(errorLocator).toBeVisible();

    const errormessage = await errorLocator.textContent();

    console.log("Error message is:", errormessage);

    expect(errormessage.includes("Invalid credentials")).toBeTruthy();
});


test('invalid password + correct username', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.getByPlaceholder("Username").fill("eisen");
    await page.getByPlaceholder("Password").fill("admin123");

    await page.locator("//button[normalize-space()='Login']").click();

    const errorLocator = page.locator("//p[contains(@class,'oxd-alert-content-text')]");

    await expect(errorLocator).toBeVisible();

    const errormessage = await errorLocator.textContent();

    console.log("Error message is:", errormessage);

    expect(errormessage.includes("Invalid credentials")).toBeTruthy();
});