const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number },
    description: { type: String },
});

module.exports = mongoose.model('Job', jobSchema);
회사명,제목,링크,지역,경력,학력,고용형태,마감일,직무분야,연봉정보
{
    "_id": "ObjectId",
    "company_id": "ObjectId",  // References Companies._id
    "job_title": "Software Engineer",
    "location": "Seoul",
    "experience_required": "신입·경력",
    "education_required": "초대졸↑",
    "employment_type": "정규직",
    "deadline": "2024-12-31",
    "salary": "Negotiable",
    "details": {
      "skills": ["JavaScript", "Node.js", "MongoDB"],
      "benefits": ["Health Insurance", "Flexible Hours"]
    },
    "views": 120,
    "created_at": "2024-11-28",
    "updated_at": "2024-11-28"
  }
  