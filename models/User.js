const mongoose = require('mongoose');

// User 스키마 정의
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// 모델 생성
module.exports = mongoose.model('User', UserSchema);

  {
    "_id": "ObjectId",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password_hash": "hashed_password",
    "role": "jobseeker", // "jobseeker" or "admin"
    "profile": {
      "full_name": "John Doe",
      "phone_number": "010-1234-5678",
      "bio": "Experienced software engineer",
      "skills": ["JavaScript", "Node.js"],
      "resume_url": "https://resume-hosting.com/johndoe.pdf"
    },
    "created_at": "2024-11-28",
    "updated_at": "2024-11-28"
  }
  