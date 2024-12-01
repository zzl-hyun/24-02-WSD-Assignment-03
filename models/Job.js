const mongoose = require('mongoose');

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Job:
//  *       type: object
//  *       properties:
//  *         companyId:
//  *           type: string
//  *           description: The ID of the company
//  *         jobTitle:
//  *           type: string
//  *           description: Job title
//  *         link:
//  *           type: string
//  *           description: Link to the job details
//  *         location:
//  *           type: string
//  *           description: Job location
//  *         experienceRequired:
//  *           type: string
//  *           description: Required experience level
//  *         educationRequired:
//  *           type: string
//  *           description: Required education level
//  *         employmentType:
//  *           type: string
//  *           description: employment
//  *         deadline:
//  *           type: string
//  *           format: date-time
//  *           description: Job application deadline
//  *         salary:
//  *           type: String
//  *           description: Salary information
//  *         details:
//  *           type: object
//  *           properties:
//  *             skills:
//  *               type: array
//  *               items:
//  *                 type: string
//  *               description: Required skills
//  *             benefits:
//  *               type: array
//  *               items:
//  *                 type: string
//  *               description: Provided benefits
//  *         views:
//  *           type: integer
//  *           description: Number of views
//  *         createdAt:
//  *           type: string
//  *           format: date-time
//  *           description: Date when the job was created
//  *       required:
//  *         - companyId
//  *         - jobTitle
//  *         - link
//  *         - location
//  *         - experienceRequired
//  */
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
});

module.exports = mongoose.model('Job', jobSchema);
