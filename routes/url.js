const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const crypto = require('crypto');

// Create Short URL
router.post('/shorten', async (req, res) => {
  const { originalUrl, userId } = req.body;
  try {
    const shortUrl = crypto.randomBytes(6).toString('hex');
    const url = new Url({ originalUrl, shortUrl, createdBy: userId });
    await url.save();
    res.status(201).json({ shortUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Redirect to Original URL
router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await Url.findOne({ shortUrl });
    if (!url) return res.status(404).json({ message: 'URL not found' });
    url.clickCount += 1;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
