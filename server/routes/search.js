const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock Pinterest search - returns sample images
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query required' });
    }

    // Generate mock results based on query
    const mockPins = generateMockPins(query);

    res.json({
      success: true,
      query,
      pins: mockPins,
      total: mockPins.length
    });
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({
      error: 'Failed to search Pinterest',
      message: error.message
    });
  }
});

function generateMockPins(query) {
  // Mock image URLs (using placeholder images)
  const mockUrls = [
    'https://images.unsplash.com/photo-1517836357463-d25ddfcb53ef?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25ddfcb53ef?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=300&h=400&fit=crop'
  ];

  const pins = [];
  for (let i = 0; i < 12; i++) {
    pins.push({
      id: `pin-${Date.now()}-${i}`,
      imageUrl: mockUrls[i % mockUrls.length]
    });
  }

  return pins;
}

module.exports = router;
