// tests/dmn-modeler.test.js
import { test, expect } from '@playwright/test';
import fs from 'fs';  
import path from 'path';


const filePath = path.join(process.cwd(), 'MyDiagram.dmn');

test.describe('DMN Modeler Component', () => {
  // Setup and teardown hooks
  test.beforeEach(async ({ page }) => {
    // Navigate to the application URL before each test
    await page.goto('http://localhost:5173');
  });

  test.afterEach(async () => {
    // await page.context().clearCookies();
    // await page.evaluate(() => localStorage.clear());
  });


  test('should render the DMN modeler canvas', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check if the canvas element exists
    const canvas = await page.locator('#canvas');
    await expect(canvas).toBeVisible();
  });


  test('should export diagram on button click', async ({ page }) => {
    await page.goto('http://localhost:5173'); // Adjust the URL if needed
  
    // Capture console logs
    const consoleMessages = [];
    page.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
  
    // Capture network requests for debugging
    page.on('response', async (response) => {
      const status = response.status();
      if (status < 300 || status >= 400) { // Ignore redirect responses
        const body = await response.body().catch(() => null);
        if (body) {
          console.log('Response Body:', body.toString());
        }
      }


    });
  
    // Ensure DMN Modeler has a default or loaded diagram
    // Simulate actions to ensure the modeler is ready if needed
  
    // Click the export button
    await page.click('#save-button'); // Adjust the selector if needed
  
    // Wait for a bit to ensure the log message is captured
    await page.waitForTimeout(5000); // Adjust the wait time if needed
  
    // Check all console messages
    const logMessages = consoleMessages.join(' ');
    expect(logMessages).toContain('DIAGRAM');
  });
  

// Import fs at the top of your test file

test('should save diagram as JSON', async ({ page }) => {
  // Navigate to your page or perform setup actions
  await page.goto('http://localhost:5173'); // Adjust URL as necessary

  // Trigger the save as JSON action
  await page.click('#save-json-button');

  // Wait for the download and save it to a temporary location
  const [download] = await Promise.all([
    page.waitForEvent('download'), // Wait for the download event
    page.click('#save-json-button') // Click the button to start the download
  ]);

  const filePathSaveAs = path.join(process.cwd(), 'MyDiagram.json');
  // Save the downloaded file
  await download.saveAs(filePathSaveAs);

  // Read and parse the file content
  const content = fs.readFileSync(filePathSaveAs, 'utf-8');
  const jsonContent = JSON.parse(content);

  const currentDate = new Date().toLocaleDateString();
  // Perform assertions on the JSON content
  expect(jsonContent.metadata).toEqual({
    author: 'Wahyu Hidayat',
     date: currentDate
  });

  // Check that definitions contain expected data
  expect(jsonContent.definitions).toHaveProperty('id', 'new');
});



test('should handle file select and read DMN XML', async ({ page }) => {
  await page.goto('http://localhost:5173'); // Update to your application's URL

  // Ensure the file exists
  if (!fs.existsSync(filePath)) {
    throw new Error('Test file does not exist at path: ' + filePath);
  }

  // Set up a file input to simulate file upload
  await page.setInputFiles('input[type="file"]', filePath);

  // Trigger file selection
  const [fileInput] = await page.$$('input[type="file"]');
  await fileInput.setInputFiles(filePath);

  // Add logic to handle what happens after the file is selected
  // Assuming that `openDiagram` would trigger some UI change or effect
  // Verify the result of `openDiagram` (if it updates the DOM, verify the changes)

  // Example: Verify that the DMN diagram is visible or correctly loaded
  // Update the selector based on your application
  const diagramCanvas = await page.locator('#canvas'); // Adjust selector as needed
  await expect(diagramCanvas).toBeVisible();

  // Additional checks can be added here based on what `openDiagram` should do
});



test('should trigger file input and handle file selection', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:5173'); // Adjust to your application's URL

  // Ensure the file exists
  if (!fs.existsSync(filePath)) {
    throw new Error('Test file does not exist at path: ' + filePath);
  }

  // Wait for the button to be visible
  const loadButton = page.locator('button#load-dmn-button');
  console.log('Waiting for the "Load DMN" button');
  await loadButton.waitFor({ state: 'visible', timeout: 30000 });

  // Click the "Load DMN" button
  console.log('Clicking the "Load DMN" button');
  await loadButton.click();

  // Log to check if the file input is present
  console.log('Checking for the file input');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.waitFor({ state: 'attached', timeout: 30000 });

  // Set the file in the file input
  console.log('Setting the file in the file input');
  await fileInput.setInputFiles(filePath);

  // Optionally: Verify that the file was processed correctly
  const diagramCanvas = page.locator('#canvas'); // Update selector as needed
  console.log('Checking if the diagram canvas is visible');
  await expect(diagramCanvas).toBeVisible();
});

});
