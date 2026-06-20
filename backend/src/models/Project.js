const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  category: {
    type: String,
    required: true,
    enum: ['AI', 'Web Development', 'Full Stack', 'DevOps', 'Mobile', 'Open Source', 'Other'],
  },
  subCategory: { type: String },
  images: [{ url: String, publicId: String, caption: String }],
  videoUrl: { type: String },
  videoType: { type: String, enum: ['upload', 'youtube', 'vimeo'] },
  githubUrl: { type: String },
  liveDemoUrl: { type: String },
  techStack: [{ type: String }],
  timeline: {
    startDate: Date,
    endDate: Date,
    duration: String,
  },
  status: { type: String, enum: ['completed', 'in-progress', 'planned'], default: 'completed' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate slug
projectSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
