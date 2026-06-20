const express = require('express');
const { submitContact, getContacts, updateStatus, deleteContact } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);
router.patch('/:id/status', protect, adminOnly, updateStatus);
router.delete('/:id', protect, adminOnly, deleteContact);

module.exports = router;
