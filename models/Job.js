const mongoose = require('mongoose');


// 키워드,회사명,제목,링크,지역,경력,학력,연봉,고용형태,마감일,직무분야,연봉정보
const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  jobTitle: { type: String, required: true },
  link: { type: String, required: true },
  location: { type: String, required: true },
  experienceRequired: { type: String, required: true },
  educationRequired: { type: String },
  salary: { type: String },
  employmentType: { type: String },
  deadline: { type: String },
  details: {
    skills: [{ type: String }],
    benefits: [{ type: String }]
  },
  viewCount: { type: Number, default: 0},
  createdAt: { type: String}
});

module.exports = mongoose.model('Job', jobSchema);
