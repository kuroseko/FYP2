// backend/routes/campaignUpdates.js

const express = require('express');
const CampaignUpdate = require('../models/CampaignUpdates');
const router = express.Router();

// Post a new update
router.post('/', async (req, res) => {
  const { campaignId, title, message } = req.body;

  try {
    const newUpdate = new CampaignUpdate({ campaignId, title, message });
    await newUpdate.save();
    res.status(201).json(newUpdate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all updates for a campaign
router.get('/:campaignId', async (req, res) => {
  try {
    const updates = await CampaignUpdate.find({ campaignId: req.params.campaignId });
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
