const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  company_name: { type: String, required: true }, // 회사명
  representative_name: { type: String, required: true }, // 대표자명
  company_type: { type: String, required: true }, // 기업형태
  industry: { type: String, required: true }, // 업종
  employee_count: { type: String }, // 사원수
  establishment_date: { type: String }, // 설립일
  revenue: { type: String }, // 매출액
  homepage: { type: String }, // 홈페이지
  company_address: { type: String }, // 기업주소
});

module.exports = mongoose.model('Company', CompanySchema);