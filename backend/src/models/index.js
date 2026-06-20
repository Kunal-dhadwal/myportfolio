const mongoose = require('mongoose');

// ─── Education ───────────────────────────────────────────────
const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  institutionLogo: { type: String },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  grade: { type: String },
  description: { type: String },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isCurrent: { type: Boolean, default: false },
  achievements: [{ type: String }],
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const Education = mongoose.model('Education', educationSchema);

// ─── Skill ────────────────────────────────────────────────────
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Mobile', 'Tools', 'Other'],
    required: true
  },
  proficiency: { type: Number, min: 0, max: 100, required: true }, // percentage
  icon: { type: String }, // icon name or URL
  color: { type: String }, // hex color for icon
  yearsOfExperience: { type: Number },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const Skill = mongoose.model('Skill', skillSchema);

// ─── Certificate ──────────────────────────────────────────────
const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: { type: String, required: true },
  organizationLogo: { type: String },
  image: { type: String }, // certificate image
  imagePublicId: { type: String },
  credentialId: { type: String },
  verificationUrl: { type: String },
  issueDate: { type: Date },
  expiryDate: { type: Date },
  doesNotExpire: { type: Boolean, default: false },
  location: { type: String },
  description: { type: String },
  skills: [{ type: String }],
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);

// ─── Contact ──────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  ipAddress: { type: String },
  userAgent: { type: String },
  repliedAt: { type: Date },
  notes: { type: String },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

module.exports = { Education, Skill, Certificate, Contact };
