const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const COLLECTIONS_FILE = path.join(__dirname, '../data/collections.json');

// Initialize collections file if it doesn't exist
async function initCollectionsFile() {
  try {
    await fs.mkdir(path.dirname(COLLECTIONS_FILE), { recursive: true });
    await fs.access(COLLECTIONS_FILE);
  } catch {
    await fs.writeFile(COLLECTIONS_FILE, JSON.stringify([], null, 2));
  }
}

// Get all collections
router.get('/', async (req, res) => {
  try {
    await initCollectionsFile();
    const data = await fs.readFile(COLLECTIONS_FILE, 'utf8');
    const collections = JSON.parse(data);
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Create new collection
router.post('/', async (req, res) => {
  try {
    await initCollectionsFile();
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Collection name required' });
    }

    const data = await fs.readFile(COLLECTIONS_FILE, 'utf8');
    const collections = JSON.parse(data);

    const newCollection = {
      id: Date.now().toString(),
      name,
      images: [],
      createdAt: new Date().toISOString()
    };

    collections.push(newCollection);
    await fs.writeFile(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));

    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

// Add image to collection
router.post('/:id/images', async (req, res) => {
  try {
    await initCollectionsFile();
    const { id } = req.params;
    const { imageUrl, pinId } = req.body;

    const data = await fs.readFile(COLLECTIONS_FILE, 'utf8');
    let collections = JSON.parse(data);

    const collection = collections.find(c => c.id === id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    collection.images.push({
      id: Date.now().toString(),
      pinId,
      imageUrl,
      addedAt: new Date().toISOString()
    });

    await fs.writeFile(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add image to collection' });
  }
});

// Remove image from collection
router.delete('/:id/images/:imageId', async (req, res) => {
  try {
    await initCollectionsFile();
    const { id, imageId } = req.params;

    const data = await fs.readFile(COLLECTIONS_FILE, 'utf8');
    let collections = JSON.parse(data);

    const collection = collections.find(c => c.id === id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    collection.images = collection.images.filter(img => img.id !== imageId);
    await fs.writeFile(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove image' });
  }
});

// Export collection
router.get('/:id/export', async (req, res) => {
  try {
    await initCollectionsFile();
    const { id } = req.params;

    const data = await fs.readFile(COLLECTIONS_FILE, 'utf8');
    const collections = JSON.parse(data);

    const collection = collections.find(c => c.id === id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export collection' });
  }
});

module.exports = router;
