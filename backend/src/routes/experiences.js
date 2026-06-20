// ─── experiences.js ──────────────────────────────────────────
const express = require('express');
const Experience = require('../models/Experience');
const { protect, adminOnly } = require('../middleware/auth');

const expRouter = express.Router();

expRouter.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find({ isPublished: true }).sort({ order: 1, startDate: -1 });
    res.json({ success: true, experiences });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

expRouter.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    res.json({ success: true, experiences });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

expRouter.post('/', protect, adminOnly, async (req, res) => {
  try {
    const exp = await Experience.create(req.body);
    res.status(201).json({ success: true, experience: exp });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

expRouter.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, experience: exp });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

expRouter.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Experience deleted' });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

module.exports = expRouter;
