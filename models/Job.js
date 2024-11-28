const mongoose = require('mongoose');
// 스키마는 JSdoc안쓰고 걍 자동화 돌림 ㅋ
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

const jobSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobTitle: { type: String, required: true },
  link: { type: String, required: true },
  location: { type: String, required: true },
  experienceRequired: { type: String, required: true },
  educationRequired: { type: String },
  employmentType: { type: String },
  deadline: { type: Date },
  salary: { type: String },
  details: {
    skills: [{ type: String }],
    benefits: [{ type: String }]
  },
  views: { type: Number, default: 0 }, // 조회수
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);
