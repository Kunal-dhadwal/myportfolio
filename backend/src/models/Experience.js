const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  companyLogo: { type: String },
  companyLogoPublicId: { type: String },
  companyWebsite: { type: String },
  jobRole: { type: String, required: true },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'],
    default: 'Full-time'
  },
  location: { type: String },
  responsibilities: [{ type: String }],
  achievements: [{ type: String }],
  technologiesUsed: [{ type: String }],
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // null = present
  isCurrent: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

// Virtual for total duration
experienceSchema.virtual('totalDuration').get(function () {
  const end = this.isCurrent ? new Date() : this.endDate;
  if (!end || !this.startDate) return '';
  const months = Math.round((end - this.startDate) / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years}y ${remainingMonths}m`;
});

experienceSchema.set('toJSON', { virtuals: true });
experienceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Experience', experienceSchema);
