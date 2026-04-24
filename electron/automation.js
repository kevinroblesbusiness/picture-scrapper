const { chromium } = require('playwright');
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
    // Check if Playwright is installed
    onProgress(`Starting Higgsfield automation...`);

    try {
      browser = await chromium.launch({ headless: false });
    } catch (error) {
      throw new Error(
        'Failed to launch browser. Playwright may not be properly installed.\n' +
        'Try running: npm install playwright\n' +
        `Error: ${error.message}`
      );
    }

    const page = await browser.newPage();

    // Navigate to Higgsfield with timeout
    onProgress(`Opening Higgsfield at ${higgsFieldUrl}...`);
    try {
      await page.goto(higgsFieldUrl, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (error) {
      throw new Error(`Failed to load Higgsfield. Check URL and internet connection: ${error.message}`);
    }

    // Navigate to Soul 2.0 image generation
    onProgress('Navigating to Soul 2.0...');
    try {
      await page.click('a:has-text("Image"), [href*="image"]', { timeout: 10000 });
    } catch (error) {
      throw new Error('Could not find Image generation button. Higgsfield UI may have changed.');
    }
    await page.waitForTimeout(2000);

    // Create character sequence based on split count
    const characterSequence = [];
    for (const [charKey, count] of Object.entries(splitCount)) {
      for (let i = 0; i < count; i++) {
        characterSequence.push(charKey);
      }
    }

    onProgress(`\n📋 Plan:\n${characterSequence.map((c, i) => `  ${i + 1}. ${CHARACTERS[c].name}`).join('\n')}\n`);

    // Validate imagePaths
    if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
      throw new Error('No valid image paths provided');
    }

    // Process each image with its assigned character
    for (let i = 0; i < Math.min(imagePaths.length, characterSequence.length); i++) {
      const imagePathObj = imagePaths[i];
      const character = characterSequence[i];
      const imagePath = typeof imagePathObj === 'string'
        ? imagePathObj
        : path.join(imagePathObj.folder, imagePathObj.file);
      const fileName = path.basename(imagePath, path.extname(imagePath));

      onProgress(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      onProgress(`${i + 1}/${characterSequence.length} | ${CHARACTERS[character].name}`);
      onProgress(`${fileName}`);

      try {
        // Find and verify prompt input field exists
        const promptInput = page.locator('textarea, input[placeholder*="prompt"], [contenteditable="true"]').first();

        // Check if element is visible with timeout
        const isVisible = await promptInput.isVisible({ timeout: 5000 }).catch(() => false);
        if (!isVisible) {
          throw new Error('Prompt input field not found. UI may have changed.');
        }

        // Get current prompt from the field with error handling
        let currentPrompt = '';
        try {
          currentPrompt = await promptInput.inputValue().catch(() => {
            // For contenteditable, try getting textContent
            return promptInput.evaluate(el => el.textContent || el.value || '');
          });
        } catch (e) {
          onProgress(`⚠️ Could not read current prompt, will use defaults`);
          currentPrompt = '';
        }

        // Fix prompt for character (auto-detect and change hair color if needed)
        const fixedPrompt = fixPromptForCharacter(currentPrompt || fileName.replace(/[-_]/g, ' '), character);

        // Clear and set new prompt
        await promptInput.click();
        await promptInput.evaluate(el => {
          el.value = '';
          el.textContent = '';
        });
        await promptInput.type(fixedPrompt, { delay: 50 });

        if (currentPrompt && currentPrompt !== fixedPrompt) {
          onProgress(`✏️ Updated prompt for ${CHARACTERS[character].name}`);
        }

        // Click Change button to select character
        onProgress(`Selecting ${CHARACTERS[character].name}...`);
        const changeBtn = page.locator('button:has-text("Change")').first();
        try {
          await changeBtn.click({ timeout: 5000 });
        } catch (error) {
          throw new Error(`Could not click Change button: ${error.message}`);
        }
        await page.waitForTimeout(800);

        // Select the character from the list
        const charName = CHARACTERS[character].name;
        const charSelector = page.locator(`button:has-text("${charName}")`).first();
        try {
          await charSelector.click({ timeout: 5000 });
        } catch (error) {
          throw new Error(`Could not select character ${charName}: ${error.message}`);
        }
        await page.waitForTimeout(500);

        onProgress(`Generating...`);

        // Click Generate button
        const generateBtn = page.locator('button:has-text("Generate")').first();
        try {
          await generateBtn.click({ timeout: 5000 });
        } catch (error) {
          throw new Error(`Could not click Generate button: ${error.message}`);
        }

        // Wait for generation to complete (increased timeout to 180 seconds)
        try {
          await page.waitForSelector('img[src*="blob"], img[src*="cloudinary"]', { timeout: 180000 });
          onProgress(`✅ Done!`);
        } catch (e) {
          onProgress(`⚠️ Generation timeout - may still be processing`);
        }

        await page.waitForTimeout(1500);
      } catch (stepError) {
        onProgress(`❌ Error processing image ${i + 1}: ${stepError.message}`);
        throw stepError;
      }
    }

    onProgress(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    onProgress('✅ All generations complete! Check Higgsfield.');

    return { message: 'Upload successful' };
  } catch (error) {
    onProgress(`\n❌ Error: ${error.message}`);
    throw error;
  } finally {
    // Ensure browser always closes
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
}

async function getImagesFromFolder(folderPath) {
  const fs = require('fs');
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
