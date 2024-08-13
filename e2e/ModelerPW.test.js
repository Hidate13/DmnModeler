// tests/dmn-modeler.test.js
import { test, expect } from '@playwright/test';

test.describe('DMN Modeler Component', () => {
  test('should render the DMN modeler canvas', async ({ page }) => {
    await page.goto('http://localhost:5173'); // Adjust the URL if needed

    // Check if the canvas element exists
    const canvas = await page.locator('#canvas');
    await expect(canvas).toBeVisible();
  });


  test('should export diagram on button click', async ({ page }) => {
    await page.goto('http://localhost:5173'); // Adjust the URL if needed

    // Click the export button
    await page.click('#save-button');

    // Check console logs or other effects of the export action
    // Playwright doesn't directly capture console logs in tests, but you can
    // check if the action was triggered correctly, e.g., by checking for specific UI changes
    const consoleMessage = await page.evaluate(() => {
      return new Promise(resolve => {
        const handler = (msg) => {
          resolve(msg);
          console.removeEventListener('message', handler);
        };
        console.addEventListener('message', handler);
        console.log('Exported');
      });
    });
    expect(consoleMessage).toContain('DIAGRAM');
  });

  test('should save diagram as JSON', async ({ page }) => {
    await page.goto('http://localhost:5173'); // Adjust the URL if needed

    // Click the save as JSON button
    await page.click('#save-json-button');

    // Check for file download or related UI changes
    // Playwright provides APIs to handle downloads
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#save-json-button'),
    ]);
    
    // Check if the downloaded file is in JSON format
    expect(download.suggestedFilename()).toBe('diagram.json');
    const fileContent = await download.path();
    const content = require('fs').readFileSync(fileContent, 'utf8');
    expect(content).toContain('xml'); // Check if XML is present in JSON
  });
});
