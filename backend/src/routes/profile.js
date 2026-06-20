const express = require('express');
const Profile = require('../models/Profile');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, profile });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    }
    res.json({ success: true, profile });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

module.exports = router;
