const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CHARACTERS = {
  leah: 'LEAH',
  catalina: 'catalina',
  isabella: 'isabella'
};

async function autoUploadToHiggsfield({ imagePaths, character, higgsFieldUrl, onProgress }) {
  let browser = null;
  try {
    onProgress(`Starting Higgsfield automation...`);

    // Launch browser
    browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    onProgress(`Opening Higgsfield at ${higgsFieldUrl}...`);
    await page.goto(higgsFieldUrl, { waitUntil: 'networkidle' });

    // Navigate to Soul 2.0 image generation
    onProgress('Navigating to Soul 2.0...');
    await page.click('a:has-text("Image"), [href*="image"]');
    await page.waitForTimeout(2000);

    // Process each image
    for (let i = 0; i < imagePaths.length; i++) {
      const imagePath = imagePaths[i];
      const fileName = path.basename(imagePath, path.extname(imagePath));

      onProgress(`Processing image ${i + 1}/${imagePaths.length}: ${fileName}`);

      // Find prompt input field
      const promptInput = page.locator('textarea, input[placeholder*="prompt"], [contenteditable="true"]').first();

      // Clear existing prompt
      await promptInput.click();
      await promptInput.evaluate(el => el.value = '');
      await promptInput.evaluate(el => el.textContent = '');

      // Type prompt (use filename as prompt, or you can customize)
      const prompt = fileName.replace(/[-_]/g, ' ');
      await promptInput.type(prompt);
      onProgress(`Typed prompt: "${prompt}"`);

      // Click Change button to select character
      onProgress(`Selecting character: ${character}...`);
      const changeBtn = page.locator('button:has-text("Change")').first();
      await changeBtn.click();
      await page.waitForTimeout(1000);

      // Select the character from the list
      const charSelector = page.locator(`button:has-text("${CHARACTERS[character.toLowerCase()]}"), [aria-label*="${character}"]`).first();
      await charSelector.click();
      await page.waitForTimeout(500);

      onProgress('Character selected. Clicking Generate...');

      // Click Generate button
      const generateBtn = page.locator('button:has-text("Generate")').first();
      await generateBtn.click();

      // Wait for generation to complete (check for result image)
      onProgress(`Generating... (this may take 30-60 seconds)`);

      // Wait for generation to finish by checking if new images appear
      try {
        await page.waitForSelector('img[src*="blob"], img[src*="cloudinary"]', { timeout: 120000 });
        onProgress(`✅ Image ${i + 1} generated successfully!`);
      } catch (e) {
        onProgress(`⚠️ Image ${i + 1} generation may be processing...`);
      }

      await page.waitForTimeout(2000);
    }

    onProgress('✅ All images processed! Check Higgsfield for results.');
    await page.waitForTimeout(3000);

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
