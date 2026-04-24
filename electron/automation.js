const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CHARACTERS = {
  leah: { name: 'LEAH', hairColor: 'blonde hair', ethnicity: 'asian' },
  catalina: { name: 'catalina', hairColor: 'black hair', ethnicity: 'latina' },
  isabella: { name: 'isabella', hairColor: 'black hair', ethnicity: 'asian' }
};

const HAIR_COLOR_PATTERNS = ['blonde hair', 'black hair', 'brown hair', 'red hair', 'dark hair', 'light hair'];
const ETHNICITY_PATTERNS = ['asian', 'latina', 'caucasian', 'african', 'middle eastern'];

function fixPromptForCharacter(prompt, character) {
  const charInfo = CHARACTERS[character.toLowerCase()];
  if (!charInfo) return prompt;

  let fixedPrompt = prompt;
  const expectedHair = charInfo.hairColor;
  const expectedEthnicity = charInfo.ethnicity;

  // Replace any hair color with correct one
  const hairRegex = new RegExp(HAIR_COLOR_PATTERNS.join('|'), 'gi');
  fixedPrompt = fixedPrompt.replace(hairRegex, expectedHair);

  // If no hair color mentioned, add it
  if (!fixedPrompt.match(hairRegex)) {
    fixedPrompt = `${expectedHair} ${expectedEthnicity} ${fixedPrompt}`.trim();
  }

  // Ensure ethnicity is mentioned if not already
  if (!fixedPrompt.match(new RegExp(ETHNICITY_PATTERNS.join('|'), 'i'))) {
    fixedPrompt = `${fixedPrompt} ${expectedEthnicity}`.trim();
  }

  return fixedPrompt;
}

async function autoUploadToHiggsfield({ imagePaths, splitCount, higgsFieldUrl, onProgress }) {
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

    // Create character sequence based on split count
    const characterSequence = [];
    for (const [charKey, count] of Object.entries(splitCount)) {
      for (let i = 0; i < count; i++) {
        characterSequence.push(charKey);
      }
    }

    onProgress(`\n📋 Plan:\n${characterSequence.map((c, i) => `  ${i + 1}. ${CHARACTERS[c].name}`).join('\n')}\n`);

    // Process each image with its assigned character
    for (let i = 0; i < Math.min(imagePaths.length, characterSequence.length); i++) {
      const imagePath = imagePaths[i];
      const character = characterSequence[i];
      const fileName = path.basename(imagePath, path.extname(imagePath));

      onProgress(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      onProgress(`${i + 1}/${characterSequence.length} | ${CHARACTERS[character].name}`);
      onProgress(`${fileName}`);

      // Find prompt input field
      const promptInput = page.locator('textarea, input[placeholder*="prompt"], [contenteditable="true"]').first();

      // Get current prompt from the field
      const currentPrompt = await promptInput.inputValue().catch(() => '');

      // Fix prompt for character (auto-detect and change hair color if needed)
      const fixedPrompt = fixPromptForCharacter(currentPrompt || fileName.replace(/[-_]/g, ' '), character);

      // Clear and set new prompt
      await promptInput.click();
      await promptInput.evaluate(el => el.value = '');
      await promptInput.type(fixedPrompt);

      if (currentPrompt && currentPrompt !== fixedPrompt) {
        onProgress(`✏️ Updated prompt for ${CHARACTERS[character].name}`);
      }

      // Click Change button to select character
      onProgress(`Selecting ${CHARACTERS[character].name}...`);
      const changeBtn = page.locator('button:has-text("Change")').first();
      await changeBtn.click();
      await page.waitForTimeout(800);

      // Select the character from the list
      const charName = CHARACTERS[character].name;
      const charSelector = page.locator(`button:has-text("${charName}")`).first();
      await charSelector.click();
      await page.waitForTimeout(500);

      onProgress(`Generating...`);

      // Click Generate button
      const generateBtn = page.locator('button:has-text("Generate")').first();
      await generateBtn.click();

      // Wait for generation to complete
      try {
        await page.waitForSelector('img[src*="blob"], img[src*="cloudinary"]', { timeout: 120000 });
        onProgress(`✅ Done!`);
      } catch (e) {
        onProgress(`⚠️ Still processing...`);
      }

      await page.waitForTimeout(1500);
    }

    onProgress(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    onProgress('✅ All generations complete! Check Higgsfield.');

    return { message: 'Upload successful' };
  } catch (error) {
    onProgress(`\n❌ Error: ${error.message}`);
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
