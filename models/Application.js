const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who applied
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },  // Job being applied for
  resume: { type: String }, // URL or file path to the attached resume
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'], 
    default: 'Pending' 
  }, // Application status
  appliedAt: { type: Date, default: Date.now }, // Date of application
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
