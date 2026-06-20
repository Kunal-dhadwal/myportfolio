const express = require('express');
const { Skill } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find({ isPublished: true }).sort({ category: 1, order: 1 });
    const grouped = skills.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});
    res.json({ success: true, skills, grouped });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try { const skill = await Skill.create(req.body); res.status(201).json({ success: true, skill }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try { const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, skill }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try { await Skill.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Skill deleted' }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

module.exports = router;
