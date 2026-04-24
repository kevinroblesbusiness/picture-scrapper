const express = require('express');
const axios = require('axios');
const router = express.Router();

// Pinterest search endpoint - uses web scraping approach
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    // Fetch from Pinterest search page
    const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Parse initial pins from page HTML
    const pins = extractPinsFromHTML(response.data);

    res.json({
      success: true,
      query,
      pins,
      total: pins.length
    });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({
      error: 'Failed to search Pinterest',
      message: error.message
    });
  }
});

function extractPinsFromHTML(html) {
  // This is a simplified extraction - in production you'd use a proper HTML parser
  const pinsRegex = /"mainContentObject":\{"id":"(\d+)","image":{"original":{"height":\d+,"width":\d+,"url":"([^"]+)"}/g;
  const pins = [];

  let match;
  while ((match = pinsRegex.exec(html)) !== null) {
    pins.push({
      id: match[1],
      imageUrl: match[2].replace(/\\/g, '')
    });
  }

  return pins.slice(0, 30); // Return first 30 pins
}

module.exports = router;
