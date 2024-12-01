const mongoose = require('mongoose');
const fs = require('fs');
const csvParser = require('csv-parser');
const Company = require('./models/Company');
const Job = require('./models/Job');

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/wsd', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패', err));

// Step 1: corp.csv 처리
const companyMap = new Map();

function processCompanies() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('corp.csv')
      .pipe(csvParser())
      .on('data', async (row) => {
        try {
          const company = await Company.findOneAndUpdate(
            { company_name: row['회사명'] }, // 중복 방지
            {
              representative_name: row['대표자명'],
              company_type: row['기업형태'],
              industry: row['업종'],
              employee_count: row['사원수'],
              establishment_date: row['설립일'],
              revenue: row['매출액'],
              homepage: row['홈페이지'],
              company_address: row['기업주소'],
            },
            { upsert: true, new: true } // 중복이면 업데이트
          );
          companyMap.set(row['회사명'], company._id); // 회사명과 ID를 매핑
        } catch (error) {
          console.error('Company 저장 중 오류:', error);
        }
      })
      .on('end', () => {
        console.log('회사 데이터 처리 완료');
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Step 2: jobs.csv 처리
function processJobs() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('jobs.csv')
      .pipe(csvParser())
      .on('data', async (row) => {
        try {

          const companyId = companyMap.get(row['회사명']);
          if (!companyId) {
            console.warn(`회사명을 찾을 수 없음: ${row['회사명']}`);
            return;
          }

          await Job.create({
            companyId,
            jobTitle: row['채용제목'],
            link: row['링크'],
            location: row['위치'],
            experienceRequired: row['경력요구'],
            educationRequired: row['학력요구'],
            salary: row['연봉'],
            employmentType: row['고용형태'],
            deadline: new Date(row['마감일']),
            details: {
              skills: row['요구기술'] ? row['요구기술'].split(',') : [],
              benefits: row['복리후생'] ? row['복리후생'].split(',') : [],
            },
          });
          console.log(`저장 완료: ${row['채용제목']}`);
        } catch (error) {
          console.error('Job 저장 중 오류:', error);
        }
      })
      .on('end', () => {
        console.log('채용 데이터 처리 완료');
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// 데이터 저장 실행
(async () => {
  try {
    await processCompanies();
    await processJobs();
    console.log('모든 데이터 저장 완료');
  } catch (error) {
    console.error('데이터 저장 중 오류:', error);
  } finally {
    mongoose.disconnect();
  }
})();
