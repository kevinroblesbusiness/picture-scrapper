const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CHARACTERS = {
  leah: { name: 'Leah', selector: '[data-character="leah"]' },
  catalina: { name: 'Catalina', selector: '[data-character="catalina"]' },
  isabella: { name: 'Isabella', selector: '[data-character="isabella"]' }
};

async function autoUploadToHiggsfield({ imagePaths, character, higgsFieldUrl, onProgress }) {
  let browser = null;
  try {
    onProgress(`Starting Higgsfield automation...`);

    // Launch browser
    browser = await chromium.launch({ headless: false });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    onProgress(`Opening Higgsfield at ${higgsFieldUrl}...`);
    await page.goto(higgsFieldUrl, { waitUntil: 'networkidle' });

    // Click upload button
    onProgress('Clicking upload button...');
    const uploadButton = page.locator('button:has-text("Upload"), button:has-text("upload")').first();
    await uploadButton.click({ timeout: 5000 });

    onProgress(`Selecting character: ${character}...`);
    // Select character
    const characterBtn = page.locator(`button:has-text("${character}"), [data-character="${character.toLowerCase()}"]`).first();
    await characterBtn.click({ timeout: 5000 });

    // Upload images
    onProgress(`Uploading ${imagePaths.length} image(s)...`);
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(imagePaths);

    // Wait for upload to complete
    await page.waitForTimeout(2000);

    onProgress('Clicking generate...');
    // Click generate button
    const generateBtn = page.locator('button:has-text("Generate"), button:has-text("generate")').first();
    await generateBtn.click({ timeout: 10000 });

    onProgress('✅ Upload complete! Check Higgsfield for results.');

    await page.waitForTimeout(3000);
    await browser.close();

    return { message: 'Upload successful' };
  } catch (error) {
    onProgress(`❌ Error: ${error.message}`);
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

async function getImagesFromFolder(folderPath) {
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const files = fs.readdirSync(folderPath);

  return files
    .filter(file => extensions.includes(path.extname(file).toLowerCase()))
    .map(file => path.join(folderPath, file));
}

module.exports = {
  autoUploadToHiggsfield,
  getImagesFromFolder,
  CHARACTERS
};
