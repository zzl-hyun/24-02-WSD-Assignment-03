const mongoose = require('mongoose');

// User 스키마 정의
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// 모델 생성
module.exports = mongoose.model('User', UserSchema);
