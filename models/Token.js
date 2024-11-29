// models/Token.js
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  issued_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
});

module.exports = mongoose.model('Token', TokenSchema);
