// backend/models/CampaignUpdate.js

const mongoose = require('mongoose');

const campaignUpdateSchema = new mongoose.Schema({
  campaignId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

const CampaignUpdate = mongoose.model('CampaignUpdate', campaignUpdateSchema);

module.exports = CampaignUpdate;
