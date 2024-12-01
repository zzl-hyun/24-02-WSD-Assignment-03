// {
//     "_id": "ObjectId",
//     "company_name": "TechCorp",
//     "CEO": '강희철/최정민'
//     "founded": "1986년 11월 21일",
//     "industry": "IT",
//     "location": "Seoul",
//     "website": "https://techcorp.com",
//     "size": "500-1000 employees",
//     "description": "Leading software development company",
//     "created_at": "2024-11-28",
//     "updated_at": "2024-11-28"
//   }
  
//   company model 만들기

const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  company_name: { type: String, required: true }, // 회사명
  representative_name: { type: String, required: true }, // 대표자명
  company_type: { type: String, required: true }, // 기업형태
  industry: { type: String, required: true }, // 업종
  employee_count: { type: String }, // 사원수
  establishment_date: { type: Date }, // 설립일
  revenue: { type: String }, // 매출액
  homepage: { type: String }, // 홈페이지
  company_address: { type: String }, // 기업주소
});

module.exports = mongoose.model('Company', CompanySchema);