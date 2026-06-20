const express = require('express');
const { Certificate } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find({ isPublished: true }).sort({ order: 1, issueDate: -1 });
    res.json({ success: true, certificates: certs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try { const cert = await Certificate.create(req.body); res.status(201).json({ success: true, certificate: cert }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try { const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json({ success: true, certificate: cert }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try { await Certificate.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Certificate deleted' }); }
  catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

module.exports = router;
