// education.js
const express = require('express');
const { Education } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');
const edRouter = express.Router();

edRouter.get('/', async (req, res) => {
  try { const ed = await Education.find({ isPublished: true }).sort({ order: 1, startDate: -1 }); res.json({ success: true, education: ed }); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
edRouter.post('/', protect, adminOnly, async (req, res) => {
  try { const ed = await Education.create(req.body); res.status(201).json({ success: true, education: ed }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});
edRouter.put('/:id', protect, adminOnly, async (req, res) => {
  try { const ed = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, education: ed }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});
edRouter.delete('/:id', protect, adminOnly, async (req, res) => {
  try { await Education.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Education deleted' }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});
module.exports = edRouter;
