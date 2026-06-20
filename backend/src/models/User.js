const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  activityLogs: [{
    action: String,
    entity: String,
    entityId: String,
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
  }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add activity log
userSchema.methods.addLog = function (action, entity, entityId, ipAddress) {
  this.activityLogs.push({ action, entity, entityId, ipAddress });
  if (this.activityLogs.length > 100) {
    this.activityLogs = this.activityLogs.slice(-100);
  }
};

module.exports = mongoose.model('User', userSchema);

async function getSalt(){
  const salt = await bcrypt.genSalt(12);
  let password = await bcrypt.hash("Admin@123456", salt);
  console.log(password);
}

getSalt();