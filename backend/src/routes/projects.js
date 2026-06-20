const express = require('express');
const router = express.Router();
const {
  getProjects, getProject, getGroupedProjects,
  createProject, updateProject, deleteProject, getAllProjectsAdmin
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getProjects);
router.get('/grouped', getGroupedProjects);
router.get('/admin/all', protect, adminOnly, getAllProjectsAdmin);
router.get('/:id', getProject);
router.post('/', protect, adminOnly, createProject);
router.put('/:id', protect, adminOnly, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;
