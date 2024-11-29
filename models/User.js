const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // 사용자명
  email: { type: String, required: true, unique: true },   // 이메일
  passwordHash: { type: String, required: true },         // 해시된 비밀번호
  role: { type: String, enum: ['jobseeker', 'admin'], default: 'jobseeker' }, // 사용자 역할
  profile: {                                              // 프로필 정보
    fullName: { type: String, required: true },          // 이름
    phoneNumber: { type: String, required: true },       // 전화번호
    bio: { type: String },                                // 자기소개
    skills: [{ type: String }],                           // 기술 리스트
    resumeUrl: { type: String },                         // 이력서 URL
  },
}, { timestamps: true });                                 // created_at, updated_at 자동 생성

module.exports = mongoose.model('User', UserSchema);
