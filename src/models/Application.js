const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },  
  resume: { type: String }, 
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'], 
    default: 'Pending' 
  },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
