const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    job_id: { type: Schema.Types.ObjectId, ref: 'Jobs', required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);