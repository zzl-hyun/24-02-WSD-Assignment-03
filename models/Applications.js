const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job',  required: true, unique: true},
    status: { type: String},
    resumeUrl: { type: String},
}, { timestamps: true});

module.exports = mongoose.model('Application', ApplicationSchema);