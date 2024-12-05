const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  access_token: { type: String, default: null,},
  refresh_token: { type: String, required: true },
  expires_at: { type: Date, required: true },
});

module.exports = mongoose.model('Token', TokenSchema);
