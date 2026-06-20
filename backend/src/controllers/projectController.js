const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all projects (public)
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { category, featured, page = 1, limit = 20, search } = req.query;
    const query = { isPublished: true };

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (search) query.$text = { $search: search };

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, page: parseInt(page), projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Increment views
    project.views += 1;
    await project.save({ validateBeforeSave: false });

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get projects by category grouped
// @route   GET /api/projects/grouped
exports.getGroupedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
    const grouped = projects.reduce((acc, project) => {
      const cat = project.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(project);
      return acc;
    }, {});
    res.json({ success: true, grouped });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Delete images from Cloudinary
    for (const img of project.images) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (admin, includes unpublished)
// @route   GET /api/projects/admin
// @access  Private/Admin
exports.getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};
