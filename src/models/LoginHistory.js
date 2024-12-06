const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  login_at: { type: Date, default: Date.now, required: true },
  ip_address: { type: String, required: true },
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema);