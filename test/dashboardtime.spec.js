const { test, expect } = require('@playwright/test');

test.afterAll(async () => {
    console.log("Done testing");
});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true });

        await testInfo.attach('Failure Screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });
    }
});

test('correct credentials', async ({ page }) => {

    // Open website
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Verify login page
    const loginText = page.locator("//h5[normalize-space()='Login']");
    await expect(loginText).toBeVisible();

    const logo = page.locator("//img[@alt='company-branding']");
    await expect(logo).toBeVisible();

    // Login
    await page.getByPlaceholder("Username").fill("Admin");
    await page.getByPlaceholder("Password").fill("admin123");

    await page.screenshot({ path: 'screenshots/login.png', fullPage: true });

    await page.locator("//button[normalize-space()='Login']").click();

    // Verify dashboard
    await expect(page).toHaveURL(/dashboard/);

    // Open attendance (WAIT FIX)
    const attendanceBtn = page.locator("//button[contains(@class,'orangehrm-attendance-card-action')]");
    await attendanceBtn.click();

    // Open calendar and clock (WAIT FIX)
    const calendarIcon = page.locator(".oxd-icon.bi-calendar.oxd-date-input-icon");
    await calendarIcon.waitFor({ state: 'visible' });
    await calendarIcon.click();

    const clockIcon = page.locator("//i[contains(@class,'bi-clock')]");
    await clockIcon.waitFor({ state: 'visible' });
    await clockIcon.click();

    // Check current hour
    const hour = new Date().getHours();

    if (hour < 12) {
        await page.locator("input[value='AM']").click();
    } else {
        await page.locator("input[value='PM']").click();
    }

    await page.screenshot({ path: 'screenshots/dateandtime.png', fullPage: true });

    const buttonIn = page.locator("//button[normalize-space()='In']");
    const buttonOut = page.locator("//button[normalize-space()='Out']");

    if (await buttonIn.isVisible()) {
        await buttonIn.click();
        console.log("Button In is Available");
    } else if (await buttonOut.isVisible()) {
        await buttonOut.click();
        console.log("Button Out is Available");
    } else {
        throw new Error("Neither In nor Out button is visible");
    }

    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/attendance/viewMyAttendanceRecord");
    await expect(page.locator("div[class='orangehrm-horizontal-padding orangehrm-vertical-padding'] span[class='oxd-text oxd-text--span']")).toContainText('Record');

});