const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String },
  bio: { type: String },
  email: { type: String },
  phone: { type: String },
  location: { type: String },
  profileImage: { type: String },
  resumeUrl: { type: String },
  introVideoUrl: { type: String },
  introVideoType: { type: String, enum: ['upload', 'youtube', 'vimeo'], default: 'youtube' },
  typingTexts: [{ type: String }], // For typing animation
  socialLinks: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    youtube: String,
    website: String,
    dribbble: String,
    behance: String,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
  },
  themeColor: { type: String, default: '#6366f1' },
  isAvailableForWork: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
