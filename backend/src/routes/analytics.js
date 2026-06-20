const express = require('express');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const { Education, Skill, Certificate, Contact } = require('../models/index');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const [
      projectCount, expCount, edCount, skillCount,
      certCount, contactCount, newContacts,
      featuredProjects, topProjects
    ] = await Promise.all([
      Project.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Skill.countDocuments(),
      Certificate.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Project.find({ featured: true }).limit(3),
      Project.find().sort({ views: -1 }).limit(5).select('title views category'),
    ]);

    const projectsByCategory = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        projects: projectCount,
        experiences: expCount,
        education: edCount,
        skills: skillCount,
        certificates: certCount,
        contacts: contactCount,
        newContacts,
      },
      projectsByCategory,
      topProjects,
      featuredProjects,
      recentContacts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
